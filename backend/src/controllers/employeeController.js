const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");

// POST /api/employees
const createEmployee = async (req, res) => {
  try {
    const { employee_id, full_name, email, department } = req.body;

    // Check for duplicate employee_id
    const existingById = await Employee.findOne({
      employee_id: employee_id.toUpperCase(),
    });
    if (existingById) {
      return res.status(409).json({
        error: "Conflict",
        message: `Employee ID "${employee_id.toUpperCase()}" already exists.`,
      });
    }

    // Check for duplicate email
    const existingByEmail = await Employee.findOne({
      email: email.toLowerCase(),
    });
    if (existingByEmail) {
      return res.status(409).json({
        error: "Conflict",
        message: `Email "${email}" is already registered.`,
      });
    }

    const employee = await Employee.create({
      employee_id,
      full_name,
      email,
      department,
    });

    return res.status(201).json(employee);
  } catch (err) {
    // Mongoose duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        error: "Conflict",
        message: `Duplicate value for field: ${field}`,
      });
    }
    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

// GET /api/employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return res.status(200).json(employees);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Employee not found." });
    }

    // Cascade delete attendance records
    await Attendance.deleteMany({ employee: id });
    await Employee.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Employee and related attendance records deleted." });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error", message: err.message });
  }
};

module.exports = { createEmployee, getAllEmployees, deleteEmployee };
