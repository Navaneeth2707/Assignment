const axios = require("axios");

const BASE_URL = process.env.NODE1_BASE_URL;

async function fetchArticles() {
  const { data } = await axios.get(`${BASE_URL}/api/articles`);
  return data;
}

module.exports = fetchArticles;
