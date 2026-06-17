// Optional external audit worker.
// GitHub Pages cannot execute this file server-side. Deploy it separately on a
// worker platform, then set window.OCTOPYE_AUDIT_ENDPOINT on the static site.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept"
};

const json = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    ...corsHeaders,
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=300"
  }
});

const normaliseUrl = (value) => {
  let url = String(value || "").trim();
  if (!url) throw new Error("Missing url parameter.");
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http and https URLs can be audited.");
  }
  return parsed.href;
};

const pageSpeed = async (url, strategy) => {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", strategy);
  ["performance", "accessibility", "best-practices", "seo"].forEach((category) => {
    endpoint.searchParams.append("category", category);
  });
  const response = await fetch(endpoint.toString(), {
    headers: { Accept: "application/json" }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    throw new Error(payload.error && payload.error.message ? payload.error.message : `${strategy} PageSpeed failed.`);
  }
  return payload.lighthouseResult;
};

const basicFetch = async (url) => {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "User-Agent": "OctopyeAuditBot/1.0 (+https://octopye.com/estimate)"
    }
  });
  const text = await response.text();
  return {
    finalUrl: response.url || url,
    status: response.status,
    contentType: response.headers.get("content-type") || "",
    title: (text.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [null, ""])[1].trim().slice(0, 180),
    description: (text.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [null, ""])[1].trim().slice(0, 220),
    htmlSample: text.slice(0, 12000)
  };
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const requestUrl = new URL(request.url);
      const target = normaliseUrl(requestUrl.searchParams.get("url"));
      const [mobile, desktop, basic] = await Promise.allSettled([
        pageSpeed(target, "mobile"),
        pageSpeed(target, "desktop"),
        basicFetch(target)
      ]);

      const audit = {
        mobile: mobile.status === "fulfilled" ? mobile.value : null,
        desktop: desktop.status === "fulfilled" ? desktop.value : null,
        basic: basic.status === "fulfilled" ? basic.value : null,
        partial: mobile.status !== "fulfilled" || desktop.status !== "fulfilled",
        error: [mobile, desktop, basic]
          .filter((result) => result.status === "rejected")
          .map((result) => result.reason && result.reason.message ? result.reason.message : "Audit source failed.")
          .join(" ")
      };

      if (!audit.mobile && !audit.desktop && !audit.basic) {
        return json({ error: audit.error || "All audit routes failed." }, 502);
      }

      return json({ audit });
    } catch (error) {
      return json({ error: error.message || "Audit failed." }, 400);
    }
  }
};
