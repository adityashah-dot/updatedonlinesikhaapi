/**
 * Route / availability verification.
 *
 * Contract (see qa/AUDIT_ROUTING_REPORT.md):
 *
 *  - A college page exists when the CMS publishes it
 *    (GET /website/colleges/{slug}).
 *  - A sub page (Courses / Admission / Scholarships / …) exists only when
 *    the CMS navigation of that college publishes it
 *    (GET /website/colleges/navbar-list/{collegeId}).
 *  - A page the CMS does not publish must answer 404 — the Overview content
 *    must never be re-labelled as another page.
 *  - The navbar of a college page must only link to published pages.
 *
 * Run:  node qa/verify-routes.cjs
 * Env:  BASE_URL (default http://localhost:3000)
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const API_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.degreefyd.com/api/b2c";
const API_TOKEN = process.env.API_TOKEN;

const HEADERS = {
  Accept: "application/json",
  ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
};

/** Colleges that must be checked, with the sub pages each of them publishes. */
const COLLEGES = [
  "lovely-professional-university-online",
  "calcutta-business-school-kolkata",
  "amity-university-online",
  "upes-online",
  "iit-delhi",
  "vit-vellore",
  "panjab-university",
  "anna-university-chennai",
  "iit-kanpur",
  "gna-university",
];

/** Sub pages that must never be rendered when the CMS does not publish them. */
const CANDIDATE_SUBS = ["courses", "course", "admission", "admissions", "scholarships", "scholarship"];

async function apiGet(path) {
  const response = await fetch(API_URL + path, { headers: HEADERS });
  let body = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  return { status: response.status, body };
}

async function siteGet(path) {
  const response = await fetch(BASE_URL + path, { redirect: "manual" });

  return response.status;
}

function payloadOf(body) {
  return body?.data?.data || body?.data || body;
}

let passed = 0;
let failed = 0;
const failures = [];

function check(condition, message) {
  if (condition) {
    passed += 1;
  } else {
    failed += 1;
    failures.push(message);
  }
}

(async () => {
  console.log(`Site:  ${BASE_URL}`);
  console.log(`API:   ${API_URL}\n`);

  for (const slug of COLLEGES) {
    const base = await apiGet(`/website/colleges/${encodeURIComponent(slug)}`);
    const page = payloadOf(base.body);

    if (base.status !== 200 || !page?.sections) {
      console.log(`--- ${slug}: no CMS page (HTTP ${base.status}) -> route must be 404`);
      check((await siteGet(`/colleges/${slug}`)) === 404, `${slug}: unknown college must be 404`);
      continue;
    }

    const collegeId = page.college_id?._id || page.college_id?.id || page.college_id;
    const navbar = await apiGet(`/website/colleges/navbar-list/${collegeId}?isTest=false`);
    const published = (navbar.body?.colleges || []).map((entry) => entry.slug);

    console.log(`--- ${slug}  (CMS pages: ${published.length})`);

    // The overview page of the college
    const overviewStatus = await siteGet(`/colleges/${slug}`);
    check(overviewStatus === 200, `${slug}: overview expected 200 got ${overviewStatus}`);
    console.log(`    /colleges/${slug} -> ${overviewStatus}`);

    // Every published page must be reachable
    for (const publishedSlug of published) {
      const status = await siteGet(`/colleges/${publishedSlug}`);
      check(status === 200, `${slug}: published page "${publishedSlug}" expected 200 got ${status}`);
      console.log(`    /colleges/${publishedSlug} -> ${status}`);
    }

    // Every sub page the CMS does not publish must be a 404
    for (const sub of CANDIDATE_SUBS) {
      const isPublished = published.some(
        (publishedSlug) => publishedSlug.toLowerCase() === `${slug}/${sub}`.toLowerCase()
      );

      if (isPublished) continue;

      const status = await siteGet(`/colleges/${slug}/${sub}`);
      check(status === 404, `${slug}: unpublished "/${sub}" expected 404 got ${status}`);
      console.log(`    /colleges/${slug}/${sub} -> ${status} (not published)`);
    }

    // The navbar of the page must only link to published pages
    const html = await (await fetch(`${BASE_URL}/colleges/${slug}`)).text();
    const navbarHtml = html.match(/<div class="sticky top-\[68px\][\s\S]*?<\/div><\/div><\/div>/);
    const links = [...(navbarHtml ? navbarHtml[0] : "").matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    const allowed = new Set(published.map((publishedSlug) => `/colleges/${publishedSlug}`));

    for (const link of links) {
      if (!link.startsWith("/colleges/")) continue;

      check(
        allowed.has(link),
        `${slug}: navbar links to a page the CMS does not publish -> ${link}`
      );
    }

    console.log(`    navbar links: ${links.filter((l) => l.startsWith("/colleges/")).join(", ")}`);
  }

  // An unknown college must never render a page
  for (const unknown of ["this-university-does-not-exist-xyz", "calcutta-business-school"]) {
    const status = await siteGet(`/colleges/${unknown}`);
    check(status === 404, `${unknown}: unknown college expected 404 got ${status}`);
    console.log(`\n    /colleges/${unknown} -> ${status}`);
  }

  // The /universities tree must behave exactly like the /colleges tree
  for (const [path, expected] of [
    ["/universities/lovely-professional-university-online", 200],
    ["/universities/lovely-professional-university-online/courses", 200],
    ["/universities/lovely-professional-university-online/admission", 200],
    ["/universities/lovely-professional-university-online/scholarships", 404],
    ["/universities/upes-online", 200],
    ["/universities/upes-online/courses", 404],
    ["/universities/upes-online/admission", 404],
    ["/universities/amity-university-online/scholarship", 200],
    ["/universities/amity-university-online/scholarships", 404],
  ]) {
    const status = await siteGet(path);
    check(status === expected, `${path} expected ${expected} got ${status}`);
    console.log(`    ${path} -> ${status}`);
  }

  console.log(`\nPASS: ${passed}   FAIL: ${failed}`);

  if (failed) {
    console.log("\nFAILURES:");
    failures.forEach((failure) => console.log(`  - ${failure}`));
    process.exitCode = 1;
  } else {
    console.log("All route/availability checks passed.");
  }
})();
