import prisma from "../lib/db.js";

const createReport = async (req, res) => {
  try {
    const {
      name,
      location,
      latitude,
      longitude,
      date,
      mapArea,
      leaderId,
      photoUrl,
      comment,
    } = req.body;
    if (!name || !location || !date || !mapArea || !leaderId || !photoUrl) {
      return res.status(400).json({
        message:
          "name, location, date, mapArea, leaderId, photoUrl are required",
      });
    }

    const leader = await prisma.user.findUnique({ where: { id: leaderId } });
    if (!leader || leader.role !== "leader") {
      return res.status(400).json({ message: "invalid leaderId" });
    }

    const report = await prisma.report.create({
      data: {
        name,
        location,
        latitude: typeof latitude === "number" ? latitude : null,
        longitude: typeof longitude === "number" ? longitude : null,
        date: new Date(date),
        mapArea,
        photoUrl,
        comment: comment || null,
        leaderId,
      },
    });

    // SMS notification to the local leader about this report should be sent here (to be implemented).

    return res.status(201).json({ report });
  } catch (error) {
    console.error("createReport error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const listLeaderReports = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "leader" && req.user.role !== "admin")) {
      return res.status(403).json({ message: "forbidden" });
    }

    const reports = await prisma.report.findMany({
      where: { leaderId: req.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        location: true,
        date: true,
        photoUrl: true,
        comment: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ reports });
  } catch (error) {
    console.error("listLeaderReports error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateReport = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "leader") {
      return res.status(403).json({ message: "forbidden" });
    }

    const { id } = req.params;
    const { status, progress } = req.body;

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) return res.status(404).json({ message: "report not found" });
    if (report.leaderId !== req.user.id)
      return res.status(403).json({ message: "forbidden" });

    const updates = {};
    if (status) {
      const normalized = String(status).toLowerCase();
      if (!["awaiting", "in_progress", "resolved"].includes(normalized)) {
        return res.status(400).json({ message: "invalid status" });
      }
      updates.status = normalized;
    }
    if (typeof progress !== "undefined") {
      const p = Number(progress);
      if (!Number.isFinite(p) || p < 0 || p > 100) {
        return res.status(400).json({ message: "progress must be 0-100" });
      }
      updates.progress = Math.round(p);
    }

    const updated = await prisma.report.update({
      where: { id },
      data: updates,
    });
    return res.status(200).json({
      report: {
        id: updated.id,
        status: updated.status,
        progress: updated.progress,
      },
    });
  } catch (error) {
    console.error("updateReport error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) return res.status(404).json({ message: "report not found" });
    // leader owner or admin can delete
    if (
      !req.user ||
      !(
        req.user.role === "admin" ||
        (req.user.role === "leader" && req.user.id === report.leaderId)
      )
    ) {
      return res.status(403).json({ message: "forbidden" });
    }
    await prisma.report.delete({ where: { id } });
    return res.status(200).json({ deleted: true });
  } catch (error) {
    console.error("deleteReport error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createReport, listLeaderReports, updateReport, deleteReport };
