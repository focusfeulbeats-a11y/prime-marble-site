#!/usr/bin/env node
/**
 * Prime Marble Specialists — Site transformer
 *
 * Run this ONCE in your repo root (where the .html files live):
 *   node transform-site.js
 *
 * It applies the same fixes that were hand-applied to index.html:
 *   1. Strips the inline <style> block and links external style.css
 *   2. Strips the inline <script> IIFE and links external site.js (defer)
 *   3. Adds font preconnect for faster Google Fonts load
 *   4. Adds width/height to every <img> (kills layout shift / CLS)
 *   5. Adds aria-modal + aria-label to the lightbox dialog
 *
 * Files already transformed (index.html) are skipped automatically.
 * The JSON-LD <script type="application/ld+json"> blocks are preserved.
 *
 * After running, commit everything and push to GitHub.
 */

const fs = require("fs");
const path = require("path");

const dir = __dirname;
const htmlFiles = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".html"));

let transformed = 0;
let skipped = 0;

for (const file of htmlFiles) {
  const fp = path.join(dir, file);
  let html = fs.readFileSync(fp, "utf8");

  // Skip if already transformed
  if (html.includes('href="style.css"')) {
    console.log(`  SKIP  ${file} (already uses external style.css)`);
    skipped++;
    continue;
  }

  const original = html;

  // ── 1. Replace inline <style> with external link ──────────────────────
  //    Preserve any <style type="application/ld+json"> (JSON-LD is in <script>, not <style>, but belt + braces)
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    html = html.replace(styleMatch[0], '<link rel="stylesheet" href="style.css">');
  }

  // ── 2. Replace inline <script> IIFE with external defer ───────────────
  //    Only the bare <script>…</script> that starts with (function ()
  //    Leave <script type="application/ld+json"> untouched.
  const scriptMatch = html.match(/<script>\s*\(function \(\)[\s\S]*?<\/script>/);
  if (scriptMatch) {
    html = html.replace(scriptMatch[0], '<script src="site.js" defer></script>');
  }

  // ── 3. Add font preconnect (before the fonts.googleapis.com link) ─────
  if (!html.includes('rel="preconnect"')) {
    html = html.replace(
      '<link href="https://fonts.googleapis.com',
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com'
    );
  }

  // ── 4. Add width + height to <img> tags (CLS fix) ─────────────────────
  //    Project / before / after images: 1200×800
  html = html.replace(/<img src="images\/project-(\d+)\.jpg"([^>]*)>/g, (m, n, rest) => {
    if (rest.includes("width=")) return m;
    return `<img src="images/project-${n}.jpg" width="1200" height="800"${rest}>`;
  });
  html = html.replace(/<img src="images\/before\.jpg"([^>]*)>/g, (m, rest) => {
    if (rest.includes("width=")) return m;
    return `<img src="images/before.jpg" width="1200" height="800"${rest}>`;
  });
  html = html.replace(/<img src="images\/after\.jpg"([^>]*)>/g, (m, rest) => {
    if (rest.includes("width=")) return m;
    return `<img src="images/after.jpg" width="1200" height="800"${rest}>`;
  });
  // Logo: 200×60 (matches .logo img width:200px in CSS)
  html = html.replace(/<img src="images\/logo\.png"([^>]*)>/g, (m, rest) => {
    if (rest.includes("width=")) return m;
    return `<img src="images/logo.png" width="200" height="60"${rest}>`;
  });
  // Catch-all for any other image without dimensions
  html = html.replace(/<img(?![^>]*width=)([^>]*)>/g, (m, rest) => `<img${rest} width="1200" height="800">`);

  // ── 5. Lightbox: add aria-modal + aria-label ──────────────────────────
  html = html.replace(
    '<div id="lightbox" role="dialog" aria-hidden="true">',
    '<div id="lightbox" role="dialog" aria-modal="false" aria-label="Project photo viewer" aria-hidden="true">'
  );

  if (html !== original) {
    fs.writeFileSync(fp, html, "utf8");
    const saved = (original.length - html.length);
    console.log(`  OK    ${file}  (saved ${saved > 0 ? saved : -saved} bytes ${saved > 0 ? "smaller" : "larger"})`);
    transformed++;
  } else {
    console.log(`  NOOP  ${file}  (no changes — check manually)`);
  }
}

console.log(`\nDone. ${transformed} file(s) transformed, ${skipped} skipped.`);
console.log(`\nNext steps:`);
console.log(`  1. Delete the stray zips:  rm "prime-marble-site (1).zip" prime-marble-site-update.zip`);
console.log(`  2. Verify style.css and site.js are in this folder.`);
console.log(`  3. Commit and push:  git add -A && git commit -m "Consolidated CSS/JS, a11y fixes, performance" && git push`);
