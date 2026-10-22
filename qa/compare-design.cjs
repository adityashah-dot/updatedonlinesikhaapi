/**
 * Measures the new Next.js college pages and prints a side-by-side comparison
 * against the reference project's recorded spec (qa/reference/LPU_TEMPLATE_SPEC.md).
 */
const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const ROUTES = [
  ["college-overview", "/colleges/lovely-professional-university-online"],
  ["college-admission", "/colleges/lovely-professional-university-online/admission"],
  ["college-courses", "/colleges/lovely-professional-university-online/courses"],
  ["college-scholarships", "/colleges/lovely-professional-university-online/scholarships"],
  ["home", "/"],
  ["listing", "/universities"],
];

/* Values recorded from the reference project. */
const REFERENCE = {
  "h1-size": "36px (Overview/Courses/Scholarships), 40.98px (Admission)",
  "h1-color": "rgb(0, 15, 34) / rgb(7, 26, 52) on Admission",
  "h2-section": "24px w700 lh32px rgb(0, 15, 34)",
  "h2-extrabold-variants": "rankings, placements, reviews-section, admission-dates, examination-pattern, scholarship-schemes",
  "h3": "16px w600 lh24px",
  "card-shell": "bg-white, border 1px rgb(231, 238, 255), radius 16px, pad 18px 22px",
  "section-gap": "22px (16px mobile)",
  "page-section-margin": "22px",
  "section-title-mb": "4px",
  "section-description": "margin-top 4px, margin-bottom 12px",
  "content-block-pad": "14px",
  "table-header": "bg rgb(11, 37, 64), white, th py-3 px-4 font-bold",
  "table-body": "td py-2.5 px-4 font-normal, divide rgb(231, 238, 255)",
  "primary-btn": "bg rgb(17, 94, 175), white, 14px w600, radius 12px, pad 10px 20px",
  "font": "Poppins",
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

  for (const [name, route] of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(900);

    const m = await page.evaluate(() => {
      const px = (v) => (v === "none" || !v ? v : Math.round(parseFloat(v) * 100) / 100 + "px");
      const cs = (el) => getComputedStyle(el);

      const h1 = document.querySelector("h1");
      const h2s = [...document.querySelectorAll("h2")].filter((h) => h.textContent.trim());
      const sec = document.querySelector("section.page-section, section[id]");
      const tbl = document.querySelector("table");
      const th = tbl ? tbl.querySelector("thead th") : null;
      const td = tbl ? tbl.querySelector("tbody td") : null;
      const btn = document.querySelector("button.bg-\\[\\#115eaf\\]");

      return {
        h1: h1
          ? {
              size: px(cs(h1).fontSize),
              weight: cs(h1).fontWeight,
              lh: px(cs(h1).lineHeight),
              color: cs(h1).color,
              font: cs(h1).fontFamily.split(",")[0],
            }
          : null,
        h2: h2s[0]
          ? {
              size: px(cs(h2s[0]).fontSize),
              weight: cs(h2s[0]).fontWeight,
              lh: px(cs(h2s[0]).lineHeight),
              color: cs(h2s[0]).color,
            }
          : null,
        h2Weights: [...new Set(h2s.map((h) => cs(h).fontWeight))].join("/"),
        section: sec
          ? {
              bg: cs(sec).backgroundColor,
              border: `${px(cs(sec).borderTopWidth)} ${cs(sec).borderTopColor}`,
              radius: px(cs(sec).borderRadius),
              pad: `${px(cs(sec).paddingTop)} ${px(cs(sec).paddingRight)} ${px(cs(sec).paddingBottom)} ${px(cs(sec).paddingLeft)}`,
            }
          : null,
        table: tbl
          ? {
              thBg: th ? cs(th).backgroundColor : "",
              thColor: th ? cs(th).color : "",
              thSize: th ? px(cs(th).fontSize) : "",
              thPad: th ? `${px(cs(th).paddingTop)} ${px(cs(th).paddingRight)}` : "",
              tdPad: td ? `${px(cs(td).paddingTop)} ${px(cs(td).paddingRight)}` : "",
              tdSize: td ? px(cs(td).fontSize) : "",
            }
          : null,
        button: btn
          ? {
              bg: cs(btn).backgroundColor,
              color: cs(btn).color,
              size: px(cs(btn).fontSize),
              weight: cs(btn).fontWeight,
              radius: px(cs(btn).borderRadius),
              pad: `${px(cs(btn).paddingTop)} ${px(cs(btn).paddingRight)}`,
            }
          : null,
        gap: (() => {
          const c = document.querySelector(".section-container");
          return c ? cs(c).rowGap : "";
        })(),
        bodyFont: cs(document.body).fontFamily.split(",")[0],
      };
    });

    console.log(`\n=== ${name}  (${route}) ===`);
    console.log(`  body font           ${m.bodyFont}`);
    console.log(`  H1                  ${m.h1 ? `${m.h1.size} w${m.h1.weight} lh${m.h1.lh} ${m.h1.color}` : "-"}`);
    console.log(`  H2                  ${m.h2 ? `${m.h2.size} w${m.h2.weight} lh${m.h2.lh} ${m.h2.color}` : "-"}   (weights on page: ${m.h2Weights})`);
    console.log(`  section shell       ${m.section ? `bg=${m.section.bg} border=${m.section.border} r=${m.section.radius} pad=${m.section.pad}` : "-"}`);
    console.log(`  section gap         ${m.gap}`);
    console.log(`  table               ${m.table ? `th bg=${m.table.thBg} ${m.table.thColor} ${m.table.thSize} pad=${m.table.thPad} | td ${m.table.tdSize} pad=${m.table.tdPad}` : "-"}`);
    console.log(`  primary button      ${m.button ? `bg=${m.button.bg} ${m.button.color} ${m.button.size} w${m.button.weight} r=${m.button.radius} pad=${m.button.pad}` : "-"}`);
  }

  console.log("\n\n=== REFERENCE (recorded spec) ===");
  Object.entries(REFERENCE).forEach(([k, v]) => console.log(`  ${k.padEnd(24)} ${v}`));

  await browser.close();
})();
