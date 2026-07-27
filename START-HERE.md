# START HERE — 3 steps, 5 minutes

## What's in this bundle

| File | What it is |
| --- | --- |
| `style.css` | Your site's CSS, extracted and fixed (contrast + mobile background) |
| `site.js` | Your site's JS, extracted and fixed (accessible lightbox) |
| `index.html` | Homepage, already transformed to use the external files |
| `transform-site.js` | Script that transforms your other 5 pages the same way |
| `vercel.json` | Vercel deploy config (clean URLs, security headers, caching) |
| `.gitignore` | Blocks stray zips and OS junk from the repo |
| `README.md` | Updated repo readme (canonical domain everywhere) |
| `LAUNCH.md` | Step-by-step: attach domain, verify form, go live |

## Step 1 — Drop these files into your repo

Copy everything into the root of your `prime-marble-site` folder (overwrite existing files when asked). Your `images/` folder and the other HTML pages stay where they are.

Delete the two stray zips:
```shell
rm "prime-marble-site (1).zip" prime-marble-site-update.zip
```

## Step 2 — Transform the other 5 pages

This one command applies the same fixes to `contact.html`, `work.html`, `marble-worktops-london.html`, `porcelain-tiling-london.html`, `blog.html`, and `404.html` — strips the duplicated inline CSS/JS, links the external files, adds image dimensions, fixes the lightbox.

```shell
node transform-site.js
```

> No Node.js installed? Get it from nodejs.org (it's a 2-minute install), or run it free at stackblitz.com — upload the folder, open the terminal, type `node transform-site.js`.

You should see output like:
```
  SKIP  index.html (already uses external style.css)
  OK    contact.html  (saved ~28 KB smaller)
  OK    work.html  (saved ~28 KB smaller)
  ...
Done. 5 file(s) transformed, 1 skipped.
```

## Step 3 — Commit and push

```shell
git add -A
git commit -m "Consolidated CSS/JS, accessibility fixes, performance, deploy config"
git push
```

Then follow **LAUNCH.md** to attach your domain and verify the contact form. That's it — site is live.

---

## What got fixed (the short version)

1. **23 KB of inline CSS** was copy-pasted on every page → moved to one `style.css`, linked externally. Pages are ~28 KB smaller each, loads once, caches properly.
2. **6 KB of inline JS** was copy-pasted on every page → moved to one `site.js`, linked with `defer`.
3. **Lightbox accessibility** — was missing `aria-modal`, focus trap, and focus return. Now: opens with focus moved into the dialog, Tab cycles within it, Escape closes it, focus returns to the photo you clicked.
4. **Orange contrast** — `#ff6a00` on white is 3.3:1 (fails WCAG AA). Added `#c8540a` for text and small UI elements. The bright orange stays for large button fills where contrast passes.
5. **Mobile background jank** — `background: fixed` causes scroll stutter on mobile. Removed `fixed` so it scrolls naturally.
6. **Image layout shift** — no `<img>` had width/height attributes, so the page jumped as images loaded. Added dimensions to every image.
7. **Font loading** — added `preconnect` hints for Google Fonts so they start loading sooner.
8. **Vercel config** — clean URLs (`/contact` works), security headers, year-long caching for static assets.
