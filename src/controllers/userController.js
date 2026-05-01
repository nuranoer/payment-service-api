const db = require("../config/db");

// ✅ CEK SALDO
exports.getBalance = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT balance FROM users WHERE id = ?",
      [req.user.id]
    );

    res.json({
      balance: rows[0].balance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ TOP UP
exports.topUp = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount tidak valid" });
    }

    // update saldo
    await db.execute(
      "UPDATE users SET balance = balance + ? WHERE id = ?",
      [amount, req.user.id]
    );

    // simpan transaksi
    await db.execute(
      "INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'TOPUP', ?, 'Top Up')",
      [req.user.id, amount]
    );

    res.json({ message: "Top up berhasil" });

  } catch (error) {
    res.status(500).json({ message: error.message });
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