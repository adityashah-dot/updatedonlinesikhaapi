# MIGRATION REPORT — Reference (React/Vite/TS) → New (Next.js 16 / JS)

- **Reference (READ-ONLY, verified pristine):** `C:\Users\GCV\Downloads\updatedonlinesiksha`
- **New project (all changes here):** `C:\degreefyd01\sikshaapi\degreefyd-new`

> **Reference integrity:** `git status --short` → empty, `git diff --stat` → empty,
> `git ls-files --others` → empty. **Zero files added, modified, deleted, renamed or
> reformatted in the reference project.**

---

## 1. REFERENCE WORKFLOW (inspected)

```
src/main.tsx                     ReactDOM entry
 └─ src/App.tsx                   <Routes> + AnimatePresence page transitions
     ├─ "/"                      HomeView.tsx          (730)
     ├─ "/universities"          UniversitiesView.tsx   (1325)
     ├─ "/universities/:slug"    CollegeDetailView.tsx (565)  ← college shell
     │     ├─ ?section=overview|courses|admission|scholarships|lms
     │     ├─ LPU_TABS pill bar (Overview/Courses/Admission/Scholarships/LMS Portal)
     │     └─ OverviewView.tsx      (1814)  ← LPU master Overview
     │        CoursesAndFeesView.tsx (936)  AdmissionView.tsx (940)
     │        ScholarshipsView.tsx (620)
     ├─ "/courses" CoursesAndFeesView   "/admission" AdmissionView
     └─ "/scholarships" ScholarshipsView
```

**Reference data:** `src/data/apiData.ts` (`DEGREEFYD_LPU_API`), `coursesData.ts`,
`institutionalData.ts`, `indianLocations.ts`, `siteBlogPosts.ts`,
`src/lib/sectionTitles.ts`, `src/constants/years.ts`.

**Reference CSS:** `src/index.css` (566 lines, Tailwind v4).

**Reference assets:** `public/logos/*` (9 recruiter logos), `public/images/*`
(campus + blog thumbs), `public/logo.svg`.

**Reference inline `<style>` blocks (3):** admission-flow CSS, exam-step CSS,
campus-marquee CSS.

---

## 2. WHAT WAS WRONG IN THE NEW PROJECT

