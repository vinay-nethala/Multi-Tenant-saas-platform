# 🚀 Frontend – Multi-Tenant SaaS Platform

## 📌 Project Overview
This is the **Frontend application** for the **Multi-Tenant SaaS Platform**.  
It allows users to **login**, **view projects**, and **add tasks to projects** securely.

🖥️ Frontend Port: **3000**  
⚙️ Backend Port: **5000**

---

## 🛠️ Technologies Used
✅ React  
✅ JavaScript  
✅ HTML & CSS  
✅ Axios  
✅ Docker  

---


## 📁 Folder Structure
```
frontend/
├── src/
│   ├── api/            📡 API calls
│   ├── components/     🧩 Reusable components
│   ├── pages/          📄 Pages (Login, Dashboard, Tasks)
│   ├── context/        🔐 Auth & Global State
│   ├── App.js
│   └── index.js
├── public/
├── Dockerfile
├── package.json
└── README.md
````
---



## ▶️ Run Frontend Locally
1️⃣ Install dependencies  
npm install  

2️⃣ Start frontend  
npm start  

🌐 Open in browser:  
http://localhost:3000  

---

## 🐳 Run Using Docker
docker-compose up --build  

🌐 Frontend URL:  
http://localhost:3000  

---

## 🔗 Backend Dependency
Frontend **requires backend** to be running.

✅ Backend Health Check API:  
http://localhost:5000/api/health  

---

## 🔐 Authentication Flow
🔹 User logs in  
🔹 Backend returns JWT token  
🔹 Token stored in localStorage  
🔹 Token sent with every API request  

📌 Request Header Format:
Authorization: Bearer JWT_TOKEN  

---

## 📝 Task Management Feature
Users can **add tasks** to projects.

📌 API Used:
POST /api/projects/:projectId/tasks  

📦 Request Body Example:
{
  "title": "Design Login Page",
  "description": "Create UI for login page"
}

🔒 Conditions:
- User must be logged in
- JWT token must be valid
- Project must belong to tenant
- User role must be allowed

---

## ❌ Why Tasks May Not Be Added
⚠️ Backend not running  
⚠️ JWT token missing or expired  
⚠️ Wrong projectId  
⚠️ Incorrect API URL  
⚠️ User role restriction  

---

## 🔍 How to Verify Task Creation
✅ Login successfully  
✅ Open Project page  
✅ Add task using form  
✅ Check browser Network tab  
✅ Verify task saved in database  

---

## 🛑 Common Errors
❌ Cannot GET /  
➡️ Route does not exist  
➡️ Use correct path: /api/health  

❌ CORS Error  
➡️ Check FRONTEND_URL in backend env  

---

## 🌱 Future Enhancements
✨ Task delete feature  
✨ Task status update (Todo → Done)  
✨ Better UI & animations  
✨ Role-based UI access  
✨ Notifications  

---

## 🎯 Conclusion
✅ Frontend is connected to backend  
✅ Authentication working  
✅ Project and Task APIs integrated  
✅ Docker setup working  
✅ Ready for evaluation & submission  

---

