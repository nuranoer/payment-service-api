# 📌 THT REST API - Digital Wallet Service

REST API untuk layanan digital payment yang mencakup fitur registrasi, login, cek saldo, top up, dan transaksi (pulsa, voucher, dll).
Dibangun menggunakan Express.js dan MySQL dengan implementasi raw query dan prepared statement.

---

## 🚀 Fitur Utama

* 🔐 Register & Login (JWT Authentication)
* 💰 Cek Saldo
* ➕ Top Up Saldo
* 🛒 Transaksi / Pembayaran
* 📜 Riwayat Transaksi (opsional)
* ✅ Validasi Input & Error Handling

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MySQL
* JSON Web Token (JWT)
* Bcrypt

---

## 📂 Struktur Project

```
src/
│
├── config/        # Koneksi database
├── controllers/   # Logic API
├── routes/        # Endpoint API
├── middleware/    # Auth JWT
└── app.js         # Entry point
```

---

## ⚙️ Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/username/tht-rest-api.git
cd tht-rest-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=api_tht
JWT_SECRET=tht_api_secret_123!
```

### 4. Setup Database

Import file:

```
database.sql
```

---

## ▶️ Menjalankan Aplikasi

```bash
npm run dev
```

Server berjalan di:

```
http://localhost:3000
```

---

## 📡 Endpoint API

| Method | Endpoint         | Deskripsi            |
| ------ | ---------------- | -------------------- |
| POST   | /api/register    | Register user        |
| POST   | /api/login       | Login user           |
| GET    | /api/balance     | Cek saldo            |
| POST   | /api/topup       | Top up saldo         |
| POST   | /api/transaction | Transaksi pembayaran |

---

## 🔑 Authentication

Gunakan token JWT di header:

```
Authorization: Bearer <token>
```

---

## 🧠 Konsep yang Digunakan

* RESTful API
* JWT Authentication
* Prepared Statement (MySQL)
* Modular Architecture
* Error Handling & Validation

---

## 📄 Database Design (DDL)

Tersedia pada file:

```
Database MYSQL
```

---

## ☁️ Deployment

Aplikasi dapat dideploy menggunakan:
/payment-service-api-production-5c43.up.railway.app

---

## 📚 API Documentation

Dokumentasi API mengacu pada:
https://api-doc-tht.nutech-integrasi.com

---

## 👨‍💻 Author

Nama: Fitri Zuyina Nur Azizah
Project: Assignment API Programmer

---

## 📌 Catatan

Project ini dibuat untuk memenuhi assignment pembuatan REST API dengan ketentuan:

* Menggunakan Express.js
* Menggunakan raw query
* Implementasi fitur saldo & transaksi
* Error handling yang baik
