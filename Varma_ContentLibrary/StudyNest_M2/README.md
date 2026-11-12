# StudyNest - Group 6 Milestone 2

An integrated Angular application with Flashcards, Assignment Manager,
and Content Library. All three features use one Express backend
and MongoDB database.

## Team

- Thoren Moore: Flashcards
- Trinity Miller: Assignment Manager
- Yugandhar Varma Vegesna: Content Library

## Project location

From the repository root, open:

Varma_ContentLibrary/StudyNest_M2

Run the commands below from this folder unless otherwise stated.

## Requirements

- Node.js 24 and npm
- MongoDB running locally on port 27017
- Available ports: 3000 for Express and 4200 for Angular

## Start the backend

```bash
npm ci --prefix server
node server/server.js
```

The backend runs at http://localhost:3000.

The default MongoDB connection is:

mongodb://127.0.0.1:27017/studynest

Collections:
- cards
- assignments
- materials

An optional MONGODB_URI environment variable overrides the connection.
Keep credentials and local .env files out of Git.

## Start the frontend

Open a second terminal in this project folder:

```bash
npm ci
npx ng serve --port 4200
```

Open http://localhost:4200.

Keep both the frontend and backend terminals running.

## Navigation

The shared navigation provides access to:

- /flashcards
- /assignments
- /content-library

The default page is Content Library.

## Features

### Flashcards

- Create cards with front and back text
- View saved cards
- Edit and update cards
- Delete cards with confirmation

### Assignment Manager

- Create assignments with a title, course, description, due date,
  and completion status
- View saved assignments
- Edit and update assignments
- Delete assignments

### Content Library

- Create materials with a title, course, and notes
- View and refresh saved materials
- Edit and update materials
- Delete materials with confirmation

## API endpoints

Each endpoint supports GET and POST.
Individual records support PUT and DELETE at /:id.

- /cards
- /api/assignments
- /api/materials

## Verification

Run from this project folder:

```bash
npx ng test --watch=false
npx ng build
npm audit
```

Latest results:
- 7 tests passed across 5 test files
- Production build succeeded
- Frontend dependency audit reported 0 vulnerabilities
- Create, read, update, and delete workflows exercised through
  the integrated browser application for all three features

Angular packages were updated to version 22.2.6.

## Repository

https://github.com/Thoren-M/Design-Studio-Project