import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const fetchArticles = () => API.get("/articles");
export const fetchArticleById = (id) => API.get(`/articles/${id}`);
