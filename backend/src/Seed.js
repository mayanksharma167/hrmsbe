require("dotenv").config();
const mongoose = require("mongoose");
const Employee = require("./models/Employee");
const Attendance = require("./models/Attendance");

const employees = [
  {
    employee_id: "EMP001",
    full_name: "Aisha Sharma",
    email: "aisha.sharma@hrms.com",
    department: "Engineering",
  },
  {
    employee_id: "EMP002",
    full_name: "Rohan Mehta",
    email: "rohan.mehta@hrms.com",
    department: "Engineering",
  },
  {
    employee_id: "EMP003",
    full_name: "Priya Kapoor",
    email: "priya.kapoor@hrms.com",
    department: "Design",
  },
  {
    employee_id: "EMP004",
    full_name: "Dev Patel",
    email: "dev.patel@hrms.com",
    department: "Product",
  },
  {
    employee_id: "EMP005",
    full_name: "Neha Gupta",
    email: "neha.gupta@hrms.com",
    department: "HR",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing data
    await Attendance.deleteMany({});
    await Employee.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert employees
    const created = await Employee.insertMany(employees);
    console.log(`👥 Inserted ${created.length} employees`);

    // Generate attendance for the last 7 days
    const today = new Date();
    const statuses = ["PRESENT", "ABSENT"];
    const attendanceRecords = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      for (const emp of created) {
        // Randomly assign status, biased toward PRESENT
        const status = Math.random() < 0.8 ? "PRESENT" : "ABSENT";
        attendanceRecords.push({
          employee: emp._id,
          employee_id: emp.employee_id,
          date: dateStr,
          status,
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(
      `📅 Inserted ${attendanceRecords.length} attendance records (7 days)`,
    );

    console.log("\n✨ Seed complete! Your HRMS Lite is ready with demo data.");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
