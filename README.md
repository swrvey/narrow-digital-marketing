# Narrow Digital Marketing — website

Hand-coded static site. No WordPress, no page builder, no theme. Eleventy assembles the shared
header and footer at build time and outputs plain HTML you can host anywhere.

The copy is written. What's left is listed below.

---

## Just want to look at it?

Open **`preview/index.html`** — double-click it and the whole site opens in your browser. No
terminal, no install, nothing running. All five pages, the mobile menu, the scroll animations,
the hover states. Every link works.

`preview/` exists only for looking. It's a copy of the real site with the paths rewritten so
your browser can follow them from a folder instead of a web server. **Deploy `_site/`, not
`preview/`.** After you edit anything, `npm run preview` regenerates both.

Two things behave differently there: the contact form won't submit from a local file, and the
URLs show as `/about/index.html` instead of `/about/`. Both are correct once it's on a real host.

---

## What's left before you launch

Four things. Everything else is done — real copy, your photo, your domain.

| # | What | Where |
|---|---|---|
| 1 | **Your phone number** | `src/_data/site.json` → `phone` and `phoneHref` |
| 2 | **Web3Forms access key** | `src/contact.njk`, between the two arrow comments |
| 3 | **Replace the Banning Glass cover image** | it's currently a Google Street View crop — see the note at the top of `src/work/banning-glass-mirror-and-screen.njk` |
| 4 | **Banning Glass year + live link** | same file, in the front matter |

Also worth a read: the contact page promises a reply "within a day", and About step 01 says you
walk people through what you found whether or not they hire you. Both are flagged in comments.
Change them if they're not true.

Anything needing your input is marked `CONFIRM` in `site.json` or sits in a comment directly
above the line it affects.

### Connecting the contact form (Web3Forms)

