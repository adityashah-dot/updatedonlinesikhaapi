const { chromium } = require("playwright");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = [];

  page.on("console", (m) => {
    if (m.type() === "error" && !/favicon|websocket|hydrat/i.test(m.text()))
      errors.push(m.text().slice(0, 140));
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message.slice(0, 140)));

  await page.goto("http://localhost:3000/colleges/lovely-professional-university-online", {
    waitUntil: "networkidle",
  });
  await sleep(1200);

  async function openAndClose(label, text, shot) {
    const loc = page.locator("button", { hasText: text }).first();
    if (!(await loc.count())) {
      console.log(`${label}: button not found`);
      return;
    }

    await loc.click({ timeout: 15000 });
    await sleep(900);

    const open = await page.evaluate(() => {
      const overlay = document.querySelector(
        ".fixed.inset-0.z-50, .fixed.inset-0.z-40"
      );
      return Boolean(overlay);
    });

    await page.screenshot({ path: `qa/shots/${shot}.png` });
    console.log(`${label}: modal open = ${open ? "YES" : "NO"}`);

    // close: click the backdrop / press Escape / click a close control
    await page.keyboard.press("Escape").catch(() => {});
    await sleep(300);
    const closeBtn = page
      .locator("button:has(svg.lucide-x), button:has(svg.lucide-x-circle)")
      .first();
    if (await closeBtn.count()) {
      await closeBtn.click({ timeout: 5000 }).catch(() => {});
    } else {
      await page.mouse.click(6, 6).catch(() => {});
    }
    await sleep(600);
  }

  await openAndClose("Apply Now", "Apply Now", "modal-apply");
  await openAndClose("Brochure", "Brochure", "modal-brochure");
  await openAndClose("Counselor Help", "Counselor Help", "modal-counselor");
  await openAndClose("Track Status", "Track Status", "modal-track");

  console.log("console errors:", errors.length ? errors.join(" ;; ") : "none");
  await browser.close();
})();
