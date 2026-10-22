const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

const API_TOKEN = process.env.API_TOKEN;

/**
 * Cache tag shared by every live-content request. The CMS webhook calls
 * /api/revalidate, which invalidates this tag so a published page is
 * re-rendered immediately instead of after the revalidate window.
 */
export const COLLEGE_CONTENT_TAG = "college-content";

function buildHeaders() {
  const headers = { Accept: "application/json" };

  if (API_TOKEN) {
    headers.Authorization = `Bearer ${API_TOKEN}`;
  }

  return headers;
}

async function apiFetch(path, revalidate = 3600) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: buildHeaders(),
    next: { revalidate, tags: [COLLEGE_CONTENT_TAG] },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status} for ${path}`);
  }

  const payload = await response.json();

  return payload;
}

/**
 * College detail payload.
 * GET {API_URL}/website/colleges/{collegeName}[?sub={subSlug}]
 *
 * The API accepts the college slug as the first path segment and the
 * remaining navigation segment as the `sub` query parameter.
 */
export async function getCollegeBySlug(collegeName, sub) {
  if (!collegeName) return null;

  const subSlug = sub ? `?sub=${encodeURIComponent(sub)}` : "";
  const payload = await apiFetch(
    `/website/colleges/${encodeURIComponent(collegeName)}${subSlug}`
  );

  return payload?.data?.data || payload?.data || payload;
}

/**
 * Same endpoint as `getCollegeBySlug`, but it never throws for a page the
 * API does not publish: a 404 (the API answers `College not found` for an
 * unknown slug *and* for an unknown `sub`) resolves to `null`.
 *
 * This is what makes "page not available" distinguishable from "the CMS is
 * down" — a missing page must answer 404, a broken CMS must not silently
 * render the Overview under a Courses URL.
 */
export async function fetchCollegePage(collegeName, sub) {
  if (!collegeName) return null;

  const subSlug = sub ? `?sub=${encodeURIComponent(sub)}` : "";

  try {
    const payload = await apiFetch(
      `/website/colleges/${encodeURIComponent(collegeName)}${subSlug}`
    );

    return payload?.data?.data || payload?.data || payload || null;
  } catch (error) {
    if (/status 404/.test(error.message)) return null;

    throw error;
  }
}

/**
 * College navigation tabs.
 * GET {API_URL}/website/colleges/navbar-list/{collegeId}?isTest={isTest}
 *
 * The raw CMS entries are returned untouched (`navbarTitle`, `slug`, `order`)
 * so the navigation layer can decide which pages exist and where they link
 * to — the href is built there, not here, because the same college is served
 * under both `/colleges/...` and `/universities/...`.
 */
export async function getCollegeNavbarList(collegeId, isTest = false) {
  if (!collegeId) return [];

  try {
    const payload = await apiFetch(
      `/website/colleges/navbar-list/${collegeId}?isTest=${isTest}`
    );

    const colleges = payload?.colleges || payload?.data?.colleges || [];

    if (!Array.isArray(colleges) || !colleges.length) {
      return [];
    }

    return colleges.map((item) => ({
      title: item.navbarTitle || "",
      slug: item.slug || "",
      order: item.order ?? 0,
    }));
  } catch (error) {
    console.error(`getCollegeNavbarList failed for ${collegeId}:`, error.message);
    return [];
  }
}

/**
 * Campus gallery of a college.
 * GET {API_URL}/website/colleges/gallery?collegeId={collegeId}
 */
export async function getCollegeGallery(collegeId) {
  if (!collegeId) return [];

  try {
    const payload = await apiFetch(
      `/website/colleges/gallery?collegeId=${encodeURIComponent(collegeId)}`
    );

    const data = payload?.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`getCollegeGallery failed for ${collegeId}:`, error.message);
    return [];
  }
}

/**
 * Hiring partners / recruiter logos of a college.
 * GET {API_URL}/website/colleges/resources?collegeId={collegeId}&resourceCategory=recruiters
 */
export async function getCollegeRecruiters(collegeId) {
  if (!collegeId) return [];

  try {
    const payload = await apiFetch(
      `/website/colleges/resources?collegeId=${encodeURIComponent(
        collegeId
      )}&resourceCategory=recruiters`
    );

    const data = payload?.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`getCollegeRecruiters failed for ${collegeId}:`, error.message);
    return [];
  }
}

/**
 * Colleges similar to the given college (used by the compare section).
 * GET {API_URL}/colleges/similar/{slug}
 */
export async function getSimilarColleges(slug) {
  if (!slug) return [];

  try {
    const payload = await apiFetch(`/colleges/similar/${encodeURIComponent(slug)}`);

    const data = payload?.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`getSimilarColleges failed for ${slug}:`, error.message);
    return [];
  }
}

/**
 * Blogs for the college blogs block.
 * POST {API_URL}/blogs/get-block-blogs
 */
export async function getCollegeBlogs(collegeId, blockContent = {}) {
  try {
    const response = await fetch(`${API_URL}/blogs/get-block-blogs`, {
      method: "POST",
      headers: {
        ...buildHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...blockContent, collegeID: collegeId }),
      next: { revalidate: 3600, tags: [COLLEGE_CONTENT_TAG] },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status} for /blogs/get-block-blogs`);
    }

    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (error) {
    console.error(`getCollegeBlogs failed for ${collegeId}:`, error.message);
    return [];
  }
}

/**
 * Courses of a college.
 * GET {API_URL}/website/colleges/courses-new/{collegeId}
 *
 * The raw CMS records are returned untouched (degreeName, avgFee, avgDuration,
 * noOfSpecializations, slug, mode) so every mapper can read the live fields.
 */
export async function getCollegeCourses(collegeId) {
  if (!collegeId) return [];

  try {
    const payload = await apiFetch(
      `/website/colleges/courses-new/${encodeURIComponent(
        collegeId
      )}?page=0&limit=25&search=&degree=&sortBy=&sortOrder=`
    );

    const data = payload?.data;

    if (!Array.isArray(data)) return [];

    return data.filter((degree) => degree && typeof degree === "object");
  } catch (error) {
    console.error(`getCollegeCourses failed for ${collegeId}:`, error.message);
    return [];
  }
}
