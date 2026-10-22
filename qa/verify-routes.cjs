const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const ROUTES = [
  ["/", "home"],
  ["/universities", "universities"],
  ["/colleges/lovely-professional-university-online", "college-overview"],
  ["/colleges/lovely-professional-university-online/admission", "college-admission"],
  ["/colleges/lovely-professional-university-online/courses", "college-courses"],
  ["/colleges/lovely-professional-university-online/scholarships", "college-scholarships"],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

  for (const [route, name] of ROUTES) {
    const errors = [];
    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
    page.on("console", (m) => {
      if (m.type() === "error" && !/favicon|websocket|hydrat/i.test(m.text()))
        errors.push(m.text().slice(0, 160));
    });
    page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message.slice(0, 160)));

    const res = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 }).catch((e) => null);
    await page.waitForTimeout(1200);

    const status = res ? res.status() : "ERR";
    const info = await page.evaluate(() => {
      const sections = [...document.querySelectorAll("section[id]")].map((s) => s.id);
      const h1 = document.querySelector("h1");
      const h2 = [...document.querySelectorAll("h2")].slice(0, 4).map((h) => h.textContent.trim().slice(0, 42));
      const toc = document.querySelector('section[aria-label="Table of contents"]');
      const tocItems = toc ? [...toc.querySelectorAll("li a")].map((a) => a.textContent.trim()) : [];
      const tabs = [...document.querySelectorAll('a[href*="/colleges/"]')]
        .filter((a) => a.closest("nav, .sticky"))
        .map((a) => a.textContent.trim())
        .slice(0, 8);
      const body = document.body.innerText || "";
      return {
        sections,
        h1: h1 ? h1.textContent.trim().slice(0, 60) : "(none)",
        h2,
        tocCount: tocItems.length,
        tocItems: tocItems.slice(0, 6),
        tabs,
        notFound: body.includes("404") && body.length < 900,
        len: body.length,
      };
    });

    await page.screenshot({ path: `qa/shots/${name}.png`, fullPage: false });

    console.log(`\n=== ${route}  [HTTP ${status}] ===`);
    console.log(`  H1: ${info.h1}`);
    console.log(`  sections(${info.sections.length}): ${info.sections.join(", ")}`);
    console.log(`  H2: ${info.h2.join(" | ")}`);
    console.log(`  TOC(${info.tocCount}): ${info.tocItems.join(" | ")}`);
    console.log(`  tabs: ${info.tabs.join(" | ")}`);
    console.log(`  text length: ${info.len}${info.notFound ? "  <-- LOOKS LIKE 404" : ""}`);
    if (errors.length) {
      console.log(`  ERRORS (${errors.length}):`);
      errors.slice(0, 4).forEach((e) => console.log("    ! " + e));
    } else {
      console.log("  no console errors");
    }
  }

  await browser.close();
})();
