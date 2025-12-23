🚀 Features

✅ Scrapes last 5 oldest blog articles from BeyondChats

✅ Cleans and normalizes scraped text

✅ Stores data in SQLite

✅ RESTful CRUD APIs

✅ One-click refresh scrape endpoint

✅ Batch replace API

✅ CORS enabled (frontend ready)

🛠 Tech Stack

Node.js

Express.js

SQLite3

Axios (HTTP requests)

Cheerio (HTML parsing)

CORS

📂 Project Structure
.
├── db.js            # SQLite DB initialization
├── scraper.js       # Blog scraping logic
├── server.js        # Express server + APIs
├── articles.db      # SQLite database (auto-created)
├── package.json
└── README.md

🧱 Database Schema

Table: articles

Column	Type	Description
id	INTEGER	Primary key
title	TEXT	Article title
content	TEXT	Article content
source_url	TEXT	Original blog URL
is_updated	INTEGER	0 = false, 1 = true
created_at	DATETIME	Auto timestamp
📦 Installation
git clone https://github.com/your-username/beyondchats-scraper.git
cd beyondchats-scraper
npm install

▶️ Run the Server
node server.js


Server will start at:

http://localhost:4000

🔄 Scrape & Initialize Data
Scrape oldest 5 blogs and refresh DB
GET /scrape-init


What it does:

Deletes existing articles

Scrapes oldest 5 blog posts

Inserts fresh data

Response

{
  "message": "Old articles deleted. Fresh articles inserted.",
  "count": 5
}

📡 API Endpoints
➤ Get All Articles
GET /api/articles

➤ Get Article by ID
GET /api/articles/:id

➤ Create Article
POST /api/articles


Body

{
  "title": "Sample Title",
  "content": "Sample Content",
  "source_url": "https://example.com"
}

➤ Update Article
PUT /api/articles/:id


Body

{
  "title": "Updated Title",
  "content": "Updated Content",
  "is_updated": 1
}

➤ Delete Article
DELETE /api/articles/:id

➤ Replace All Articles (Batch)
POST /api/articles/replace-all


Body

{
  "articles": [
    {
      "title": "Title 1",
      "content": "Content 1",
      "source_url": "https://example.com",
      "is_updated": true
    }
  ]
}
