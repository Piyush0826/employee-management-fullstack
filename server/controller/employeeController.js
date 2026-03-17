import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Salary from "../models/Salary.js";
import Leave from "../models/Leave.js";
import bcrypt from "bcryptjs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the server root directory
const serverRoot = path.join(__dirname, '..');

// Ensure uploads directory exists
const uploadsDir = path.join(serverRoot, 'public', 'uploads');
console.log('Uploads directory:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Normalize file extension to lowercase
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, Date.now() + ext); 
  }
});

const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;

    console.log('Received data:', req.body);
    console.log('File data:', req.file);
    if (req.file) {
      console.log('File saved at:', req.file.path);
      console.log('File filename:', req.file.filename);
    }

    // Validate required fields
    if (!name || !email || !employeeId || !password || !role || !department || !salary) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields" 
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "user already registered in emp" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });
    const savedUser = await newUser.save();
    
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary: Number(salary),
    });
    const newEmp = await newEmployee.save();
    return res.status(200).json({ success: true, message: "Employee added successfully", employee: newEmp });
  } catch (error) {
    console.error("Add employee error:", error);
    return res.status(500).json({ success: false, error: error.message || "add employee server error" });
  }
};
 const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('userId', 'name email profileImage')
      .populate('department', 'dep_name');  
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get employee server error" });
  } 
 }

 const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id)
      .populate('userId', 'name email profileImage')
      .populate('department', 'dep_name');
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Get employee by id error:", error);
    return res.status(500).json({ success: false, error: "get employee by id server error" });
  }
 }

 const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary
    } = req.body;

    // Validate required fields
    if (!name || !designation || !department || !salary) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields" 
      });
    }

    // Get the employee to find their userId
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Update user info (including profileImage if provided)
    const updateUserData = {
      name
    };
    
    if (req.file) {
      updateUserData.profileImage = req.file.filename;
    }

    await User.findByIdAndUpdate(
      employee.userId,
      updateUserData,
      { new: true }
    );

    // Update employee info
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        dob,
        gender,
        maritalStatus,
        designation,
        department,
        salary: Number(salary)
      },
      { new: true }
    )
    .populate('userId', 'name email profileImage')
    .populate('department', 'dep_name');

    console.log('Employee updated with file:', req.file?.filename);
    return res.status(200).json({ 
      success: true, 
      message: "Employee updated successfully", 
      employee: updatedEmployee 
    });
  } catch (error) {
    console.error("Update employee error:", error);
    return res.status(500).json({ success: false, error: error.message || "update employee server error" });
  }
 }

 const getEmployeeByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const employee = await Employee.findOne({ userId })
      .populate('userId', 'name email profileImage')
      .populate('department', 'dep_name');
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee profile not found" });
    }
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Get employee by user id error:", error);
    return res.status(500).json({ success: false, error: "get employee profile server error" });
  }
 }

const deleteEmployeesWithoutDept = async (req, res) => {
  try {
    // Find all employees with no department (department is null or undefined)
    const employeesWithoutDept = await Employee.find({ 
      $or: [
        { department: null },
        { department: undefined },
        { department: "" }
      ]
    });

    if (employeesWithoutDept.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: "No employees without department found",
        deletedCount: 0
      });
    }

    const employeeIds = employeesWithoutDept.map(emp => emp._id);
    const userIds = employeesWithoutDept.map(emp => emp.userId);

    // Delete salaries for these employees
    await Salary.deleteMany({ employee: { $in: employeeIds } });

    // Delete leaves for these employees
    await Leave.deleteMany({ employeeId: { $in: employeeIds } });

    // Delete user accounts
    await User.deleteMany({ _id: { $in: userIds } });

    // Delete employees
    await Employee.deleteMany({ _id: { $in: employeeIds } });

    return res.status(200).json({ 
      success: true, 
      message: "All employees without department deleted successfully",
      deletedCount: employeeIds.length,
      details: {
        employees: employeeIds.length,
        userAccounts: userIds.length,
        salaries: 0,
        leaves: 0
      }
    });
  } catch (error) {
    console.error("Delete employees without dept error:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || "delete employees without department server error" 
    });
  }
}

export { addEmployee, upload, getEmployees, getEmployeeById, updateEmployee, getEmployeeByUserId, deleteEmployeesWithoutDept };
