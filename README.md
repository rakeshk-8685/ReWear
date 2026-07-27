# 👕 ReWear - Sustainable Clothing Swap & Exchange Marketplace

[![GitHub Repository](https://img.shields.io/badge/GitHub-rakeshk--8685%2FReWear-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rakeshk-8685/ReWear)
[![Angular](https://img.shields.io/badge/Angular-20.3-dd0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

**ReWear** is a modern, enterprise-grade full-stack platform designed to facilitate peer-to-peer garment swaps, reduce textile waste, and incentivize sustainable fashion consumption through real-time swapper communication, environmental impact tracking, and intuitive item trading workflows.

---

## ✨ Features

- 🔄 **Interactive Swap & Exchange System**: Propose single or multi-item clothing swaps, manage active requests, and track exchange statuses (Pending, Accepted, Completed, Rejected, Cancelled).
- 🌿 **Sustainability & Impact Dashboard**: Track personal and community environmental savings—including gallons of water saved, kg of CO₂ emissions offset, and eco-pledge milestones.
- 💬 **Real-time Live Chat**: Instant messaging powered by **Socket.io** allowing swappers to discuss trade logistics, request extra garment photos, or arrange meeting spots.
- 🏝️ **Dynamic Island Active Swap Bar**: Interactive floating status bar displaying active swap countdowns, live unread messages, and real-time trade notifications.
- 👗 **Garment Catalog & Smart Filtering**: Explore garments filtered by category (Tops, Bottoms, Outerwear, Dresses, Shoes, Accessories), size, condition, and estimated value.
- 📸 **Cloudinary Image Processing**: High-speed image upload support with automatic optimization and responsive gallery view.
- 🔒 **Enterprise Authentication & Security**: JWT authentication with refresh token rotation, bcrypt password hashing, HTTP-only cookie support, Helmet HTTP security headers, and API rate limiters.
- 🛡️ **Role-Based Access Control (RBAC)**: Admin dashboard for moderation, user management, and flag/report resolutions.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: Angular 20 (Standalone Components architecture)
- **State Management**: NgRx Signals Store & Signals
- **Styling**: Tailwind CSS & Vanilla CSS Design System with dark mode glassmorphism
- **Real-time Client**: `socket.io-client`

### Backend
- **Runtime**: Node.js v20+ with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time Server**: Socket.io WS/Polling gateway
- **Image Storage**: Cloudinary API via Multer Storage

### Deployment & DevOps
- **Containerization**: Docker & Docker Compose (`docker-compose.yml`)
- **Production Hosting**: Render Blueprint (`render.yaml`)
- **API Documentation**: OpenAPI 3.0 & Swagger UI ([https://rewear-api-dm0d.onrender.com/api-docs](https://rewear-api-dm0d.onrender.com/api-docs))

---

## 📚 API Documentation (Swagger UI)

Interactive OpenAPI documentation for the backend API is available at:
- **Production Swagger UI**: [https://rewear-api-dm0d.onrender.com/api-docs](https://rewear-api-dm0d.onrender.com/api-docs)
- **Local Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Raw OpenAPI JSON Spec**: [https://rewear-api-dm0d.onrender.com/api-docs.json](https://rewear-api-dm0d.onrender.com/api-docs.json)

---

## 📁 Repository Structure

```text
ReWear/
├── backend/                  # Node.js + Express + TypeScript API Service
│   ├── src/
│   │   ├── config/           # Database & Environment configuration
│   │   ├── controllers/      # Route controllers (Auth, Items, Swaps, Chat, Users)
│   │   ├── middleware/       # Auth, Role, Upload & Error handling middlewares
│   │   ├── models/           # Mongoose schemas (User, Item, SwapRequest, ChatMessage)
│   │   ├── routes/           # REST API routes
│   │   ├── services/         # Core business logic layer
│   │   ├── socket/           # Real-time WebSocket handlers & channels
│   │   └── server.ts         # Application entry point & server start
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # Angular 20 Single Page Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Services, Auth Guards, Interceptors, Stores
│   │   │   ├── features/     # Feature modules (Items, Swaps, Chat, Profile, Admin)
│   │   │   ├── layouts/      # Main, Auth, Admin layouts
│   │   │   └── shared/       # Reusable components (Navbar, Dynamic Island, Item Cards)
│   │   └── environments/    # Environment configurations (dev & prod)
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml        # Docker Multi-container orchestration
├── render.yaml               # Render Infrastructure Blueprint
└── README.md
```


## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v20.x or higher
- [npm](https://www.npmjs.com/) v10.x or higher
- [MongoDB](https://www.mongodb.com/) running locally or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/rakeshk-8685/ReWear.git
cd ReWear
```

### 2️⃣ Configure Backend Environment
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://rakeshkr8685_db_user:<YOUR_PASSWORD>@cluster0.abxawlp.mongodb.net/?appName=Cluster0
JWT_SECRET=super_secret_access_key_2026
JWT_REFRESH_SECRET=super_secret_refresh_key_2026
CLIENT_URL=http://localhost:4200
```

### 3️⃣ Start Backend API
```bash
cd backend
npm install
npm run dev
```
The backend API will start on `http://localhost:5000/api`.

### 4️⃣ Start Frontend Application
Open a new terminal tab:
```bash
cd frontend
npm install
npm start
```
The Angular web application will launch at `http://localhost:4200`.

---

## 🐳 Running with Docker Compose

You can spin up the entire application stack (MongoDB + Express Backend + Angular Frontend) using Docker Compose:

```bash
docker-compose up --build
```

- **Frontend Application**: `http://localhost:80`
- **Backend API Gateway**: `http://localhost:5000/api`
- **MongoDB**: `localhost:27017`



## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [Issues](https://github.com/rakeshk-8685/ReWear/issues) page.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
