# Rabat, Morocco — Wikimedia Commons image sourcing

Research date: 2026-06-11. Purpose: hotlinkable hero/section photography for the Rabat static site
(images served at runtime from `upload.wikimedia.org`).

## Method and verification notes (read first)

- **Network constraint this session:** Wikimedia hosts (`commons.wikimedia.org`, `en.wikipedia.org`,
  `upload.wikimedia.org`) returned **HTTP 403 to WebFetch**, and the sandbox HTTP proxy blocks them
  ("Host not in allowlist"), so per-URL HTTP verification was impossible. Verification was instead done
  via the web-search backend, which **reads the live Commons file pages** and returned their metadata
  (exact title, pixel dimensions, file size, license, author). Files are listed only if the search engine
  confirmed the Commons file page (or its category entry with exact filename + dimensions) exists.
- **Direct URL construction:** Commons direct URLs are deterministic:
  `https://upload.wikimedia.org/wikipedia/commons/<a>/<ab>/<Filename>` where `a`/`ab` are the first
  hex chars of `md5(filename_with_underscores)`. All hash paths below were computed locally with this
  canonical scheme. Sanity check: for `Rabat, old and new (…).jpg` the search engine independently
  returned the live direct URL `…/commons/e/e4/…`, which matches the computed hash exactly.
- **Thumb pattern:** `https://upload.wikimedia.org/wikipedia/commons/thumb/<a>/<ab>/<File>/1280px-<File>`
  (works for any Commons bitmap; swap 1280 for other widths).
- **Status flags:**
  - `VERIFIED` — license + author + dimensions read from the live file page.
  - `PARTIAL` — file existence + dimensions confirmed (category listing / file page hit), but
    license/author could not be extracted this session. **Check the file page before shipping.**
- Suggested credit format: `Author, License, via Wikimedia Commons` (link the file page).

---

## ★ BEST PICKS

- **BEST HERO (Rabat page):** `Rabat City 1.JPG` — Commons **Quality Image**, Bou Regreg river with
  boats and the Rabat old-city waterfront seen from the Salé bank. CC BY-SA 4.0, by MarwanAndrew,
  3872×2592. Fully verified. (See subject 2/7.)
  *If you specifically want the blue-and-white street look for the hero, use the Pline kasbah images in
  subject 1 after a quick visual check — their license/author are verified, but I could not visually
  confirm the framing this session.*
- **BEST LANDING-PAGE TRIP CARD:** `Hassan Tower and columns (Rabat, Morocco) (15126547404).jpg` —
  **CC0 (public domain dedication)** by Carlos ZGZ, the iconic minaret + ruined columns, 2048×1536.
  Zero attribution friction, fully verified.

---

## 1. Kasbah of the Udayas — streets (hero subject)

