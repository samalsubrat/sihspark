import prisma from "../lib/db.js";

const listLeaderAlerts = async (req, res) => {
  try {
    if (!req.user || !["leader", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "forbidden" });
    }

    const { limit = 50, cursor } = req.query;
    const take = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const alerts = await prisma.leaderAlert.findMany({
      take,
      ...(cursor ? { skip: 1, cursor: { id: String(cursor) } } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        waterTest: {
          select: {
            id: true,
            waterbodyName: true,
            location: true,
            quality: true,
            dateTime: true,
            asha: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      alerts,
      nextCursor: alerts.length === take ? alerts[alerts.length - 1].id : null,
    });
  } catch (error) {
    console.error("listLeaderAlerts error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const listGlobalAlerts = async (req, res) => {
  try {
    if (!req.user || !["leader", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "forbidden" });
    }

    const { limit = 50, cursor } = req.query;
    const take = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const alerts = await prisma.globalAlert.findMany({
      take,
      ...(cursor ? { skip: 1, cursor: { id: String(cursor) } } : {}),
      orderBy: { createdAt: "desc" },
      include: {
        waterTest: {
          select: {
            id: true,
            waterbodyName: true,
            location: true,
            quality: true,
            dateTime: true,
            asha: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      alerts,
      nextCursor: alerts.length === take ? alerts[alerts.length - 1].id : null,
    });
  } catch (error) {
    console.error("listGlobalAlerts error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllAlerts = async (req, res) => {
  try {
    if (!req.user || !["leader", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "forbidden" });
    }

    const { limit = 50, cursor } = req.query;
    const take = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    // Get both leader and global alerts
    const [leaderAlerts, globalAlerts] = await Promise.all([
      prisma.leaderAlert.findMany({
        take: Math.floor(take / 2),
        orderBy: { createdAt: "desc" },
        include: {
          leader: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          waterTest: {
            select: {
              id: true,
              waterbodyName: true,
              location: true,
              quality: true,
              dateTime: true,
              asha: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.globalAlert.findMany({
        take: Math.ceil(take / 2),
        orderBy: { createdAt: "desc" },
        include: {
          waterTest: {
            select: {
              id: true,
              waterbodyName: true,
              location: true,
              quality: true,
              dateTime: true,
              asha: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Combine and sort all alerts by creation date
    const allAlerts = [
      ...leaderAlerts.map(alert => ({ ...alert, type: 'leader' })),
      ...globalAlerts.map(alert => ({ ...alert, type: 'global' })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      alerts: allAlerts.slice(0, take),
      nextCursor: allAlerts.length > take ? allAlerts[take - 1].id : null,
    });
  } catch (error) {
    console.error("getAllAlerts error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAlertStats = async (req, res) => {
  try {
    if (!req.user || !["leader", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "forbidden" });
    }

    const [leaderAlertCount, globalAlertCount, recentAlerts] = await Promise.all([
      prisma.leaderAlert.count(),
      prisma.globalAlert.count(),
      prisma.leaderAlert.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    return res.status(200).json({
      stats: {
        totalLeaderAlerts: leaderAlertCount,
        totalGlobalAlerts: globalAlertCount,
        totalAlerts: leaderAlertCount + globalAlertCount,
        recentAlerts,
      },
    });
  } catch (error) {
    console.error("getAlertStats error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  listLeaderAlerts,
  listGlobalAlerts,
  getAllAlerts,
  getAlertStats,
};
