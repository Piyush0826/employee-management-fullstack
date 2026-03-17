import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import authRouter from "./routes/auth.js"
import departmentRouter from "./routes/department.js"
import employeeRouter from "./routes/employee.js"
import salaryRouter from "./routes/salary.js"
import leaveRouter from "./routes/leave.js"
import connectDB from "./db/db.js"
// Import models to ensure they're registered
import User from "./models/User.js"
import Department from "./models/Department.js"
import Employee from "./models/Employee.js"
import Salary from "./models/Salary.js"
import Leave from "./models/Leave.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

console.log('__dirname:', __dirname)
console.log('Public path:', path.join(__dirname, 'public'))
console.log('Uploads path:', path.join(__dirname, 'public', 'uploads'))

// Middleware
app.use(cors())
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(express.static(path.join(__dirname, 'public')))

// Explicit route for uploads - serve files directly
app.get('/uploads/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    const filepath = path.join(__dirname, 'public', 'uploads', filename);
    res.sendFile(filepath);
  } catch (err) {
    console.error('Upload file error:', err);
    res.status(500).json({ error: 'Failed to serve file' });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working', uploads_path: path.join(__dirname, 'public', 'uploads') });
});

// Routes
app.use("/api/auth", authRouter)
app.use("/api/department", departmentRouter)
app.use("/api/employee", employeeRouter)
app.use("/api/salary", salaryRouter)
app.use("/api/leave", leaveRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({ 
    success: false, 
    error: err.message || "Internal server error" 
  })
})

// Start server only after DB connects
const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    console.log('Database connection successful')
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on http://0.0.0.0:${PORT}`)
      console.log(`Test endpoint: http://localhost:${PORT}/test`)
      console.log(`Uploads route: http://localhost:${PORT}/uploads/:filename`)
    })
  })
  .catch((err) => {
    console.error('Database connection failed:', err)
    console.log('Server will still start for testing...')
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (DB connection failed)`)
    })
  })
  .catch((err) => {
    console.error("Database connection failed", err)
  })