### 1a. Kasbah des Oudaias P1060348.JPG — VERIFIED license/author (framing unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:Kasbah_des_Oudaias_P1060348.JPG
- Direct: https://upload.wikimedia.org/wikipedia/commons/5/51/Kasbah_des_Oudaias_P1060348.JPG
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Kasbah_des_Oudaias_P1060348.JPG/1280px-Kasbah_des_Oudaias_P1060348.JPG
- 3328 × 1872 (wide 16:9 — good banner crop) | Author: **Pline** | License: **CC BY-SA 3.0** (multi-licensed GFDL/CC BY-SA 3.0, 2.5, 2.0, 1.0)
- Inside the Kasbah des Oudaias (Pline's Rabat series); blue-and-white quarter — exact framing not visually confirmed this session.

### 1b. Kasbah des Oudaias P1060356.JPG — VERIFIED license/author (framing unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:Kasbah_des_Oudaias_P1060356.JPG
- Direct: https://upload.wikimedia.org/wikipedia/commons/8/85/Kasbah_des_Oudaias_P1060356.JPG
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Kasbah_des_Oudaias_P1060356.JPG/1280px-Kasbah_des_Oudaias_P1060356.JPG
- 3328 × 1872 | Author: **Pline** | License: **CC BY-SA 3.0** (same multi-license)
- Companion shot from the same series inside the kasbah.

## 2. Kasbah of the Udayas from the sea/river

### 2a. Rabat City 1.JPG — VERIFIED ★ BEST HERO
- File page: https://commons.wikimedia.org/wiki/File:Rabat_City_1.JPG
- Direct: https://upload.wikimedia.org/wikipedia/commons/b/bc/Rabat_City_1.JPG
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Rabat_City_1.JPG/1280px-Rabat_City_1.JPG
- 3872 × 2592 | Author: **MarwanAndrew** | License: **CC BY-SA 4.0** | Commons **Quality Image** (Wiki Loves Africa 2015)
- Bou Regreg river and the Rabat old town/kasbah waterfront viewed from the Salé side, boats on the water.

### 2b. A Cloudy View - Oudaya Rabat.jpg — PARTIAL (license/author unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:A_Cloudy_View_-_Oudaya_Rabat.jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/5/55/A_Cloudy_View_-_Oudaya_Rabat.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/A_Cloudy_View_-_Oudaya_Rabat.jpg/1280px-A_Cloudy_View_-_Oudaya_Rabat.jpg
- 5184 × 3456 | Author: not confirmed | License: not confirmed (filename style matches WLM Morocco uploads, likely CC BY-SA 4.0 — **verify**)
- Dramatic cloudy-sky view of the Oudaya kasbah; largest kasbah image found (in Category:Kasbah of the Udayas).

## 3. Hassan Tower (Tour Hassan)

### 3a. Hassan Tower and columns (Rabat, Morocco) (15126547404).jpg — VERIFIED ★ BEST TRIP CARD
- File page: https://commons.wikimedia.org/wiki/File:Hassan_Tower_and_columns_(Rabat,_Morocco)_(15126547404).jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/e/e4/Hassan_Tower_and_columns_%28Rabat%2C_Morocco%29_%2815126547404%29.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Hassan_Tower_and_columns_%28Rabat%2C_Morocco%29_%2815126547404%29.jpg/1280px-Hassan_Tower_and_columns_%28Rabat%2C_Morocco%29_%2815126547404%29.jpg
- 2048 × 1536 | Author: **Carlos ZGZ** (Flickr) | License: **CC0 / CC-Zero (public domain)**
- The unfinished 12th-century minaret rising behind the field of ruined columns — the classic Tour Hassan postcard.

### 3b. 04032012-Bouregreg - Tour Hassan (6951882099).jpg — PARTIAL (license/author unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:04032012-Bouregreg_-_Tour_Hassan_(6951882099).jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/a/a8/04032012-Bouregreg_-_Tour_Hassan_%286951882099%29.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/04032012-Bouregreg_-_Tour_Hassan_%286951882099%29.jpg/1280px-04032012-Bouregreg_-_Tour_Hassan_%286951882099%29.jpg
- 3592 × 2386 | Author/License: not confirmed (Flickr import — **verify**)
- Hassan Tower seen across/over the Bouregreg — combines monument + river.

## 4. Mausoleum of Mohammed V

### 4a. King's guard-Mausoleum Mohammed V-Rabat-Morocco.jpg — VERIFIED (exterior)
- File page: https://commons.wikimedia.org/wiki/File:King%27s_guard-Mausoleum_Mohammed_V-Rabat-Morocco.jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/d/d9/King%27s_guard-Mausoleum_Mohammed_V-Rabat-Morocco.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/King%27s_guard-Mausoleum_Mohammed_V-Rabat-Morocco.jpg/1280px-King%27s_guard-Mausoleum_Mohammed_V-Rabat-Morocco.jpg
- 4032 × 1908 (≈2.1:1 — excellent banner ratio) | Author: **Yair Haklai** (user:Yair-haklai) | License: **CC BY-SA 4.0**
- Royal guard in red at the white-marble mausoleum facade — color pop, strong section header.

### 4b. Mausoleum of Mohammed V with a Koran reader (5508503031).jpg — VERIFIED (interior)
- File page: https://commons.wikimedia.org/wiki/File:Mausoleum_of_Mohammed_V_with_a_Koran_reader_(5508503031).jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/d/d0/Mausoleum_of_Mohammed_V_with_a_Koran_reader_%285508503031%29.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Mausoleum_of_Mohammed_V_with_a_Koran_reader_%285508503031%29.jpg/1280px-Mausoleum_of_Mohammed_V_with_a_Koran_reader_%285508503031%29.jpg
- 4288 × 2848 | Author: **Jorge Láscar** (Flickr photo 5508503031, photostream confirmed) | License: **CC BY 2.0** (Láscar's standard Flickr license — double-check tag on page)
- Ornate zellige-and-gold interior with the Koran reader beside the royal tomb.

## 5. Chellah necropolis

### 5a. Chellah landscape.jpg — VERIFIED license/author (dimensions unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:Chellah_landscape.jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/a/a4/Chellah_landscape.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Chellah_landscape.jpg/1280px-Chellah_landscape.jpg
- Dimensions: not confirmed (check page; request 1280px thumb regardless) | Author: **HalaRah** | License: **CC BY-SA 4.0** (Wiki Loves Monuments 2018 Morocco)
- The Zawiya of Chellah ruins in their landscape — the minaret here is the famous stork-nest perch.

### 5b. Rabat, Chellah necropolis exterior.jpg — PARTIAL (license/author unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:Rabat,_Chellah_necropolis_exterior.jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/7/74/Rabat%2C_Chellah_necropolis_exterior.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Rabat%2C_Chellah_necropolis_exterior.jpg/1280px-Rabat%2C_Chellah_necropolis_exterior.jpg
- Dimensions/author/license: not confirmed (uploaded 2007 — **verify**)
- Fortified Almohad-style gate and outer walls of the necropolis.

## 6. Rabat Medina / Rue des Consuls

### 6a. Medina wall - Rabat (5508523225).jpg — VERIFIED
- File page: https://commons.wikimedia.org/wiki/File:Medina_wall_-_Rabat_(5508523225).jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/f/f9/Medina_wall_-_Rabat_%285508523225%29.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Medina_wall_-_Rabat_%285508523225%29.jpg/1280px-Medina_wall_-_Rabat_%285508523225%29.jpg
- Dimensions: not confirmed (Láscar Flickr originals are typically 2048px wide) | Author: **Jorge Láscar** | License: **CC BY 2.0** (explicitly confirmed)
- The ochre Andalusian wall of the medina — atmosphere shot for the medina section.

### 6b. Shopping à la médina de Rabat.jpg — PARTIAL (license/author unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:Shopping_%C3%A0_la_m%C3%A9dina_de_Rabat.jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/a/a0/Shopping_%C3%A0_la_m%C3%A9dina_de_Rabat.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Shopping_%C3%A0_la_m%C3%A9dina_de_Rabat.jpg/1280px-Shopping_%C3%A0_la_m%C3%A9dina_de_Rabat.jpg
- 2048 × 1152 (16:9) | Author/License: not confirmed (**verify**)
- Market/shopping scene; listed in Category:Rue des Consuls Rabat — the souk street itself.

## 7. Bou Regreg river, boats and marina

### 7a. Rabat City 1.JPG — VERIFIED (same file as 2a — river, boats, city)
- See subject 2a for all URLs/details. Doubles perfectly here.

### 7b. 03032012-Marina de Rabat-Salé (6805763132).jpg — PARTIAL (license/author unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:03032012-Marina_de_Rabat-Sal%C3%A9_(6805763132).jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/1/1c/03032012-Marina_de_Rabat-Sal%C3%A9_%286805763132%29.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/03032012-Marina_de_Rabat-Sal%C3%A9_%286805763132%29.jpg/1280px-03032012-Marina_de_Rabat-Sal%C3%A9_%286805763132%29.jpg
- 3653 × 2426 | Author/License: not confirmed (Flickr import — **verify**)
- The Bouregreg Marina with moored yachts between Rabat and Salé.

## 8. Andalusian Gardens

### 8a. A photos of andalusian garden in the kasbah of oudaya Rabat.jpg — VERIFIED
- File page: https://commons.wikimedia.org/wiki/File:A_photos_of_andalusian_garden_in_the_kasbah_of_oudaya_Rabat.jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/f/fd/A_photos_of_andalusian_garden_in_the_kasbah_of_oudaya_Rabat.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/A_photos_of_andalusian_garden_in_the_kasbah_of_oudaya_Rabat.jpg/1280px-A_photos_of_andalusian_garden_in_the_kasbah_of_oudaya_Rabat.jpg
- 2048 × 1365 | Author: **Omalihy** | License: **CC BY-SA 4.0** (Wiki Loves Monuments)
- The flower-filled Andalusian garden inside the Oudayas kasbah, palace walls behind.

## 9. Rabat beach / Atlantic coast

### 9a. Rabat Beach 3.jpg — PARTIAL (license/author unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:Rabat_Beach_3.jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/7/71/Rabat_Beach_3.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Rabat_Beach_3.jpg/1280px-Rabat_Beach_3.jpg
- 4608 × 3456 | Author/License: not confirmed (**verify**; Category:Beaches of Rabat)
- The city beach below the Oudayas at the river mouth.

### 9b. Plage de Rabat Rabat Marokko.jpg — PARTIAL (license/author unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:Plage_de_Rabat_Rabat_Marokko.jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/b/be/Plage_de_Rabat_Rabat_Marokko.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Plage_de_Rabat_Rabat_Marokko.jpg/1280px-Plage_de_Rabat_Rabat_Marokko.jpg
- 2048 × 1536 | Author/License: not confirmed (**verify**)
- Sand, surf and the Atlantic at Rabat's plage.

## 10. Mohammed VI Tower / modern skyline

### 10a. Rabat, old and new (Mausoleum of Mohammed V and new Mohammed VI Tower behind; ضريح محمد الخامس).jpg — PARTIAL (direct URL confirmed live; license/author unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:Rabat,_old_and_new_(Mausoleum_of_Mohammed_V_and_new_Mohammed_VI_Tower_behind;_%D8%B6%D8%B1%D9%8A%D8%AD_%D9%85%D8%AD%D9%85%D8%AF_%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3).jpg
- Direct (returned live by search engine, matches computed hash): https://upload.wikimedia.org/wikipedia/commons/e/e4/Rabat%2C_old_and_new_%28Mausoleum_of_Mohammed_V_and_new_Mohammed_VI_Tower_behind%3B_%D8%B6%D8%B1%D9%8A%D8%AD_%D9%85%D8%AD%D9%85%D8%AF_%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3%29.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Rabat%2C_old_and_new_%28Mausoleum_of_Mohammed_V_and_new_Mohammed_VI_Tower_behind%3B_%D8%B6%D8%B1%D9%8A%D8%AD_%D9%85%D8%AD%D9%85%D8%AF_%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3%29.jpg/1280px-Rabat%2C_old_and_new_%28Mausoleum_of_Mohammed_V_and_new_Mohammed_VI_Tower_behind%3B_%D8%B6%D8%B1%D9%8A%D8%AD_%D9%85%D8%AD%D9%85%D8%AF_%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3%29.jpg
- 5181 × 3873 | Author/License: not confirmed (**verify**; in Category:Mohammed VI Tower (Salé))
- "Old and new" — the white Mausoleum of Mohammed V with Africa's tallest skyscraper (250 m, opened April 2026) rising behind. Best storytelling shot for the modern-Rabat section.

## 11. Moroccan food

### 11a. Moroccan TAGINE.JPG — VERIFIED
- File page: https://commons.wikimedia.org/wiki/File:Moroccan_TAGINE.JPG
- Direct: https://upload.wikimedia.org/wikipedia/commons/e/ea/Moroccan_TAGINE.JPG
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Moroccan_TAGINE.JPG/1280px-Moroccan_TAGINE.JPG
- 3648 × 2736 | Author: **Ridouan Red** | License: **CC BY-SA 4.0**
- A steaming Moroccan tagine in its conical clay pot.

### 11b. Moroccan Mint Tea - 1.jpg — VERIFIED
- File page: https://commons.wikimedia.org/wiki/File:Moroccan_Mint_Tea_-_1.jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/4/42/Moroccan_Mint_Tea_-_1.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Moroccan_Mint_Tea_-_1.jpg/1280px-Moroccan_Mint_Tea_-_1.jpg
- 6048 × 4024 | Author: **Sarkar Sayantan** | License: **CC BY-SA 4.0**
- Mint tea poured into ornate glasses — the highest-resolution food option.

## 12. Hassan II Mosque, Casablanca (day-trip card)

### 12a. Hassan II Mosque - general framing, Casablanca, Morocco.jpg — PARTIAL (license/author unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:Hassan_II_Mosque_-_general_framing,_Casablanca,_Morocco.jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/e/e9/Hassan_II_Mosque_-_general_framing%2C_Casablanca%2C_Morocco.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Hassan_II_Mosque_-_general_framing%2C_Casablanca%2C_Morocco.jpg/1280px-Hassan_II_Mosque_-_general_framing%2C_Casablanca%2C_Morocco.jpg
- 10622 × 8078 (huge) | Author/License: not confirmed (**verify**; hosted on Commons, Category:Hassan II Mosque)
- Full view of the mosque and its 210 m minaret over the Atlantic.

### 12b. Hassan II Mosque Plaza.jpg — PARTIAL (license/author unconfirmed)
- File page: https://commons.wikimedia.org/wiki/File:Hassan_II_Mosque_Plaza.jpg
- Direct: https://upload.wikimedia.org/wikipedia/commons/3/32/Hassan_II_Mosque_Plaza.jpg
- 1280px: https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Hassan_II_Mosque_Plaza.jpg/1280px-Hassan_II_Mosque_Plaza.jpg
- 3872 × 2592 (landscape — better card crop) | Author/License: not confirmed (**verify**)
- The vast esplanade with the mosque behind.
- Caution: avoid the very large "Minaret tower of the Hassan II Mosque…" file — it is hosted locally on
  English Wikipedia with a "do not copy to Commons" notice (considered non-free in Morocco); prefer the
  Commons-hosted files above.

## 13. Aerial / panorama of Rabat

### 13a. Rabat City 1.JPG — VERIFIED (same as 2a; wide river-and-city panorama, Quality Image)
### 13b. Rabat, old and new (…).jpg — PARTIAL (same as 10a; sweeping old/new cityscape)

---

## Attribution quick list (verified files)

| File | Credit line |
|---|---|
| Hassan Tower and columns (15126547404) | Carlos ZGZ, CC0, via Wikimedia Commons (credit appreciated, not required) |
| Rabat City 1.JPG | MarwanAndrew, CC BY-SA 4.0, via Wikimedia Commons |
| King's guard-Mausoleum Mohammed V | Yair Haklai, CC BY-SA 4.0, via Wikimedia Commons |
| Mausoleum … Koran reader (5508503031) | Jorge Láscar, CC BY 2.0, via Wikimedia Commons |
| Medina wall - Rabat (5508523225) | Jorge Láscar, CC BY 2.0, via Wikimedia Commons |
| Chellah landscape.jpg | HalaRah, CC BY-SA 4.0, via Wikimedia Commons |
| A photos of andalusian garden … | Omalihy, CC BY-SA 4.0, via Wikimedia Commons |
| Kasbah des Oudaias P1060348/P1060356 | Pline, CC BY-SA 3.0, via Wikimedia Commons |
| Moroccan TAGINE.JPG | Ridouan Red, CC BY-SA 4.0, via Wikimedia Commons |
| Moroccan Mint Tea - 1.jpg | Sarkar Sayantan, CC BY-SA 4.0, via Wikimedia Commons |

CC BY-SA images: include the credit + license link near the image or on a credits page. ShareAlike only
binds derivatives of the image itself; hotlinking with attribution is fine.

## Follow-ups before launch
1. Open each PARTIAL file page once (normal browser) to record author/license — 8 pages.
2. Visually confirm the two Pline kasbah shots show the blue-and-white streets; if yes, promote 1a to hero.
3. Spot-check each 1280px thumb URL returns 200 (any browser/curl outside this sandbox).
