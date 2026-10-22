# AUDIT REPORT — College routing / page availability / navbar (Next.js project)

Project audited: `C:\degreefyd01\sikshaapi\degreefyd-new` (Next.js 16.4.2, React 19, Tailwind v4)
Reference project (`C:\Users\GCV\Downloads\updatedonlinesiksha`) — **read only, not modified**.
API audited live: `https://api.degreefyd.com/api/b2c` (token from `.env.local`).

---

## 1. Files that actually exist (no file was invented for this task)

### Routing / pages
| File | Role |
|---|---|
| `src/app/layout.jsx` | Root layout + **global** metadata (contains the word *LPU*) |
| `src/app/page.jsx` | Home |
| `src/app/universities/page.jsx` | University listing |
| `src/app/universities/UniversitiesClient.jsx` | Listing client wrapper |
| `src/app/universities/[...slug]/page.jsx` | University detail route (`/universities/{slug}[/{sub}]`) |
| `src/app/universities/[...slug]/not-found.jsx` | 404 UI |
| `src/app/colleges/[...slug]/page.jsx` | College detail route (`/colleges/{slug}[/{sub}]`) |
| `src/app/colleges/[...slug]/not-found.jsx` | 404 UI |
| `src/app/api/revalidate/route.js` | CMS webhook → revalidate tag |
| `src/app/globals.css` | Design system (`.page-section`, `.card`, `.section-title`, …) |

### Services (API + mapping)
| File | Role |
|---|---|
| `src/services/collegeApi.js` | All college API calls |
| `src/services/collegeMapper.js` | College payload → college model |
| `src/services/overviewMapper.js` | College payload → overview/section model |
| `src/services/coursesViewMapper.js` | Overview model → Courses template model |
| `src/services/collegePageLoader.js` | Shared loader for both detail routes |
| `src/services/universityApi.js` | Listing API (`/website/colleges/listing`) |

### Components
`src/components/college/` → `CollegeTemplate`, `CollegeNavbar`, `CollegeHero`,
`OverviewView`, `CoursesAndFeesView`, `CollegeCourses`, `CollegeAdmission`,
`CollegeScholarships`, `CollegeTableOfContents`, `CollegeOverview` *(dead file, not imported)*
`src/components/shell/` → `SiteShell`, `SiteActionsContext`
`src/components/layout/` → `Navbar`, `Footer`, `FloatingActions`
`src/components/modals/` → `ApplyOnlineModal`, `BrochureModal`, `CounselorModal`,
`CourseDetailModal`, `EmiCalculatorModal`, `HelpDeskModal`, `LmsPortalModal`,
`LoginModal`, `TrackApplicationModal`
`src/components/shared/` → `AdmissionFlowSteps`, `BlogsListSection`,
`CompareCollegesCarousel`, `CompareCollegesSection`, `HomeFaq`, `PopularCoursesMobile`,
`ProgrammeCardsSection`, `StudentTestimonials`, `TopCollegesByLocation`
`src/components/home/` → `HomeView`, `HomePageClient`
`src/components/universities/` → `UniversitiesView`

### Data / lib
`src/data/apiData.js`, `coursesData.js`, `indianLocations.js`, `institutionalData.js`,
`mockCollegePayload.js`; `src/lib/collegeTitle.js`, `sectionTitles.js` *(unused)*, `types.js`;
`src/constants/years.js`; `src/hooks/useMediaQuery.js`

### QA
`qa/audit-content.cjs`, `check-html.cjs`, `compare-design.cjs`, `debug-hydration.cjs`,
`inspect-api.cjs`, `inspect-navbar.cjs`, `inspect-sections.cjs`, `verify-modals.cjs`,
`verify-routes.cjs`, `verify-slugs.cjs`, `qa/reference/LPU_TEMPLATE_SPEC.md`,
`qa/MIGRATION_REPORT.md`, `qa/shots/*`

---

## 2. Actual API endpoints used by the project (verified live)

