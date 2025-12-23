require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fetchArticles = require("./fetcher");
const scrapeContent = require("./scraper");
const fetchRelatedLinks = require("./serp");
const organizeWithGroq = require("./groq");
const updateArticle = require("./updater");

const app = express();
app.use(cors());

const PORT = 5000;

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

app.get("/scrape-enrich-organize", async (req, res) => {
  try {
    const articles = await fetchArticles();
    let updated = 0;

    for (const article of articles) {

      if (article.is_updated === 1) {
        console.log(`⏭️ Skipping: ${article.title}`);
        continue;
      }

      console.log(`🧠 Processing: ${article.title}`);

      const sourceContent = await scrapeContent(article.source_url);

      const links = await fetchRelatedLinks(article.title);
      let serpContent = "";

      for (const link of links) {
        serpContent += "\n" + (await scrapeContent(link));
      }

      const aggregatedContent = `
${article.content}

SOURCE CONTENT:
${sourceContent}

RELATED CONTENT:
${serpContent}
`;

      const organized = await organizeWithGroq(
        article.title,
        aggregatedContent
      );

      await updateArticle(article.id, {
        title: article.title,
        content: organized,
        is_updated: 1
      });

      updated++;
      await sleep(3000); // Groq-safe delay
    }

    res.json({
      message: "Groq AI enrichment completed",
      updated
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Groq processing failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AI Worker running on http://localhost:${PORT}`);
});
