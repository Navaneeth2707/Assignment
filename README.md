# BeyondChats – Full Stack AI Content Pipeline  
Engineering Assignment Submission

This repository contains a complete AI-powered content automation system built for the BeyondChats engineering assignment. The project demonstrates a real-world approach to scraping, managing, enriching, and publishing blog content using backend APIs, LLMs, and a modern frontend interface.

The system automatically scrapes the oldest blog articles from BeyondChats, stores them in a database, enriches the content using Google Search and Large Language Models, and displays the improved articles through a React-based frontend. An Admin panel is provided to control and monitor the entire pipeline.

The implementation intentionally prioritizes clarity, reliability, and practical engineering decisions over over-engineering.

---

## Technology Stack

Backend APIs are implemented using Node.js and Express.  
SQLite is used as the database for simplicity and portability.  
Axios and Cheerio are used for web scraping.  
SerpAPI is used for Google Search integration.  
Groq (LLaMA 3.1) is used for LLM-based content enrichment.  
The frontend is built using React and Tailwind CSS.  
All services communicate using REST APIs.

---

## Laravel Note

Although the assignment specified Laravel for the backend, Node.js (Express) was used due to time constraints and to avoid framework switching. The backend follows a clean REST-based structure with clear separation of concerns and equivalent data models. The same design can be directly mapped to Laravel controllers and Eloquent models if required.

---

## Repository Structure

beyondchats-assignment  
- phase1-node → Backend APIs and blog scraper  
- phase2-node → AI worker for search and LLM processing  
- frontend → React frontend and admin panel  
- README.md → Project documentation  

---

## Backend Scraping & APIs (Phase 1)

The backend is responsible for scraping the 5 oldest blog articles from BeyondChats and storing them in a SQLite database. It exposes REST APIs to create, read, update, and delete articles.

Available endpoints:

- GET /scrape-init  
- GET /api/articles  
- GET /api/articles/:id  
- POST /api/articles  
- PUT /api/articles/:id  
- DELETE /api/articles  

To run the backend:

```
cd phase1-node
npm install
npm start
The backend runs at http://localhost:4000.

To trigger scraping:

GET http://localhost:4000/scrape-init

AI Enrichment Worker (Phase 2)
The AI worker fetches articles from the backend, searches for related content using Google Search, scrapes reference articles, enriches the original content using an LLM, and publishes the updated articles back to the backend.

The enrichment process combines original content with contextual reference material, uses structured prompts, applies rate limiting, avoids duplicate processing, and updates only unprocessed articles to ensure predictable execution and controlled API usage.

Environment variables required (create a .env file inside phase2-node):

env
NODE1_BASE_URL=http://localhost:4000
SERP_API_KEY=your_serpapi_key
GROQ_API_KEY=your_groq_key
GROQ_API_KEY1=optional_secondary_key
To run the AI worker:


cd phase2-node
npm install
npm start
The worker runs at http://localhost:5000.

To trigger AI enrichment:

GET http://localhost:5000/scrape-enrich-organize

React Frontend (Phase 3)
The frontend displays AI-updated articles and provides an Admin panel to control the pipeline.


To run the frontend:

bash
Copy code
cd frontend
npm install
npm run dev
The frontend runs at http://localhost:5173.
```

#  Recommended Local Setup Order

- cd phase1-node && npm install && npm start
- cd phase2-node && npm install && npm start
- cd frontend && npm install && npm run dev
# Engineering Decisions
- Node.js was chosen over Laravel for faster delivery.
- SQLite was selected for simplicity.
- Polling was used instead of WebSockets to reduce complexity.
- Authentication was kept out of scope.
- Only text content is scraped to reduce LLM cost.

# These decisions were made intentionally under assignment constraints.

# Known Limitations
- No authentication or role-based access
- No background job queue
- No real-time updates
- No SEO optimization
- No citation rendering

# Future Improvements
- Laravel backend implementation
- Redis + BullMQ job queues
- WebSocket-based live progress updates
- Authentication and RBAC
- Monitoring and logging