| Endpoint | Method | Used by | Live result |
|---|---|---|---|
| `/website/colleges/listing?isCollgesNamesRequired=true&isCollgesLocationsRequired=true&page=N` | GET | `universityApi.js` | 200 — `pagination.total = 298`, `totalPages = 30`, `pageSize = 10` |
| `/website/colleges/{slug}` | GET | `collegeApi.js` | 200 — CMS page document |
| `/website/colleges/{slug}?sub={sub}` | GET | `collegeApi.js` | 200 only for subs the CMS has, otherwise **404 `{"status":false,"message":"College not found"}`** |
| `/website/colleges/navbar-list/{collegeId}?isTest=false` | GET | `collegeApi.js` | 200 — `{ status, colleges: [{ _id, navbarTitle, slug, order }] }` |
| `/website/colleges/courses-new/{collegeId}?page=0&limit=25&search=&degree=&sortBy=&sortOrder=` | GET | `collegeApi.js` | 200 — raw degree records |
| `/website/colleges/gallery?collegeId={id}` | GET | `collegeApi.js` | 200 |
| `/website/colleges/resources?collegeId={id}&resourceCategory=recruiters` | GET | `collegeApi.js` | 200 |
| `/website/colleges/similar/{slug}` | GET | `collegeApi.js` | 200 |
| `/blogs/get-block-blogs` | POST | `collegeApi.js` | 200 |

### Response fields that matter for routing
`GET /website/colleges/{slug}` returns a CMS **page** document:

```
_id, slug, college_id{ _id, name, collegeShortName, slug, location, ... },
title, shortTitle, navbarTitle, pageType, parentId, hero{}, sections[], toc[],
faq, faqs, testimonials, blogs, latestNews, seo, status, createdAt, updatedAt
```

* `pageType` = `"parent"` for every page returned.
* `shortTitle` / `navbarTitle` carry the **section type** of the page:
  `"Overview"`, `"Courses"`, `"Admission"`, `"Scholarship"`.
* `sections[]` → `{ title, key, blocks[] }`, `blocks[]` → `{ type, content }`
  (`richtext`, `banner`, `cta`, `courses_list`, `course_specialization_list`,
  `admission_flow`, `placement_stats`, `resource_grid`, `gallery`,
  `certificate_grid`, `testimonials`, `blogs`, `compare`).
* `college_id` is the **college record**; the nav bar list is keyed by `college_id._id`
  and is **shared by every page of that college**.

---

## 3. Availability measured against the live API (all 300 listed slugs)

300 slugs in the listing → **285 have a live page**, 15 return
`404 College not found` (`st-xavier-s-university-kolkata`, `shri-guru-ram-rai-university-dehradun`,
`icfai-university`, `sbbsu`, `amrapali-university-haldwani`, `iit-bhu-varanasi`,
`roorkee-institute-of-technology`, `coer-university-roorkee`,
`madhya-pradesh-bhoj-open-university`, `rama-university`, `amity-patna`, `amity-noida`,
`mangalayatan-university-distance-and-online-programs`, `jamia-hamdard-university-online`,
`centre-for-distance-and-open-learning-jamia-millia-islamia-jamia-nagar-delhi`).

Of the 285 live colleges (every nav entry verified with a real request):

| Section | Colleges that have it |
|---|---|
| **Overview** (base page) | **283 / 285** |
| **Courses** sub-page | **66** |
| **Admission** sub-page | **73** |
| **Scholarships** sub-page | **9** |
| Other CMS sub-pages | `placements` 5 · `placement` 4 · `hostel-campus` 2 · `infrastructure` 1 |
| **No Courses page** | **217** |
| **No Admission page** | **210** |

Nav-entry integrity across all 285 colleges: **285** self entries, **160** sub-page
entries (**0 of them point at a sub the API does not serve**), **4** sibling-page
entries (all served), **1** entry that points outside the college
(`government-medical-college-patiala` → `government-medical-collegegmc-patiala/courses`).

### Required test universities
| Slug | Overview | Courses | Admission | Scholarships | API nav titles |
|---|---|---|---|---|---|
| `lovely-professional-university-online` | ✅ 15 sections | ✅ `?sub=courses` (8) | ✅ `?sub=admission` (10) | ❌ | Overview, Admission, Courses |
| `calcutta-business-school-kolkata` | ✅ 11 sections | ❌ | ❌ | ❌ | Overview |
| `amity-university-online` | ✅ 15 sections | ✅ `?sub=courses` (8) | ✅ `?sub=admission` (7) | ✅ `?sub=scholarship` (8) | Overview, Courses, Admission, Scholarship |
| `upes-online` | ✅ 13 sections | ❌ | ❌ | ❌ | Overview |
| `iit-delhi` | ✅ 17 | ❌ (`admissions` only) | ✅ `?sub=admissions` (12) | ❌ | Overview, Courses(→other page), Admission |
| `vit-vellore` | ✅ 16 | ✅ `?sub=courses` (6) | ❌ (`vit-vellore-admission-2026` is a standalone page) | ❌ | Overview, Admission(→other page), Courses |

