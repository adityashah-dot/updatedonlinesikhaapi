import {
  fetchCollegePage,
  getCollegeBlogs,
  getCollegeCourses,
  getCollegeGallery,
  getCollegeNavbarList,
  getCollegeRecruiters,
} from "@/services/collegeApi";
import { mapCollegePayload } from "@/services/collegeMapper";
import { mapOverviewData } from "@/services/overviewMapper";
import {
  buildCollegeNavigation,
  pageSectionOf,
  resolveNavTarget,
} from "@/services/collegeNavigation";
import { buildMockCollegePayload } from "@/data/mockCollegePayload";

const IS_TEST = false;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_COLLEGE_DATA === "true";

/**
 * Splits a route slug into the college slug and its optional sub-page.
 *
 * "/lovely-professional-university-online"          -> { collegeName, sub: "" }
 * "/lovely-professional-university-online/courses"  -> { collegeName, sub: "courses" }
 */
export function splitSlug(slugParam) {
  const segments = (Array.isArray(slugParam) ? slugParam : [slugParam])
    .flatMap((part) => String(part ?? "").split("/"))
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    collegeName: segments[0] || "",
    sub: segments.slice(1).join("/"),
    fullSlug: segments.join("/"),
  };
}

/**
 * Strips CMS HTML out of a live-content string (used for SEO text, where raw
 * markup must never leak into <meta> tags).
 */
export function toPlainText(value) {
  if (typeof value !== "string") return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Legacy listing ids that the API does not know, mapped to the real
 * production slug. Old links / cached bundles pointing at these ids are
 * redirected to the canonical college page instead of 404-ing.
 */
export const LEGACY_SLUG_ALIASES = {
  "lpu-online": "lovely-professional-university-online",
  "cu-online": "chandigarh-university-online",
  "amity-online": "amity-university-online",
  "manipal-online": "manipal-university-online",
  "jain-online": "jain-university-online",
};

/**
 * Returns the canonical path for a legacy slug, or null when the slug is
 * already canonical.
 */
export function resolveLegacySlug(slugParts) {
  const { collegeName, sub } = splitSlug(slugParts);

  const canonical = LEGACY_SLUG_ALIASES[collegeName.toLowerCase()];

  if (!canonical) return null;

  return {
    collegeName: canonical,
    sub,
    path: `/${canonical}${sub ? `/${sub}` : ""}`,
  };
}

/** A payload is usable only when it actually carries college data. */
function hasCollegeData(payload) {
  if (!payload || typeof payload !== "object") return false;

  return Boolean(
    payload.slug ||
      payload.title ||
      payload.college_id ||
      payload.navbarTitle ||
      payload.hero ||
      Array.isArray(payload.sections)
  );
}

/**
 * Merges an optional `?section=` query parameter into the route slug so that
 * `/colleges/{slug}?section=courses` loads the same live content as
 * `/colleges/{slug}/courses`.
 */
export function withSection(slugParam, sectionParam) {
  const { collegeName } = splitSlug(slugParam);
  const section = String(sectionParam || "").trim();

  if (!section) return splitSlug(slugParam);

  return {
    collegeName,
    sub: section,
    fullSlug: `${collegeName}/${section}`,
  };
}

/**
 * Shared college page loader used by both /colleges/[...slug] and
 * /universities/[...slug].
 *
 * - Reads the slug and splits off the optional sub-page.
 * - Loads the base page of the college and the navigation the CMS publishes
 *   for it (`GET /website/colleges/navbar-list/{collegeId}`).
 * - A sub page exists only when the CMS publishes it: the requested path is
 *   matched against the published navigation. When it does not match, the
 *   loader answers `{ unavailable: true }` and the route returns 404 — the
 *   Overview content is never re-labelled as a Courses/Admission page.
 * - The template of the page is taken from the CMS payload itself
 *   (`shortTitle` / `navbarTitle`), never guessed from the URL text.
 *
 * Returns `null` only when the college itself cannot be resolved.
 */
export async function loadCollegePage(slugParts, options = {}) {
  const { basePath = "/colleges" } = options;
  const { collegeName, sub, fullSlug } = splitSlug(slugParts);

  if (!collegeName) return null;

  let payload = await fetchCollegePage(collegeName, "");

  // Some CMS pages publish a slug that carries its own sub path
  // ("<college>-courses/<segment>"). They are only reachable as a whole
  // path, so the full path is tried when the first segment alone is unknown.
  if (!hasCollegeData(payload) && fullSlug.includes("/")) {
    payload = await fetchCollegePage(fullSlug, "");
  }

  if (!hasCollegeData(payload)) {
    if (!USE_MOCK_DATA) return null;

    payload = buildMockCollegePayload(fullSlug);
  }

  const college = mapCollegePayload(payload, { slug: collegeName });

  if (!college) return null;

  const collegeId = college.college?.id || "";
  // Canonical slug of the college (without the sub-page) used for links.
  const collegeSlug = college.college?.slug || collegeName;

  const [navEntries, courses, gallery, recruiters, blogs] = await Promise.all([
    getCollegeNavbarList(collegeId, IS_TEST),
    getCollegeCourses(collegeId),
    getCollegeGallery(collegeId),
    getCollegeRecruiters(collegeId),
    getCollegeBlogs(collegeId),
  ]);

  const nav = buildCollegeNavigation({
    entries: navEntries,
    navBase: collegeSlug,
    basePath,
  });

  const target = resolveNavTarget({
    requestedPath: fullSlug,
    navBase: collegeSlug,
    entries: navEntries,
  });

  // The API does not publish this page — the route must answer 404.
  if (!target) {
    return { unavailable: true, college, nav, collegeSlug };
  }

  if (target.kind === "sub") {
    const subPayload = await fetchCollegePage(collegeName, target.sub);

    if (!hasCollegeData(subPayload)) {
      return { unavailable: true, college, nav, collegeSlug };
    }

    payload = subPayload;
  } else if (target.kind === "page") {
    const pagePayload = await fetchCollegePage(target.slug, "");

    if (!hasCollegeData(pagePayload)) {
      return { unavailable: true, college, nav, collegeSlug };
    }

    payload = pagePayload;
  }

  const overview = mapOverviewData(payload, {
    courses,
    gallery,
    recruiters,
    blogs,
  });

  const section =
    target.kind === "base" ? "overview" : pageSectionOf(payload);

  return {
    college,
    nav,
    overview,
    section,
    sub,
    fullSlug,
    collegeSlug,
  };
}
