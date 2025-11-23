# TinyLink - URL Shortener

A simple and efficient URL shortener service built with Express.js, Neon Postgres, and vanilla JavaScript.

## ScreenShots

<img width="457 " height="300" alt="Screenshot 2025-11-23 174933" src="https://github.com/user-attachments/assets/bf52633e-14a1-44f6-8b46-551dfa0b706f" />
<img width="457" height="300" alt="Screenshot 2025-11-23 174947" src="https://github.com/user-attachments/assets/a01e2a51-00e2-495a-bd5f-567a8525a217" />

<img width="460" height="300" alt="image" src="https://github.com/user-attachments/assets/e9b0ff32-0e03-472f-896d-1c043a5961d8" />


## Features

- Shorten long URLs with custom or auto-generated codes
- Track click statistics for each short link
- View detailed analytics (clicks, last clicked timestamp)
- Search and sort links
- Delete links
- Responsive design
- Real-time click tracking

## Tech Stack

**Backend:**
- Node.js with Express.js
- Neon Postgres (Database)
- ES6 Modules

**Frontend:**
- HTML5
- CSS3 (Vanilla CSS with CSS Variables)
- JavaScript (Vanilla JS with Fetch API)

## API Endpoints
Base URL: http://localhost:3000

1. GET /healthz :-  Health Check
2. POST /api/links :- Create a new short link
        - { "targetUrl": "https://anylink.com", "code": "mylink12" }
3. GET /api/links:- Get all links
4. GET /api/links/:code :- Get link stats
5. DELETE /api/links/:code ;- Delete a link
6. GET /:code :- Redirect to target URL

## Database Schema
CREATE TABLE links (
id SERIAL PRIMARY KEY,
code VARCHAR(8) UNIQUE NOT NULL,
target_url TEXT NOT NULL,
clicks INTEGER DEFAULT 0,
last_clicked_at TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

