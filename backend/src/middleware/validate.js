const { body, validationResult } = require("express-validator");

// Reusable handler to return validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: "Validation Error",
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Validation rules for creating an employee
const validateEmployee = [
  body("employee_id")
    .trim()
    .notEmpty()
    .withMessage("Employee ID is required.")
    .isLength({ max: 50 })
    .withMessage("Employee ID must be 50 characters or fewer."),

  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ max: 255 })
    .withMessage("Full name must be 255 characters or fewer."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail(),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required.")
    .isLength({ max: 100 })
    .withMessage("Department must be 100 characters or fewer."),

  handleValidation,
];

// Validation rules for marking attendance
const validateAttendance = [
  body("employeeId")
    .notEmpty()
    .withMessage("Employee ID is required.")
    .isMongoId()
    .withMessage("Invalid employee ID format."),

  body("date")
    .notEmpty()
    .withMessage("Date is required.")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format."),

  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(["PRESENT", "ABSENT", "present", "absent"])
    .withMessage("Status must be PRESENT or ABSENT."),

  handleValidation,
];

module.exports = { validateEmployee, validateAttendance };
