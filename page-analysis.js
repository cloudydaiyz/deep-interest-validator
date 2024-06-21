const classifyArticleTitles = require("./classify.js");

// Verifies that the articles are in order, and like interesting articles
async function analyzePage(page, pageStats) {
  // Get the table that's the main body of the page
  const table = await page.getByRole('table').nth(2);

  // Get the direct child rows of the table
  const rows = await table.locator('tbody > tr').all();

  // Get the age for each of the articles in order from the child rows
  const mayLike = [];
  for(let i = 0; i < 30 && pageStats.articlesChecked < 100; i++) {
    const titleRow = rows[3*i];
    const ageRow = rows[1 + 3*i];

    // Check if the time this article was published is in order
    const age = await ageRow.locator('span.age a').innerText();
    const minutes = convertAgeStringToMinutes(age);
    if(minutes < pageStats.prevMinutes) {
      pageStats.inOrder = false;
    }
    pageStats.prevMinutes = minutes;

    // Push this article to the list of articles that may be liked
    const upVoteBtn = await titleRow.locator('a.clicky');
    const articleTitle = await titleRow.locator('.titleline > a').innerText();

    // Check whether the upVoteBtn has already been clicked or not
    const upVoteBtnClass = await upVoteBtn.getAttribute('class');
    const upVoteBtnClicked = upVoteBtnClass
      .split(' ')
      .findIndex((token) => token == 'nosee') > -1 
      ? true : false;
    
    // Push this article to the list of articles that may get liked
    mayLike.push({
      title: articleTitle,
      btn: upVoteBtn,
      clicked: upVoteBtnClicked
    });

    pageStats.articlesChecked++;
  }

  // Upvote only the articles that are interesting
  const titles = mayLike.map((items) => items.title);
  const classifications = await classifyArticleTitles(titles);
  for(let i = 0; i < classifications.classifications.length; i++) {
    const interest = classifications.classifications[i].prediction;
    if(interest == 'interesting') {
      mayLike[i].interesting = true;
      if(!mayLike[i].clicked) {
        await mayLike[i].btn.click();
      }
    } else {
      mayLike[i].interesting = false;
    }
  }

  return mayLike;
}

// Logs in to HackerNews using the specified username and password
async function loginToHackerNews(page, username, password) {
  // Go to the login page
  safeGoto(page, 'https://news.ycombinator.com/login?goto=newest');

  const forms = await page.locator('form').all();
  const form = forms[0];

  const usernameForm = await form.locator('[name="acct"]');
  const passwordForm = await form.locator('[name="pw"]');
  const loginButton = await form.locator('[type="submit"]');

  // await page.waitForTimeout(1000);
  await usernameForm.fill(username);
  await passwordForm.fill(password);
  await loginButton.click();
}

async function safeGoto(page, url) {
  await page.waitForTimeout(500);
  await page.goto(url);
  
  // Retry if blocked
  const checkForBlocked = await page
    .locator(`:text("Sorry, we're not able to serve your requests this quickly.")`)
    .count();
  if(checkForBlocked > 0) {
    await page.waitForTimeout(500);
    await page.goto(url);
  }
}

// Converts the string age of an article to minutes and returns it as a number
// e.g. convertAgeStringToMinutes("4 minutes ago") returns 4
// e.g. convertAgeStringToMinutes("4 hours ago") returns 240
// Only does "x minutes ago" and "x hours ago"
function convertAgeStringToMinutes(ageString) {
  let quantity;
  let endIndex;
  let multiplier = 1;

  const minutesEndIndex = ageString.indexOf(' minutes ago') > 0 ? 
    ageString.indexOf(' minutes ago') : ageString.indexOf(' minute ago');
  const hoursEndIndex = ageString.indexOf(' hours ago') > 0 ? 
    ageString.indexOf(' hours ago') : ageString.indexOf(' hour ago');
  
  if(minutesEndIndex > -1) {
    endIndex = minutesEndIndex;
  } else if(hoursEndIndex > -1) {
    endIndex = hoursEndIndex;
    multiplier = 60;
  } else {
    return -1;
  }

  quantity = Number(ageString.substring(0, endIndex));
  if(isNaN(quantity)) quantity = 0;
  return quantity * multiplier;
}

// Tests the analyzePage function
async function analyzePageTest(page) {
  await loginToHackerNews(page, "kyland03-test", "kylanduncan");

  const pageStats = {
    articlesChecked: 0,
    inOrder: true,
    prevMinutes: 0
  };

  const results = await analyzePage(page, pageStats);
  const sentiment = results.map((result) => result.interesting);
  const numInterestingArticles = sentiment.reduce(
    (accumulator, currentValue) => currentValue ? ++accumulator : accumulator, 
    0
  );

  return numInterestingArticles;
}

module.exports = { analyzePage, loginToHackerNews, safeGoto, analyzePageTest };