import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addEmployee, upload, getEmployees, getEmployeeById, updateEmployee, getEmployeeByUserId, deleteEmployeesWithoutDept } from "../controller/employeeController.js";

const router = express.Router();

router.get("/", authMiddleware, getEmployees);
router.get("/profile/:userId", authMiddleware, getEmployeeByUserId);
router.get("/:id", authMiddleware, getEmployeeById);
router.post("/add", authMiddleware, upload.single('image'), addEmployee);
router.put("/:id", authMiddleware, upload.single('image'), updateEmployee);
router.delete("/cleanup/no-department", authMiddleware, deleteEmployeesWithoutDept);

 
export default router;