1. Go to [web3forms.com](https://web3forms.com) and enter `hello@narrowdigital.tech`.
2. They email you an access key — a long string like `1a2b3c4d-5e6f-...`.
3. In `src/contact.njk`, find the line between the two arrow comments and paste your key in
   place of `YOUR-WEB3FORMS-ACCESS-KEY-HERE`.
4. Rebuild, deploy, send yourself a test message.

Free, unlimited submissions, no dashboard to log into. Messages land in your inbox; nothing is
stored on the site. Until the key is in, the form shows a clear error instead of failing
silently. A hidden honeypot field catches most bots.

### Swapping your photo later

Drop a new file in `src/assets/img/`, then update the `src` and `srcset` in the block marked
`YOUR PHOTO` in both `src/about.njk` and `src/index.njk`. Keep it 4:5 portrait. If you send me
a new one I'll cut the three sizes and wire it up.

---

## Quick start

```bash
npm install     # once
npm start       # local preview at http://localhost:8080 — reloads as you edit
npm run build   # writes the deployable site into _site/
npm run preview # build + refresh the double-clickable preview/ folder
```

Node 18 or newer.

---

## Where everything lives

```
src/
  _data/
    site.json          ← your details: domain, email, phone, location, nav
    services.json      ← all service copy + the "how I work" steps
  _includes/
    layouts/base.njk   ← the HTML shell (meta tags, favicons, fonts)
    layouts/case.njk   ← the frame around every case study
    partials/header.njk ← nav — edit once, applies to all pages
    partials/footer.njk ← footer — edit once, applies to all pages
    partials/cta.njk    ← the dark "let's talk" band above the footer
  assets/
    css/style.css      ← the whole design system, commented by section
    js/main.js         ← scroll reveals, mobile menu, contact form
    fonts/             ← Inter Tight + Inter, self-hosted
    img/               ← logos, favicons, placeholder images
  index.njk            ← Home        →  /
  about.njk            ← About       →  /about/     (your bio lives here)
  services.njk         ← Services    →  /services/  (pricing section at the bottom)
  work.njk             ← Work index  →  /work/
  contact.njk          ← Contact     →  /contact/
  work/                ← one file per case study
  404.njk  robots.njk  sitemap.njk
tools/make-preview.js  ← builds the double-clickable preview folder
_site/                 ← generated. Never edit by hand. This is what you deploy.
preview/               ← generated. For looking at locally. Don't deploy this one.
```

**Editing copy:** service descriptions and the four "how I work" steps are in
`src/_data/services.json` — one file feeds both the homepage teaser and the Services page, so
they can't drift apart. Everything else is in the page file it appears on.

**Your bio** sits between `<!-- ABOUT ME -->` comments in `src/about.njk`. Rewrite it however
you like — it's written to sound like you, not like a brochure.

---

## Add a case study

1. Duplicate `src/work/banning-glass-mirror-and-screen.njk`.
2. Rename it — **the filename becomes the URL** (`acme-plumbing.njk` → `/work/acme-plumbing/`).
3. Edit the fields at the top (client, tag, year, scope, summary, cover image).
4. Bump `order:` higher than the previous project so it sorts to the front.
5. Add the cover image to `src/assets/img/` — 1600 × 1000px (16:10), under 400KB.

It appears on `/work/`, on the homepage, and in `sitemap.xml` automatically.

---

## Deploy

**Your setup — Hostinger domain, Cloudflare Pages, GitHub — is written up step by step in
[DEPLOY.md](DEPLOY.md). Start there.**

The generic version, if you ever move hosts: `_site/` is the folder to publish.

**Cloudflare Pages** — connect the repo, then build command `npm run build`, output directory
`_site`.

**Netlify** — connect the repo, then build command `npm run build`, publish directory `_site`.

**Vercel** — connect the repo, framework preset Eleventy (or Other), build command
`npm run build`, output directory `_site`.

**No repo, no build server?** Run `npm run build` on your machine and drag the `_site` folder
onto Cloudflare Pages or Netlify. It's just files.

After the domain is live: add the site to Google Search Console and submit
`https://yourdomain.com/sitemap.xml`.

---

## Mobile

Tested in a real Chromium browser at 320, 375, 390, 430, 768, 1024 and 1440 wide, plus
landscape, on all seven pages. Result: no horizontal scroll anywhere, no broken images, every
tap target at least 24px tall, and every text/background pair passing WCAG AA contrast.

What's handled specifically for phones:

- **Menu** — full-screen panel sized with `dvh` so the phone's URL bar can't clip the bottom of
  it, padded clear of the home-indicator, scroll contained so the page behind doesn't move.
  Closes on tap, on Escape, and when a link is followed.
- **Hover effects are behind `@media (hover: hover)`** — on a touchscreen a hover state
  otherwise sticks after you tap and looks broken.
- **Form fields are 16px** — anything smaller makes iOS Safari zoom in when you tap a field.
- **The numbered service rows** collapse to a single column below 600px. The number column was
  eating 56px of a 390px screen.
- **Photos ship at three sizes** and the browser picks. A phone downloads a 61KB or 109KB
  portrait instead of the 179KB desktop one.
- **`env(safe-area-inset-*)`** keeps content off the notch in landscape.

Homepage on a phone, scrolled to the bottom, everything loaded: about 365KB. Most of that is
the two photos. If you ever want it leaner, re-export them as WebP.

---

## What's deliberately not here

No client counters, no star ratings, no testimonial slider, no logo wall, no stock photos of
people who were never your customers. The layout is spaced so those absences read as restraint,
not as gaps.

The "What changed" section on the Banning Glass page is empty on purpose, with a note saying
so. That's the section a sharp prospect reads closely — an honest blank beats a number you
can't screenshot. When you have real figures, the `.placeholder-note` and `.facts` styles are
already built for dropping them in.

Two lines on the site are promises rather than descriptions. Both are easy to change and both
are flagged in a comment above them:

- **Contact page:** "I'll get back to you within a day."
- **About page, step 01:** you walk people through what you found whether or not they hire you.

---

## Design system, in brief

| | |
|---|---|
| Ink | `#111111` |
| Body | `#2b2b2b` |
| Secondary | `#6e6e6e` |
| Hairline | `#e6e6e6` |
| Accent (your logo blue) | `#1017C2` |
| Accent on dark | `#3b6dff` |
| Display / headings | Inter Tight, 500–800, `-0.04em` tracking |
| Body | Inter, 400/500, 1.7 line-height |
| Spacing | 8px base; sections `clamp(5rem, 9vw, 11rem)` |
| Max width | 1280px, gutters `clamp(1.5rem, 5vw, 4rem)` |

All of it is at the top of `style.css` as CSS variables. Change a value there and it updates
everywhere. Every text/background pair passes WCAG AA — if you change a colour, check it before
you ship.

**Motion:** elements fade and rise 8px as they scroll in, staggered 60ms apart. All of it turns
off automatically for anyone with "reduce motion" enabled in their OS settings.

---

## About the logo files

Your original `narrow-digital-logo.svg` was a spec sheet — the lockup plus two monogram
variants on one canvas. It's been split into separate assets, same geometry, same hex values:

| File | Used for |
|---|---|
| `logo-wordmark.svg` | Header nav |
| `logo-lockup.svg` | Homepage hero |
| `logo-lockup-inverse.svg` | Footer (white, for the dark background) |
| `logo-wordmark-inverse.svg` | Spare, for dark sections |
| `favicon.svg` / `favicon-32.png` / `apple-touch-icon.png` | Browser tab and phone home screen |
| `logo-monogram-light.svg` | Spare, light-background monogram |
| `og-image.png` | Social share preview, 1200 × 630 |

One change worth knowing about: the original drew the wordmark as live text in the system font
stack, which renders differently on every OS. These versions are outlined in Inter Tight 800 —
the same typeface the site's headings use — so the logo and the headlines match, and the
wordmark looks identical everywhere.

If you'd rather have the original system-font version back, `logo-wordmark-systemfont.svg` is
the untouched text version. Swap the filename in `partials/header.njk`.
