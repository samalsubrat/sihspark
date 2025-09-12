import prisma from "../lib/db.js";

const createHotspot = async (req, res) => {
  try {
    if (!req.user || !["admin", "leader"].includes(req.user.role)) {
      return res.status(403).json({ message: "forbidden" });
    }
    const { name, description, location, latitude, longitude } = req.body;
    if (!name || !location) {
      return res
        .status(400)
        .json({ message: "name and location are required" });
    }
    const lat = typeof latitude === "number" ? latitude : undefined;
    const lng = typeof longitude === "number" ? longitude : undefined;
    const hotspot = await prisma.hotspot.create({
      data: {
        name,
        description: description || null,
        location,
        latitude: lat ?? null,
        longitude: lng ?? null,
        createdById: req.user.id,
      },
    });
    return res.status(201).json({ hotspot: { id: hotspot.id } });
  } catch (error) {
    console.error("createHotspot error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const listHotspots = async (_req, res) => {
  try {
    const hotspots = await prisma.hotspot.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        latitude: true,
        longitude: true,
      },
    });
    return res.status(200).json({ hotspots });
  } catch (error) {
    console.error("listHotspots error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getHotspotById = async (req, res) => {
  try {
    const { id } = req.params;
    const hs = await prisma.hotspot.findUnique({ where: { id } });
    if (!hs) return res.status(404).json({ message: "hotspot not found" });
    return res.status(200).json({ hotspot: hs });
  } catch (error) {
    console.error("getHotspotById error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateHotspot = async (req, res) => {
  try {
    const { id } = req.params;
    const hs = await prisma.hotspot.findUnique({ where: { id } });
    if (!hs) return res.status(404).json({ message: "hotspot not found" });
    if (
      !(
        req.user.role === "admin" ||
        (req.user.role === "leader" && req.user.id === hs.createdById)
      )
    ) {
      return res.status(403).json({ message: "forbidden" });
    }
    const { name, description, location, latitude, longitude } = req.body;
    const data = {};
    if (name) data.name = name;
    if (typeof description !== "undefined")
      data.description = description || null;
    if (location) data.location = location;
    if (typeof latitude === "number") data.latitude = latitude;
    if (typeof longitude === "number") data.longitude = longitude;
    const updated = await prisma.hotspot.update({ where: { id }, data });
    return res.status(200).json({ hotspot: { id: updated.id } });
  } catch (error) {
    console.error("updateHotspot error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteHotspot = async (req, res) => {
  try {
    const { id } = req.params;
    const hs = await prisma.hotspot.findUnique({ where: { id } });
    if (!hs) return res.status(404).json({ message: "hotspot not found" });
    if (
      !(
        req.user.role === "admin" ||
        (req.user.role === "leader" && req.user.id === hs.createdById)
      )
    ) {
      return res.status(403).json({ message: "forbidden" });
    }
    await prisma.hotspot.delete({ where: { id } });
    return res.status(200).json({ deleted: true });
  } catch (error) {
    console.error("deleteHotspot error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createHotspot,
  listHotspots,
  getHotspotById,
  updateHotspot,
  deleteHotspot,
};
