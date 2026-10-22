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
const H = {
  Accept: "application/json",
  ...(env.API_TOKEN ? { Authorization: `Bearer ${env.API_TOKEN}` } : {}),
};

(async () => {
  const p = await (
    await fetch(`${env.API_URL}/website/colleges/lovely-professional-university-online`, { headers: H })
  ).json();

  const d = p?.data?.data || p?.data || p;
  const id = d?.college_id?._id || d?.college_id?.id;
  console.log("collegeId =", id);

  const np = await (
    await fetch(`${env.API_URL}/website/colleges/navbar-list/${id}?isTest=false`, { headers: H })
  ).json();

  const cols = np?.colleges || np?.data?.colleges || [];
  console.log("\n=== navbar list (" + cols.length + ") ===");
  cols.forEach((c) => {
    console.log(
      `  navbarTitle="${c.navbarTitle}" slug="${c.slug}" pageType=${c.pageType} order=${c.order}`
    );
  });

  console.log("\n=== raw first entry ===");
  console.log(JSON.stringify(cols[0], null, 2).slice(0, 900));

  // Probe which sub values the detail endpoint accepts
  console.log("\n=== probing ?sub= values ===");
  for (const sub of ["", "admission", "courses", "scholarships", "scholarship", "overview", "lms"]) {
    const url = `${env.API_URL}/website/colleges/lovely-professional-university-online${
      sub ? `?sub=${sub}` : ""
    }`;
    const res = await fetch(url, { headers: H });
    let info = "";
    if (res.ok) {
      const j = await res.json();
      const dd = j?.data?.data || j?.data || j;
      const secs = (dd?.sections || []).map((s) => s.title);
      info = `OK  sections(${secs.length}): ${secs.join(" | ").slice(0, 200)}`;
    } else {
      info = `HTTP ${res.status}`;
    }
    console.log(`  sub="${sub}" -> ${info}`);
  }
})();
