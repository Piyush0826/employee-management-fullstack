import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Salary from "../models/Salary.js";
import Leave from "../models/Leave.js";
import User from "../models/User.js";


const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
    return res.status(200).json({ success: true, departments })
  } catch (error) {
    return res.status(500).json({ success: false, error: "get department server error" })
  }
}

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;

    const newDep = new Department({
      dep_name,
      description,
    });

    await newDep.save();

    return res.status(200).json({
      success: true,
      department: newDep,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "add department server error",
    });
  }
};
const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, error: "edit department server error" });
  }
}
 const updateDepartment = async (req, res) => { 
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const updatedDepartment = await Department.findByIdAndUpdate(
      { _id: id },
      { dep_name, description },
      { new: true }
    );
    return res.status(200).json({ success: true, department: updatedDepartment });
  } catch (error) {
    return res.status(500).json({ success: false, error: "update department server error" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find all employees in this department
    const employeesInDept = await Employee.find({ department: id });
    const employeeIds = employeesInDept.map(emp => emp._id);
    const userIds = employeesInDept.map(emp => emp.userId);
    
    // Delete all salaries for employees in this department
    if (employeeIds.length > 0) {
      await Salary.deleteMany({ employee: { $in: employeeIds } });
      
      // Delete all leaves for employees in this department
      await Leave.deleteMany({ employeeId: { $in: employeeIds } });
      
      // Delete all user accounts for employees in this department
      await User.deleteMany({ _id: { $in: userIds } });
    }
    
    // Delete all employees in this department
    await Employee.deleteMany({ department: id });
    
    // Delete the department
    const deletedep = await Department.findByIdAndDelete({ _id: id });
    return res.status(200).json({ 
      success: true, 
      message: "Department, employees, user accounts, salaries, and leaves deleted successfully",
      deletedCount: {
        employees: employeeIds.length,
        userAccounts: userIds.length,
        salaries: 0,
        leaves: 0
      }
    });
  } catch (error) {
    console.error("Delete department error:", error);
    return res.status(500).json({ success: false, error: "delete department server error" });
  }
};

export { addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment };
