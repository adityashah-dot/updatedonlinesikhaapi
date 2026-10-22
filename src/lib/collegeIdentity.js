/**
 * Identity of the university the visitor is currently on.
 *
 * The modals (Apply / Brochure / LMS / Help desk / Track application) are
 * rendered site-wide, so they must never hardcode the name of a single
 * university — they read it from the active college instead.
 */

/** Full name of the college, e.g. "Lovely Professional University Online". */
export function collegeNameOf(college) {
  return String(
    college?.name || college?.shortName || college?.title || ""
  ).trim();
}

/**
 * Short code of the college, used in ids and file names:
 * "LPU Online" → "LPU", "Calcutta Business School" → "CBS".
 */
export function collegeCodeOf(college) {
  const short = String(college?.shortName || "").replace(/\s+Online$/i, "").trim();
  const base = short || collegeNameOf(college);

  if (!base) return "OS";

  const words = base.split(/[\s-]+/).filter(Boolean);

  if (!words.length) return "OS";
  if (words.length === 1) return words[0].toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "OS";

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "") || "OS";
}

/** File name safe variant of the college name. */
export function collegeSlugOf(college) {
  const base = college?.slug || collegeNameOf(college);

  return String(base || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "university";
}
