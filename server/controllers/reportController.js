import prisma from "../lib/db.js";
import { sendSMSWrapper } from "../lib/sms.js";
import { sendWhatsAppWrapper } from "../lib/whatapp.js";

const createReport = async (req, res) => {
  try {
    // Check if user is authenticated and has permission
    if (!req.user || !["leader", "admin", "public", "asha"].includes(req.user.role)) {
      return res.status(403).json({ message: "forbidden" });
    }

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

    // Required fields validation
    if (!name || !date) {
      return res.status(400).json({
        message: "name and date are required",
      });
    }

    // Either location or coordinates must be provided
    if (!location && (!latitude || !longitude)) {
      return res.status(400).json({
        message:
          "Either location name or coordinates (latitude, longitude) are required",
      });
    }

    // Use the authenticated user as the leaderId (both admin and leader can create reports)
    const actualLeaderId = req.user.id;

    const report = await prisma.report.create({
      data: {
        name,
        location: location || null,
        latitude: typeof latitude === "number" ? latitude : null,
        longitude: typeof longitude === "number" ? longitude : null,
        date: new Date(date),
        mapArea: mapArea || null,
        photoUrl: photoUrl || null,
        comment: comment || null,
        leaderId: actualLeaderId,
      },
    });

    // SMS notification to the local leader about this report should be sent here (to be implemented).

    // Get the user who created the report for SMS notification
    const reportCreator = await prisma.user.findUnique({
      where: { id: actualLeaderId },
    });
    if (reportCreator && reportCreator.number) {
      const formattedDate = new Date(date).toLocaleString("en-IN", {
        weekday: "short", // Thu
        day: "2-digit", // 11
        month: "short", // Sep
        year: "numeric", // 2025
        hour: "2-digit", // 03
        minute: "2-digit", // 30
        hour12: true, // AM/PM
        timeZone: "Asia/Kolkata", // Indian time zone
      });

      const notificationMessage = `🚨 New Report Created 🚨
Name: ${name}
Location: ${location}
Date: ${formattedDate}
Map Area: ${mapArea}`;

      await sendSMSWrapper(reportCreator.number, notificationMessage);
      await sendWhatsAppWrapper(reportCreator.number, notificationMessage);
    } else {
      console.warn(`⚠️ User ${actualLeaderId} has no phone number saved.`);
    }

    return res.status(201).json({ report });
  } catch (error) {
    console.error("createReport error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const listLeaderReports = async (req, res) => {
  try {
    if (!req.user || !["leader", "admin", "asha", "public"].includes(req.user.role)) {
      return res.status(403).json({ message: "forbidden" });
    }

    // Both admins and leaders can see all reports
    const whereClause = {}; // No filtering - show all reports

    const reports = await prisma.report.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        location: true,
        latitude: true,
        longitude: true,
        date: true,
        mapArea: true,
        photoUrl: true,
        comment: true,
        status: true,
        progress: true,
        leaderId: true,
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
    if (!req.user || !["leader", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "forbidden" });
    }

    const { id } = req.params;
    const { status, progress } = req.body;

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) return res.status(404).json({ message: "report not found" });

    // Both admins and leaders can update any report
    // No additional permission checks needed

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
