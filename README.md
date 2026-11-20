# Backend Practical – A1 & A2

**Student Name:** Anurag Gupta  
**Registration ID:** PIET24CD007  
**Project:** Backend Development Practical

## Project Overview

This repository contains two backend development practical tasks using Node.js, Express.js and MongoDB.

### A1 – Library Book Management API

A RESTful API for managing library books.

**Features:**
- Add a new book (POST)
- Get all books (GET)
- Get a book by ID (GET)
- Update book details (PUT)
- Delete a book (DELETE)
- MongoDB database integration using Mongoose
- Input validation and error handling
- Request logging middleware

**Book Schema:**
- title – String (Required)
- author – String (Required)
- price – Number (Minimum 1)
- category – String
- isAvailable – Boolean (Default: true)

### A2 – Student Portal with Login and Protected Routes

A secure student portal backend with authentication and authorization.

**Features:**
- Student and Admin registration
- Input validation using Joi
- Password hashing using bcrypt
- JWT-based authentication
- JWT token expiration after 1 hour
- Protected profile route
- Admin-only students route
- Helmet security middleware
- CORS configuration
- Rate limiting (100 requests per 15 minutes)

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript
- JWT
- bcryptjs
- Joi
- Helmet
- CORS
- express-rate-limit

## Project Structure

```text
backend_Practical_PIET24CD007_ANURAG_GUPTA/
│
├── file/
│   ├── A1.js
│   ├── A2.js
│   ├── server.js
│   ├── .env
│   ├── models/
│   │   └── Book.js
│   └── routes/
│       └── bookRoutes.js
│
├── outputs/
├── .gitignore
├── package.json
└── README.md
```

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Open the project folder:

```bash
cd backend_Practical_PIET24CD007_ANURAG_GUPTA
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file inside the `file` folder:

```env
MONGO_URI=mongodb://127.0.0.1:27017/libraryDB
JWT_SECRET=your_secret_key
```

Do not upload the `.env` file to GitHub.

## Run A1 – Library Book Management API

```bash
node file/A1.js
```

Server runs on:

```text
http://localhost:3000
```

Books API:

| Method | Endpoint | Description |
|---|---|---|
| POST | /books | Add book |
| GET | /books | Get all books |
| GET | /books/:id | Get book by ID |
| PUT | /books/:id | Update book |
| DELETE | /books/:id | Delete book |

## Run A2 – Student Portal API

```bash
node file/A2.js
```

Authentication API:

| Method | Endpoint | Description |
|---|---|---|
| POST | /register | Register student/admin |
| POST | /login | Login |
| GET | /profile | Get authenticated profile |
| GET | /students | Admin-only
