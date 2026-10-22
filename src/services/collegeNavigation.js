/**
 * College navigation — the single source of truth for "which pages exist".
 *
 * The CMS publishes the navigation of every college through
 * `GET /website/colleges/navbar-list/{collegeId}`:
 *
 *   { navbarTitle: "Overview", slug: "lovely-professional-university-online" }
 *   { navbarTitle: "Courses",  slug: "lovely-professional-university-online/courses" }
 *   { navbarTitle: "Admission",slug: "amity-university-online/admission" }
 *
 * Three kinds of entries exist in the live data:
 *
 *  - `base`   the slug of the college itself (the Overview page),
 *  - `sub`    `<college slug>/<sub>` — a sub page of the same college
 *             (`?sub=<sub>` on the college endpoint),
 *  - `page`   a standalone CMS page of the same university
 *             (`vit-vellore-admission-2026`).
 *
 * Only what the API publishes is routable: a URL that is not in the
 * navigation does not exist and must answer 404 instead of falling back to
 * the Overview content.
 */

/** Canonical sections and the order/design they use in the pill bar. */
const SECTION_ORDER = ["overview", "courses", "admission", "scholarships"];

const SECTION_LABELS = {
  overview: "Overview",
  courses: "Courses",
  admission: "Admission",
  scholarships: "Scholarships",
};

const SECTION_ICONS = {
  overview: "grid_view",
  courses: "menu_book",
  admission: "how_to_reg",
  scholarships: "workspace_premium",
};

/**
 * Maps a CMS title / slug segment onto the section it represents.
 * `page` means "a real CMS page this project has no dedicated template for"
 * (placements, hostel & campus, infrastructure, …) — it is still routed
 * and still renders its own API content.
 */
export function classifySection(value) {
  const text = String(value || "").toLowerCase();

  if (!text) return "overview";
  if (text.includes("course")) return "courses";
  if (text.includes("admission")) return "admission";
  if (text.includes("scholar")) return "scholarships";

  return "page";
}

/** The section of a page, read from the payload the API returned. */
export function pageSectionOf(payload) {
  const key = payload?.shortTitle || payload?.navbarTitle || "";

  return classifySection(key);
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

/**
 * Builds the navigation model of a college.
 *
 * @param {object} params
 * @param {Array}  params.entries   raw CMS navbar entries
 * @param {string} params.navBase   canonical slug of the college
 * @param {string} params.basePath  route tree the links must stay in
 *                                  ("/colleges" or "/universities")
 */
export function buildCollegeNavigation({
  entries = [],
  navBase = "",
  basePath = "/colleges",
} = {}) {
  const base = String(navBase || "").trim();
  const tabs = [];
  const seen = new Set();

  entries.forEach((entry) => {
    const slug = String(entry?.slug || "").trim();
    const title = String(entry?.title || "").trim();

    if (!slug) return;

    const isBase = normalize(slug) === normalize(base);
    const isSub = Boolean(base) && slug.startsWith(`${base}/`);
    const section = isBase ? "overview" : classifySection(title || slug);
    // Unknown CMS pages stay separate tabs (one per published page).
    const key = section === "page" ? `page:${normalize(slug)}` : section;

    if (seen.has(key)) return;

    seen.add(key);

    tabs.push({
      id: slug,
      title,
      label: SECTION_LABELS[section] || title,
      icon: SECTION_ICONS[section] || "article",
      href: `${basePath}/${slug}`,
      section,
      kind: isBase ? "base" : isSub ? "sub" : "page",
      sub: isSub ? slug.slice(base.length + 1) : "",
      order: entry?.order ?? 0,
    });
  });

  // The Overview page is the base page of the college — it always exists.
  if (base && !tabs.some((tab) => tab.kind === "base")) {
    tabs.unshift({
      id: base,
      title: "Overview",
      label: SECTION_LABELS.overview,
      icon: SECTION_ICONS.overview,
      href: `${basePath}/${base}`,
      section: "overview",
      kind: "base",
      sub: "",
      order: 0,
    });
  }

  // Canonical sections first (design order), published CMS pages after.
  const ordered = [...tabs].sort((a, b) => {
    const rank = (tab) => {
      const index = SECTION_ORDER.indexOf(tab.section);

      return index === -1 ? SECTION_ORDER.length : index;
    };

    return rank(a) - rank(b);
  });

  return { tabs: ordered, navBase: base };
}

/**
 * Resolves a requested URL path against the published navigation.
 *
 * Returns `null` when the API does not publish that page — the route must
 * then answer 404 instead of rendering the Overview.
 *
 * @param {object} params
 * @param {string} params.requestedPath  the URL path, e.g. "lpu-online/courses"
 * @param {string} params.navBase        canonical slug of the college
 * @param {Array}  params.entries        raw CMS navbar entries
 */
export function resolveNavTarget({
  requestedPath = "",
  navBase = "",
  entries = [],
} = {}) {
  const path = String(requestedPath || "").trim();

  if (!path) return null;

  const published = entries.find(
    (entry) => normalize(entry?.slug) === normalize(path)
  );

  if (published) {
    const slug = String(published.slug).trim();

    if (normalize(slug) === normalize(navBase)) {
      return { kind: "base", slug, sub: "" };
    }

    if (navBase && slug.startsWith(`${navBase}/`)) {
      return { kind: "sub", slug, sub: slug.slice(navBase.length + 1) };
    }

    return { kind: "page", slug, sub: "" };
  }

  if (normalize(path) === normalize(navBase)) {
    return { kind: "base", slug: navBase, sub: "" };
  }

  // A single segment is a (possibly legacy) slug of the base college page.
  if (!path.includes("/")) {
    return { kind: "base", slug: path, sub: "" };
  }

  return null;
}
