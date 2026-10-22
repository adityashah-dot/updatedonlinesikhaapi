const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const msgs = [];

  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") {
      msgs.push(`[${m.type()}] ${m.text().slice(0, 900)}`);
    }
  });
  page.on("pageerror", (e) => msgs.push("[pageerror] " + e.message.slice(0, 900)));

  await page.goto("http://localhost:3000/universities", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  msgs.forEach((m) => console.log(m + "\n---"));
  await browser.close();
})();
