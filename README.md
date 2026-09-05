# Cinemify

A full-stack OTT (streaming) platform.

- **Backend**: Express.js REST API + MySQL (via Sequelize)
- **Frontend**: React (Vite) with a Netflix-style browse/watch UI
- **Auth**: JWT, with `user` and `admin` roles

## Features

- Email/password auth (register, login, JWT sessions)
- Browse movies and series, filter by genre/type, search by title
- Movie playback and per-episode playback for series
- Personal watchlist ("My List")
- Admin dashboard: create/edit/delete titles, manage genres, manage episodes

## Project layout

```
cinemify/
  backend/    Express API (port 5000)
  frontend/   React app (port 5173)
```

## Setup

### 1. Database

Create a MySQL database:

```sql
CREATE DATABASE cinemify;
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in your MySQL credentials and a JWT secret
npm install
npm run dev             # starts on http://localhost:5000, auto-creates tables
npm run seed             # optional: adds demo genres/movies/series + an admin user
```

Seeded admin login: `admin@cinemify.com` / `admin123`

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # points VITE_API_URL at the backend
npm install
npm run dev             # starts on http://localhost:5173
```

Open http://localhost:5173, register a user (or sign in as the seeded admin) and browse.

## API overview

| Method | Endpoint                                | Description                        | Auth        |
|--------|------------------------------------------|-------------------------------------|-------------|
| POST   | /api/auth/register                       | Create account                      | -           |
| POST   | /api/auth/login                          | Login                               | -           |
| GET    | /api/auth/me                             | Current user                        | User        |
| GET    | /api/content                             | List/search/filter content          | -           |
| GET    | /api/content/:id                         | Content detail (+ episodes/genres)  | -           |
| POST   | /api/content                             | Create title                        | Admin       |
| PUT    | /api/content/:id                         | Update title                        | Admin       |
| DELETE | /api/content/:id                         | Delete title                        | Admin       |
| POST   | /api/content/:id/episodes                | Add episode (series)                | Admin       |
| DELETE | /api/content/:id/episodes/:episodeId     | Delete episode                      | Admin       |
| GET    | /api/genres                              | List genres                         | -           |
| POST   | /api/genres                              | Create genre                        | Admin       |
| DELETE | /api/genres/:id                          | Delete genre                        | Admin       |
| GET    | /api/watchlist                           | Current user's watchlist            | User        |
| POST   | /api/watchlist/:contentId                | Add to watchlist                    | User        |
| DELETE | /api/watchlist/:contentId                | Remove from watchlist               | User        |

Video/poster/trailer fields are plain URLs (no file upload or transcoding pipeline) — point them at any hosted video/image, e.g. an S3/CDN URL.
# cinemify-in
