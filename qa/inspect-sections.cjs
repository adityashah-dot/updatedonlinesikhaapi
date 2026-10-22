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

const name = process.argv[2] || "lovely-professional-university-online";
const sub = process.argv[3] || "";

(async () => {
  const p = await (
    await fetch(
      `${env.API_URL}/website/colleges/${name}${sub ? `?sub=${sub}` : ""}`,
      { headers: H }
    )
  ).json();

  const d = p?.data?.data || p?.data || p;

  console.log(`=== sub="${sub}" ===`);
  (d?.sections || []).forEach((s, i) => {
    console.log(`  [${i}] "${s.title}"  key=${s.key}`);
    (s.blocks || []).forEach((b) => {
      const c = b?.content || {};
      const keys = Object.keys(c);
      let detail = "";
      if (Array.isArray(c.items)) detail = `items(${c.items.length})`;
      else if (Array.isArray(c.steps)) detail = `steps(${c.steps.length})`;
      else if (Array.isArray(c.courses)) detail = `courses(${c.courses.length})`;
      else if (Array.isArray(c.certificates)) detail = `certificates(${c.certificates.length})`;
      else if (Array.isArray(c.testimonials)) detail = `testimonials(${c.testimonials.length})`;
      else if (Array.isArray(c.blogs)) detail = `blogs(${c.blogs.length})`;
      else if (Array.isArray(c.resources)) detail = `resources(${c.resources.length})`;
      else if (typeof c.html === "string") detail = `html(${c.html.length})`;
      else if (typeof c.content === "string") detail = `content(${c.content.length})`;
      console.log(`        - ${b.type}: [${keys.join(",")}] ${detail}`);
    });
  });
})();
