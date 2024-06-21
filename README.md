# deep-interest-validator
![Static Badge](https://img.shields.io/badge/version-1.0-blue)

Welcome to the Deep Interest Validator!

This program logs in to [HackerNews](https://news.ycombinator.com/news) using the credentials that you specify, and validate that the first several articles are properly sorted using [Playwright](https://playwright.dev/). In addition to this, among those articles, articles that are considered "deeply interesting" are upvoted using the account credentials that you give.

My program uses [Cohere](https://cohere.com/) in order to classify articles as deeply interesting. For a more "formal" definition, look at HackerNews' definition of a deeply  interesting article:
https://news.ycombinator.com/newswelcome.html#:~:text=A%20crap%20link,to%20be%20quieter.

You may notice that I have delays in some places throughout the code:

`await page.waitForTimeout(1000);`

This is because sending requests to HackerNews too fast causes the website to block your traffic, as seen in `images/blocked.png`.
 
Finally, I have some tests for my program and HackerNews website in `tests/index.test.js`.
 
Have fun!

## How to run
This program requires a couple of environment variables to be set:
- `DIV_HACKER_NEWS_USERNAME` - username of your HackerNews account
- `DIV_HACKER_NEWS_PASSWORD` - password of your HackerNews account
- `DIV_COHERE_API_KEY` - an API key of your Cohere account
    - To get your own Cohere API key, [create a Cohere account](https://dashboard.cohere.com/welcome/login) and [navigate to API keys](https://dashboard.cohere.com/api-keys).

Make sure that you have Node.js installed in order to run this program. First, call `npm install` to install the required modules.

From there, you have a couple of options:
- Run `npm start` to run the main program
- Run `npm test` to run the tests

## For the future
If I want to continue this project in the future, I would add:
- support for the `analyze page` test
- functionality to automatically create a new HackerNews account

## Technology used
Programming language(s): JavaScript

Libraries / Frameworks: Playwright, Cohere

<img src="images/node-js.svg" alt="Node.js logo" width="50" height="50"> <img src="images/playwright-logo.svg" alt="Playwright logo" width="50" height="50"> <img src="images/cohere-logo.png" alt="Cohere logo" width="50" height="50">
