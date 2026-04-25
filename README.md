# 🚀 CodeStage – Online Coding Evaluation Platform

CodeStage is a scalable coding platform designed to evaluate programming submissions efficiently using an asynchronous job processing architecture.

---

## 📌 Features

- 🧠 Online Code Execution (Judge0)
- ⚡ Asynchronous Processing using BullMQ + Redis
- 🔐 Secure Evaluation (Base64, hidden test cases)
- 📊 Submission Tracking (time, memory, failed cases)
- 👤 JWT Authentication
- 📡 WebSocket support (planned)

---

## 🏗️ Tech Stack

**Backend**
- Node.js, Express.js
- MongoDB, Mongoose
- Redis, BullMQ
- Judge0 API

**Frontend (Planned)**
- React / Next.js
- Tailwind CSS

---

## ⚙️ System Architecture

User Submission → Backend API → MongoDB (Pending) → Redis Queue → Worker → Judge0 → Update DB

---

## 🔄 Workflow

1. User submits code  
2. Stored in MongoDB (Pending)  
3. Job added to Redis queue  
4. Worker processes it  
5. Judge0 executes code  
6. Result stored in DB  
7. Short polling used in frontend  

---

## 📁 Project Structure

backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── queue/
│   ├── workers/
│   ├── utils/
│   └── seed/
├── .env
└── server.js

---

## 🚀 Setup

1. Clone repo  
git clone https://github.com/unadkat7/codestage.git  
cd codestage  

2. Install dependencies  
npm install  

3. Create `.env` file  

PORT=5000  
MONGO_URI=your_mongodb_uri  
REDIS_HOST=127.0.0.1  
REDIS_PORT=6379  
JUDGE0_API_URL=your_judge0_url  
JWT_SECRET=your_secret  

4. Start Redis  
redis-server  

5. Run backend  
npm run dev  

6. Run worker  
node src/workers/worker.js  

---

## 📈 Highlights

- Queue-based architecture (real-world scalable design)
- Non-blocking backend
- Supports concurrency via workers
- Clean separation (API vs Worker)

---

## 🔮 Future Improvements

- Frontend integration  
- WebSocket live updates  
- Leaderboard system  
- AI-based feedback  
- Contest mode  

---

## 👨‍💻 Author

Jay Unadkat  
MERN Stack Developer
