import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: "public" },
    });

    const token = generateToken(user);
    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("signup error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "email, password and role are required" });
    }

    const normalizedRole = String(role).toLowerCase();
    if (!["public", "asha", "leader", "admin"].includes(normalizedRole)) {
      return res.status(400).json({ message: "invalid role" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (["admin", "leader", "asha"].includes(normalizedRole)) {
      if (user.role !== normalizedRole) {
        return res.status(403).json({ message: "role mismatch" });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const token = generateToken(user);
    return res.status(200).json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("signin error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { signup, signin };
