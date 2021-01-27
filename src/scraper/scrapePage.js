require("dotenv").config();
const puppeteer = require("puppeteer");

async function scrapePage(callback, options) {
  const { email, password, url } = options;

  // In dev mode launch the browser in headful mode with dev tools open
  const puppeteerOptions =
    process.env.NODE_ENV === "production" ? undefined : { devtools: true };

  console.log("Launching browser.");
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();

  console.log(`Navigating to ${url}`);
  await page.goto(url);

  await page.waitForSelector("#sso-login-submit", { visible: true });
  await page.click("#sso-login-submit");

  console.log("Logging in.");
  await page.waitForSelector("#userNameInput");
  await page.type("#userNameInput", email);
  await page.type("#passwordInput", password);
  await page.click("#submitButton");

  console.log("Waiting for page to load.");

  await waitForPageLoad(page);

  console.log("Page loaded, retrieving data.");

  // Page is loaded so pass control to the callback to implement scraping
  const result = await callback(page);

  if (process.env.NODE_ENV === "production") {
    // Keep the browser window open in dev mode
    await browser.close();
  }

  return result;
}

/**
 * Sets up an event listener that triggers when the page is loaded.
 * Returns a promise which resolves when the event fires.
 * @param {puppeteer.Page} page - The puppeteer page instance to wait for
 */
function waitForPageLoad(page) {
  return new Promise(resolve => {
    page.on("load", () => {
      resolve();
    });
  });
}

module.exports = scrapePage;
