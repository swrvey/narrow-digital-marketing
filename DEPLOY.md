# Getting narrowdigital.tech live

Your exact setup: domain at **Hostinger**, hosting on **Cloudflare Pages**, updates pushed
through **GitHub**. All free. Budget about an hour the first time.

The order matters — do these top to bottom.

---

## Step 0 — Move this folder somewhere permanent

Right now the project lives in a temporary session folder. **Copy the whole
`narrow-digital-marketing` folder to somewhere permanent first** — `~/Documents/` or
`~/Sites/` is fine. Everything below assumes you're working from the copy.

It's already set up as a git repository with your first commit made, so nothing is lost when
you move it.

---

## Step 1 — Put the code on GitHub

**Create a free account** at [github.com](https://github.com) if you don't have one.

**The no-terminal way:** install [GitHub Desktop](https://desktop.github.com), open it, choose
`File → Add Local Repository`, point it at your `narrow-digital-marketing` folder. It will
recognise the existing repo. Then click **Publish repository**. Name it `narrow-digital`.
Private or public both work — Cloudflare can read private repos once you authorise it.

**The terminal way**, if you'd rather. Create an empty repo on GitHub first (no README, no
.gitignore — the repo must be empty), then:

```bash
cd ~/Documents/narrow-digital-marketing
git remote add origin https://github.com/YOUR-USERNAME/narrow-digital.git
git push -u origin main
```

Check: your files should be visible on github.com. You should **not** see `node_modules`,
`_site`, or `preview` — those are excluded on purpose, since they're generated.

---

## Step 2 — Add the domain to Cloudflare

Sign up at [cloudflare.com](https://cloudflare.com) (free).

`Add a domain` → type `narrowdigital.tech` → choose the **Free** plan. Cloudflare scans for
existing DNS records, then shows you **two nameservers** that look like:

```
xxxx.ns.cloudflare.com
yyyy.ns.cloudflare.com
```

Leave that page open — you need those two lines in the next step.

---

## Step 3 — Point Hostinger at Cloudflare

In Hostinger's hPanel:

1. `Domains` → `Domain Portfolio`
2. Click **Manage** next to narrowdigital.tech
3. On the Domain Overview page, click **Edit** next to DNS/Nameservers
4. Choose **Change Nameservers**
5. Paste the two Cloudflare nameservers into the first two fields. **Leave the other fields
   blank.** Save.

Cloudflare emails you when the domain is active. Usually minutes; officially up to 24 hours.
You can keep going while you wait — the next steps don't depend on it finishing.

---

## Step 4 — Create the Cloudflare Pages project

In the Cloudflare dashboard: `Workers & Pages` → `Create` → **Pages** tab → **Connect to Git**.

Authorise GitHub, pick your `narrow-digital` repo, then set:

| Setting | Value |
|---|---|
| Framework preset | Eleventy (or None) |
| Build command | `npm run build` |
| Build output directory | `_site` |

Then open **Environment variables** and add one:

| Name | Value |
|---|---|
| `NODE_VERSION` | `22` |

That last one matters — without it Cloudflare may pick an old Node that won't run Eleventy 3.

**Save and Deploy.** In about a minute you get a live URL like
`narrow-digital.pages.dev`. Open it. That's your site, on the internet.

> Cloudflare is steering new projects toward Workers, and Pages is in maintenance mode. For a
> plain static site with Git deploys, Pages is still the simplest path and isn't going away.
> If you'd rather start on Workers, the build settings are identical — it just needs a
> `wrangler.toml`. Ask me and I'll add one.

---

## Step 5 — Attach your domain

Once the domain shows **Active** in Cloudflare:

In your Pages project → `Custom domains` → **Set up a custom domain** → enter
`narrowdigital.tech`. Because your DNS is already on Cloudflare, it creates the record itself —
nothing to copy or paste.

Do it a second time for `www.narrowdigital.tech`. Cloudflare redirects one to the other.

HTTPS is automatic and free. Give the certificate a few minutes, then load
`https://narrowdigital.tech`.

---

## Step 6 — Set up hello@narrowdigital.tech

In Cloudflare, pick your domain → `Email` → `Email Routing` → **Get started**.

1. Cloudflare offers to add the required MX and SPF records. Accept.
2. Create a custom address: `hello@narrowdigital.tech` → destination: your Gmail.
3. Cloudflare emails that Gmail account a verification link. Click it.

Now mail sent to `hello@narrowdigital.tech` lands in your Gmail. To **send** from it:

Gmail → `Settings` → `See all settings` → `Accounts and Import` → **Add another email address**:

- Name: Pedro Ruiz
- Email: `hello@narrowdigital.tech`
- Untick "Treat as an alias"
- SMTP server: `smtp.gmail.com`, port `587`, TLS
- Username: your full Gmail address
- Password: a Google **App Password**, not your normal one — you'll need 2-Step Verification
  turned on to generate one

Google emails a confirmation code to finish. After that, `hello@narrowdigital.tech` shows up in
Gmail's From dropdown.

---

## Step 7 — Turn the contact form on

1. Go to [web3forms.com](https://web3forms.com), enter `hello@narrowdigital.tech`
2. They email you an access key
3. Open `src/contact.njk`, find the line between the two arrow comments, paste the key over
   `YOUR-WEB3FORMS-ACCESS-KEY-HERE`
4. Commit and push (GitHub Desktop: write a message, `Commit to main`, then `Push origin`)
5. Cloudflare rebuilds automatically. Send yourself a test message from the live site.

---

## Step 8 — Tell Google it exists

1. [Google Search Console](https://search.google.com/search-console) → add
   `https://narrowdigital.tech` as a **Domain** property
2. It gives you a TXT record → add it in Cloudflare under `DNS` → `Records`
3. Once verified: `Sitemaps` → submit `sitemap.xml`

While you're there, claim or clean up your own Google Business Profile. You sell local SEO —
someone will check.

---

## From then on, updating the site

1. Edit a file (copy, prices, a new case study)
2. `npm start` locally to check it
3. Commit and push
4. Live in about 30 seconds

Every push is a version you can roll back to from the Cloudflare dashboard if something breaks.

---

## Still to fill in before you launch

- [ ] Your phone number — `src/_data/site.json`, `phone` and `phoneHref`
- [ ] Web3Forms access key — Step 7 above
- [ ] Replace the Street View cover image on the Banning Glass page (see the comment at the top
      of `src/work/banning-glass-mirror-and-screen.njk`)
- [ ] Set the year and live URL on that same case study
- [ ] Confirm the hours line on the contact page is actually true
