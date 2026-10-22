# LPU ONLINE — TEMPLATE / DESIGN SPEC (measured)

> Auto-measured from the live app at **1366×900** via `qa/lpu-template-audit.json`
> (regenerate: `node audit-lpu.cjs`).
> **No content/data values are included** — this is the template, typography, colour,
> imagery, table and component spec only.

---

## 1. GLOBAL

| Property | Value |
|---|---|
| Font family | `Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` |
| Base font size | 16px |
| Body text colour | `rgb(17, 28, 45)` = **#111c2d** |
| Page background | `rgb(249, 249, 255)` = **#f9f9ff** |
| `<title>` (all 4 tabs) | `Online Siksha - LPU Online Degrees & Admissions Portal` |
| Meta description | `UGC-entitled online degree programs, fee structures, scholarship calculators, and admissions for Lovely Professional University Online.` |
| Content max width | `max-w-7xl` = **1280px** |
| Page gutters | `px-4 sm:px-6 lg:px-8` → 16 / 24 / **32px** |

### Section spacing
| Rule | Value |
|---|---|
| `.section-container` | `display:flex; flex-direction:column; gap:22px` (16px ≤640px) |
| `.page-section` | `margin-bottom:22px` (16px ≤640px) |
| `.content-block` | `padding-top:14px; padding-bottom:14px` |
| `.section-title` | `margin-bottom:4px` |
| Card inner gap | `gap:22px` inside cards |

---

## 2. COLOUR TOKENS

| Token | Hex | RGB | Used for |
|---|---|---|---|
| Ink | **#000f22** | 0,15,34 | All headings, table body text, strong text |
| Navy | **#0b2540** | 11,37,64 | Table header rows, dark CTA bands, hero cards, Apply-Now (dark) |
| Navy deep | **#071a34** | 7,26,52 | Admission page H1 |
| Navy alt | **#0b1e3a** / **#0b1b3a** | — | Hero gradient stops |
| Brand blue | **#115eaf** | 17,94,175 | Links, primary buttons, active tab, active TOC item, active chips |
| Brand hover | **#004689** | 0,70,137 | Button hover |
| Brand light | **#70aaff** | 112,170,255 | Accent text on dark bands |
| Body text | **#43474d** | 67,71,77 | 12–15px paragraphs, table header text on light |
| Body alt | **#2d3137** | 45,49,55 | Secondary paragraph |
| Muted | **#74777e** | 116,119,126 | 12px captions, subtitles |
| On-dark text | **#b1c8eb** | 177,200,235 | Body copy on navy bands |
| On-dark muted | **#768dad** | 118,141,173 | Labels on navy bands |
| Tint 1 | **#f0f3ff** | 240,243,255 | Tinted section bg, inactive chips, footer bands |
| Tint 2 | **#e7eeff** | 231,238,255 | Card borders, table row dividers |
| Tint 3 | **#d5e3ff** | 213,227,255 | Tinted section border, chip border |
| Tint 4 | **#d8e3fb** | 216,227,251 | Hero blur blob, footer logo border |
| Tint 5 | **#e1eaff** | 225,234,255 | Admission H1 card border |
| Tint 6 | **#eef4ff** | 238,244,255 | Icon-circle background (learning platform) |
| Card inner | **#f9f9ff** | 249,249,255 | Testimonial / table cell inner bg |
| Amber bg | **#fffbeb** | — | Icon chip (NAAC) |
| Amber text | **#92400e** / **#b45309** | — | Icon / value text |
| Amber icon | **#d97706** | — | Star icon |
| Amber chip | **#ffdcc3** bg / **#6e3900** txt | — | "Ongoing Batch", "Defense Personnel" tags |
| Blue chip | **#d5e3ff** bg / **#004689** txt | — | "Academic Merit" tag, "Required" badge |
| Green chip | **#e0f2e9** bg / **#129b55** txt | — | "Alumni Benefit" tag |
| Pink chip | **#ffdcc3** / pink-800 | — | "Women in Education" tag |
| Green accent | oklch(0.828 0.189 84.429) | — | Verified/emerald badges |
| Green text | oklch(0.596 0.145 163.225) | — | Success text |
| Grey border | **#c4c6ce** | — | Inputs, secondary button borders |
| Grey text | **#555960** | 85,89,96 | Tertiary text |
| Header dark | oklch(0.208 0.042 265.755) | — | "Ask AI Advisor" button |
| Header border | oklch(0.869 0.022 252.894) | — | "Login" button border |

