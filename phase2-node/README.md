# Phase 2 – AI-Based Article Enrichment Pipeline
BeyondChats Assignment

## Objective
- Fetch articles from backend API
- Find related high-ranking articles using Google Search
- Scrape content from multiple sources
- Enrich and restructure content using an LLM
- Publish updated articles back to backend
- Ensure each article is processed only once

This phase focuses on automation, orchestration, and LLM constraints.

## Tech Stack
- Runtime: Node.js
- Worker API: Express
- Search: SerpAPI (Google Search)
- Scraping: Axios + Cheerio
- LLM: Groq (LLaMA 3.1)
- Communication: REST APIs

## Project Structure
phase2-node/
- server.js        # Orchestrates enrichment pipeline
- fetcher.js       # Fetches articles from backend
- scraper.js       # Scrapes article content
- serp.js          # Google Search via SerpAPI
- groq.js          # LLM orchestration with retries
- updater.js       # Updates articles via API
- package.json
- README.md



## Data Flow
1. Fetch articles from backend API
2. Skip articles where is_updated = 1
3. For each article:
   - Scrape original article
   - Search Google using article title
   - Scrape related articles
   - Aggregate all content
   - Send content to LLM
   - Publish updated article back to backend
4. Mark article as updated

## Worker Trigger API
GET /scrape-enrich-organize

Response:
{
  "message": "Groq AI enrichment completed",
  "updated": 3
}

## Google Search Integration
- Uses SerpAPI (no direct Google scraping)
- Searches using article title
- Fetches top 3 organic results

Why SerpAPI:
- Reliable
- Avoids bot detection
- Production-ready approach

## Content Scraping Strategy
- Scrapes all <p> tags
- Cleans whitespace
- Applies timeout and headers
- Skips failed URLs safely

Aggregated Content:
Original Article
+ Source Article
+ Related Articles

## LLM Processing
Model:
llama-3.1-8b-instant

LLM Tasks:
- Rewrite content in structured format
- Improve clarity and depth
- Remove duplication
- Avoid URLs and source mentions

Output Structure:
- Title
- Introduction
- Key Points
- Detailed Explanation
- Conclusion

## Rate Limiting & Reliability
Implemented safeguards:
- Global cooldown (8 seconds)
- API key rotation
- Input size limiting
- Reduced token usage
- Retry with exponential backoff on 429 errors

Designed to reflect real production constraints.

## Article Update Logic
PUT /api/articles/:id

Payload:
{
  "title": "<original title>",
  "content": "<llm generated content>",
  "is_updated": 1
}

Ensures:
- No duplicate processing
- Idempotency
- Clean separation of original vs enriched content

## Environment Variables
Create a .env file:

NODE1_BASE_URL=http://localhost:4000  
SERP_API_KEY=your_serpapi_key  
GROQ_API_KEY=your_groq_key  
GROQ_API_KEY1=optional_second_key  

## Local Setup
Node.js 18+

npm install  
npm start  

Worker runs at:
http://localhost:5000

Trigger pipeline:
GET http://localhost:5000/scrape-enrich-organize

## Design Decisions
- Node.js worker instead of Laravel jobs
- SerpAPI over raw Google scraping
- Global LLM cooldown for stability
- Text-only scraping to reduce token usage

## Limitations
- No queue system
- No parallel processing
- No citations yet
- Basic content extraction

## Future Improvements
- Redis + BullMQ queue
- Citation injection
- Improved HTML extraction
- Retry persistence
- Monitoring and logging

## Phase 2 Status
End-to-end automation completed  
Google search integrated  
Content scraping working  
LLM enrichment successful  
Rate-limit safe execution  
Backend update integrated
