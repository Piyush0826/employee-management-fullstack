import Salary from '../models/Salary.js'
import Employee from '../models/Employee.js'

const addSalary = async (req, res) => {
  try {
    const { employee, basicSalary, allowances, deductions, payDate } = req.body

    console.log('=== Adding Salary ===')
    console.log('Request body:', req.body)

    if (!employee || !basicSalary || !payDate) {
      console.log('Missing required fields')
      return res.status(400).json({
        success: false,
        error: 'Employee, Basic Salary, and Pay Date are required'
      })
    }

    // Calculate net salary
    const netSalary = Number(basicSalary) + (Number(allowances) || 0) - (Number(deductions) || 0)

    console.log('Creating new salary document...')
    const newSalary = new Salary({
      employee,
      basicSalary: Number(basicSalary),
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      netSalary: netSalary,
      payDate: new Date(payDate)
    })

    console.log('Salary object created, saving to database...')
    await newSalary.save()
    console.log('Salary saved successfully')

    // Populate employee data after saving
    const populatedSalary = await Salary.findById(newSalary._id).populate({
      path: 'employee',
      populate: {
        path: 'userId',
        select: 'name email'
      }
    })

    res.status(201).json({
      success: true,
      message: 'Salary added successfully',
      salary: populatedSalary
    })
  } catch (error) {
    console.error('=== ERROR ADDING SALARY ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    if (error.errors) {
      console.error('Validation errors:', error.errors)
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add salary'
    })
  }
}

const getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate({
        path: 'employee',
        select: 'employeeId userId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ payDate: -1 })

    res.json({
      success: true,
      salaries
    })
  } catch (error) {
    console.error('Error fetching salaries:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

const getSalaryById = async (req, res) => {
  try {
    const { id } = req.params
    const salary = await Salary.findById(id).populate({
      path: 'employee',
      select: 'employeeId userId',
      populate: {
        path: 'userId',
        select: 'name email'
      }
    })

    if (!salary) {
      return res.status(404).json({
        success: false,
        error: 'Salary record not found'
      })
    }

    res.json({
      success: true,
      salary
    })
  } catch (error) {
    console.error('Error fetching salary:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

const updateSalary = async (req, res) => {
  try {
    const { id } = req.params
    const { basicSalary, allowances, deductions, payDate } = req.body

    const salary = await Salary.findByIdAndUpdate(
      id,
      { basicSalary, allowances, deductions, payDate },
      { new: true }
    )

    if (!salary) {
      return res.status(404).json({
        success: false,
        error: 'Salary record not found'
      })
    }

    res.json({
      success: true,
      message: 'Salary updated successfully',
      salary
    })
  } catch (error) {
    console.error('Error updating salary:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params
    const salary = await Salary.findByIdAndDelete(id)

    if (!salary) {
      return res.status(404).json({
        success: false,
        error: 'Salary record not found'
      })
    }

    res.json({
      success: true,
      message: 'Salary deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting salary:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export { addSalary, getSalaries, getSalaryById, updateSalary, deleteSalary }
