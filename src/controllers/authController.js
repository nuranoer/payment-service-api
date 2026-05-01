const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    // validasi
    if (!email || !first_name || !last_name || !password) {
      return res.status(400).json({
        status: 102,
        message: "Semua field wajib diisi",
        data: null
      });
    }

    // cek user
    const [user] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length > 0) {
      return res.status(400).json({
        status: 102,
        message: "Email sudah terdaftar",
        data: null
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)",
      [email, first_name, last_name, hash]
    );

    return res.status(201).json({
      status: 0,
      message: "Registrasi berhasil",
      data: null
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ❌ validasi kosong
    if (!email || !password) {
      return res.status(400).json({
        status: 102,
        message: "Paramter email tidak sesuai format",
        data: null
      });
    }

    // ❌ validasi format email (simple)
    if (!email.includes("@")) {
      return res.status(400).json({
        status: 102,
        message: "Paramter email tidak sesuai format",
        data: null
      });
    }

    // cek user
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      status: 0,
      message: "Login Sukses",
      data: {
        token: token
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    });
  }
};