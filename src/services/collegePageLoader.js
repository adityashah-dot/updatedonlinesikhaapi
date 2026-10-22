import {
  getCollegeBlogs,
  getCollegeBySlug,
  getCollegeCourses,
  getCollegeGallery,
  getCollegeNavbarList,
  getCollegeRecruiters,
} from "@/services/collegeApi";
import { mapCollegePayload } from "@/services/collegeMapper";
import { mapOverviewData } from "@/services/overviewMapper";
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
 * - Calls the production college API (base page, then the `?sub=` variant).
 * - Falls back to the base college payload when the API does not serve the
 *   requested sub-page, so the page renders instead of 404-ing.
 * - Maps the payload with the existing mapper and loads the college navbar.
 *
 * Returns `null` only when the college itself cannot be resolved.
 */
export async function loadCollegePage(slugParts) {
  const { collegeName, sub, fullSlug } = splitSlug(slugParts);

  if (!collegeName) return null;

  let payload = null;

  if (sub) {
    try {
      payload = await getCollegeBySlug(collegeName, sub);
    } catch (error) {
      console.warn(
        `Sub page "${sub}" is not served by the API for ${fullSlug}; ` +
          "falling back to the base college payload."
      );
      payload = null;
    }
  }

  if (!hasCollegeData(payload)) {
    try {
      payload = await getCollegeBySlug(collegeName, "");
    } catch (error) {
      console.error(`College fetch failed for ${fullSlug}:`, error.message);
      payload = null;
    }
  }

  if (!hasCollegeData(payload)) {
    if (!USE_MOCK_DATA) return null;

    payload = buildMockCollegePayload(fullSlug);
  }

  const college = mapCollegePayload(payload, { slug: fullSlug });

  if (!college) return null;

  const collegeId = college.college?.id || "";
  // Base college slug (without the sub-page) used for every generated link.
  const collegeSlug = college.college?.slug || collegeName;

  const [tabs, courses, gallery, recruiters, blogs] = await Promise.all([
    getCollegeNavbarList(collegeId, IS_TEST),
    getCollegeCourses(collegeId),
    getCollegeGallery(collegeId),
    getCollegeRecruiters(collegeId),
    getCollegeBlogs(collegeId),
  ]);

  const overview = mapOverviewData(payload, {
    courses,
    gallery,
    recruiters,
    blogs,
  });

  return {
    college,
    tabs,
    overview,
    sub,
    fullSlug,
    collegeSlug,
  };
}
