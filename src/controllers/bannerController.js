const db = require("../config/db");

exports.getBanners = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT banner_name, banner_image, description FROM banners"
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