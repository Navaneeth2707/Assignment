# Phase 1 – Article Scraping & CRUD API
BeyondChats Assignment

## Objective
- Scrape the 5 oldest articles from the BeyondChats blog
- Store articles in a database
- Provide CRUD APIs to manage articles

## Tech Stack
- Backend: Node.js + Express
- Database: SQLite
- Scraping: Axios + Cheerio
- API: REST (JSON)

Note:
The assignment mentions Laravel, but Node.js was used to reduce context switching.
The same structure can be implemented in Laravel if required.

## Project Structure
phase1-node/
- server.js
- scraper.js
- db.js
- articles.db
- package.json
- README.md

## Scraping Source
https://beyondchats.com/blogs

## Scraping Logic
1. Fetch the blog page
2. Detect pagination and find the last page
3. Traverse backwards to get the oldest articles
4. Scrape exactly 5 articles
5. Extract title and full content

## Database Schema
articles
id INTEGER PRIMARY KEY
title TEXT
content TEXT
source_url TEXT
is_updated INTEGER DEFAULT 0
created_at DATETIME

## Scrape Initialization API
GET /scrape-init

Deletes old articles and inserts fresh oldest articles.

Response:
{
  "message": "Old articles deleted. Fresh articles inserted.",
  "count": 5
}

## API Endpoints

GET /api/articles  
GET /api/articles/:id  

POST /api/articles
{
  "title": "Sample Title",
  "content": "Article body",
  "source_url": "https://example.com"
}

PUT /api/articles/:id
{
  "title": "Updated Title",
  "content": "Updated content",
  "is_updated": 1
}

DELETE /api/articles/:id  
DELETE /api/articles  

POST /api/articles/replace-all
{
  "articles": [
    {
      "title": "Title",
      "content": "Body",
      "source_url": "URL",
      "is_updated": false
    }
  ]
}

## Local Setup
Node.js 18+

npm install  
npm start  

Server runs at:
http://localhost:4000

## Design Decisions
- Node.js used instead of Laravel for faster development
- SQLite for simple local setup
- Manual scrape trigger
- No authentication

## Limitations
- No pagination
- No validation
- No authentication
- Scraper depends on current site structure

## Phase 1 Status
Scraping completed  
Database working  
CRUD APIs ready  
Phase 2 ready


NOTE:
## ⚠️ Technology Deviation Note

> **Important**

> The original assignment specifies a **Laravel-based backend**.

> Due to time constraints and to avoid context switching between multiple backend frameworks, the backend APIs were implemented using **Node.js (Express)** instead.

> This decision allowed me to:

> - Reuse scraping logic and shared utilities  
> - Maintain a single JavaScript runtime across the system  
> - Focus more on the core data pipeline, LLM integration, and overall system design  

> The **API structure, data models, and responsibilities** remain equivalent to a Laravel implementation, and the same architecture can be **directly translated to Laravel controllers and Eloquent models** if required.
