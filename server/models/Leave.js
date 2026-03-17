import mongoose from "mongoose";
import { Schema } from "mongoose";

const leaveSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  leaveType: { type: String, required: true }, // Sick Leave, Casual Leave, etc.
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
  appliedDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
