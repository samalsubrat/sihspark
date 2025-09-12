import prisma from "../lib/db.js";

const getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "unauthorized" });
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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

export { getProfile };
