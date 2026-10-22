const { chromium } = require("playwright");
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

const SLUGS = [
  "lovely-professional-university-online",
  "chandigarh-university-online",
  "amity-university-online",
  "manipal-university-jaipur-online",
];

(async () => {
  // ---- discover real slugs from the universities API ----
  let slugs = SLUGS;
  try {
    const p = await (
      await fetch(`${env.API_URL}/website/universities`, { headers: H })
    ).json();
    const list = p?.data?.colleges || p?.data?.data || p?.colleges || p?.data;
    if (Array.isArray(list) && list.length) {
      const found = list
        .map((c) => c.slug || c.collegeSlug)
        .filter(Boolean)
        .slice(0, 4);
      if (found.length) slugs = found;
    }
  } catch (e) {
    console.log("slug discovery failed:", e.message);
  }

  console.log("slugs under test:", slugs.join(", "), "\n");

  const browser = await chromium.launch();

  for (const slug of slugs) {
    for (const vp of [
      { w: 1366, h: 900, n: "desktop" },
      { w: 390, h: 844, n: "mobile" },
    ]) {
      const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
      const errors = [];
      page.on("console", (m) => {
        if (m.type() === "error" && !/favicon|websocket|hydrat/i.test(m.text()))
          errors.push(m.text().slice(0, 120));
      });
      page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message.slice(0, 120)));

      const res = await page
        .goto(`http://localhost:3000/colleges/${slug}`, { waitUntil: "networkidle", timeout: 45000 })
        .catch(() => null);
      await page.waitForTimeout(900);

      const info = await page.evaluate(() => {
        const h1 = document.querySelector("h1");
        return {
          sections: document.querySelectorAll("section[id]").length,
          h1: h1 ? h1.textContent.trim().slice(0, 50) : "(none)",
          len: (document.body.innerText || "").length,
        };
      });

      console.log(
        `${slug.padEnd(46)} ${vp.n.padEnd(8)} [${res ? res.status() : "ERR"}] sections=${info.sections} len=${info.len} h1="${info.h1}" ${errors.length ? "ERRORS:" + errors.length : "clean"}`
      );
      if (errors.length) errors.slice(0, 2).forEach((e) => console.log("      ! " + e));

      await page.screenshot({
        path: `qa/shots/slug-${slug}-${vp.n}.png`,
        fullPage: false,
      });
      await page.close();
    }
  }

  await browser.close();
})();
