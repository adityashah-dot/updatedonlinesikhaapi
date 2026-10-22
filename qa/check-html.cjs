const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto("http://localhost:3000/colleges/lovely-professional-university-online", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(1200);

  const t = await page.evaluate(() => {
    const text = [...document.querySelectorAll("section")]
      .map((x) => x.textContent)
      .join(" ");
    return {
      hasTags: text.includes("<p>") || text.includes("</p>") || text.includes("&nbsp;"),
      snippet: (text.match(/.{0,40}Lovely Professional University Online is.{0,140}/) || [""])[0],
    };
  });

  console.log("raw HTML still visible:", t.hasTags);
  console.log("snippet:", t.snippet);

  await page.screenshot({ path: "qa/shots/new-college.png" });
  await browser.close();
})();
