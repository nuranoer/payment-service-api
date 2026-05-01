require("dotenv").config();

const express = require("express");
const app = express();

const routes = require("./routes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use("/uploads", express.static("uploads"));

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Routes utama
app.use("/api", routes);

// 🔥 Handle route tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Endpoint tidak ditemukan",
    data: null
  });
});

// 🔥 Global error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  res.status(500).json({
    status: 500,
    message: "Internal Server Error",
    data: null
  });
});

// Jalankan server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});