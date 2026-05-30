import jwt from "jsonwebtoken";

export const adminAuth = async (req, res, next) => {
  try {
    const headers = req.headers;
    const token = headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token not found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }
    req.adminId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
