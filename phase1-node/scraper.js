const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://beyondchats.com/blogs";

function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
}

async function scrapeLastFiveBlogs() {
  const collected = [];

  const { data } = await axios.get(`${BASE_URL}/`);
  const $ = cheerio.load(data);

  const pageNumbers = $("a.page-numbers")
    .map((_, el) => parseInt($(el).text()))
    .get()
    .filter(n => !isNaN(n));

  const lastPage = Math.max(...pageNumbers);

  for (let page = lastPage; page >= 0; page--) {
    const pageUrl =
      page === 0
        ? `${BASE_URL}/`
        : `${BASE_URL}/page/${page}/`;

    const pageRes = await axios.get(pageUrl);
    const $$ = cheerio.load(pageRes.data);

    const pageArticles = [];

    $$("article").each((_, el) => {
      const title = cleanText($$(el).find("h2").text());
      const url = $$(el).find("a").attr("href");

      if (title && url) pageArticles.push({ title, url });
    });

    pageArticles.reverse();

    for (const article of pageArticles) {
      collected.push(article);
      if (collected.length === 5) break;
    }

    if (collected.length === 5) break;
  }

  for (const article of collected) {
    const articlePage = await axios.get(article.url);
    const $$$ = cheerio.load(articlePage.data);

    article.content = cleanText($$$("article").text());
  }

  return collected;
}

module.exports = scrapeLastFiveBlogs;
