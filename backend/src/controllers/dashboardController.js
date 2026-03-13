const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");

const getDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [totalEmployees, presentToday, absentToday, recentAttendance] =
      await Promise.all([
        Employee.countDocuments(),
        Attendance.countDocuments({ date: today, status: "PRESENT" }),
        Attendance.countDocuments({ date: today, status: "ABSENT" }),
        Attendance.find()
          .populate("employee", "full_name employee_id department")
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    const presentDaysPerEmployee = await Attendance.aggregate([
      { $match: { status: "PRESENT" } },
      {
        $group: {
          _id: "$employee",
          totalPresent: { $sum: 1 },
          employee_id: { $first: "$employee_id" },
        },
      },
      { $sort: { totalPresent: -1 } },
    ]);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);

    const weeklyRaw = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: weekStart.toISOString().split("T")[0] },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: { $toDate: "$date" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeklyTrendMap = {};

    weeklyRaw.forEach((row) => {
      const day = dayMap[row._id.day - 1];

      if (!weeklyTrendMap[day]) {
        weeklyTrendMap[day] = {
          day,
          present: 0,
          absent: 0,
        };
      }

      if (row._id.status === "PRESENT") {
        weeklyTrendMap[day].present = row.count;
      }

      if (row._id.status === "ABSENT") {
        weeklyTrendMap[day].absent = row.count;
      }
    });

    const weeklyTrend = Object.values(weeklyTrendMap);

    return res.status(200).json({
      totalEmployees,
      presentToday,
      absentToday,
      notMarkedToday: totalEmployees - presentToday - absentToday,
      recentAttendance,
      presentDaysPerEmployee,
      weeklyTrend, // ✅ Added
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

module.exports = { getDashboard };