---

## 3. TYPOGRAPHY SCALE

### H1
| Page | Size | Weight | Line-height | Colour |
|---|---|---|---|---|
| Overview | 36px | 700 | 40px | #000f22 |
| Courses | 36px | 700 | 45px | #000f22 |
| Scholarships | 36px | 700 | 40px | #000f22 |
| Admission | 40.98px | 700 | 49.18px | **#071a34** |

### H2 — section headings
| Size | Weight | Line-height | Colour | Where |
|---|---|---|---|---|
| 24px | 700 | 32px | #000f22 | default section heading (most sections) |
| 24px | **800** | 32px | #000f22 | `rankings`, `placements`, `reviews-section` (Overview); `admission-dates`, `examination-pattern`, `scholarship-schemes` (Admission) |
| 20px | 700 | 28px | #000f22 | `latest-news`, `popular-programmes` (Overview) |
| 22px | 700 | 30.8px | #000f22 | "Table of contents" |
| 30px | 800 | 36px | **#ffffff** | `counseling-callback` heading (on navy) |
| 24px | 700 | 32px | **#ffffff** | `documents-required` heading (on navy) |

### H3
| Size | Weight | Line-height | Colour | Where |
|---|---|---|---|---|
| 16px | 600 | 24px | #000f22 | UG/PG program tables, learning-platform rows, pillar titles |
| 16px | 700 | 24px | #000f22 | Scholarships calculator + pillar titles |
| 18px | 600 | 24.3px | #000f22 | Overview `admission-process` steps, exam-pattern steps |
| 14px | 600 | 20px | #000f22 | Admission `admission-process` steps |
| 12px | 700 | 16px | #000f22 | Admission `examination-pattern` steps |
| 15px | 600 | 20.63px | #000f22 | Course card titles (Courses tab) |
| 14px | 600 | 19.25px | #000f22 | Programme card titles (Overview) |
| 20px | 700 | 28px | #000f22 | "Frequently Asked Questions" (Overview) |
| 19px | 800 | 23.75px | #000f22 | Compare card title (Overview) |
| 18px | 800 | 28px | #000f22 | "Add College" (Compare) |
| 14px | 500 | 19.25px | #115eaf | Blog post titles |
| 14px | 700 | 20px | #000f22 | Application-process step titles |
| 16px | 800 | 20px | #000f22 | Compare card title (Admission) |

### H4
| Size | Weight | Line-height | Colour | Where |
|---|---|---|---|---|
| 12px | 500 | 19.2px | #74777e | "Specialisations" label under programme names |
| 14px | 700 | 20px | #ffffff | Footer columns: Popular Degrees / Admissions Desk / Support Desk |

### Paragraphs (by role)
| Size | Colour | Line-height | Style | Max-width |
|---|---|---|---|---|
| 15px | #43474d | 23.25px | normal | — |
| 14px | #43474d | 20px / 22.75px | normal | 768px (Courses hero) |
| 14px | #2d3137 | 22.75px | normal | — |
| 14px | #b1c8eb | 22.75px | normal | 384px (on navy) |
| 13px | #43474d | 21.13px | normal | — |
| 12px | #43474d | 19.5px / 16px | normal | — |
| 12px | #74777e | 19.2px | normal / **italic** | — |
| 12px | #555960 | 19.5px | normal | — |
| 12px | #b1c8eb | 19.5px / 16px | normal | — |
| 12px | green oklch(.765 .177 163) | 16px | normal | — |

---

## 4. SECTION SHELLS

### Shell A — Card section (Overview, Admission)
```
bg: #ffffff
border: 1px solid #e7eeff
border-radius: 16px
padding: 18px 22px 18px 22px
shadow: shadow-xs
width: 1216px   (1280 max-w-7xl − 32px gutters ×2)
```
Variants:
| Variant | Difference |
|---|---|
| Tinted | `bg:#f0f3ff`, `border-color:#d5e3ff`, no shadow — used by `latest-news`, `sample-degree` |
| Dark band | `bg:#0b2540`, `border:1px solid #314869`, radius 16px — `counseling-callback` |
| H1 card | `border-color:#e1eaff`, `padding:32px` all round — `admission-highlights` |
| Borderless | `bg:transparent`, no border, no radius, no padding — `documents-required` (has its own dark inner band) |

