# Launch Guide — Prime Marble Specialists

Follow these steps in order. Each one is required before the site is production-ready.

---

## 1. Clean up the repo

Before anything else, remove the stray zip files that are bloating the deploy and shipping source to the public site:

```shell
cd prime-marble-site
git rm "prime-marble-site (1).zip" prime-marble-site-update.zip
```

Drop in the `.gitignore` from this folder (it blocks `*.zip` so they can't creep back in):

```shell
git add .gitignore
git commit -m "Remove stray zips, add .gitignore"
```

---

## 2. Add the deploy config

Copy `vercel.json` into the repo root. It gives you:

- **Clean URLs** — `/contact` works as well as `/contact.html`
- **Security headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- **Long-cache rules** — images, CSS, JS and fonts cached for a year (faster repeat visits)
- **Redirect** — `/index.html` → `/` (canonical homepage)

```shell
git add vercel.json
git commit -m "Add Vercel deploy config: clean URLs, security headers, caching"
git push
```

---

## 3. Create a production Vercel project

The current live URL (`prime-marble-site-74qm-…-edgar-vieiras-projects.vercel.app`) is a **preview deploy on a personal account**. You need a production project.

### Option A — via the Vercel dashboard (easiest)

1. Go to **vercel.com → New Project**.
2. Import the `focusfeulbeats-a11y/prime-marble-site` repo.
3. Framework preset: **Other** (static site, no build command).
4. Click **Deploy**.

### Option B — via the CLI

```shell
npm i -g vercel
vercel link        # link the repo to a Vercel project
vercel --prod      # first production deploy
```

> **Important:** create the project under a **team or owner account**, not a personal sandbox, so it's not tied to one person's GitHub login.

---

## 4. Attach your custom domain

You've bought `primemarbletiling.co.uk` — this is already the canonical domain hardcoded in every page's `<link rel="canonical">`, `og:url`, and JSON-LD schema, so no HTML changes are needed.

1. In the Vercel dashboard → **Settings → Domains**.
2. Add `primemarbletiling.co.uk` (apex) and `www.primemarbletiling.co.uk`.
3. Vercel shows you the DNS records to set at your registrar:
   - **Apex:** `A` record → `76.76.21.21` (or use Vercel's nameservers)
   - **www:** `CNAME` record → `cname.vercel-dns.com`
4. Set the apex as the **primary domain**. Redirect `www` → apex (Vercel does this automatically once both are added).
5. Enable **Force HTTPS** (Vercel provisions the SSL certificate automatically — usually within minutes).

Verify: open `https://primemarbletiling.co.uk/` in a browser. You should see the live site with a padlock. Check that `https://www.primemarbletiling.co.uk/` redirects to the apex.

---

## 5. Verify the contact form

Both forms (homepage and `/contact`) submit to **Basin** at `https://usebasin.com/f/740588ce5ce8`. Basin is a form backend — submissions land in Basin's dashboard and are forwarded to the email you configured there.

### Check list

1. Log in to **usebasin.com** and open form `740588ce5ce8`.
2. Confirm the **forwarding email** is correct (this is where submissions land). Update if needed.
3. Set up an **auto-reply** to the submitter (Basin → Settings → Auto-Reply):
   ```
   Subject: Thanks for your enquiry — Prime Marble Specialists

   Hi {{name}},

   Thanks for getting in touch. We've received your enquiry and will call
   you back within 2 working hours (8am–8pm, Monday–Saturday).

   Need it faster? WhatsApp photos of your space to 07979 515900 for an
   instant estimate.

   — Prime Marble Specialists
   ```
4. **Send a test submission** from the live site. Confirm it arrives in the forwarding inbox AND that the auto-reply fires.
5. Turn on **spam protection** in Basin (reCAPTCHA or honeypot) if not already on.

---

## 6. Verify the old preview URL redirects (optional but recommended)

Once the production domain is live, the old `prime-marble-site-74qm-…vercel.app` URL will still resolve. Two options:

- **Leave it** — Vercel preview URLs are not indexed by Google if not linked publicly, so it's harmless.
- **Delete it** — in Vercel → Settings → Advanced → delete the old preview deployment. Cleanest option.

Either way, make sure **no public link, ad, or social post** points at the old URL — everything should use `primemarbletiling.co.uk`.

---

## 7. Post-launch essentials (from the GTM playbook)

Once the domain is live and the form is verified, these are the next moves (full detail in the audit PDF):

1. **Google Search Console** — add `primemarbletiling.co.uk` as a property, verify via DNS or HTML tag, submit `sitemap.xml`.
2. **Google Business Profile** — claim or create, use the canonical domain, upload 20+ project photos, collect first 5 reviews.
3. **GA4** — install with consent mode (UK GDPR), define `form_submit` and `phone_click` as conversions.
4. **Legal pages** — publish `/privacy` and `/cookies` before turning on analytics (required under UK GDPR).
5. **Footer** — add registered company address, company number, VAT number.

---

## File checklist

| File | Action |
| --- | --- |
| `.gitignore` | Copy to repo root |
| `vercel.json` | Copy to repo root |
| `README.md` | Replace existing README |
| `LAUNCH.md` | Add to repo root (reference) |

After copying, commit and push:

```shell
git add .gitignore vercel.json README.md LAUNCH.md
git commit -m "Production deploy config + launch guide"
git push
```

Then trigger a production deploy on Vercel and complete steps 4–5 above.
