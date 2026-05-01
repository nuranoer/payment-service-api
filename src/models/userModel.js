const db = require("../config/db");

// ambil user berdasarkan email
exports.findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

// ambil saldo
exports.getBalanceById = async (id) => {
  const [rows] = await db.execute(
    "SELECT balance FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};

// update saldo
exports.updateBalance = async (id, amount) => {
  await db.execute(
    "UPDATE users SET balance = balance + ? WHERE id = ?",
    [amount, id]
  );
};