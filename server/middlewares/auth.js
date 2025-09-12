import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const auth = req.headers["authorization"] || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) return res.status(401).json({ message: "invalid token" });

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "unauthorized" });
  if (req.user.role !== role)
    return res.status(403).json({ message: "forbidden" });
  next();
};

export { isLoggedIn, requireRole };
