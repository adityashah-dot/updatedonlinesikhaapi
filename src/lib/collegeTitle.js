/**
 * College title helpers — port of the reference project's
 * src/lib/sectionTitles.ts (JS version).
 */

/** "LPU Online" -> "LPU" ; "CU Online" -> "CU" */
export function collegeBase(shortName) {
  return String(shortName || "").replace(/\s+Online$/i, "").trim();
}

/**
 * Builds "{Name} Online {Topic} {Year}" — the reference title pattern.
 * The year is appended only when the topic does not already carry one.
 */
export function collegeSectionTitle(shortName, topic, year = "2026") {
  const base = collegeBase(shortName);
  const cleanTopic = String(topic || "").trim();

  if (!base) return cleanTopic;

  if (/\b20\d{2}\b/.test(cleanTopic)) return `${base} Online ${cleanTopic}`;

  return `${base} Online ${cleanTopic} ${year}`;
}

/** Picks the first non-empty value. */
export function firstOf(...values) {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" && !value.trim()) continue;
    if (Array.isArray(value) && !value.length) continue;
    return value;
  }

  return "";
}
