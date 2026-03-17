import express from 'express'
import {
  addSalary,
  getSalaries,
  getSalaryById,
  updateSalary,
  deleteSalary
} from '../controller/salaryController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// Add salary (POST)
router.post('/add', authMiddleware, addSalary)

// Get all salaries (GET)
router.get('/', authMiddleware, getSalaries)

// Get salary by ID (GET)
router.get('/:id', authMiddleware, getSalaryById)

// Update salary (PUT)
router.put('/:id', authMiddleware, updateSalary)

// Delete salary (DELETE)
router.delete('/:id', authMiddleware, deleteSalary)

export default router
