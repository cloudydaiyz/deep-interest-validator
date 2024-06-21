// Entry point for the program
const { chromium } = require("playwright");
const { analyzePage, loginToHackerNews, safeGoto, analyzePageTest } = require("./page-analysis.js");

// NOTE: You can replace these with your own HackerNews credentials!
const exampleUsername = process.env.DIV_HACKER_NEWS_USERNAME;
const examplePassword = process.env.DIV_HACKER_NEWS_PASSWORD;

async function saveHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await safeGoto(page, "https://news.ycombinator.com/newest");

  await loginToHackerNews(page, exampleUsername, examplePassword);

  // Keep track of data across pages
  const pageStats = {
    articlesChecked: 0,
    inOrder: true,
    prevMinutes: 0
  };

  while(pageStats.articlesChecked < 100) {
    await page.waitForTimeout(1000);

    // Verify that the articles are in order, and like interesting articles
    await analyzePage(page, pageStats);

    // Go to the next page
    const moreButton = await page.locator('.morelink');
    await moreButton.click();
  }

  if(pageStats.inOrder) {
    console.log('The articles are chronologically in order!');
  } else {
    console.log('The articles are NOT in order!');
  }

  browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();