# Quiz App Frontend

A React-based quiz application frontend for the Quiz App project.

## Features

- User login and signup
- Quiz taking experience
- Profile page with attempt history
- Admin dashboard for questions, users, and feedback
- Admin CSV question upload

## Project Structure

- src/components - reusable UI components
- src/pages - app pages such as Home, Quiz, Profile, Admin
- src/utils - API helpers and storage utilities

## Prerequisites

- Node.js 18+ installed
- npm or yarn

## Installation

```bash
npm install
```

## Running the Frontend

```bash
npm start
```

The app will open at:

```text
http://localhost:3000
```

## Environment Variables

Create a `.env` file in the project root if needed:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Backend Connection

This frontend expects the backend to be running at:

```text
http://localhost:5000/api
```

## Notes

- Admin features require a valid admin account on the backend
- Questions uploaded from the admin dashboard are stored in the backend database
