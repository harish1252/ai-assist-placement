AI Assist for Placement 

A full-stack MERN application built to help final-year students prepare for campus placements — track DSA progress, practice interview questions, monitor core CS subjects, manage daily tasks, and get instant help from an AI-powered placement assistant.

 Live Demo: ai-assist-placement-dep.vercel.app


 Features
 Secure Authentication — JWT-based register/login with bcrypt password hashing
 AI Placement Assistant — Real-time chat powered by Groq's LLM API for instant doubt-solving
 Dashboard — Task manager with calendar view and daily progress tracking
 DSA Progress Tracker — Track problems solved across 10 core topics (Arrays, Trees, DP, Graphs, etc.)
 Interview Preparation — 30+ curated questions across Technical, HR, System Design, and CS Fundamentals categories
 Subject Tracker — Monitor preparation progress across OS, DBMS, CN, OOP, and System Design
 Protected Routes — All user data is private and persisted per-account in MongoDB 


  Tech Stack

Frontend: React, React Router, Tailwind CSS, Axios, Context API Backend: Node.js, Express.js, JWT, bcrypt.js Database: MongoDB (Atlas) AI Integration: Groq API (Llama 3.1) Deployment: Vercel (frontend), Render (backend), MongoDB Atlas (database)

Architecture
Client (React + Vite)
      │
      ▼
Express REST API (JWT-protected routes)
      │
      ├──► MongoDB Atlas (users, tasks, progress data)
      │
      └──► Groq API (AI chat completions)

Getting Started (Local Setup)
Prerequisites
Node.js (v18+)
MongoDB Atlas account (or local MongoDB)
Groq API key (console.groq.com) 


. Clone the repository

git clone https://github.com/harish1252/ai-assist-placement.git
cd ai-assist-placement

Backend setup
cd backend
npm install

Create a .env file in backend/:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key

Run the backend
npm run dev

Frontend setup
cd ..
npm install

Create a .env file in the project root
VITE_API_URL=http://localhost:5000

Run the frontend
npm run dev 


Project Structure
ai-assist-placement/
├── backend/
│   ├── config/          # Database connection
│   ├── middleware/       # JWT auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express API routes
│   └── server.js
├── src/
│   ├── components/       # Navbar, Sidebar
│   ├── context/           # Auth context (global state)
│   ├── pages/             # Dashboard, Login, Register, AI Assistant, etc.
│   ├── services/          # Axios API service layer
│   └── Routes/            # App routing + protected routes
└── README.md