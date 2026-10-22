# DATA FLOW — kahan API call hota hai aur data kaise aata hai

Project: `C:\degreefyd01\sikshaapi\degreefyd-new` (Next.js 16 App Router)
API: `https://api.degreefyd.com/api/b2c` (`.env.local` → `API_URL`, `API_TOKEN`)

---

## 1. Golden rule

**API sirf server components me call hoti hai.** Browser me koi `fetch` nahi hai.
Client components (`"use client"`) sirf **props** me already-mapped data receive karte hain.

```
┌─ SERVER (async server component) ──────────────┐   ┌─ CLIENT ("use client") ─────────────┐
│ route/page.jsx  →  services/*  →  fetch(API)   │──▶│ page.jsx  →  components/*           │
│                                            data │   │            (sirf props use karte   │
└────────────────────────────────────────────────┘   │             hain, koi fetch nahi)   │
                                                     └────────────────────────────────────┘
```

Isi wajah se SEO/SSR theek hai, loading fast hai, aur API token browser me leak nahi hota.

---

## 2. Endpoints (sab live-verified)

| # | Endpoint | Method | Called from | Kya deta hai |
|---|---|---|---|---|
| 1 | `/website/colleges/listing?isCollgesNamesRequired=true&isCollgesLocationsRequired=true&page=N&search=` | GET | `services/universityApi.js` → `getUniversitiesPayload()` | University listing (298 records, 10/page) + pagination |
| 2 | `/website/colleges/{slug}` | GET | `services/collegeApi.js` → `fetchCollegePage()` | College **page document**: `title`, `shortTitle`, `hero`, `sections[]`, `toc[]`, `faq`, `testimonials`, `college_id{}` |
| 3 | `/website/colleges/{slug}?sub={sub}` | GET | same | Ek **sub-page** (Courses / Admission / Scholarship / Placements …). Unknown sub → **404 `College not found`** |
| 4 | `/website/colleges/navbar-list/{collegeId}?isTest=false` | GET | `services/collegeApi.js` → `getCollegeNavbarList()` | Kaunse pages publish hue hain: `[{ navbarTitle, slug, order }]` |
| 5 | `/website/colleges/courses-new/{collegeId}?page=0&limit=25…` | GET | `getCollegeCourses()` | Degree records (`degreeName`, `slug`, `avgFee`, `avgDuration`, `courses[]`, `mode`) |
| 6 | `/website/colleges/gallery?collegeId={id}` | GET | `getCollegeGallery()` | Campus gallery images |
| 7 | `/website/colleges/resources?collegeId={id}&resourceCategory=recruiters` | GET | `getCollegeRecruiters()` | Recruiter logos |
| 8 | `/blogs/get-block-blogs` (POST, body `{collegeID}`) | POST | `getCollegeBlogs()` | Blog cards |

---

## 3. College page ka flow (step by step)

