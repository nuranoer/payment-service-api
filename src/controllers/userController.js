const db = require("../config/db");
//Profile
exports.updateProfile = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        status: 102,
        message: "Parameter tidak lengkap",
        data: null
      });
    }

    // update data
    await db.execute(
      "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?",
      [first_name, last_name, req.user.id]
    );

    // ambil data terbaru
    const [rows] = await db.execute(
      "SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?",
      [req.user.id]
    );

    return res.status(200).json({
      status: 0,
      message: "Update Profile berhasil",
      data: rows[0]
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 102,
        message: "Format Image tidak sesuai",
        data: null
      });
    }

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    await db.execute(
      "UPDATE users SET profile_image = ? WHERE id = ?",
      [imageUrl, req.user.id]
    );

    const [rows] = await db.execute(
      "SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?",
      [req.user.id]
    );

    return res.status(200).json({
      status: 0,
      message: "Update Profile Image berhasil",
      data: rows[0]
    });

  } catch (error) {
    return res.status(400).json({
      status: 102,
      message: error.message,
      data: null
    });
  }
};
// ✅ CEK SALDO
exports.getBalance = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT balance FROM users WHERE id = ?",
      [req.user.id] // 🔥 dari JWT
    );

    return res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: rows[0].balance
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

// ✅ TOP UP
exports.topUp = async (req, res) => {
  try {
    let { top_up_amount } = req.body;

    // 🔥 paksa jadi number
    const amount = Number(top_up_amount);

    // ❌ validasi
    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 102,
        message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        data: null
      });
    }

    // ambil saldo sekarang
    const [rows] = await db.execute(
      "SELECT balance FROM users WHERE id = ?",
      [req.user.id]
    );

    // 🔥 pastikan number
    const currentBalance = Number(rows[0]?.balance) || 0;

    const newBalance = currentBalance + amount;

    // update saldo
    await db.execute(
      "UPDATE users SET balance = ? WHERE id = ?",
      [newBalance, req.user.id]
    );

    // simpan transaksi
    await db.execute(
      "INSERT INTO transactions (user_id, transaction_type, amount) VALUES (?, 'TOPUP', ?)",
      [req.user.id, amount]
    );

    return res.status(200).json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: {
        balance: newBalance
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

// ✅ TRANSAKSI
exports.transaction = async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount tidak valid" });
    }

    // cek saldo
    const [rows] = await db.execute(
      "SELECT balance FROM users WHERE id = ?",
      [req.user.id]
    );

    const balance = rows[0].balance;

    if (balance < amount) {
      return res.status(400).json({ message: "Saldo tidak cukup" });
    }

    // kurangi saldo
    await db.execute(
      "UPDATE users SET balance = balance - ? WHERE id = ?",
      [amount, req.user.id]
    );

    // simpan transaksi
    await db.execute(
      "INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'PAYMENT', ?, ?)",
      [req.user.id, amount, description]
    );

    res.json({ message: "Transaksi berhasil" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};