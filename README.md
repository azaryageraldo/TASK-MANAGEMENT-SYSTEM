# Task Management System

Fullstack Application developed as a recruitment test for **NEXA**.

## Tech Stack

- **Backend:** Laravel 11, PHP 8.4
- **Frontend:** React, Vite, TailwindCSS
- **Database:** MySQL
- **Auth:** JWT (JSON Web Token)

## Features

- User Authentication (Register, Login, Logout)
- Task Management (Create, Read, Update, Delete)
- Filter Tasks by Status (To Do, In Progress, Done)
- Sort Tasks by Deadline
- Responsive UI

## Project Structure

- `backend/` - Laravel API
- `frontend/` - React Client
- `db.sql` - Database Dump (Not included, run migrations)

## Setup Instructions

### Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed.
2. Run the application:
   ```bash
   docker-compose up --build
   ```
3. Open http://localhost:5173 for Frontend.
4. Open http://localhost:8000 for Backend status.

Note: You might need to run migrations manually if the backend starts before the database is ready:

```bash
docker-compose exec backend php artisan migrate
```

### Backend (Manual)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Copy `.env` file:
   ```bash
   cp .env.example .env
   ```
4. Configure database in `.env`:
   - DB_DATABASE=task_management_system
   - DB_USERNAME=azaryageraldo
   - DB_PASSWORD=anes0709
5. Generate app key:
   ```bash
   php artisan key:generate
   ```
6. Generate JWT secret:
   ```bash
   php artisan jwt:secret
   ```
7. Run migrations:
   ```bash
   php artisan migrate
   ```
8. Start server:
   ```bash
   php artisan serve
   ```

### Frontend

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173

## API Documentation

See `postman_collection.json` (to be added) or check `backend/routes/api.php`.

## Dummy Account

- **Email:** user@example.com
- **Username:** user123
- **Password:** password123
