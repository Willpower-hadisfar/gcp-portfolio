// Geo-persona front-door gate for `/` — see vault:
// Active_Projects/william-power.com (Sovereign HQ)/ADRs/ADR-0004 — Geo-Persona Entry Gate (Country-Scoped Front Door).md
//
// Design invariants:
// - Persona selection is server-side only. No third-party geolocation request is ever made
//   (GDPR Ch. V: visitor IPs never leave the CDN — request.cf.country).
// - Always exactly one visible persona per page view; unresolved country -> explicit IE default,
//   with provenance rendered in the page's meta-bar (never a silent hard-code).
// - Every persona carries a plain <a href="/home"> bypass that works with JS disabled.
// - Gate page is served with no-store so one visitor's persona is never cached for another.
// - The 402/L402 tollgate (Phase 2) is a separate layer and reads nothing from this gate.

const PERSONAS = new Set(["GB", "CH", "AE", "US"]); // anything else -> IE default
const BADGES = {
  GB: "SATIRE // REGION: GB",
  CH: "HOROLOGY // REGION: CH",
  AE: "ENTERPRISE // REGION: GCC",
  US: "REBOUND // REGION: US",
  IE: "SOVEREIGN // REGION: IE",
};

// Crawlers and non-browser clients take the direct entrance to the real content.
// This is a mailroom door, not a security boundary: UA spoofing is accepted by design.
const CRAWLER_UA = new RegExp(
  [
    "googlebot", "bingbot", "duckduckbot", "yahoo", "yandex", "baidu", "slurp",
    "facebookexternalhit", "whatsapp", "twitterbot", "threads", "linkedinbot",
    "telegrambot", "slackbot", "discordbot", "redditbot", "applebot", "mj12bot",
    "petalbot", "embedly", "quora link preview", "pinterest", "okhttp", "axios",
    "python-requests", "go-http-client", "curl", "wget", "httpie",
  ].join("|"),
  "i"
);

const GATE_PATH = "/";
const HOME_PATH = "/home";

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  if (url.pathname !== GATE_PATH) return next();

  const ua = request.headers.get("User-Agent") ?? "";
  if (request.method !== "GET" || CRAWLER_UA.test(ua)) {
    return Response.redirect(new URL(HOME_PATH, request.url), 302);
  }

  const res = await next();
  if (res.status !== 200 || !(res.headers.get("content-type") ?? "").includes("text/html")) {
    return res; // asset missing or errored — don't inject into a non-200 body
  }

  const edgeCountry = request.cf?.country ?? "";
  const country = PERSONAS.has(edgeCountry) ? edgeCountry : "IE";
  const provenance = edgeCountry ? `EDGE:${country}` : "CF-UNRESOLVED→IE-DEFAULT";

  // Split/join injection: literal, no RegExp $ pitfalls. Throws on a missing sentinel so a
  // stale template fails the deploy preview loudly instead of shipping an un-personalized page.
  const inject = (html, token, value) => {
    if (!html.includes(token)) {
      throw new Error(`gate template missing token ${token}`);
    }
    return html.split(token).join(value);
  };

  const html = await res.text();
  const injected = inject(
    inject(inject(html, "__GATE_COUNTRY__", country), "__GATE_PROVENANCE__", provenance),
    "__GATE_BADGE__",
    BADGES[country]
  );

  const headers = new Headers(res.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("cache-control", "no-store");

  return new Response(injected, { status: res.status, statusText: res.statusText, headers });
}
