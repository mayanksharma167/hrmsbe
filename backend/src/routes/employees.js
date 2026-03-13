const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  deleteEmployee,
} = require("../controllers/employeeController");
const { validateEmployee } = require("../middleware/validate");

router.post("/", validateEmployee, createEmployee);
router.get("/", getAllEmployees);
router.delete("/:id", deleteEmployee);

module.exports = router;
