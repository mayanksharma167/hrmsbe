const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAttendanceByEmployee,
  getAllAttendance,
} = require("../controllers/attendanceController");
const { validateAttendance } = require("../middleware/validate");

router.post("/", validateAttendance, markAttendance);
router.get("/", getAllAttendance); // supports ?date=YYYY-MM-DD
router.get("/:employeeId", getAttendanceByEmployee);

module.exports = router;
