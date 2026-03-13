const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// POST /api/attendance
const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    // employeeId here is the MongoDB ObjectId
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Employee not found." });
    }

    // Check for duplicate attendance for same employee on same date
    const existing = await Attendance.findOne({ employee: employeeId, date });
    if (existing) {
      return res.status(409).json({
        error: "Conflict",
        message: `Attendance for ${employee.full_name} on ${date} already marked as ${existing.status}.`,
      });
    }

    const record = await Attendance.create({
      employee: employeeId,
      employee_id: employee.employee_id,
      date,
      status: status.toUpperCase(),
    });

    return res.status(201).json(record);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Conflict",
        message: "Attendance for this employee on this date already exists.",
      });
    }
    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

// GET /api/attendance/:employeeId
const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Employee not found." });
    }

    const records = await Attendance.find({ employee: employeeId }).sort({
      date: -1,
    });

    return res.status(200).json(records);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

// GET /api/attendance?date=YYYY-MM-DD
const getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = {};
    if (date) filter.date = date;

    const records = await Attendance.find(filter)
      .populate("employee", "full_name employee_id department email")
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json(records);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

module.exports = { markAttendance, getAttendanceByEmployee, getAllAttendance };
