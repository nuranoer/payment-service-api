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
    const { service_code } = req.body;

    // ❌ validasi
    if (!service_code) {
      return res.status(400).json({
        status: 102,
        message: "Service ataus Layanan tidak ditemukan",
        data: null
      });
    }

    // 🔎 ambil service
    const [serviceRows] = await db.execute(
      "SELECT * FROM services WHERE service_code = ?",
      [service_code]
    );

    if (serviceRows.length === 0) {
      return res.status(400).json({
        status: 102,
        message: "Service ataus Layanan tidak ditemukan",
        data: null
      });
    }

    const service = serviceRows[0];
    const amount = Number(service.service_tariff);

    // 💰 ambil saldo user
    const [userRows] = await db.execute(
      "SELECT balance FROM users WHERE id = ?",
      [req.user.id]
    );

    const currentBalance = Number(userRows[0]?.balance) || 0;

    // ❌ saldo tidak cukup
    if (currentBalance < amount) {
      return res.status(400).json({
        status: 102,
        message: "Saldo tidak mencukupi",
        data: null
      });
    }

    const newBalance = currentBalance - amount;

    // update saldo
    await db.execute(
      "UPDATE users SET balance = ? WHERE id = ?",
      [newBalance, req.user.id]
    );

    // 🧾 generate invoice
    const invoice = `INV${Date.now()}`;

    // simpan transaksi
    const [result] = await db.execute(
      `INSERT INTO transactions 
      (user_id, transaction_type, amount, service_code, invoice_number) 
      VALUES (?, 'PAYMENT', ?, ?, ?)`,
      [req.user.id, amount, service_code, invoice]
    );

    // response
    return res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number: invoice,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: "PAYMENT",
        total_amount: amount,
        created_on: new Date()
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

//TRANSACTION HISTORY

exports.getTransactionHistory = async (req, res) => {
  try {
    // 🔥 parsing aman
    let offset = parseInt(req.query.offset);
    let limit = parseInt(req.query.limit);

    // default value
    if (isNaN(offset)) offset = 0;
    if (isNaN(limit)) limit = null;

    let query = `
      SELECT 
        t.invoice_number,
        t.transaction_type,
        t.amount AS total_amount,
        t.created_at AS created_on,
        s.service_name
      FROM transactions t
      LEFT JOIN services s 
        ON t.service_code = s.service_code
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
    `;

    let params = [req.user.id];

    // 🔥 hanya kalau limit valid
    if (limit !== null) {
      query += " LIMIT ? OFFSET ?";
      params.push(limit, offset);
    }

    // 🔥 DEBUG (WAJIB CEK SEKALI)
    console.log("QUERY:", query);
    console.log("PARAMS:", params);

    const [rows] = await db.execute(query, params);

    const records = rows.map((item) => ({
      invoice_number: item.invoice_number,
      transaction_type: item.transaction_type,
      description:
        item.transaction_type === "TOPUP"
          ? "Top Up balance"
          : item.service_name,
      total_amount: item.total_amount,
      created_on: item.created_on
    }));

    return res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset,
        limit,
        records
      }
    });

  } catch (error) {
    console.log("ERROR:", error); // 🔥 debug
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    });
  }
};