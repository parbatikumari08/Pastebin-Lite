Pastebin-Lite

A lightweight Pastebin-like web application that allows users to create text pastes, generate shareable links, and view content via those links. Pastes can optionally expire based on time (TTL) or number of views.

This project was built as a backend-focused take-home assignment and is designed to pass automated tests.

Features

Create a text paste

Generate a unique, shareable URL

View paste content via API or HTML page

Optional constraints:

Time-based expiry (TTL)

View-count limit

Persistent storage using PostgreSQL

Deterministic time support for automated testing

Tech Stack
Backend

Node.js

Express.js

PostgreSQL (Neon)

Prisma ORM

Frontend

React (Vite)

Axios

React Router

API Endpoints
Health Check
GET /api/healthz


Response:

{ "ok": true }

Create Paste
POST /api/pastes


Request body:

{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}


Response:

{
  "id": "string",
  "url": "https://your-app-domain/p/<id>"
}

Fetch Paste (API)
GET /api/pastes/:id


Response:

{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}


Returns HTTP 404 if:

Paste does not exist

Paste has expired

View limit is exceeded

View Paste (HTML)
GET /p/:id


Returns HTML containing paste content

Returns 404 if unavailable

Content is rendered safely (no script execution)

Deterministic Time Testing

If the environment variable below is set:

TEST_MODE=1


The backend will treat the request header:

x-test-now-ms: <milliseconds since epoch>


as the current time for expiry logic only.
This enables deterministic automated testing.

Persistence Layer

This application uses PostgreSQL as the persistence layer, hosted on Neon (free tier).

Prisma ORM is used for schema definition and migrations

Data persists across requests and server restarts

No in-memory storage is used

Running the Project Locally
Prerequisites

Node.js (18+ recommended)

PostgreSQL database (Neon or equivalent)

Backend Setup
cd backend
npm install


Create .env:

DATABASE_URL=postgresql://<username>:<password>@<host>/<db>
PORT=3000


Run migrations and start server:

npx prisma migrate dev
npm run dev


Backend runs on:

http://localhost:3000

Frontend Setup
cd frontend
npm install


Create .env:

VITE_API_URL=http://localhost:3000/api


Start frontend:

npm run dev


Frontend runs on:

http://localhost:5173

Project Structure
pastebin-lite/
 ├─ backend/
 │   ├─ src/
 │   ├─ prisma/
 │   └─ package.json
 ├─ frontend/
 │   ├─ src/
 │   └─ package.json
 └─ README.md

Design Decisions

PostgreSQL + Prisma chosen for reliability, schema enforcement, and persistence across serverless requests

Express used for explicit routing and predictable API behavior

Minimal UI by design; automated tests focus on backend correctness

Environment variables used to avoid hardcoded URLs or secrets

Classic JSX runtime used for stability across environments

Deployment Notes

Backend can be deployed to Vercel, Render, or Railway

Frontend can be deployed to Vercel

Environment variables must be configured on the hosting platform

No manual database migrations or shell access required after deployment

