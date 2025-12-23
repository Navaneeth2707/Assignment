require("dotenv").config();
const axios = require("axios");

async function fetchRelatedLinks(title) {
  const { data } = await axios.get("https://serpapi.com/search", {
    params: {
      q: title,
      engine: "google",
      api_key: process.env.SERP_API_KEY,
      num: 3
    }
  });
 // console.log(data.organic_results);
  return data.organic_results
    ? data.organic_results.map(r => r.link)
    : [];
}

module.exports = fetchRelatedLinks;
