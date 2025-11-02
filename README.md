

# 🌾 AgroBlock – Blockchain-Based Agricultural Supply Chain Management

A blockchain-powered MERN application for transparent and traceable farm-to-table supply chain management.

---

## 🚀 Features

- 🔐 Role-based authentication (Farmer, Distributor, Retailer, Consumer)  
- 📦 Product registration with metadata and images  
- 🔄 Product transfer workflow across supply chain stages  
- ⛓️ Blockchain ledger with transaction history and hash generation  
- 📊 Supply chain analytics and blockchain visualization  
- 📍 GPS-based product tracking  
- 🔍 QR code verification for authenticity  
- 💾 Smart contract and proof-of-authority simulation  

---

## 🛠️ Tech Stack

**Frontend:** React, React Router, Tailwind CSS, Axios, Vite  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, Bcrypt  
**Blockchain:** Custom simulation using SHA-256, block creation, and smart contract logic  

---

## 🧱 Architecture

```

Frontend (React)
│
▼
Backend (Node.js + Express)
│
▼
Blockchain Engine (Custom Simulation)
│
▼
Database (MongoDB)

````

---

## ⚙️ Installation

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Steps

```bash
# Clone repo
git clone https://github.com/yourusername/agroblock.git
cd agroblock

# Backend setup
cd backend
npm install
cp .env.example .env
npm run dev
````

```bash
# Frontend setup
cd ../frontend
npm install
npm run dev
```

Access:

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend API → [http://localhost:5000](http://localhost:5000)

---

## 🧩 API Overview

### Authentication

```
POST /api/auth/register
POST /api/auth/login
```

### Products

```
POST /api/products/register
GET  /api/products
```

### Transfers

```
POST /api/requests
PUT  /api/requests/:id/accept
```

### Blockchain

```
GET /api/blockchain/overview
GET /api/blockchain/blocks
```

---

## 📁 Project Structure

```
agroblock/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── services/
    └── vite.config.js
```

---

## 🔮 Future Enhancements

* Real Ethereum / IPFS integration
* AI-based quality prediction
* IoT sensor data tracking
* Mobile app (React Native)
* Advanced analytics dashboard

---

**License:** MIT
**Repository:** [https://github.com/yourusername/agroblock](https://github.com/yourusername/agroblock)


