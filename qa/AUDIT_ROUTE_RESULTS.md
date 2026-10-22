# ROUTE TEST RESULTS — before / after

Server: `npm run dev` → `http://localhost:3000` (Next.js 16.4.2)
API: `https://api.degreefyd.com/api/b2c` (live)
Test date: see git log of this file.

## 1. Route matrix (before → after)

`before` = state before the fix (Overview content silently re-labelled as a
Courses/Admission page), `after` = state after the fix.

| Route | before | after | after H1 | Correct? |
|---|---|---|---|---|
| `/colleges/lovely-professional-university-online` | 200 | 200 | Lovely Professional University Online | ✔ |
| `/colleges/lovely-professional-university-online/courses` | 200 | 200 | LPU Online Courses and Fees 2026 | ✔ (published) |
| `/colleges/lovely-professional-university-online/admission` | 200 | 200 | LPU Online Admission 2026 | ✔ (published) |
| `/colleges/lovely-professional-university-online/scholarships` | 200 (fake) | **404** | – | ✔ not published |
| `/universities/lovely-professional-university-online` | 200 | 200 | Lovely Professional University Online | ✔ |
| `/universities/lovely-professional-university-online/courses` | 200 | 200 | LPU Online Courses and Fees 2026 | ✔ |
| `/universities/lovely-professional-university-online/admission` | 200 | 200 | LPU Online Admission 2026 | ✔ |
| `/universities/lovely-professional-university-online/scholarships` | 200 (fake) | **404** | – | ✔ not published |
| `/colleges/calcutta-business-school-kolkata` | 200 | 200 | Calcutta Business School | ✔ |
| `/colleges/calcutta-business-school-kolkata/courses` | 200 (fake) | **404** | – | ✔ not published |
| `/colleges/calcutta-business-school-kolkata/admission` | 200 (fake) | **404** | – | ✔ not published |
| `/colleges/calcutta-business-school` | 404 | 404 | – | ✔ unknown slug |
| `/colleges/amity-university-online` | 200 | 200 | Amity University Online | ✔ |
| `/colleges/amity-university-online/courses` | 200 | 200 | Amity University Online Courses and Fees | ✔ |
| `/colleges/amity-university-online/admission` | 200 | 200 | Amity University Online Admission 2026 | ✔ |
| `/colleges/amity-university-online/scholarship` | 200 | 200 | Amity Online Scholarship 2026 | ✔ (published) |
| `/colleges/amity-university-online/scholarships` | 200 (fake) | **404** | – | ✔ not published |
| `/universities/amity-university-online/courses` | 200 | 200 | Amity University Online Courses and Fees | ✔ |
| `/colleges/upes-online` | 200 | 200 | UPES Online | ✔ |
| `/colleges/upes-online/courses` | 200 (fake) | **404** | – | ✔ not published |
| `/colleges/upes-online/admission` | 200 (fake) | **404** | – | ✔ not published |
| `/universities/upes-online/admission` | 200 (fake) | **404** | – | ✔ not published |
| `/colleges/iit-delhi` | 200 | 200 | IIT Delhi | ✔ |
| `/colleges/iit-delhi/admission` | 200 (fake) | **404** | – | ✔ API serves `admissions` |
| `/colleges/iit-delhi/admissions` | 200 | 200 | IIT Delhi Admissions 2026 | ✔ |
| `/colleges/iit-delhi/courses` | 200 (fake) | **404** | – | ✔ CMS points to a sibling page |
| `/colleges/vit-vellore` | 200 | 200 | VIT Vellore | ✔ |
| `/colleges/vit-vellore/courses` | 200 | 200 | VIT Vellore Courses and Fees 2026 | ✔ |
| `/colleges/vit-vellore/admission` | 200 (fake) | **404** | – | ✔ CMS points to a sibling page |
| `/colleges/vit-vellore-admission-2026` | 200 | 200 | VIT Vellore Admission 2026 | ✔ published sibling page |
| `/colleges/this-university-does-not-exist-xyz` | 404 | 404 | – | ✔ |
| `/universities/this-university-does-not-exist-xyz` | 404 | 404 | – | ✔ |

## 2. Navbar (before → after)

| College | before | after |
|---|---|---|
| `lovely-professional-university-online` | 5 pills (Overview, Courses, Admission, Scholarships, LMS) | 3 API tabs (Overview, Courses, Admission) + LMS |
| `amity-university-online` | 5 pills | 4 API tabs (Overview, Courses, Admission, Scholarships) + LMS |
| `upes-online` | 5 pills | 1 API tab (Overview) + LMS |
| `calcutta-business-school-kolkata` | 5 pills | 1 API tab (Overview) + LMS |
| `iit-delhi` | 5 pills | 3 API tabs (Overview, Courses→sibling page, Admission) + LMS |
| `panjab-university` | 5 pills | 6 API tabs (Overview, Courses, Admission, Scholarship, Placements, Hostel & Campus) + LMS |

All links stay inside the current route tree:
`/universities/{slug}/courses` links to `/universities/{slug}/courses`
(no more jump into the `/colleges` tree), and the LMS pill opens the LMS modal
instead of linking to a route that does not exist.

## 3. Automated availability verification

`node qa/verify-routes.cjs` (10 colleges, both route trees, published vs
unpublished pages, navbar links):

```
PASS: 121   FAIL: 0
All route/availability checks passed.
```

Extended run over 32 further colleges (published pages reachable, unpublished
sub pages 404, `?section=` query parameter):

```
PASS 348  FAIL 0
```

## 4. Content leak check (main content, footer excluded — the footer is the
site-wide university directory by design)

| Page | LPU / Lovely Professional in main content |
|---|---|
| `/colleges/amity-university-online` | none |
| `/colleges/upes-online` | none |
| `/colleges/calcutta-business-school-kolkata` | none |
| `/colleges/iit-kanpur` | none |
| `/colleges/panjab-university/courses` | none |
| `/colleges/amity-university-online/admission` | none |

`<title>` per page: `Amity University Online | Online Siksha`,
`UPES Online | Online Siksha`, `Calcutta Business School | Online Siksha`,
`IIT Kanpur | Online Siksha`, `Panjab University | Online Siksha`.

## 5. Lint

```
$ npm run lint
✖ 31 problems (0 errors, 31 warnings)
```

All 31 warnings are pre-existing (`@next/next/no-img-element`,
`react-hooks/exhaustive-deps`) — no new warning was introduced by the fix.

## 6. Build

```
$ npm run build
▲ Next.js 16.4.2 (Turbopack)
✓ Compiled successfully in 3.3s
✓ Generating static pages using 7 workers (6/6) in 1680ms

Route (app)                  Revalidate  Expire
┌ ○ /                                5m      1y
├ ○ /_not-found                      5m      1y
├ ƒ /api/revalidate
├ ƒ /colleges/[...slug]
├ ƒ /universities
└ ƒ /universities/[...slug]
```

No errors.