> Note: `calcutta-business-school` (without `-kolkata`) is **not** a slug of the API → 404.
> The real slug is `calcutta-business-school-kolkata`.

---

## 4. Current bugs (exact reason)

### B1 — Sub-pages are force-rendered even when the API has no such page
`src/services/collegePageLoader.js:136-155`: when `?sub=` fails, the loader **silently
falls back to the base payload** and the page renders the Overview content under the
Courses/Admission URL.

```
/colleges/upes-online/courses      -> 200 "UPES Online Courses and Fees 2026"   (API has no courses page)
/colleges/upes-online/admission    -> 200 "UPES Online Admission Highlights 2026" (API has no admission page)
/colleges/lovely-professional-university-online/scholarships -> 200 "Scholarships & Fee Discounts" (no scholarship page)
/colleges/amity-university-online/scholarships -> 200 (API only serves `scholarship`, singular)
/colleges/iit-delhi/courses        -> 200 "IIT Delhi Courses & Fees 2026"      (API has no courses sub)
/colleges/vit-vellore/admission    -> 200 "VIT Vellore Online Admission…"       (API has no admission sub)
/colleges/calcutta-business-school-kolkata/courses -> 200 (no courses page)
```
The Overview sections are then re-labelled by `CollegeTemplate.resolveSection()`
(`src/components/college/CollegeTemplate.jsx:14-24`), which *guesses* the section from
the slug text — so Overview content is served as a Courses/Admission page.

### B2 — The navbar is hardcoded, not API-driven
`src/components/college/CollegeNavbar.jsx:6-13` renders a fixed list
`Overview · Courses · Admission · Scholarships` + `LMS Portal` for **every** university.
The API tabs are then **filtered out** (`CollegeNavbar.jsx:28-32` drops every entry whose
title is `overview|courses|admission|scholarships|lms`), so the CMS navigation never
reaches the UI. Result: **5 pills on every college page**, even on colleges that have
no Courses/Admission page at all.

### B3 — Broken / wrong-tree links in the navbar
* `CollegeNavbar.jsx:15-16` hardcodes `hrefFor()` → always `/colleges/...`, so on the
  `/universities/...` route tree every pill links into the `/colleges` tree.
* The `LMS Portal` pill links to `/colleges/{slug}/lms`, but the API has **no** `lms`
  sub-page for any college → the link lands on the Overview page.
* `collegeApi.js:77` hardcodes `href: "/colleges/${item.slug}"` for the API tabs.

### B4 — Nav entries can point at a page that does not exist
`government-medical-college-patiala` has a `Courses` tab whose slug is
`government-medical-collegegmc-patiala/courses` → `?sub=courses` = **404**. The old code
hid this by falling back to the base payload (B1).

### B5 — `CollegeTemplate.resolveSection()` maps unknown API pages onto Overview
`CollegeTemplate.jsx:14-24` only knows overview/courses/admission/scholarships/lms, so
real CMS pages such as `placements`, `placement`, `hostel-campus`, `infrastructure`
(`panjab-university`, `amity-university-jaipur`, `amity-university-lucknow`, …) were
rendered with the Overview template.

