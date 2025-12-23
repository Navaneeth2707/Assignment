const express = require("express");
const cors = require("cors");
const db = require("./db");
const scrapeOldestArticles = require("./scraper");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- SCRAPE INIT ---------------- */
/* ---------------- SCRAPE INIT (REFRESH DATA) ---------------- */
app.get("/scrape-init", async (req, res) => {
  try {
    const articles = await scrapeOldestArticles();

    db.serialize(() => {
      // 1️⃣ Delete old data
      db.run("DELETE FROM articles", err => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // 2️⃣ Insert fresh data
        const stmt = db.prepare(
          `INSERT INTO articles (title, content, source_url) VALUES (?, ?, ?)`
        );

        articles.forEach(article => {
          stmt.run(article.title, article.content, article.url);
        });

        stmt.finalize();

        // 3️⃣ Respond success
        res.json({
          message: "Old articles deleted. Fresh articles inserted.",
          count: articles.length
        });
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ---------------- CRUD APIs ---------------- */

// GET all articles
app.get("/api/articles", (req, res) => {
    console.log("okok11")
  db.all("SELECT * FROM articles", [], (err, rows) => {
    res.json(rows);
  });
});

// GET article by ID
app.get("/api/articles/:id", (req, res) => {
  db.get(
    "SELECT * FROM articles WHERE id = ?",
    [req.params.id],
    (err, row) => res.json(row)
  );
});

// CREATE article
app.post("/api/articles", (req, res) => {
    console.log("okok111")
  const { title, content, source_url } = req.body;
  console.log("okok1")
  db.run(
    `INSERT INTO articles (title, content, source_url) VALUES (?, ?, ?)`,
    [title, content, source_url],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

// UPDATE article
app.put("/api/articles/:id", (req, res) => {
  const { title, content, is_updated } = req.body;
  console.log("okok")
  db.run(
    `UPDATE articles SET title=?, content=?, is_updated=? WHERE id=?`,
    [title, content, is_updated, req.params.id],
    
    () => res.json({ updated: true })
  );
});

// DELETE article
app.delete("/api/articles/:id", (req, res) => {
    console.log("okokdd")
  db.run(
    "DELETE FROM articles WHERE id=?",
    [req.params.id],
    () => res.json({ deleted: true })
  );
});
// DELETE all + INSERT new (BATCH REPLACE)
app.post("/api/articles/replace-all", (req, res) => {
  const articles = req.body.articles;

  if (!Array.isArray(articles)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  db.serialize(() => {
    db.run("DELETE FROM articles");

    const stmt = db.prepare(
      `INSERT INTO articles (title, content, source_url, is_updated)
       VALUES (?, ?, ?, ?)`
    );

    articles.forEach(a => {
      stmt.run(
        a.title,
        a.content,
        a.source_url,
        a.is_updated ? 1 : 0
      );
    });

    stmt.finalize();

    res.json({
      message: "Articles replaced successfully",
      count: articles.length
    });
  });
});


app.listen(4000, () =>
  console.log("🚀 Server running on http://localhost:4000")
);
