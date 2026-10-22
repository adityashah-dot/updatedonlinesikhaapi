/**
 * Live-content audit: reports the CMS sections that render empty.
 *
 * Usage:
 *   node qa/audit-content.cjs                       # audits every college in the listing
 *   node qa/audit-content.cjs upes-online lovely-professional-university-online
 *
 * For every college page it prints each section with its block types and the
 * amount of content behind it. Sections flagged EMPTY are the ones the CMS
 * still has to fill in (they are the ones the user sees as blank on the site).
 */
const fs = require("fs");

function loadEnv() {
  const env = {};
  fs.readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim();
    });
  return env;
}

const env = loadEnv();
const BASE = env.API_URL || env.NEXT_PUBLIC_API_URL;
const HEADERS = {
  Accept: "application/json",
  ...(env.API_TOKEN ? { Authorization: `Bearer ${env.API_TOKEN}` } : {}),
};

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} for ${path}`);
  return res.json();
}

function contentSize(block) {
  const content = block?.content || {};
  let size = 0;

  Object.values(content).forEach((value) => {
    if (typeof value === "string") size += value.replace(/<[^>]*>/g, "").trim().length;
    else if (Array.isArray(value)) size += value.length * 12;
    else if (value && typeof value === "object") size += 12;
  });

  return size;
}

function auditSections(label, payload) {
  const data = payload?.data?.data || payload?.data || payload;
  const sections = Array.isArray(data?.sections) ? data.sections : [];

  if (!sections.length) {
    console.log(`  [${label}] no sections`);
    return 0;
  }

  let empty = 0;

  sections.forEach((section, index) => {
    const blocks = section?.blocks || [];
    const types = blocks.map((b) => b?.type).join(", ") || "no blocks";
    const size = blocks.reduce((total, block) => total + contentSize(block), 0);
    const isEmpty = size === 0;

    if (isEmpty) empty += 1;

    console.log(
      `  [${label}] ${String(index).padStart(2, "0")} "${section?.title || "(no title)"}" ` +
        `blocks(${types}) content=${size}${isEmpty ? "   <-- EMPTY" : ""}`
    );
  });

  return empty;
}

async function listColleges() {
  const payload = await get(
    "/website/colleges/listing?isCollgesNamesRequired=true&isCollgesLocationsRequired=true"
  );
  const records = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.data?.data)
      ? payload.data.data
      : [];

  return records.map((record) => record.slug).filter(Boolean);
}

(async () => {
  const slugs = process.argv.slice(2).length
    ? process.argv.slice(2)
    : await listColleges();

  console.log(`Auditing ${slugs.length} college page(s)\n`);

  let totalEmpty = 0;

  for (const slug of slugs) {
    console.log(`=== ${slug} ===`);

    try {
      const base = await get(`/website/colleges/${encodeURIComponent(slug)}`);
      totalEmpty += auditSections("overview", base);

      const data = base?.data?.data || base?.data || base;
      const collegeId = data?.college_id?._id || data?.college_id?.id;

      if (collegeId) {
        const nav = await get(
          `/website/colleges/navbar-list/${collegeId}?isTest=false`
        );
        const tabs = Array.isArray(nav?.colleges) ? nav.colleges : [];

        for (const tab of tabs) {
          if (!tab?.slug || tab.slug === slug) continue;

          const sub = String(tab.slug).split("/").pop();
          const subPayload = await get(
            `/website/colleges/${encodeURIComponent(slug)}?sub=${encodeURIComponent(sub)}`
          );
          totalEmpty += auditSections(sub, subPayload);
        }
      }
    } catch (error) {
      console.log(`  ERROR: ${error.message}`);
    }

    console.log("");
  }

  console.log(`\nTotal empty sections: ${totalEmpty}`);
})();
