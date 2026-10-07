#HABIT-TRACKER

A habit tracker and journal app built with the MERN stack. Users can sign up, log in, track tasks and daily logs, and write journal entries.

## Status

- Backend: complete
- Frontend: in progress

## Tech Stack

- MongoDB Atlas
- Express.js
- Node.js
- React (in progress)
- JWT authentication

## Features (Backend)

- User registration and login with JWT authentication
- CRUD APIs for tasks, daily logs, and journal entries
- Protected routes

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register a user |
| POST | /api/auth/login | Log in and receive a token |
| GET/POST | /api/tasks | Get or create tasks |
| PUT/DELETE | /api/tasks/:id | Update or delete a task |

<fix these to match your actual routes, and add dailylogs and journal>

## Setup

1. Clone the repo
```
   git clone https://github.com/<username>/<repo>.git
   cd <repo>/server
```
2. Install dependencies
```
   npm install
```
3. Create a `.env` file in `server/`
```
   MONGO_URI=<your MongoDB Atlas connection string>
   JWT_SECRET=<any random secret>
   PORT=5000
```
4. Start the server
```
   npm start
