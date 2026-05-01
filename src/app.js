require("dotenv").config(); 

const express = require("express");
const app = express();

const routes = require("./routes");

// Middleware
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Routes utama
app.use("/api", routes);

// 🔥 Handle route tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// 🔥 Global error handler (optional tapi bagus buat nilai)
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// Jalankan server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});