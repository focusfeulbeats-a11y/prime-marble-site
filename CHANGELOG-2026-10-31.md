# Prime Marble website update — 31 October 2026

## Changes
- Added the Marble Fabrication & Installation page to the main navigation across the site's navigation menus.
- Added a dedicated Marble Fabrication & Installation service card to the homepage.
- Added the missing mobile menu controls and menu behavior to the fabrication landing page.
- Added a mobile Call / WhatsApp contact bar to the fabrication landing page.
- Generated WebP versions of the 12 primary project photographs and updated website references to use them; original image files remain in the repository.
- Removed references to the unavailable `images/marble-bg.jpg` asset while retaining the existing gradient backgrounds.
- Connected service-page provider schema to the homepage business entity using a stable `@id`.
- Clarified the fabrication-partner/customer-supplied-stone model in `llms.txt`.
- Added explicit OAI-SearchBot allow rules to `robots.txt`; the existing wildcard allow rule remains.
- Corrected stale local asset paths in the archived `index_original.html` page.

## Validation performed
- Checked local HTML asset references: no missing local assets.
- Checked CSS `url(...)` references: no missing local assets.
- Parsed JSON-LD blocks: valid JSON.
- Checked inline JavaScript syntax with Node: no syntax errors.
- Confirmed the fabrication navigation link is present in site navigation menus.

## Not performed
- No live deployment or Search Console changes.
- No GitHub commit/push (requires the GitHub connection).
- No full visual QA on physical devices; a headless browser screenshot attempt timed out in this environment.
