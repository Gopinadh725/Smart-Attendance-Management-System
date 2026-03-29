# SAMS Backend

This is the Node.js/Express server for the Smart Attendance Management System.

## 📁 Directory Structure
- `config/`: Database connection (`db.js`).
- `controllers/`: Logic for handling requests.
- `middleware/`: Auth and Device Binding guards.
- `models/`: MongoDB/Mongoose schemas.
- `routes/`: Express router definitions.
- `scripts/`: Utility scripts for seeding and user creation.

## 🛠️ Setup
1. `npm install`
2. Create `.env` (see root README).
3. `npm start` (or `npm run dev` if configured).

## 🗄️ Database Scripts
Run scripts from the `Backend` directory:
- `node scripts/seed.js`: Seed the database with sample data.
- `node scripts/createFaculty.js`: Create a sample faculty user.
- `node scripts/createStudent.js`: Create a sample student user.
