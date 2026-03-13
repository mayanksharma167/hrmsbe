const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    // Store employee_id string for easy querying / display
    employee_id: {
      type: String,
      required: true,
    },
    date: {
      type: String, // stored as "YYYY-MM-DD" for easy filtering
      required: true,
    },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate attendance entries for same employee on same date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
