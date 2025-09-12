import bcrypt from "bcrypt";
import prisma from "../lib/db.js";

const ensureAdmin = (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "forbidden" });
  }
};

const createUser = async (req, res) => {
  try {
    if (ensureAdmin(req, res)) return;
    const { email, password, role, name } = req.body;
    if (!email || !password || !role)
      return res
        .status(400)
        .json({ message: "email, password, role are required" });
    if (
      !["asha", "leader", "admin", "public"].includes(
        String(role).toLowerCase()
      )
    )
      return res.status(400).json({ message: "invalid role" });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: String(role).toLowerCase(),
        name: name || null,
      },
    });
    return res
      .status(201)
      .json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const listReports = async (req, res) => {
  try {
    if (ensureAdmin(req, res)) return;
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ reports });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    if (ensureAdmin(req, res)) return;
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const listWaterTests = async (req, res) => {
  try {
    if (ensureAdmin(req, res)) return;
    const tests = await prisma.waterTest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ waterTests: tests });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    if (ensureAdmin(req, res)) return;
    const { id } = req.params;
    const { email, password, role, name } = req.body;
    const data = {};
    if (email) data.email = email;
    if (name !== undefined) data.name = name;
    if (role) {
      const r = String(role).toLowerCase();
      if (!["asha", "leader", "admin", "public"].includes(r)) {
        return res.status(400).json({ message: "invalid role" });
      }
      data.role = r;
    }
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    const user = await prisma.user.update({ where: { id }, data });
    return res
      .status(200)
      .json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      });
  } catch (e) {
    if (e.code === "P2025")
      return res.status(404).json({ message: "user not found" });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (ensureAdmin(req, res)) return;
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    return res.status(200).json({ deleted: true });
  } catch (e) {
    if (e.code === "P2025")
      return res.status(404).json({ message: "user not found" });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const listUsers = async (req, res) => {
  try {
    if (ensureAdmin(req, res)) return;
    const { role, email, q, limit = 50, cursor } = req.query;
    const where = {};
    if (role) where.role = String(role).toLowerCase();
    if (email) where.email = String(email);
    if (q)
      where.OR = [
        { email: { contains: String(q), mode: "insensitive" } },
        { name: { contains: String(q), mode: "insensitive" } },
      ];
    const take = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
    const users = await prisma.user.findMany({
      where,
      take,
      ...(cursor ? { skip: 1, cursor: { id: String(cursor) } } : {}),
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        createdAt: true,
      },
    });
    return res
      .status(200)
      .json({
        users,
        nextCursor: users.length === take ? users[users.length - 1].id : null,
      });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createUser,
  updateUser,
  deleteUser,
  listReports,
  listWaterTests,
  listUsers,
  getUserById,
};