### Shell B — Page-level section (Courses tab)
```
class: content-block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
width: 1280px
padding: 14px 32px 14px 32px
bg/border/radius: none
```
Variants:
| Variant | Difference |
|---|---|
| Full-bleed tinted | `width:1366`, `bg:#f0f3ff/50`, `border-top/bottom:1px solid #e7eeff`, `padding:14px 0` — `all-courses` |
| Full-bleed white | `width:1366`, `bg:#ffffff`, `border:1px solid #e7eeff`, `padding:14px 0` — `student-reviews` |
| Full-bleed navy | `width:1366`, `bg:#0b2540`, `padding:14px 0` — `counselor-helpline` |
| Inner wrapper | inside full-bleed shells: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` → content at x=43, width 1280 |

### Table of contents card
```
bg:#ffffff · border:1px solid #e7eeff · radius:16px · padding:24px
H2 "Table of contents" 22px / 700 / 30.8px / #000f22 · margin-bottom 16px
items: 14.5px, #115eaf, weight 500 (400 for collapsed sub-items)
```

---

## 5. TABLES

All LPU tables share: `w-full border-collapse`, `text-left`, font **Poppins**, wrapper
`overflow-x-auto` (→ `overflow-x:auto`).

### Overview — 4 tables, wrapper `rounded-xl border border-[#e7eeff] mt-[18px]`
| # | Cols | Headers | Font | th bg / colour | th padding | td colour / weight | td padding |
|---|---|---|---|---|---|---|---|
| T0 | 2 | Particulars, Details | 14px | **#0b2540** / #ffffff / 700 | 12px 16px | #000f22 / 400 | 10px 16px |
| T1 | 3 | Degree, Duration, Avg. Fees | 13px | **#0b2540** / #ffffff / 700 | 8px 12px | #111c2d / 400 | 8px 12px |
| T2 | 2 | Authority / Body, Recognition / Status | 14px | **#0b2540** / #ffffff / 700 | 12px 20px | #000f22 / 400 | 12px 20px |
| T3 | 2 | Mode of Transport, Details | 14px | **#0b2540** / #ffffff / 700 | 12px 16px | #000f22 / 400 | 14px 16px |

thead row: `bg-[#0b2540] text-white`; th `py-3 px-4 font-bold`; tbody `divide-y divide-[#e7eeff]`;
td `py-2.5 px-4 font-normal`; row hover `hover:bg-[#f0f3ff]/60`.

### Courses — 3 tables
| # | Cols | Headers | Font | th | td |
|---|---|---|---|---|---|
| T0 (UG) | 5 | Course Name, Duration, Per Sem Fee, Total Fee, Details | 12px | bg **#f9f9ff**, colour **#43474d**, 700, `border-b #e7eeff`, pad 10px 20px | #000f22, 400, pad 10px 20px, `border-b #e7eeff` |
| T1 (PG) | 5 | same | 12px | same | same |
| T2 (dates) | 3 | Event, Details, Tentative Date | 14px | bg **#0b2540**, #ffffff, 700, pad 12px 16px | #000f22, **700**, pad 14px 16px |

UG/PG table wrapper: `overflow-x-auto` (no border, no radius).
Table card: `bg-white rounded-xl border border-[#e7eeff] overflow-hidden flex flex-col justify-between`.
Table head strip: `px-5 py-3.5 bg-[#f0f3ff] border-b border-[#e7eeff]`.
Corner badge: `px-2 py-0.5 text-xs rounded-md bg-[#d3e4ff] text-[#011c37]` (UG) / `bg-[#d5e3ff] text-[#004689]` (PG).
Table footer strip: `px-3.5 py-1.5 bg-[#f9f9ff] border-t border-[#e7eeff]`.

### Admission — 3 tables, all 14px, wrapper `rounded-xl border border-[#e7eeff] mt-[18px]`
| # | Cols | Headers | th | td |
|---|---|---|---|---|
| T0 | 2 | Event, Important Date | #0b2540 / #ffffff / 700 / 12px 16px | #000f22 / 700 / 14px 16px |
| T1 | 4 | Course, Eligibility, Selection Process, Tuition Fee | same | same |
| T2 | 2 | Scholarship / Benefit, Details | same | same |

### Scholarships
**0 tables** — calculator + pillar cards only.

---

## 6. IMAGERY / LOGO / PLACEHOLDER SLOTS

| Slot | File | Rendered size | fit | radius | border | alt |
|---|---|---|---|---|---|---|
| **Header logo** | `logo.svg` | **120×44** | contain | 0 | — | "Online Siksha - Higher Education Gateway" |
| **Footer logo** | `logo.svg` | **184×44** | fill | 0 | 1px #d8e3fb | "Online Siksha - Higher Education Gateway" |
| **University logo (Overview hero)** | `lovely_professional_university_online_course_logo.webp` | **80×80** | contain | **16px** | 1px #e7eeff | "LPU Logo" |
| University logo (Compare card) | same | 83×83 | contain | 0 | — | "LPU Logo" |
| University logo (Admission callback) | same | 63×63 | contain | 0 | — | "LPU Logo" |
| **Hero / campus banner** | `lovely_professional_university_online_course_image.webp` | 431×256 (Overview) / 404×256 (Admission) | **cover** | 0 | — | descriptive alt |
| **Campus marquee** | `campusviewlpu.jpeg` + `campusarealpu.jpeg` | **318×220** | cover | **18px** | — | "…campus view" / "…campus aerial view" — each repeated 4× |
| **Sample degree cert** | `..._sampledegree.we` | 450×256 | contain | 4px | — | "LPU Online Degree Certificate" |
| **Recruiter logos** (8) | amazon.jpg 77×34, cognizant 62×34, tcs 62×34, infosys.png 60×34, wipro 58×34, techmahindra 63×34, capgemini.png 56×34, deloitte 62×34, timesinternet 61×34 | h=34 | contain | 0 | — | company name (alt present) |
| **Blog thumbnails** | mbaonline.png, mba02.png, cuet2026.png | 100×72 | cover | 0 | — | **no alt text** (3 images) |

Recruiter logo set appears **twice** (2 marquee rows of 8).

---

## 7. BUTTONS / CHIPS / BADGES

| Component | bg | colour | size / weight | radius | padding | border |
|---|---|---|---|---|---|---|
| Primary CTA | #115eaf | #ffffff | 14px / 600 | 12px | 10px 20px | – (shadow) |
| Primary CTA (small) | #115eaf | #ffffff | 12px / 700 | 12px | 10px 20px | – |
| Secondary CTA | #ffffff | #000f22 | 14px / 600 | 12px | 10px 16px | 1px #0b2540 |
| Ghost / text link | transparent | #115eaf | 14px / 500 | 12px | 10px 14px | 1px #115eaf |
| Outlined secondary | #ffffff | #000f22 | 12px / 500 | 8px | 8px 14px | 1px #c4c6ce |
| Dark CTA (navy band) | #0b2540 | #ffffff | 12px / 600 | 8px | 8px 16px | – |
| Hero "Apply Now" | #0b2540 | #ffffff | 14px / 600 | 8px | 10px 12px | – |
| Filter chip (active) | #115eaf | #ffffff | 12px / 700 | 8px | 6px 12px | 1px #115eaf |
| Filter chip (inactive) | #f0f3ff | #43474d | 12px / 700 | 8px | 6px 12px | 1px #e7eeff |
| Review category chip (active) | #115eaf | #ffffff | 11px / 700 | 8px | 4px 12px | – |
| Review category chip (inactive) | #f0f3ff | #43474d | 11px / 700 | 8px | 4px 12px | – |
| Header "Ask AI Advisor" | oklch(.208 .042 265.755) | #ffffff | 12px / 600 | 8px | 6px 10px | – |
| Header "Get Free Counselling" | #115eaf | #ffffff | 12px / 500 | 6px | 4px 10px | – |
| Header "Login" | transparent | #000f22 | 12px / 600 | 8px | 6px 10px | 1px oklch(.869 .022 252.894) |
| Tab pill (active) | #115eaf | #ffffff | 14px / 600 | 8px | 6px 14px | – |
| Tab pill (inactive) | transparent | #43474d | 14px / 500 | 8px | 6px 14px | – |
| Nav link (active) | transparent | #115eaf | 14px / 600 | 0 | 0 0 4px | 1px #115eaf (underline) |
| Nav link (idle) | transparent | #43474d | 14px / 500 | 0 | 0 0 4px | – |
| Tag chip (amber) | #ffdcc3 | #6e3900 | 10px / 700 | 4px | 2px 8px | – |
| Tag chip (blue) | #d5e3ff | #004689 | 10px / 700 | 4px | 2px 8px | – |
| Tag chip (green) | #e0f2e9 | #129b55 | 10px / 700 | 4px | 2px 8px | – |
| "Required" badge | #d5e3ff | #004689 | 10px / 700 | 4px | 2px 8px | – |

---

## 8. COMPONENT SPECS (per tab)

### OVERVIEW — 14 sections + TOC
`latest-news` → `highlights` → `courses-fees` → `popular-programmes` → `eligibility-criteria`
→ `admission-process` → `rankings` → `examination-pattern` → `placements` → `campus`
→ `sample-degree` → `reviews-section` → `compare-colleges` → `blogs`

| Section | Heading | Type | Shell | Notable |
|---|---|---|---|---|
| latest-news | "LPU Online Latest News and Updates" | h2 20/700 | Tinted | "View more" link |
| highlights | "LPU Online Highlights 2026" | h2 24/700 | Card | highlight table (T0), category chips, "Show More Highlights", "Download Factsheet" |
| courses-fees | "LPU Online Courses and Fees 2026" | h2 24/700 | Card | degree table (T1) |
| popular-programmes | "LPU Online Popular Programmes" | h2 20/700 | Card | 6 programme cards — h3 15/600, h4 12/500 "Specialisations", "Brochure" + "Apply Now" |
| eligibility-criteria | "LPU Online Eligibility and Selection Criteria" | h2 24/700 | Card | table (T2) |
| admission-process | "LPU Online Admission Process 2026" | h2 24/700 | Card | 5 steps, h3 18/600 |
| rankings | "LPU Online Rankings and Accreditations" | h2 **24/800** | Card | |
| examination-pattern | "LPU Online Examination Pattern" | h2 24/700 | Card | 4 blocks, h3 18/600 |
| placements | "LPU Online Placements" | h2 **24/800** | Card | 8 recruiter logos ×2 rows (h=34) + stats |
| campus | "LPU Online Campus" | h2 24/700 | Card | 2 images 318×220 r18 + transport table (T3) |
| sample-degree | "LPU Online Sample Degree" | h2 24/700 | **Tinted** | 450×256 cert image, r4 |
| reviews-section | "LPU Online Reviews" | h2 **24/800** | Card | rating bar (94% / 25,000+ / 100%), 5 category chips, 3-col card grid |
| compare-colleges | "Compare Colleges with LPU Online" | h2 24/700 | Card | 2-col compare grid + 80×80 logo |
| blogs | "Blogs" | h2 24/700 | Card | 3 posts, 100×72 thumbs (no alt), h3 14/500 #115eaf |

### COURSES & FEES — 8 sections
`fee-structure` → `all-courses` → `admission-dates` → `learning-platform` → `student-reviews` → `faqs` → `blogs` → `counselor-helpline`

| Section | Heading | Type | Shell |
|---|---|---|---|
| fee-structure | "LPU Online Fee Structure 2026 (Semester & Total)" | h2 24/700 | Page-level (1280) |
| all-courses | "LPU Online All Courses" | h2 24/700 | Full-bleed #f0f3ff/50 |
| admission-dates | "LPU Online Admission Dates 2026" | h2 24/700 | Page-level |
| learning-platform | "How You Study: The LPU e-Connect Platform" | h2 24/700 | Page-level, border-top list |
| student-reviews | "LPU Online Reviews" | h2 24/700 | Full-bleed white |
| faqs | "Frequently Asked Questions (LPU Online)" | h2 24/700 | Page-level, accordion |
| blogs | "Blogs" | h2 24/700 | Card (r16) |
| counselor-helpline | h3 20/700 white "Have Questions About Courses, Eligibility, or Fees?" | h3 | Full-bleed navy |

**fee-structure internals:** 2-column grid (lg:grid-cols-2, gap-6) of UG / PG table cards.
**learning-platform internals:** `ul.border-t border-[#e7eeff]`; each `li` = `grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] gap-x-4 sm:gap-x-6 gap-y-2 py-5 sm:py-6 border-b border-[#e7eeff]`;
icon `w-9 h-9 rounded-full bg-[#eef4ff] text-[#115eaf] group-hover:bg-[#115eaf] group-hover:text-white`;
mobile index "01" 10px #c4c6ce; h3 16/600; p 12px #43474d mt-[7.5px] max-w-2xl; meta `text-xs font-medium text-[#115eaf] whitespace-nowrap` + icon.
**student-reviews internals:** grid `md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4`; card `bg-[#f9f9ff] p-4 rounded-xl border border-[#e7eeff] hover:border-[#115eaf] hover:shadow-sm`; stars `text-amber-500 w-3.5 h-3.5 fill-current`; quote 12px #43474d **italic** `line-clamp-3`; footer `mt-4 pt-3 border-t border-[#d5e3ff]`; avatar `w-8 h-8 rounded-full bg-white text-[#115eaf] font-bold text-xs border border-[#e7eeff]`.

### ADMISSION — 12 sections
`admission-highlights` → `admission-dates` → `eligibility-criteria` → `admission-process` → `application-process` → `examination-pattern` → `documents-required` → `scholarship-schemes` → `counseling-callback` → `student-reviews` → `blogs` → `compare`

| Section | Heading | Type | Shell |
|---|---|---|---|
| admission-highlights | "LPU Online Admission Highlights 2026" | **h1 40.98/700 #071a34** | Card, padding 32, border #e1eaff |
| admission-dates | "LPU Online Admission Important Dates 2026" | h2 **24/800** | Card |
| eligibility-criteria | "LPU Online Eligibility & Selection Criteria 2026" | h2 24/700 | Card |
| admission-process | "LPU Online Admission Process 2026" | h2 24/700 | Card, h3 14/600 |
| application-process | "LPU Online Application Process 2026" | h2 24/700 | Card, h3 14/700 |
| examination-pattern | "LPU Online Examination Pattern" | h2 **24/800** | Card, h3 12/700 |
| documents-required | "LPU Online Documents Required for Admission" | h2 24/700 **white** | Borderless, own dark band |
| scholarship-schemes | "LPU Online Scholarship 2026" | h2 **24/800** | Card |
| counseling-callback | "Have Questions About Document Eligibility or Grants?" | h2 **30/800 white** | **Dark** #0b2540, border #314869 |
| student-reviews | "LPU Online Student Reviews" | h2 24/700 | Card |
| blogs | "Blogs" | h2 24/700 | Card |
| compare | "Compare" | h2 24/700 | Card |

### SCHOLARSHIPS — 2 sections + hero
`scholarship-calculator` → `scholarship-schemes`

| Element | Spec |
|---|---|
| Hero H1 | "Scholarships & Fee Discounts" — 36px / 700 / 40px / #000f22 |
| **scholarship-calculator** | w 1216, bg #ffffff, **border 2px solid #115eaf/30**, r 16px, pad 18px 22px; heading h3 16/700 "Calculate Your Net Tuition Fee & Savings" |
| ↳ inner split | `flex flex-col lg:flex-row gap-8`; left = controls (w-3/5), right = result card (w-2/5) |
| ↳ result card | `rounded-2xl` gradient `from-[#0b2540] to-[#000f22]`, w 455×292, r 16px, pad 18px 22px; "Eligible Tuition Waiver" label #b1c8eb, "20% Waiver" 30/36px **#0b2540→white 3xl/4xl w800**, "Total Fee Savings" 12px emerald-400, "Claim 20% Scholarship" btn #115eaf 12/700 r12px |
| **scholarship-schemes** | 6 pillar cards, grid `md:grid-cols-2 lg:grid-cols-3 gap-6`; each **389×255**, bg #ffffff, 1px #e7eeff, r 16px, pad 18px 22px, `hover:border-[#115eaf]` |
| ↳ pillar icon | `w-10 h-10 rounded-xl` — amber `#fffbeb/#92400e` or blue `#e7eeff/#115eaf` |
| ↳ pillar tag | 10px/700 r4px (amber/blue/green/pink variants) |
| ↳ pillar title | h3 16/700 #000f22, `section-title font-bold text-base` |
| ↳ pillar body | 12px #43474d leading-relaxed |
| ↳ pillar footnote | `mt-4 pt-3 border-t border-[#e7eeff]` 12px/700 #115eaf |
| Tables | **none** |
| Images | only site logo (header 120×44, footer 184×44) |

Pillar footnotes: "Applied Automatically", "Evaluated on Marksheet", "Defense Service Card Verified", "Self Certification Affidavit", "Past Registration Number Match", "Company ID / HR Letter".

---

## 9. PER-PAGE PALETTE (usage counts)

| Page | Colours (colour × count) |
|---|---|
| Overview | #111c2d ×412, #ffffff ×225, #115eaf ×210, #000f22 ×153, #43474d ×149, #74777e ×117, #f0f3ff ×67, amber-oklch ×38, #b1c8eb ×37, #f9f9ff ×28, #0b2540 ×25, #2d3137 ×21, #1a222f ×18, green-oklch ×18, #70aaff ×11, #d8e3fb ×9, #768dad ×7, blue-oklch ×5 |
| Courses | #111c2d ×275, #115eaf ×256, #ffffff ×152, #000f22 ×117, #74777e ×115, #43474d ×103, amber-oklch ×38, #b1c8eb ×38, #001b3c ×22, #f0f3ff ×19, #1a222f ×18, #70aaff ×15, #0b2540 ×14, #555960 ×12, #d8e3fb ×11, #f9f9ff ×10, #d5e3ff ×9, #004689 ×8 |
| Admission | #111c2d ×186, #ffffff ×128, #115eaf ×100, #43474d ×83, #000f22 ×80, #b1c8eb ×41, #74777e ×37, amber-oklch ×27, #1a222f ×18, #f9f9ff ×16, #0b2540 ×16, #70aaff ×11, #d5e3ff ×9, #d8e3fb ×9, #768dad ×7, #ffdcc3 ×6, blue-oklch ×5, #0b2342 ×5 |
| Scholarships | #ffffff ×61, #111c2d ×60, #115eaf ×58, #43474d ×43, #b1c8eb ×38, #000f22 ×36, #1a222f ×18, #d8e3fb ×15, #70aaff ×12, #768dad ×9, #d97706 ×8, blue-oklch ×5, green-oklch ×5, #f0f3ff ×4, #74777e ×4, #e7eeff ×4, #d5e3ff ×3, #004689 ×3 |

---

## 10. QUICK REBUILD CHECKLIST (for Amity / CU)

1. Font: **Poppins** everywhere, base 16px.
2. Heading colour always **#000f22** (except Admission H1 **#071a34** and on-dark **#ffffff**).
3. Section H2: **24px / 700 / 32px**; use **800** only for rankings, placements, reviews, admission-dates, examination-pattern, scholarship-schemes.
4. Body copy **12–14px / #43474d**; captions **12px / #74777e**.
5. Card shell: `bg-white border-[#e7eeff] rounded-2xl shadow-xs`, padding **18px 22px**.
6. Page-level shell: `content-block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (1280 wide, 32px gutters).
7. Table header row: `bg-[#0b2540] text-white`; header cell `py-3 px-4 font-bold`; body `py-2.5 px-4 font-normal`; wrapper `rounded-xl border border-[#e7eeff] mt-[18px] overflow-x-auto`.
8. Tables: `border-collapse`, Poppins, `text-left`; no zebra striping; row hover `bg-[#f0f3ff]/60`.
9. Images: hero/banner `object-cover`; logos `object-contain`; campus `rounded-[18px]`; certificate `rounded` + `contain`.
10. Logos: site `logo.svg` 120×44 (header) / 184×44 (footer); university logo 80×80 `rounded-2xl border border-[#e7eeff]`.
11. Buttons: primary `#115eaf` r12 10px 20px 14px/600; secondary white + `border-[#0b2540]` r12 10px 16px; ghost `#115eaf` text r12.
12. Never mix: no box-shadow on tinted sections; no rounded corners on full-bleed bands; `#f0f3ff` is only for tinted/hover states, never for the primary card.
