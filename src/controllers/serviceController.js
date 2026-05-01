const db = require("../config/db");

exports.getServices = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY id ASC"
    );

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: rows
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      data: null
    });
  }
};