# StudyNest M2 Content Library

Yugandhar Varma Vegesna — Group 6

Content Library component with Angular, Express, and MongoDB CRUD.
This folder is the working base for group integration.
Flashcards, Assignment Manager, and shared navigation still need integration.

## Requirements

- Node.js and npm
- MongoDB running locally on port 27017
- Install the frontend and backend dependencies separately

## Start the backend

From this project folder:

```bash
cd server
npm ci
node server.js
```

The backend runs at http://localhost:3000.
The default database is mongodb://127.0.0.1:27017/studynest.
Materials are stored in the materials collection.

An optional MONGODB_URI environment variable overrides the connection.
Do not commit credentials or local .env files.

## Start the frontend

Open another terminal in this project folder:

```bash
npm ci
npx ng serve
```

Open http://localhost:4200.

## Features

- Create a material with a title, course, and content
- Read saved materials
- Edit and update materials
- Delete materials with confirmation

## Verification completed

- Production build passed
- MaterialService creation test passed
- Create, Read, Update, and Delete tested through the browser
- Updated data remained after refreshing
- Deleted data stayed deleted after refreshing