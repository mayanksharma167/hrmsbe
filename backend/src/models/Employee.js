const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

module.exports = mongoose.model("Employee", employeeSchema);
