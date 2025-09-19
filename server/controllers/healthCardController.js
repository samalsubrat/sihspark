import prisma from "../lib/db.js";
import QRCode from "qrcode";
import crypto from "crypto";

// Calculate AI-based risk score based on water test history
const calculateRiskScore = async (waterbodyName) => {
  try {
    // Get all water tests for this waterbody from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const waterTests = await prisma.waterTest.findMany({
      where: {
        waterbodyName: waterbodyName,
        dateTime: {
          gte: sixMonthsAgo
        }
      },
      orderBy: { dateTime: 'desc' }
    });

    if (waterTests.length === 0) {
      return 50; // Default medium risk if no recent tests
    }

    // Calculate risk based on recent test results
    let riskScore = 0;
    let totalWeight = 0;

    waterTests.forEach((test, index) => {
      // More recent tests have higher weight
      const weight = Math.max(1, waterTests.length - index);
      totalWeight += weight;

      // Risk scoring based on quality
      switch (test.quality) {
        case 'good':
          riskScore += 20 * weight; // Low risk
          break;
        case 'medium':
          riskScore += 60 * weight; // Medium risk
          break;
        case 'high':
          riskScore += 90 * weight; // High risk
          break;
        case 'disease':
          riskScore += 100 * weight; // Critical risk
          break;
        default:
          riskScore += 50 * weight; // Unknown risk
      }
    });

    // Calculate weighted average
    const averageRisk = totalWeight > 0 ? riskScore / totalWeight : 50;

    // Factor in test frequency (more frequent testing = lower risk)
    const testFrequency = waterTests.length / 6; // tests per month
    const frequencyBonus = Math.min(20, testFrequency * 5); // Max 20 point bonus

    // Factor in time since last test (older tests = higher risk)
    const daysSinceLastTest = (new Date() - waterTests[0].dateTime) / (1000 * 60 * 60 * 24);
    const recencyPenalty = Math.min(30, daysSinceLastTest * 0.5); // Max 30 point penalty

    const finalRiskScore = Math.max(0, Math.min(100, averageRisk - frequencyBonus + recencyPenalty));
    
    return Math.round(finalRiskScore);
  } catch (error) {
    console.error("Error calculating risk score:", error);
    return 50; // Default medium risk on error
  }
};

// Generate contamination history from water tests
const generateContaminationHistory = async (waterbodyName) => {
  try {
    const waterTests = await prisma.waterTest.findMany({
      where: {
        waterbodyName: waterbodyName,
        quality: {
          in: ['medium', 'high', 'disease']
        }
      },
      orderBy: { dateTime: 'desc' },
      take: 10 // Last 10 contamination events
    });

    return waterTests.map(test => ({
      date: test.dateTime,
      quality: test.quality,
      location: test.location,
      notes: test.notes,
      severity: test.quality === 'disease' ? 'critical' : 
                test.quality === 'high' ? 'high' : 'medium'
    }));
  } catch (error) {
    console.error("Error generating contamination history:", error);
    return [];
  }
};

