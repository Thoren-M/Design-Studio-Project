# Assignment Manager M2 setup

1. Start MongoDB locally or create a MongoDB Atlas database.
2. In `server`, copy `.env.example` to `.env` and replace `MONGODB_URI` if needed.
3. Run `npm install` and `npm start` inside `server`.
4. In a second terminal, run `npm install` and `npm start` in `Trinity_AssignmentManager`.
5. Open `http://localhost:4200`.

The Assignment Manager supports Create, Read, Update, and Delete through the Express API, and all assignment records are stored in MongoDB.
