const db = require("../config/db");

exports.createTransaction = async (user_id, type, amount, description) => {
  await db.execute(
    "INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)",
    [user_id, type, amount, description]
  );
};