### B6 — Cross-university hardcoded content (renders on every college)
| File:line | Hardcoded text |
|---|---|
| `src/app/layout.jsx:10,14,16-18` | Global `<title>`/description: *"…LPU Online Degrees & Admissions Portal"* |
| `src/components/college/OverviewView.jsx:42-57` | `DEFAULT_TOC` – 14 LPU-styled entries (*"Highlights 2026"*, *"Courses and Fees 2026"* …) used whenever `collegeData.toc` is empty |
| `OverviewView.jsx:1232,1235,1248,1253,1258` | `4.8 / 5.0 Rating`, `1,400+ Verified Submissions`, `94% Completion Rate`, `25,000+ Active Learners`, `100% Verified Profiles` — invented for every university |
| `OverviewView.jsx:380,1378` | `Official Facts 2026`, `Apply Now 2026` |
| `src/components/college/CollegeScholarships.jsx:158,189` | H1 `Scholarships & Fee Discounts` (not from the API) |
| `src/components/college/CollegeAdmission.jsx:207` | `Admissions Open 2026` (static claim for every college) |
| `src/lib/collegeTitle.js:15` | `year = "2026"` hardcoded instead of `constants/years.js` |
| `src/components/modals/ApplyOnlineModal.jsx:35,242` | `OS-LPU-2026-…`, *"Online Siksha & LPU CDOE"* |
| `src/components/modals/LmsPortalModal.jsx:19,123` | *"LPU e-Connect Portal Preview"*, *"encrypted LPU CDN"* |
| `src/components/modals/HelpDeskModal.jsx:28` | *"Authorized LPU CDOE Admissions & Student Grievance Support"* |
| `src/components/modals/CourseDetailModal.jsx:49` | *"…available 24/7 on the LPU e-Connect mobile and web portal."* |
| `src/components/modals/BrochureModal.jsx:21` | default download `LPU_Online_Complete_Brochure_2026.pdf` |
| `src/components/modals/TrackApplicationModal.jsx:39` | placeholder `e.g. LPU-2026-00123` |
| `src/components/modals/LoginModal.jsx:68,92,135` | demo row *"Online MBA - Lovely Professional University"* |

### B7 — Dead code
`src/components/college/CollegeOverview.jsx` and `src/lib/sectionTitles.js` are not
imported anywhere.

---

## 5. Fix implemented (only in the Next.js project)

| File | Change |
|---|---|
| `src/services/collegeApi.js` | `fetchCollegePage()` returns `null` on 404 instead of throwing; `getCollegeNavbarList()` returns the raw CMS entries (`title`/`slug`/`order`) instead of a hardcoded `/colleges/...` href |
| `src/services/collegeNavigation.js` **(new)** | Single source of truth for the navigation: `classifySection()`, `buildCollegeNavigation()` (API tabs → route-aware hrefs, canonical order, de-duplication), `resolveNavTarget()` (is the requested URL an API-published page?) and `pageSectionOf()` (payload → template) |
| `src/services/collegePageLoader.js` | No silent fallback any more. The requested path must match an API navbar entry (or be the base page); otherwise the loader returns `{ unavailable: true }` → route answers **404**. The section/template is derived from the CMS payload (`shortTitle`/`navbarTitle`), not from slug guessing |
| `src/app/colleges/[...slug]/page.jsx`, `src/app/universities/[...slug]/page.jsx` | `notFound()` when the page is unavailable; pass `basePath` so the navbar stays inside the current route tree |
| `src/components/college/CollegeNavbar.jsx` | Renders **only** the tabs the API publishes, with route-aware hrefs; `LMS Portal` opens the LMS modal instead of linking to a non-existent route |
| `src/components/college/CollegeTemplate.jsx` | Template chosen from the API-resolved section (overview / courses / admission / scholarships / generic CMS page); registers the active college so the modals stop showing another university's name |
| `src/components/college/OverviewView.jsx` | `DEFAULT_TOC` (LPU list) removed; the TOC is built from the API `toc`; the invented review statistics are replaced by API values (or hidden) |
| `src/components/college/CollegeScholarships.jsx`, `CollegeAdmission.jsx` | Page heading / status eyebrow taken from the API payload |
| `src/lib/collegeTitle.js` | Year comes from `src/constants/years.js` |
| `src/app/layout.jsx` | Global metadata no longer names a single university |
| `src/components/modals/*.jsx` (Apply, Brochure, CourseDetail, HelpDesk, LmsPortal, TrackApplication, Login) | University name taken from the active college (context) instead of a hardcoded LPU string |
| `src/components/shell/SiteShell.jsx`, `SiteActionsContext.jsx` | Holds the active college so the modals can use it |
| `qa/verify-routes.cjs` | Updated to the new contract (availability matrix + 404 expectations) |

**Design was not touched**: no className, colour, spacing, typography, card size, table
structure, responsive rule or section order was changed in any component. Only the *data*
behind them is now API-driven.

