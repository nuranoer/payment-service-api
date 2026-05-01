const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("HEADER:", authHeader);
  console.log("SECRET:", process.env.JWT_SECRET);

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    req.user = decoded;
    next();

  } catch (error) {
    console.log("JWT ERROR:", error.message); // 🔥 INI KUNCI
    return res.status(401).json({ message: "Invalid token" });
  }
};