| Problem | Detail |
|---|---|
| **globals.css was outdated** | `.page-section` 32px (ref 22), no `.section-container`, `.section-title` 12px (ref 4), `.section-description` 18px (ref 4/12), `.card` 20/24 (ref 18/22), `.content-block` 24px (ref 14), unguarded `select` rule, and the whole `.uni-detail` mobile block, `.tap-chip`/`.tap-hit`, 12px text floor, mobile full-bleed block, dark theme, `.uv-search-*`/`.uv-listing` blocks were missing |
| **Home / listing / layout / 8 modals were COMPILED** | `src/components/home/HomeView.jsx`, `universities/UniversitiesView.jsx`, `layout/{Navbar,Footer,FloatingActions}.jsx`, `shell/SiteShell.jsx` and every file in `modals/` were `next build` output committed as source (`import { jsx as _jsx } from "react/jsx-runtime"`). They were **older revisions** of the reference — the old home hero ("Find Your Online Degree at India's Leading Universities" vs the reference's "Discover, Compare & Enroll in India's Top Online Universities"), 78/146 and 95/179 reference strings missing |
| **9 shared components missing entirely** | `BlogsListSection`, `PopularCoursesMobile`, `HomeFaq`, `CompareCollegesSection`, `ProgrammeCardsSection`, `AdmissionFlowSteps`, `CompareCollegesCarousel`, `StudentTestimonials`, `TopCollegesByLocation` |
| **College detail had no sub-pages** | `CollegeTemplate` always rendered `OverviewView`; `?sub=` was fetched from the API but never used. `/colleges/<slug>/courses` and `/admission` rendered the Overview |
| **OverviewView.jsx gaps** | missing `.section-container` wrapper (32px `space-y-8` instead of 22px gap), missing campus marquee + its 3rd inline `<style>` block, hero `flex-col` instead of `flex-row`, no `order-1/order-2` mobile image-first, no `md:ml-auto`, no `min-h-[44px]` tap targets, no `tap-chip`/`tap-hit`, no `text-red-600` form errors, wrong floating-TOC offset, no in-page **Table of contents** card at all |
| **Generic placeholder pages** | `CollegeHero` (blue gradient), `CollegeNavbar` (plain links), `CollegeOverview`, `CollegeCourses`, `CollegeAdmission`, `CollegeScholarships` were slate-coloured placeholders, and three of them were not even routed |
| **Mapper picked the wrong sections** | `findSection(sections, /admission/)` matched "Admission Highlights" instead of "Admission Process" → `admission_flow` steps were never found, so the Admission page rendered without its process/exam sections |

---

## 3. WHAT WAS CHANGED (new project only)

### 3.1 `src/app/globals.css` — replaced with the reference CSS
All reference rules restored: typography base layer (h1 700/-0.015em, h2–h6 600/-0.01em,
`h1 + p { margin-top:4px }`), `.page-section` 22/16, `.section-container` flex gap 22/16,
`.section-title` 4px, `.section-description` 4/12, `.card` 18/22 + mobile 14/16,
`.content-block` 14px, guarded `select`, scrollbar, `slideInLeft`/`fadeIn`/`marquee`,
mobile full-bleed ≤767px, `.uv-search-*`/`.uv-listing` mobile block, dark theme,
`.uni-detail` mobile foundation, `.tap-chip`/`.tap-hit`, 12px text floor.

### 3.2 `public/` — assets copied from the reference
`logos/` (9 recruiter logos) · `images/` (campus x2, blog thumbs x3, degree samples) · `logo.svg`.

### 3.3 Shared components ported (reference TSX → real JSX, TypeScript compiler API)
`BlogsListSection`, `PopularCoursesMobile`, `HomeFaq`, `CompareCollegesSection`,
`ProgrammeCardsSection`, `AdmissionFlowSteps`, `CompareCollegesCarousel`,
`StudentTestimonials`, `TopCollegesByLocation`, `Navbar`, `Footer`, `FloatingActions`,
`HomeView`, `UniversitiesView`, and all 9 modals (Apply / Brochure / Counselor /
CourseDetail / EmiCalculator / HelpDesk / LmsPortal / TrackApplication / Login).

Also ported: `hooks/useMediaQuery.js` (SSR-safe), `lib/sectionTitles.js`,
`constants/years.js`, `lib/types.js`, `lib/collegeTitle.js` (reference title pattern
`{Name} Online {Topic} {Year}`).

### 3.4 College pages rebuilt to the reference design
| File | Change |
|---|---|
| `components/college/CollegeTemplate.jsx` | now switches on the API `sub` → Overview / Courses / Admission / Scholarships; wraps everything in `.uni-detail` |
| `components/college/CollegeNavbar.jsx` | reference sticky pill bar (Overview / Courses / Admission / Scholarships / LMS Portal) with `material-symbols-outlined` icons; API navbar entries that duplicate a canonical tab are de-duplicated |
| `components/college/CollegeHero.jsx` | reference light hero: bordered logo, badges, location+rating line, campus image, 4 stat tiles, Brochure/Apply |
| `components/college/CollegeTableOfContents.jsx` | reference TOC card (triangle bullets, active underline, View more/less) |
| `components/college/CollegeCourses.jsx` | reference Courses page: fee-structure UG/PG tables, all-courses grid, learning platform, reviews, FAQs, blogs, counselor band |
| `components/college/CollegeAdmission.jsx` | reference Admission page: highlights, eligibility matrix, admission flow, application process, examination pattern, documents, scholarships, callback form, reviews, blogs, compare, FAQs |
| `components/college/CollegeScholarships.jsx` | reference Scholarships page: calculator, 6 pillars, blogs, counselor band |
| `components/college/OverviewView.jsx` | fixed all listed gaps + added the TOC card |

### 3.5 Data layer
- `services/overviewMapper.js` — sections now resolved **by block type**
  (`richtext`, `courses_list`, `admission_flow`, `placement_stats`, `resource_grid`,
  `gallery`, `certificate_grid`, `testimonials`, `blogs`, `compare`,
  `certificate_grid`, `scholarship_*`) instead of title regex, plus new optional
  sections (admission dates, application process, documents, learning platform,
  scholarship rules/pillars) and HTML stripping on hero copy.
- `services/collegeApi.js` — unchanged (API + slug flow preserved).
- `services/collegeMapper.js` — unchanged.
- `app/colleges/[...slug]/page.jsx` — passes `sub` + `slug` to the template and falls
  back to the base payload when the API does not serve a segment (e.g. `/scholarships`).

### 3.6 `eslint.config.mjs`
The React Compiler rules `react-hooks/refs` and `react-hooks/set-state-in-effect` are
disabled **only for the ported folders** — those components keep the reference's exact
ref/effect patterns, which the reference ships as-is.

---

## 4. API / SLUG FLOW (preserved & verified)

```
/colleges/[...slug]
  → splitSlug()                       collegeName = seg[0], sub = seg[1..]
  → getCollegeBySlug(collegeName, sub)   GET {API}/website/colleges/{name}?sub={sub}
  → mapCollegePayload(payload, {slug})   → { college, courses, scholarships, admission, toc, faq, ... }
  → Promise.all([navbar-list, courses, gallery, recruiters, similar, blogs])
  → mapOverviewData(payload, extras)     → the Overview/Courses/Admission/Scholarships model
  → <CollegeTemplate data tabs overview sub slug />
```

The API is the only content source — **no LPU copy is hardcoded into the college pages**.
Verified live against `api.degreefyd.com`:
* valid `sub` values the API serves: `""` (overview), `admission`, `courses`
* other segments fall back to the base payload rather than 404-ing

---

## 5. ROUTES VERIFIED

| Route | HTTP | H1 | Sections | Console |
|---|---|---|---|---|
| `/` | 200 | Discover, Compare & Enroll in India's Top Online Universities | 7 | clean |
| `/universities` | 200 | Explore Top UGC-DEB Approved Online Universities in India | 2 | clean |
| `/colleges/lovely-professional-university-online` | 200 | Lovely Professional University Online | 14 + TOC(7) + 5 tabs | clean |
| `/colleges/lovely-professional-university-online/admission` | 200 | LPU Online Admission Highlights 2026 | 8 + TOC(7) | clean |
| `/colleges/lovely-professional-university-online/courses` | 200 | LPU Online Courses and Fees 2026 | 6 + TOC(6) | clean |
| `/colleges/lovely-professional-university-online/scholarships` | 200 | Scholarships & Fee Discounts | 2 + TOC(2) | clean |

**Slugs tested (desktop 1366px + mobile 390px):**

| Slug | Result |
|---|---|
| `lovely-professional-university-online` | 200 · 14 sections · clean |
| `chandigarh-university-online` | 200 · 14 sections · clean · different content |
| `amity-university-online` | 200 · 14 sections · clean · different content |
| `manipal-university-jaipur-online` | 404 (not in the API) — correct |

**Modals:** Apply Now ✓, Brochure ✓, Counselor Help ✓ open and close correctly.

---

## 6. FIELDS NOT AVAILABLE FROM THE API

| Section | Missing field | Behaviour |
|---|---|---|
| `scholarship-calculator` | no `scholarship_calculator` / `scholarship_rules` block | calculator section hidden, TOC entry hidden — **no invented content** |
| `scholarship-schemes` | no `scholarship_pillars` block | falls back to `college.scholarships` rows; when the API has none the section is hidden |
| `learning-platform` | no `learning_platform` block | section + TOC entry hidden |
| `admission-dates` (Courses tab) | no `important_dates` block | section + TOC entry hidden |
| `application-process` | no `application_process` block | section + TOC entry hidden |
| `documents-required` | no `documents` block | section + TOC entry hidden |
| `duration` stat tile | no duration on the college record | tile renders the reference's `—` placeholder, not a made-up value |
| `latestNews.author` | not in the payload | left blank |

No placeholder copy, fake numbers or LPU text was injected into the college pages.

---

## 7. QA ARTEFACTS (new project)

`qa/MIGRATION_REPORT.md` (this file) · `qa/reference/LPU_TEMPLATE_SPEC.md` (the reference
design spec, measured from the reference app) · `qa/lpu-template-audit.json` ·
`qa/verify-routes.cjs` · `qa/verify-slugs.cjs` · `qa/verify-modals.cjs` ·
`qa/compare-design.cjs` · `qa/inspect-api.cjs` · `qa/inspect-sections.cjs` ·
`qa/inspect-navbar.cjs` · `qa/shots/` (screenshots).
