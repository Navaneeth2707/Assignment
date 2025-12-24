# Phase 3 – React Frontend (Article Viewer & Admin Panel)
BeyondChats Assignment

## Objective
- Build a React-based frontend
- Fetch articles from backend APIs
- Display AI-updated articles in a clean UI
- Provide an admin panel to control the pipeline

Admin panel allows:
- Extracting original articles
- Triggering AI enrichment
- Monitoring progress
- Managing article lifecycle

This phase focuses on user experience and system integration.

## Tech Stack
- Frontend: React (Vite)
- Routing: React Router
- Styling: Tailwind CSS
- API Client: Axios
- State Management: React Hooks

## Project Structure
frontend/
- src/
  - api/
    - articles.js
  - pages/
    - BlogList.jsx
    - BlogDetails.jsx
    - Admin.jsx
  - App.jsx
  - main.jsx
- README.md

## Application Overview
[User]
  |
  v
[React UI]
  |
  v
[Node Backend APIs]
  |
  v
[AI Worker + Database]

The frontend works as:
- Public blog viewer
- Internal admin dashboard

## API Integration
All API calls are centralized using Axios.

Base URL:
http://localhost:4000/api

APIs Used:
GET /articles  
GET /articles/:id  
DELETE /articles  
GET /scrape-init  
GET http://localhost:5000/scrape-enrich-organize  

## Pages & Features

### Blog List Page (/)
Purpose:
- Display only AI-updated articles

Behavior:
- Filters articles where is_updated === 1
- Shows message if no updated articles exist
- Responsive card-based layout

### Blog Details Page (/blog/:id)
Purpose:
- Display full article content

Features:
- Clean typography
- Preserves paragraph formatting
- Link to original source
- Handles page refresh via API

### Admin Panel (/admin)
Main control panel for the system.

Step 1: Extract Blogs
- Triggers backend /scrape-init
- Displays extracted article titles
- Allows review before AI processing

Step 2: Improve & Publish
- Triggers AI enrichment pipeline
- Shows progress indicator
- Displays rotating status messages
- Polls backend until all articles are updated
- Redirects to blog list on success

Clear All Articles
- Deletes all articles
- Resets system safely

## UX & Feedback
To handle long-running AI tasks:
- Loading spinners
- Step-based progress indicators
- Human-readable status messages
- Actions disabled during processing

This prevents a black-box user experience.

## Local Setup
Prerequisites:
- Node.js 18+
- Backend running at http://localhost:4000
- AI Worker running at http://localhost:5000

Install dependencies:
npm install

Start frontend:
npm run dev

App runs at:
http://localhost:5173

## Design Decisions
- Client-side filtering to show only updated articles
- Polling instead of WebSockets for simplicity
- Admin panel included in same app
- React Hooks used instead of Redux

## Limitations
- No authentication or roles
- Admin panel is public
- No pagination
- No error boundary UI
- Text-only rendering

## Future Improvements
- Add authentication for admin routes
- Add pagination and search
- Render rich markdown or HTML
- Replace polling with WebSockets
- Add skeleton loaders
