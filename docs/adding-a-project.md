# Playbook: adding a new project

How to add one project to the Shreedhar Group site, following the pattern the 11 existing projects use.
Worked example throughout: **Shreedhar Bliss** (slug `bliss`). Checked against the repo on 2026-10-03, after the October 2026 fix round.

The site is plain static HTML. There is no build step and no shared template or stylesheet: every project page is a self-contained file with its own CSS and script. A new project is a copy of an existing page plus edits in six other places.

Sections in a page are found by their HTML comment markers (for example `<!-- HERO -->`), not by line number. Line numbers move every time a page is edited.

## 0. Before you start

Get these from Hill. Do not guess or copy them from another project:

- Project name, status (ongoing / ready possession / completed), unit types, unit count
- Site address, postal code, map coordinates, Google Maps embed link
- Any price or possession date
- Brochure PDF and source images

**Sign-off rule:** anything touching prices, possession dates, RERA (Real Estate Regulatory Authority) text or contact details goes to Hill for approval before it is merged.

**RERA (Hill's decision, 2026-10-03):** do not put a RERA number on any page. Copy the existing "RERA ✓ Certified" tile as it is and add nothing to it.

### The one phone number

Hill's decision, 2026-10-03: the whole site uses a single number. Never put any other number on a page, and never add an "Alternate" line.

| Use | Value |
|---|---|
| Shown as text | `+91 98795 03547` |
| Call link | `tel:+919879503547` |
| WhatsApp link | `https://wa.me/919879503547?text=...` |

## 1. Pick the slug

One lowercase word, the project name without "Shreedhar": `bliss`, `vihar`, `luxuria`. Use a hyphen only if two words are unavoidable.

The slug is used everywhere, and must be identical in all of them:

| Thing | Path for `bliss` |
|---|---|
| Page | `projects/bliss.html` |
| Public URL | `https://shreedhargroup.vercel.app/projects/bliss` (no `.html`; `vercel.json` has `cleanUrls: true`) |
| Card image | `images/projects/bliss.webp` |
| Page images | `images/projects/bliss/` |
| Brochure | `brochures/bliss.pdf` |

## 2. Add the files

### Brochure
`brochures/<slug>.pdf`. Compress it before adding: aim for under 10 MB, since it downloads on mobile. Keep the untouched original outside the repo in `D:/Documents/Shreedhar Website-backups/brochures-original/`. Compress embedded images only (about 150 dpi, JPEG quality about 75); never turn pages into pictures, and check that small text on floor plans is still readable at 200% zoom. Compare every page with the original before accepting the result: one automatic pass corrupted a Luxuria page in October 2026 and only the page-by-page comparison caught it. If the file will not shrink without visible loss, keep the original.

### Images
All images are WebP (`.webp`). Put the JPG/PNG sources in place, run `node convert-images.js` (converts every JPG/PNG under `images/` to WebP at quality 75, skips ones already converted), then delete the JPG/PNG sources so they are not committed. The script does not resize, so resize first. It needs `npm install` once (`sharp` is a development dependency).

| File | Use | Size guide (from `bliss`) |
|---|---|---|
| `images/projects/<slug>.webp` | Card on the homepage | Landscape, about 1400 px wide, 65–235 KB |
| `images/projects/<slug>/hero.webp` | Top of project page, first gallery cell, link-preview image | About 1700 px wide, 16:9 or wider, under 350 KB |
| `images/projects/<slug>/<name>.webp` | Gallery (Bliss has 5 cells: hero + 4) | 1200–1700 px wide, under 350 KB |
| `images/projects/<slug>/plan-<name>.webp` | Floor plans, one per tab | 900–1700 px wide, 50–120 KB |

Naming: lowercase, hyphens, descriptive.
- Gallery: `aerial`, `exterior-day`, `clubhouse`, `pool`, `garden`, `entrance`, `night`, `amenities`.
- Plans always start with `plan-`: `plan-layout`, `plan-ground`, `plan-typical`, `plan-type-a`, `plan-unit-3bhk`.
- `hero.webp` is required.

## 3. Create the project page

Copy `projects/bliss.html` to `projects/<slug>.html`, then replace every Bliss-specific value. Pick a source project of the same kind where you can (villa project → `bliss`/`palace`; apartments → `vihar`/`royal`). Do not copy `glory.html`: it is written in a compact style unlike the other ten.

Work through the page top to bottom:

| # | Section (marker) | What to change |
|---|---|---|
| 1 | `<title>` | `Shreedhar <Name> — <config> in <area> \| Shreedhar Group` |
| 2 | Meta description | One or two sentences: name, config, area, top amenities |
| 3 | Canonical and link-preview tags (right after the description) | See "Head tags" below |
| 4 | JSON-LD (structured data for search engines) | `name`, `description`, full `address`, `geo`, `amenity` list, `numberOfRooms` |
| 5 | `<!-- WHATSAPP FLOAT -->` | Project name inside the pre-filled message. Number stays `919879503547` |
| 6 | `<!-- NAV -->` | `aria-label` on "Enquire Now" |
| 7 | `<!-- HERO -->` | Image path, `alt`, `width`/`height`, status tag (`Ongoing · <area>`), `<h1>`, sub-text, brochure link, fallback gradient colour |
| 8 | `<!-- KEY HIGHLIGHTS -->` | Six `hl-item` tiles. Leave the `RERA ✓` tile as copied; no number |
| 9 | `<!-- GALLERY -->` | One `g-cell` per image (see "Image tiles" below) |
| 10 | `<!-- ABOUT PROJECT -->` | Copy from the brochure |
| 11 | `<!-- AMENITIES -->` | Only amenities the brochure lists |
| 12 | `<!-- FLOOR PLANS -->` | One tab plus one panel per plan (see "Floor-plan tabs" below) |
| 13 | `<!-- SPECIFICATIONS -->` | From the brochure |
| 14 | `<!-- LOCATION -->` | Maps `iframe` src (must be `https://www.google.com/maps/embed...`), site address, nearby landmarks, connectivity |
| 15 | `<!-- SITE OFFICE CONTACT -->` | Role line and the project name in the WhatsApp message. Phone is the one site number; no "Alternate" row |
| 16 | `<!-- BROCHURE CTA -->` | Brochure link and `aria-label` |
| 17 | `<!-- FOOTER -->`, `<!-- LIGHTBOX -->`, `<style>`, `<script>` | Nothing project-specific. Do not edit |

Then search the new file for the old slug and name (`bliss`, `Bliss`, `Dahegam`, `Hansoli`). There must be zero matches left. Then list every phone number in the file (search `wa.me/`, `tel:` and `+91`): each one must be the site number.

### Head tags

Every page carries one canonical link and one set of Open Graph (link preview) tags. They repeat text already on the page; do not write new copy for them.

```html
<link rel="canonical" href="https://shreedhargroup.vercel.app/projects/bliss">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Shreedhar Group">
<meta property="og:title" content="(same as <title>)">
<meta property="og:description" content="(same as the meta description)">
<meta property="og:url" content="(same as canonical)">
<meta property="og:image" content="https://shreedhargroup.vercel.app/images/projects/bliss/hero.webp">
<meta property="og:image:width" content="1690">
<meta property="og:image:height" content="841">
<meta property="og:image:alt" content="(same as the hero image alt)">
<meta name="twitter:card" content="summary_large_image">
```

The canonical URL must equal the `<loc>` you add to `sitemap.xml`, character for character.

### Images

Rules for every `<img>` (from `CLAUDE.md`; all 11 existing pages follow them):

- Descriptive `alt` text. Icon-only links need an `aria-label`.
- Hero image: `loading="eager" fetchpriority="high" decoding="async"`. Exactly one `fetchpriority="high"` per page.
- Nav logo: `loading="eager"`. Every other image: `loading="lazy" decoding="async"`.
- `width` and `height` are the file's **true pixel size**, not a round guess. Wrong values make the page jump when the image arrives. Read them from the file (image properties, or `sharp(path).metadata()`).
- Keep the `onerror` fallback each existing image has.

### Image tiles (gallery and floor plans)

Each clickable tile is a `div` that opens the image viewer. The image path appears twice (in `openLightbox(...)` and in `<img src>`), and the caption appears twice (in `openLightbox(...)` and in `aria-label`):

```html
<div class="g-cell"
  onclick="openLightbox('../images/projects/bliss/pool.webp','Swimming Pool — Splash that lasts forever')"
  role="button" tabindex="0" aria-label="View larger: Swimming Pool — Splash that lasts forever">
```

Keep `role="button" tabindex="0"` and the `aria-label` on every tile; they are what makes the gallery usable by keyboard and screen reader.

### Floor-plan tabs

The tab and its panel are tied together by one id, here `type-a`. All five places must agree:

```html
<button class="fp-tab" onclick="showPlan('type-a',this)" role="tab" id="tab-type-a"
  aria-controls="plan-type-a" aria-selected="false" tabindex="-1">Type A</button>
...
<div class="fp-panel" id="plan-type-a" role="tabpanel" aria-labelledby="tab-type-a">
```

- Exactly one tab is the starting one: it has class `active`, `aria-selected="true"` and `tabindex="0"`, and its panel has class `active`. Every other tab has `aria-selected="false"` and `tabindex="-1"`.
- Keep the image file name the same as the id (`plan-type-a.webp`).
- Keep tab labels short; long ones wrap badly on phones.

### Paths

Project pages sit one folder down, so assets are `../images/...` and `../brochures/...`. Links back to the homepage are absolute: `/` and `/#projects`.

### Mobile

The page CSS is copied with the page, so layout carries over. What breaks on a phone is content: long floor-plan tab labels, long `<h1>` names, more or fewer than six highlight tiles. Check at 320 px and 375 px wide.

## 4. Update the homepage (`index.html`)

Four places. Missing any one leaves the site inconsistent.

1. **Project card** in `.projects-grid`. Copy a whole `pcard` block (each starts with a numbered comment such as `<!-- 1. SHREEDHAR BLISS — ... -->`) and change:
   - the numbered comment
   - `data-cat`: space-separated filter keys. Valid keys: `ongoing`, `completed`, `residential`, `villa`, `weekend`. Bliss uses `weekend villa`.
   - `onclick="window.location='projects/<slug>'"` and the "View Details" `href` (no `.html`)
   - card image `src` and `alt`
   - status tag: `pcard-tag ongoing` (Ongoing), `pcard-tag ready-possession` (Ready Possession), plain `pcard-tag` (Completed)
   - `pcard-name`, `pcard-loc`, the three `pcard-chip` values
   - brochure `href` and `aria-label`
   - stagger class: cards cycle `reveal`, `reveal reveal-d1`, `reveal reveal-d2`. Re-cycle the cards after the insertion point and renumber their comments.
   - **Position (Hill's rule):** a new project goes after the existing ongoing projects and before the ready-possession and completed ones.
2. **Section heading** `11 Projects. One Promise.` → bump the number.
3. **Enquiry form dropdown** `#cf-project`: add `<option>Shreedhar <Name> — <config></option>` before "Other / General Enquiry". Only ongoing projects are listed here.
4. **Filter buttons** (`.proj-filters`): only if the project needs a category that does not exist. Avoid; reuse an existing key.

Do not change `45+ Projects` (marquee, section sub-heading and number counter). That is the group's lifetime total, not the count of pages.

## 5. Update the chatbot (`api/chat.js`)

The chatbot's project list lives on the server, in the `CHAT_SYSTEM` text at the top of `api/chat.js` (it is no longer in `index.html`). Add one numbered line in the same form:

```
12. SHREEDHAR <NAME> - <status>. <area>. Config: <config>.
```

The chatbot can only talk about projects in this list. Facts only, taken from the page: no prices, no dates.

## 6. Update the sitemap (`sitemap.xml`)

Add one block inside `<urlset>`, using the clean URL and today's date:

```xml
  <url>
    <loc>https://shreedhargroup.vercel.app/projects/bliss</loc>
    <lastmod>2026-10-03</lastmod>
    <priority>0.9</priority>
  </url>
```

Also update `<lastmod>` on the homepage entry, since `index.html` changed. `robots.txt` needs no change.

## 7. Security policy (`vercel.json`)

`vercel.json` sends a Content Security Policy (a browser rule listing where scripts, styles, fonts, images and frames may load from). A normal new project needs no change. But anything loaded from a host not already listed is silently blocked on the live site. Allowed today: the site itself, Google Fonts, `cdn.jsdelivr.net` (scripts), `api.emailjs.com`, and `www.google.com` (map frames). Images must be local files. If a new page needs another host, that is a `vercel.json` change and needs review.

## 8. Check before handing to Hill

- [ ] `/projects/<slug>` opens; hero, every gallery cell and every floor-plan tab shows an image
- [ ] Image viewer opens and closes by mouse (click, ✕, backdrop) and by keyboard (Tab to a tile, Enter, Escape returns focus)
- [ ] Floor-plan tabs switch by click and by arrow keys
- [ ] Both brochure buttons on the page and the one on the card open the right PDF
- [ ] Call and WhatsApp buttons use `919879503547` and the new project's name; no other number anywhere on the page
- [ ] Homepage card sits after the ongoing projects, appears under the right filters and links to the page
- [ ] Card count on the homepage equals the heading number
- [ ] Project is in the dropdown (if ongoing), in `api/chat.js`, and in `sitemap.xml`
- [ ] Canonical URL equals the sitemap `<loc>`; link-preview title, description and image are the new project's
- [ ] One `fetchpriority="high"`; every `<img>` has `loading`, and true `width`/`height`
- [ ] No leftover text from the copied project (search for the old slug, name and area)
- [ ] 320 px and 375 px wide: no sideways scroll, nav button not cut off, tabs and tiles wrap cleanly
- [ ] No JPG/PNG sources left under `images/projects/`; brochure compressed and original backed up
- [ ] Other project pages and the homepage still load (nothing else was edited)
- [ ] Hill has approved prices, possession dates, RERA text and contact details

There is no build command (`CLAUDE.md` mentions `npm run build`; it does not exist). Verify by opening the pages. `npx serve` in the repo folder serves the site locally, but it does not apply the `vercel.json` headers and `/api/chat` will not answer; the Vercel preview deploy for the branch is the full test.

Work on a branch. Never push to `main`; Vercel deploys `main` to the live site.

## Known issues that affect this playbook

Open as of 2026-10-03. A copied page inherits these.

| # | Issue | Where | New page: do this |
|---|---|---|---|
| 1 | Light text on dark sections is below the 4.5:1 contrast minimum (footer text, highlight labels, site-contact labels). Left as is; fixing it changes the look and needs Hill | all pages | Inherited |
| 2 | The security policy still allows inline scripts and styles, because every page is built from them. A strict policy needs the inline code moved into shared files | site-wide | Nothing per page |
| 3 | Link-preview images are WebP. Some services show JPG/PNG more reliably | all pages | Use `hero.webp` like the others until Hill decides |
| 4 | Every page is a self-contained copy, so any template fix must be repeated in 11 files | `projects/*.html` | Copy from an up-to-date page; never from an old backup |
| 5 | `glory.html` is written in a compact style unlike the other ten | `projects/glory.html` | Do not copy `glory` |
| 6 | Homepage card images have no `width`/`height`, and a few homepage image sizes are round guesses | `index.html` | Add true `width`/`height` to the new card image anyway |
| 7 | `images/projects/glory/location.webp` is not used by any page (kept on purpose) | — | — |
| 8 | `CLAUDE.md` requires `npm run build`, which does not exist | `package.json` | Verify by opening pages |
| 9 | Six brochures are still large and were left untouched, because they could not be shrunk without visible loss: bliss 23.8 MB, royal 12.8 MB, vihar 8.9 MB, glory 6.5 MB, villa 5.4 MB, palace 3.7 MB. Luxuria is still 20.1 MB after compression. Smaller files need a fresh export from the designer's source | `brochures/` | Ask the designer for a web-size export of the new brochure |

Fixed in the October 2026 round, for reference: single phone number, chatbot script injection and open chat endpoint, Greens missing from the chatbot, stray tag in `greens.html`, footer year, sitemap dates, EmailJS pinned with an integrity hash, `sharp` upgraded, image loading and true sizes, 320 px layout, keyboard and screen-reader support, muted-text contrast on light backgrounds, canonical and link-preview tags, reduced-motion support, security headers, brochure compression (5 of 11 files).
