import mongoose from 'mongoose'

const salarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    basicSalary: {
      type: Number,
      required: true
    },
    allowances: {
      type: Number,
      default: 0
    },
    deductions: {
      type: Number,
      default: 0
    },
    netSalary: {
      type: Number
    },
    payDate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
)

const Salary = mongoose.model('Salary', salarySchema)
export default Salary
