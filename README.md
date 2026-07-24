# 👕 ReWear - Sustainable Clothing Swap & Exchange Marketplace

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

---

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
MONGO_URI=mongodb://127.0.0.1:27017/rewear_db
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

---

## 🌐 Deploying to Render

This project includes a pre-configured `render.yaml` blueprint file for effortless 1-click deployment on Render.com:

1. Push your repository to GitHub: `https://github.com/rakeshk-8685/ReWear`.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **Blueprint**.
3. Connect the **`ReWear`** repository.
4. Set the `MONGO_URI` variable to your MongoDB Atlas connection string:
   ```text
   mongodb+srv://rakeshkr8685_db_user:<YOUR_PASSWORD>@cluster0.abxawlp.mongodb.net/?appName=Cluster0
   ```
5. Click **Apply**. Render will automatically build both the Node.js API Web Service and the Angular Static Web Site!

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new swapper account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & issue tokens | ❌ |
| `GET` | `/api/items` | Fetch garment listings with filtering & pagination | ❌ |
| `POST` | `/api/items` | List a new clothing item (supports image upload) | ✅ |
| `POST` | `/api/swaps` | Propose a new swap request | ✅ |
| `GET` | `/api/swaps/my-swaps` | Retrieve incoming & outgoing swap requests | ✅ |
| `PATCH` | `/api/swaps/:id/status` | Accept, reject, or cancel a swap request | ✅ |
| `GET` | `/api/chat/messages/:swapId` | Fetch chat message history for a swap | ✅ |
| `GET` | `/health` | API Gateway health check endpoint | ❌ |

---

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