// Generate QR code for health card
const generateQRCode = async (waterbodyId) => {
  try {
    const healthCardUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/health-card/${waterbodyId}`;
    const qrCodeDataURL = await QRCode.toDataURL(healthCardUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

// Create or update health card for a waterbody
const createOrUpdateHealthCard = async (req, res) => {
  try {
    const { waterbodyName, waterbodyId, location, latitude, longitude } = req.body;

    if (!waterbodyName || !location) {
      return res.status(400).json({
        message: "waterbodyName and location are required"
      });
    }

    // Check if user has permission (admin, leader, or asha)
    if (!["admin", "leader", "asha"].includes(req.user.role)) {
      return res.status(403).json({ message: "forbidden" });
    }

    // Generate unique waterbody ID if not provided
    const finalWaterbodyId = waterbodyId || crypto.randomUUID();

    // Calculate risk score
    const riskScore = await calculateRiskScore(waterbodyName);

    // Generate contamination history
    const contaminationHistory = await generateContaminationHistory(waterbodyName);

    // Get last tested date
    const lastTest = await prisma.waterTest.findFirst({
      where: { waterbodyName: waterbodyName },
      orderBy: { dateTime: 'desc' },
      select: { dateTime: true }
    });

    // Generate QR code
    const qrCode = await generateQRCode(finalWaterbodyId);

    // Create or update health card
    const healthCard = await prisma.waterbodyHealthCard.upsert({
      where: { waterbodyId: finalWaterbodyId },
      update: {
        waterbodyName,
        location,
        latitude: typeof latitude === "number" ? latitude : null,
        longitude: typeof longitude === "number" ? longitude : null,
        riskScore,
        lastTestedDate: lastTest?.dateTime || null,
        contaminationHistory,
        qrCode,
        updatedAt: new Date()
      },
      create: {
        waterbodyName,
        waterbodyId: finalWaterbodyId,
        location,
        latitude: typeof latitude === "number" ? latitude : null,
        longitude: typeof longitude === "number" ? longitude : null,
        riskScore,
        lastTestedDate: lastTest?.dateTime || null,
        contaminationHistory,
        qrCode
      }
    });

    return res.status(200).json({
      healthCard: {
        id: healthCard.id,
        waterbodyName: healthCard.waterbodyName,
        waterbodyId: healthCard.waterbodyId,
        location: healthCard.location,
        latitude: healthCard.latitude,
        longitude: healthCard.longitude,
        riskScore: healthCard.riskScore,
        lastTestedDate: healthCard.lastTestedDate,
        contaminationHistory: healthCard.contaminationHistory,
        qrCode: healthCard.qrCode,
        createdAt: healthCard.createdAt,
        updatedAt: healthCard.updatedAt
      }
    });
  } catch (error) {
    console.error("createOrUpdateHealthCard error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get health card by waterbody ID
const getHealthCard = async (req, res) => {
  try {
    const { waterbodyId } = req.params;

    const healthCard = await prisma.waterbodyHealthCard.findUnique({
      where: { waterbodyId: waterbodyId }
    });

    if (!healthCard) {
      return res.status(404).json({ message: "Health card not found" });
    }

    return res.status(200).json({
      healthCard: {
        id: healthCard.id,
        waterbodyName: healthCard.waterbodyName,
        waterbodyId: healthCard.waterbodyId,
        location: healthCard.location,
        latitude: healthCard.latitude,
        longitude: healthCard.longitude,
        riskScore: healthCard.riskScore,
        lastTestedDate: healthCard.lastTestedDate,
        contaminationHistory: healthCard.contaminationHistory,
        qrCode: healthCard.qrCode,
        createdAt: healthCard.createdAt,
        updatedAt: healthCard.updatedAt
      }
    });
  } catch (error) {
    console.error("getHealthCard error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all health cards
const getAllHealthCards = async (req, res) => {
  try {
    // Check if user has permission
    if (!["admin", "leader", "asha"].includes(req.user.role)) {
      return res.status(403).json({ message: "forbidden" });
    }

    const healthCards = await prisma.waterbodyHealthCard.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    return res.status(200).json({
      healthCards: healthCards.map(card => ({
        id: card.id,
        waterbodyName: card.waterbodyName,
        waterbodyId: card.waterbodyId,
        location: card.location,
        latitude: card.latitude,
        longitude: card.longitude,
        riskScore: card.riskScore,
        lastTestedDate: card.lastTestedDate,
        contaminationHistory: card.contaminationHistory,
        qrCode: card.qrCode,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt
      }))
    });
  } catch (error) {
    console.error("getAllHealthCards error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update health card (refresh data)
const refreshHealthCard = async (req, res) => {
  try {
    const { waterbodyId } = req.params;

    // Check if user has permission
    if (!["admin", "leader", "asha"].includes(req.user.role)) {
      return res.status(403).json({ message: "forbidden" });
    }

    const existingCard = await prisma.waterbodyHealthCard.findUnique({
      where: { waterbodyId: waterbodyId }
    });

    if (!existingCard) {
      return res.status(404).json({ message: "Health card not found" });
    }

    // Recalculate risk score and contamination history
    const riskScore = await calculateRiskScore(existingCard.waterbodyName);
    const contaminationHistory = await generateContaminationHistory(existingCard.waterbodyName);

    // Get last tested date
    const lastTest = await prisma.waterTest.findFirst({
      where: { waterbodyName: existingCard.waterbodyName },
      orderBy: { dateTime: 'desc' },
      select: { dateTime: true }
    });

    // Update the health card
    const updatedCard = await prisma.waterbodyHealthCard.update({
      where: { waterbodyId: waterbodyId },
      data: {
        riskScore,
        lastTestedDate: lastTest?.dateTime || null,
        contaminationHistory,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      healthCard: {
        id: updatedCard.id,
        waterbodyName: updatedCard.waterbodyName,
        waterbodyId: updatedCard.waterbodyId,
        location: updatedCard.location,
        latitude: updatedCard.latitude,
        longitude: updatedCard.longitude,
        riskScore: updatedCard.riskScore,
        lastTestedDate: updatedCard.lastTestedDate,
        contaminationHistory: updatedCard.contaminationHistory,
        qrCode: updatedCard.qrCode,
        createdAt: updatedCard.createdAt,
        updatedAt: updatedCard.updatedAt
      }
    });
  } catch (error) {
    console.error("refreshHealthCard error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createOrUpdateHealthCard,
  getHealthCard,
  getAllHealthCards,
  refreshHealthCard
};
