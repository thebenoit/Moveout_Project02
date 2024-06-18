const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('response', response => {
    if (response.url().endsWith(""))
      console.log(response.url());
      // do something here
  });

  await page.goto("https://www.facebook.com/marketplace/montreal/search?minPrice=300&maxPrice=3000&minBedrooms=1&minBathrooms=1&minSqft=500&maxSqft=2000&daysSinceListed=7&query=2%20bedroom%20appartment&exact=false"); // Replace with the URL you want to scrape

  await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');

  await browser.close();
})();
