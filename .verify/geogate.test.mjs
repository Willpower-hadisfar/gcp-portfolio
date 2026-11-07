// Throwaway verification harness for functions/index.js (not committed to the package).
// Stubs `context` so request.cf.country is deterministic; proves persona selection,
// provenance, injection loud-failure, no-store, bot/HEAD redirects, and passthrough.

import { onRequest } from "../functions/index.js";

const GATE =
  '<!doctype html><html lang="en" data-country="__GATE_COUNTRY__"><body>' +
  '<span>__GATE_PROVENANCE__</span><span class="badge">__GATE_BADGE__</span>' +
  "</body></html>";

const makeRes = (url) => {
  const { pathname } = new URL(url);
  return new Response(GATE, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" }, // what `next()` serves for /
  });
};

const makeContext = ({ url, country, method = "GET", ua }) => {
  const request = new Request(url, { method, headers: ua ? { "User-Agent": ua } : {} });
  Object.defineProperty(request, "cf", { value: country === undefined ? {} : { country } });
  return { request, next: async () => makeRes(url) };
};

let pass = 0,
  fail = 0;
const check = (name, cond) => {
  if (cond) {
    pass++;
    console.log(`  ok  ${name}`);
  } else {
    fail++;
    console.error(`FAIL ${name}`);
  }
};

const browserUA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/130.0";

// GB persona
{
  const res = await onRequest(makeContext({ url: "https://www.william-power.com/", country: "GB", ua: browserUA }));
  const html = await res.text();
  check("GB: 200", res.status === 200);
  check("GB: data-country=GB", html.includes('data-country="GB"'));
  check("GB: provenance EDGE:GB", html.includes(">EDGE:GB<"));
  check("GB: badge SATIRE", html.includes("SATIRE // REGION: GB"));
  check("GB: no-store", res.headers.get("cache-control") === "no-store");
  check("GB: no sentinel remains", !html.includes("__GATE_"));
}
// CH persona
{
  const res = await onRequest(makeContext({ url: "https://www.william-power.com/", country: "CH", ua: browserUA }));
  const html = await res.text();
  check("CH: badge HOROLOGY", html.includes("HOROLOGY // REGION: CH"));
}
// AE persona
{
  const res = await onRequest(makeContext({ url: "https://www.william-power.com/", country: "AE", ua: browserUA }));
  const html = await res.text();
  check("AE: badge ENTERPRISE", html.includes("ENTERPRISE // REGION: GCC"));
}
// US persona
{
  const res = await onRequest(makeContext({ url: "https://www.william-power.com/", country: "US", ua: browserUA }));
  const html = await res.text();
  check("US: badge REBOUND", html.includes("REBOUND // REGION: US"));
}
// Unresolved country -> explicit IE default with visible provenance
{
  const res = await onRequest(makeContext({ url: "https://www.william-power.com/", country: undefined, ua: browserUA }));
  const html = await res.text();
  check("UNRESOLVED: IE persona", html.includes('data-country="IE"'));
  check("UNRESOLVED: loud provenance", html.includes(">CF-UNRESOLVED→IE-DEFAULT<"));
  check("UNRESOLVED: SOVEREIGN badge", html.includes("SOVEREIGN // REGION: IE"));
}
// Unknown-but-present country (e.g. DE) -> IE default, provenance still names the real edge value? no: DESIGN = IE + EDGE:IE
{
  const res = await onRequest(makeContext({ url: "https://www.william-power.com/", country: "DE", ua: browserUA }));
  const html = await res.text();
  check("DE -> IE default, provenance EDGE:IE", html.includes(">EDGE:IE<") && html.includes('data-country="IE"'));
}
// Bot UA -> 302 to /home
for (const [name, ua] of [
  ["googlebot", "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"],
  ["curl", "curl/8.7.1"],
]) {
  const res = await onRequest(makeContext({ url: "https://www.william-power.com/", country: "GB", ua }));
  check(`${name}: 302`, res.status === 302);
  check(`${name}: location=/home`, res.headers.get("location")?.endsWith("/home"));
}
// HEAD -> 302
{
  const res = await onRequest(makeContext({ url: "https://www.william-power.com/", country: "GB", ua: browserUA, method: "HEAD" }));
  check("HEAD: 302", res.status === 302);
}
// /home and /writing passthrough untouched
{
  const res = await onRequest(makeContext({ url: "https://www.william-power.com/home", country: "GB", ua: browserUA }));
  check("/home: untouched 200", res.status === 200 && (await res.text()) === GATE);
  const rss = await onRequest(makeContext({ url: "https://www.william-power.com/rss.xml", country: "GB", ua: browserUA }));
  check("/rss.xml: passthrough", rss.status === 200);
}
// Missing sentinel -> loud throw (stale template protection)
{
  const sentinelContext = {
    // Stale template: one sentinel already baked in -> handler must throw on the missing token
    request: new Request("https://www.william-power.com/", { headers: { "User-Agent": browserUA } }),
    next: async () =>
      new Response(GATE.replace("__GATE_COUNTRY__", "GB"), {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
  };
  Object.defineProperty(sentinelContext.request, "cf", { value: { country: "GB" } });
  let threw = false;
  try {
    await onRequest(sentinelContext);
  } catch (e) {
    threw = /missing token/.test(e.message);
  }
  check("stale template: throws loudly", threw);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
