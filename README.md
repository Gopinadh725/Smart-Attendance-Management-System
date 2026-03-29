# Smart Attendance Management System (SAMS)

SAMS is a production-level attendance tracking application built with the MERN stack. It features role-based access, automated device binding for security, and a stunning premium UI.

## 🏗️ Project Structure

```text
├── Backend/                # Express API
│   ├── config/           # DB and other configurations
│   ├── controllers/      # Route controllers (logic)
│   ├── middleware/       # JWT and Device Binding auth
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── scripts/          # Database seeding and utility scripts
│   └── server.js         # Entry point
├── Frontend/               # React (Vite/CRA)
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI & Layout components
│   │   ├── context/     # Auth and Theme providers
│   │   ├── pages/       # Page-level components (Dashboards, Auth)
│   │   ├── utils/       # API clients and helpers
│   │   ├── App.js       # Root component & Routing
│   │   └── index.js    # React entry point
│   └── tailwind.config.js # Styling configuration
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### 1. Setup Backend
```bash
cd Backend
npm install
```
Add your `.env` file with the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```
Start development server:
```bash
npm start
```

### 2. Setup Frontend
```bash
cd Frontend
npm install
npm start
```

## 🛠️ Key Technologies
- **Frontend**: React, Tailwind CSS, Framer Motion, FingerprintJS, Lucid Icons, Recharts.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, ExcelJS.

## 👥 Roles
- **Student**: View attendance, check analytics, receive alerts.
- **Faculty**: Mark/Edit attendance, view subject reports, export to Excel.
- **Admin**: Manage users, reset device binding, monitor system-wide stats.
