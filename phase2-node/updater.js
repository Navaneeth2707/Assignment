const axios = require("axios");

const BASE_URL = process.env.NODE1_BASE_URL;

async function updateArticle(id, payload) {
  await axios.put(`${BASE_URL}/api/articles/${id}`, payload);
}

module.exports = updateArticle;
