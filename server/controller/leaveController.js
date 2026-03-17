import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

const addLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, description } = req.body;
    const userId = req.user._id; // From auth middleware

    // Validate required fields
    if (!employeeId || !leaveType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    const newLeave = new Leave({
      employeeId,
      userId,
      leaveType,
      startDate,
      endDate,
      description
    });

    const savedLeave = await newLeave.save();
    return res.status(200).json({
      success: true,
      message: "Leave request submitted successfully",
      leave: savedLeave
    });
  } catch (error) {
    console.error("Add leave error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "add leave server error"
    });
  }
};

const getLeavesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const leaves = await Leave.find({ userId })
      .populate("employeeId", "employeeId designation")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leaves
    });
  } catch (error) {
    console.error("Get leaves error:", error);
    return res.status(500).json({
      success: false,
      error: "get leaves server error"
    });
  }
};

const getLeavesByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const leaves = await Leave.find({ employeeId })
      .populate("employeeId", "employeeId designation")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leaves
    });
  } catch (error) {
    console.error("Get leaves by employee id error:", error);
    return res.status(500).json({
      success: false,
      error: "get leaves server error"
    });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { leaveType, startDate, endDate, description } = req.body;

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        error: "Leave not found"
      });
    }

    // Only allow updates if leave is still pending
    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        error: "Cannot update approved or rejected leave"
      });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      {
        leaveType,
        startDate,
        endDate,
        description,
        updatedAt: Date.now()
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Leave updated successfully",
      leave: updatedLeave
    });
  } catch (error) {
    console.error("Update leave error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "update leave server error"
    });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        error: "Leave not found"
      });
    }

    // Only allow deletion if leave is still pending
    if (leave.status !== "Pending") {
      return res.status(400).json({
        success: false,
        error: "Cannot delete approved or rejected leave"
      });
    }

    await Leave.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Leave deleted successfully"
    });
  } catch (error) {
    console.error("Delete leave error:", error);
    return res.status(500).json({
      success: false,
      error: "delete leave server error"
    });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status"
      });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({
        success: false,
        error: "Leave not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Leave status updated successfully",
      leave: updatedLeave
    });
  } catch (error) {
    console.error("Update leave status error:", error);
    return res.status(500).json({
      success: false,
      error: "update leave status server error"
    });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: "employeeId",
        select: "employeeId designation department salary",
        populate: {
          path: "department"
        }
      })
      .populate("userId", "name email profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leaves
    });
  } catch (error) {
    console.error("Get all leaves error:", error);
    return res.status(500).json({
      success: false,
      error: "get all leaves server error"
    });
  }
};

const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id)
      .populate({
        path: "employeeId",
        select: "employeeId designation department salary",
        populate: {
          path: "department"
        }
      })
      .populate("userId", "name email profileImage");

    if (!leave) {
      return res.status(404).json({
        success: false,
        error: "Leave not found"
      });
    }

    return res.status(200).json({
      success: true,
      leave
    });
  } catch (error) {
    console.error("Get leave by id error:", error);
    return res.status(500).json({
      success: false,
      error: "get leave server error"
    });
  }
};

export { addLeave, getLeavesByUserId, getLeavesByEmployeeId, updateLeave, deleteLeave, updateLeaveStatus, getAllLeaves, getLeaveById };
