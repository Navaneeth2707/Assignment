const axios = require("axios");
const cheerio = require("cheerio");

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function scrapeContent(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120"
      }
    });

    const $ = cheerio.load(data);
    let content = "";

    $("p").each((_, el) => {
      content += " " + $(el).text();
    });
     //  console.log(content);
    return cleanText(content);
  } catch {
    console.log(`⚠️ Scrape skipped: ${url}`);
    return "";
  }
}

module.exports = scrapeContent;
