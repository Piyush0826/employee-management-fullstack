import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { 
  addLeave, 
  getLeavesByUserId, 
  getLeavesByEmployeeId, 
  updateLeave, 
  deleteLeave,
  updateLeaveStatus,
  getAllLeaves,
  getLeaveById
} from "../controller/leaveController.js";

const router = express.Router();

// Employee routes
router.get("/", authMiddleware, getAllLeaves);
router.post("/add", authMiddleware, addLeave);
router.get("/user/:userId", authMiddleware, getLeavesByUserId);
router.get("/employee/:employeeId", authMiddleware, getLeavesByEmployeeId);
router.put("/:id/status", authMiddleware, updateLeaveStatus);
router.get("/:id", authMiddleware, getLeaveById);
router.put("/:id", authMiddleware, updateLeave);
router.delete("/:id", authMiddleware, deleteLeave);

export default router;
