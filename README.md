# Pastebin Lite

A lightweight Pastebin-like web application that allows users to create text pastes, generate shareable links, and view content via those links. Pastes can optionally expire based on time (TTL) or number of views.

This project was built as a backend-focused take-home assignment and is designed to pass automated evaluation.

---

## Live Deployment

Frontend
[https://pastebin-lite-6mn3.vercel.app/](https://pastebin-lite-6mn3.vercel.app/)

Backend API
[https://pastebin-lite-omega.vercel.app/](https://pastebin-lite-omega.vercel.app/)

Health Check
[https://pastebin-lite-omega.vercel.app/api/healthz](https://pastebin-lite-omega.vercel.app/api/healthz)

---

## Features

* Create a text paste
* Generate a unique, shareable URL
* View paste content via API or HTML page
* Optional expiry mechanisms

  * Time-based expiry (TTL in seconds)
  * View-count limit
* Persistent storage using PostgreSQL
* Deterministic time support for automated tests

---

## Tech Stack

Backend

* Node.js
* Express.js
* PostgreSQL (Neon)
* Prisma ORM

Frontend

* React (Vite)
* Axios
* React Router

---

## API Endpoints

Health Check
GET /api/healthz

Response:

```json
{ "ok": true }
```

---

Create Paste
POST /api/pastes

Request body:

```json
{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}
```

Response:

```json
{
  "id": "string",
  "url": "https://pastebin-lite-6mn3.vercel.app/p/<id>"
}
```

---

Fetch Paste (API)
GET /api/pastes/:id

Response:

```json
{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

Returns HTTP 404 if:

* Paste does not exist
* Paste has expired
* View limit is exceeded

---

View Paste (HTML)
GET /p/:id

* Returns an HTML page displaying paste content
* Content is rendered safely (no script execution)
* Returns HTTP 404 if unavailable

---

## Deterministic Time Testing

When the backend environment variable below is set:

```
TEST_MODE=1
```

The backend will use the request header:

```
x-test-now-ms: <milliseconds since epoch>
```

as the current time only for expiry calculations.
This enables deterministic automated testing.

---

## Persistence Layer

* PostgreSQL hosted on Neon
* Prisma ORM used for schema definition, migrations, and database access
* Data persists across requests and server restarts
* No in-memory storage is used

---

## Running Locally

Prerequisites

* Node.js (18+ recommended)
* PostgreSQL database (Neon or equivalent)

---

Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>
TEST_MODE=0
```

Run migrations and start server:

```bash
npx prisma migrate dev
npm run dev
```

Backend runs at:

```
http://localhost:3000
```

---

Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## Project Structure

```
pastebin-lite/
 ├─ backend/
 │   ├─ src/
 │   ├─ prisma/
 │   ├─ .env.example
 │   └─ package.json
 ├─ frontend/
 │   ├─ src/
 │   ├─ .env.example
 │   └─ package.json
 └─ README.md
```

---

## Design Decisions

* PostgreSQL and Prisma were chosen for reliability and persistence
* Express is used for explicit routing and predictable API behavior
* The UI is intentionally minimal, as backend behavior is the primary evaluation focus
* Environment variables are used to avoid hardcoded URLs or secrets
* The classic JSX runtime is used for stability across environments

---

## Deployment

* Backend deployed on Vercel
* Frontend deployed on Vercel
* PostgreSQL hosted on Neon
* Environment variables configured via the Vercel dashboard
* No manual database steps required post-deployment

---

## Status

* Functional requirements implemented
* Persistence layer implemented
* TTL and view-count expiry supported
* Deterministic testing supported
* Deployed and submission-ready

---

## Submission Links

Frontend
[https://pastebin-lite-6mn3.vercel.app/](https://pastebin-lite-6mn3.vercel.app/)

Backend
[https://pastebin-lite-omega.vercel.app/](https://pastebin-lite-omega.vercel.app/)

Repository
[https://github.com/parbatikumari08/Pastebin-Lite]
