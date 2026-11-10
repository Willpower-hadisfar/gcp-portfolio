# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Deployment — Cloudflare Pages

Per ADR-0001 (vault: `Active_Projects/william-power.com (Sovereign HQ)/ADRs/`):

- **Build command:** `npm run build` — **Publish dir:** `dist`
- The gate at `/` is `public/index.html` plus `functions/index.js` (Pages Functions). No separate Worker, no `fetch(request)` self-proxy.
- `wrangler.toml` is present for CLI deploys: `npx wrangler deploy` (preview: `npx wrangler pages dev dist`).
- **Do not switch the DNS records to proxied until the v2.1 cutover checkpoint** (Firebase's ACME challenge still needs DNS-only today). Until then this builds alongside the Firebase deployment unaided.

---

**Where this deploys:** master → Cloudflare Pages (auto-build on push; production domain on the Pages project). Historical note: previously Firebase Hosting, fully retired at the 2026-11 Pages cutover.