```
GET /colleges/{slug}[/{sub}]  →  src/app/colleges/[...slug]/page.jsx   (server)
GET /universities/{slug}[/{sub}] → src/app/universities/[...slug]/page.jsx (server)
        │
        ▼
services/collegePageLoader.js  →  loadCollegePage(slug, { basePath })
        │
        ├─ 1) fetchCollegePage(collegeName, "")          → endpoint #2  (base page)
        │      └─ 404 ⇒ college hi unknown ⇒ page 404
        │
        ├─ 2) mapCollegePayload(payload)                  → college model
        │      college_id._id  ⇒ collegeId
        │      college_id.slug ⇒ collegeSlug (canonical, link banate hain)
        │
        ├─ 3) getCollegeNavbarList(collegeId)             → endpoint #4  (navigation)
        │      ⇒ buildCollegeNavigation()  (services/collegeNavigation.js)
        │         • canonical tabs (Overview/Courses/Admission/Scholarships)
        │         • extra CMS pages (Placements, Hostel & Campus …)
        │         • hrefs route-aware: /colleges/... ya /universities/...
        │
        ├─ 4) resolveNavTarget(requestedPath, navBase, entries)
        │      • path API navigation me hai  → us page ko serve karo
        │      • path API navigation me NAHI hai ⇒ { unavailable: true } ⇒ **404**
        │        (Overview content kabhi Courses/Admission page ki tarah render nahi hota)
        │
        ├─ 5) sub-page ho ⇒ fetchCollegePage(collegeName, sub)   → endpoint #3
        │      (standalone CMS page ho ⇒ fetchCollegePage(entrySlug))
        │
        ├─ 6) Promise.all → endpoints #5, #6, #7, #8
        │
        ├─ 7) mapOverviewData(payload, extras)            → section model
        │      (services/overviewMapper.js)
        │      CMS `sections[]` ko **block type** se resolve karta hai:
        │      richtext | banner | cta | courses_list | course_specialization_list
        │      | admission_flow | placement_stats | resource_grid | gallery
        │      | certificate_grid | testimonials | blogs | compare
        │      → highlights, coursesFees, eligibility, admission, rankings,
        │        examinationPattern, placements, campus, sampleDegree,
        │        reviews, faqs, compare, blogs, toc, admissionDates …
        │
        ├─ 8) section = payload.shortTitle (API se)  ⇒ overview | courses |
        │      admission | scholarships | page   (template ka selection)
        │
        ▼
components/college/CollegeTemplate.jsx  ("use client")
        ├─ section=courses      → CollegeCourses → CoursesAndFeesView
        │                            └─ buildCoursesViewData()  (services/coursesViewMapper.js)
        ├─ section=admission    → CollegeAdmission
        ├─ section=scholarships → CollegeScholarships
        └─ section=overview/page→ OverviewView
```

---

## 4. Data kaise shape hota hai (3 layer)

| Layer | File | Kaam |
|---|---|---|
| **Raw** | `services/collegeApi.js` | Sirf API call + caching. Koi mapping nahi. |
| **Model** | `services/collegeMapper.js` (`mapCollegePayload`) · `services/overviewMapper.js` (`mapOverviewData`) · `services/coursesViewMapper.js` (`buildCoursesViewData`) · `services/universityApi.js` (`mapUniversity`) | Raw payload → UI-ready model (tables parse, fees map, sections resolve). Missing field ⇒ `null`/empty ⇒ component us block ko **hide** kar deta hai (koi default/guessed content nahi). |
| **View** | `components/**` | Sirf model render karta hai. College-specific text (LPU/Amity/…) component me nahi, model me hota hai. |

---

## 5. Caching / freshness

```js
// services/collegeApi.js
fetch(url, { next: { revalidate: 3600, tags: [COLLEGE_CONTENT_TAG] } })
```

* College content → **3600 s** (1 ghanta) ISR, tag `college-content`.
* University listing → **300 s** (5 min).
* Route level: `export const revalidate = 3600` (detail pages), `300` (listing).

**CMS publish karte hi turant refresh:** webhook `POST /api/revalidate`

```jsonc
// body
{ "secret": "<REVALIDATE_SECRET>", "slug": "amity-university-online", "sub": "courses" }
```
→ `revalidateTag("college-content")` + `revalidatePath("/colleges/{slug}")`, `/universities/{slug}` (+ `/{sub}`).
Auth: secret match nahi ⇒ 401.

---

## 6. Page availability ka rule (API-driven)

```
page exists ⇔ API navbar-list me us page ka entry hai
```

* `?sub=` fetch 404 → 404 page (fallback nahi).
* Navbar me sirf API ke publish kiye tabs.
* Template page ke `shortTitle` se chunta hai — URL text guess nahi hota.

Stats (live, 285 colleges): Overview 283 · Courses 66 · Admission 73 · Scholarships 9 ·
**217 colleges me Courses page nahi, 210 me Admission page nahi** ⇒ un routes pe 404.

---

## 7. Search (listing page)

```
/universities?search=amity
   → app/universities/page.jsx (server)  → getUniversitiesPayload({ search, page })
   → GET /website/colleges/listing?...&search=amity
   → pagination + links me search preserve hota hai (pageHref())
```
Server-side hai, isliye poore 298 universities me search hota hai (page 2/3 bhi).
