/**
 * Inspects the live API payload for a college (read-only).
 * Usage: node qa/inspect-api.cjs <collegeName> [sub]
 */
const fs = require("fs");

function loadEnv() {
  const env = {};
  const raw = fs.readFileSync(".env.local", "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  });
  return env;
}

const env = loadEnv();
const BASE = env.API_URL || env.NEXT_PUBLIC_API_URL;
const TOKEN = env.API_TOKEN;

const name = process.argv[2] || "lovely-professional-university-online";
const sub = process.argv[3] || "";

async function get(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json", ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
  });
  if (!res.ok) throw new Error(`${res.status} for ${path}`);
  return res.json();
}

(async () => {
  const payload = await get(
    `/website/colleges/${encodeURIComponent(name)}${sub ? `?sub=${encodeURIComponent(sub)}` : ""}`
  );
  const data = payload?.data?.data || payload?.data || payload;

  console.log("=== top-level keys ===");
  console.log(Object.keys(data || {}).join(", "));

  console.log("\n=== college_id keys ===");
  const college = data?.college_id || {};
  console.log(Object.keys(college).join(", "));

  console.log("\n=== hero ===");
  console.log(JSON.stringify(data?.hero, null, 2).slice(0, 1200));

  console.log("\n=== sections ===");
  (data?.sections || []).forEach((s, i) => {
    console.log(
      `  [${i}] key=${s.key} title="${s.title}" slug=${s.slug} type=${s.sectionType} blocks=${(s.blocks || []).map((b) => b.type).join(",")}`
    );
  });

  console.log("\n=== toc ===");
  console.log(JSON.stringify(data?.toc, null, 2).slice(0, 1500));

  console.log("\n=== other keys present ===");
  ["admission", "scholarships", "courses", "faq", "faqs", "latestNews", "testimonials", "blogs", "scholarshipRules", "scholarshipPillars"].forEach((k) => {
    const v = data?.[k];
    if (v !== undefined) {
      const desc = Array.isArray(v) ? `array(${v.length})` : typeof v;
      console.log(`  ${k}: ${desc}`);
      if (Array.isArray(v) && v.length) console.log("     first:", JSON.stringify(v[0]).slice(0, 300));
    }
  });
})();
