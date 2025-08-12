# Library Management System (Updated)

Fullstack sample project:
- Frontend: React (Vite) + HTML + CSS (in `frontend/`)
- Backend: Java Spring Boot + Spring Data JPA (Hibernate) (in `backend/`)
- Database: MySQL (schema in `db/schema.sql`)

## New features
- Book search by title/author/ISBN (`/api/books/search?q=...`).
- Borrow records tracked with user's phone and email; list at `/api/borrow/records`.
- Frontend: multiple pages (Home/Add/Borrow/Records) using React Router, colored UI and SVG background.
- Overdue highlighting for borrow records older than 14 days.

See previous README content for run instructions.