---

## 6. Routes that intentionally stay unavailable

For every college, only the pages published by the API exist. Concretely:

* `/colleges/{slug}/courses` and `/universities/{slug}/courses` → **404** for the
  **217** colleges without a Courses page (e.g. `upes-online`,
  `calcutta-business-school-kolkata`, `iit-kanpur`, `nit-jalandhar`, `anna-university-chennai`).
* `/colleges/{slug}/admission` and `/universities/{slug}/admission` → **404** for the
  **210** colleges without an Admission page (e.g. `upes-online`, `gna-university`,
  `vit-vellore`, `calcutta-business-school-kolkata`).
* `/colleges/{slug}/scholarships` → **404** for the **276** colleges without a
  scholarship page; only the 9 that publish one (`amity-university-online` → `scholarship`,
  `panjab-university`, `amity-university-mohali`, `amity-university-lucknow`,
  `amity-university-raipur`, `amity-university-mumbai`, `amity-university-jaipur`,
  `chandigarh-university`, `lovely-professional-university-phagwara`) have a working tab,
  and the tab points at the exact sub the API serves.
* Unknown college slug → **404** (unchanged).
* `/colleges/{slug}/placements`, `/hostel-campus`, `/infrastructure` → exist only for the
  12 colleges that publish them, and render the CMS payload of that page.

---

## 7. Before / after route test

Tested with `qa/verify-routes.cjs` against the dev server (`npm run dev`, port 3000).
Full matrix, navbar comparison, leak check, lint and build output:
**`qa/AUDIT_ROUTE_RESULTS.md`**.

Headline (before → after):

| Route | before | after |
|---|---|---|
| `/colleges/lovely-professional-university-online/scholarships` | 200 (fake page) | **404** |
| `/colleges/upes-online/courses` | 200 (fake page) | **404** |
| `/colleges/upes-online/admission` | 200 (fake page) | **404** |
| `/colleges/calcutta-business-school-kolkata/courses` | 200 (fake page) | **404** |
| `/colleges/calcutta-business-school-kolkata/admission` | 200 (fake page) | **404** |
| `/colleges/amity-university-online/scholarships` | 200 (fake page) | **404** |
| `/colleges/iit-delhi/admission` | 200 (fake page) | **404** (API serves `admissions`) |
| `/colleges/iit-delhi/courses` | 200 (fake page) | **404** |
| `/colleges/vit-vellore/admission` | 200 (fake page) | **404** |
| published pages (`…/courses`, `…/admission`, `…/scholarship`) | 200 | 200 (unchanged, content now taken from the matching CMS page) |
| unknown slug | 404 | 404 |

```
$ node qa/verify-routes.cjs
PASS: 121   FAIL: 0

$ npm run lint
✖ 31 problems (0 errors, 31 warnings)      # all warnings pre-existing

$ npm run build
✓ Compiled successfully in 3.3s
```

---

## 8. Notes / limitations

* The reference project `C:\Users\GCV\Downloads\updatedonlinesiksha` was **not**
  modified (`git status --short` in that folder stays empty).
* `BrochureModal` still downloads the static brochure asset
  `https://images.degreefyd.com//lpu-online-brochure.pdf` — the API publishes
  no per-college brochure URL (`courses-new` returns `degreeName`, `slug`,
  `avgFee`, `avgDuration`, `courses[]`, `mode` only), so the download target
  could not be made university-specific without inventing an endpoint. Only
  the *file name* is now university-specific.
* The `LMS Portal` pill is not a page (no college publishes an `lms` sub page);
  it opens the LMS modal instead of linking to a dead route. The pill and its
  styling are unchanged.
* Two CMS data-quality issues are visible in the live navigation and are
  reported, not patched:
  * `government-medical-college-patiala` → "Courses" points at
    `government-medical-collegegmc-patiala/courses` (a different slug of the
    same university). The tab links to that published page, which renders.
  * `vit-vellore` → "Admission" and `iit-delhi` → "Courses" point at
    standalone CMS pages of the same university. The tabs link to those pages,
    which render.
* `src/components/college/CollegeOverview.jsx` and `src/lib/sectionTitles.js`
  are dead files (not imported anywhere). They were left untouched — deleting
  them is outside the scope of this fix.
