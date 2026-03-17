import React, { useState, useEffect } from 'react'
import SummaryCard from './SummaryCard'
import axios from 'axios'
import { 
    FaBuilding, 
    FaCheckCircle, 
    FaFileAlt, 
    FaHourglassHalf, 
    FaMoneyBillWave, 
    FaTimesCircle, 
    FaUsers 
} from 'react-icons/fa'

const API_BASE_URL = 'http://localhost:5000'

const AdminSummary = () => {
    const [summary, setSummary] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        monthlySalary: 0,
        leaveApplied: 0,
        leaveApproved: 0,
        leavePending: 0,
        leaveRejected: 0
    })

    useEffect(() => {
        fetchSummaryData()
    }, [])

    const fetchSummaryData = async () => {
        try {
            const token = localStorage.getItem('token')
            
            // Fetch employees
            const employeeRes = await axios.get(`${API_BASE_URL}/api/employee`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            
            // Fetch departments
            const departmentRes = await axios.get(`${API_BASE_URL}/api/department`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            
            // Fetch salaries
            const salaryRes = await axios.get(`${API_BASE_URL}/api/salary`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            
            // Fetch leaves
            const leaveRes = await axios.get(`${API_BASE_URL}/api/leave`, {
                headers: { "Authorization": `Bearer ${token}` }
            })

            // Calculate totals - check for correct response property names
            const totalEmployees = employeeRes.data.employees ? employeeRes.data.employees.length : 0
            const totalDepartments = departmentRes.data.departments ? departmentRes.data.departments.length : 0
            
            const monthlySalary = salaryRes.data.salaries ? 
                salaryRes.data.salaries.reduce((sum, salary) => sum + (salary.basicSalary || 0), 0) : 0
            
            const leaves = leaveRes.data.leaves || []
            const leaveApplied = leaves.length
            const leaveApproved = leaves.filter(l => l.status === 'Approved').length
            const leavePending = leaves.filter(l => l.status === 'Pending').length
            const leaveRejected = leaves.filter(l => l.status === 'Rejected').length

            setSummary({
                totalEmployees,
                totalDepartments,
                monthlySalary,
                leaveApplied,
                leaveApproved,
                leavePending,
                leaveRejected
            })
        } catch (error) {
            console.log('Error fetching summary data:', error.message)
        }
    }

    return (
        <div className='p-6'>
            <h3 className='text-2xl font-bold'>Dashboard Overview</h3>
            
            {/* Upper Grid: 3 Columns on Medium Screens */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
                <SummaryCard 
                    icon={<FaUsers />} text="Total Employees" number={summary.totalEmployees} color="bg-teal-600" 
                />
                <SummaryCard 
                    icon={<FaBuilding />} text="Total Departments" number={summary.totalDepartments} color="bg-yellow-600" 
                />
                <SummaryCard 
                    icon={<FaMoneyBillWave />} text="Monthly Salary" number={`$${summary.monthlySalary}`} color="bg-red-600" 
                />
            </div>

            <div className='mt-12'>
                <h4 className='text-center text-2xl font-bold'>Leave Details</h4>
                
                {/* Lower Grid: 2 Columns on Medium Screens */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <SummaryCard 
                        icon={<FaFileAlt />} text="Leave Applied" number={summary.leaveApplied} color="bg-teal-600" 
                    />
                    <SummaryCard 
                        icon={<FaCheckCircle />} text="Leave Approved" number={summary.leaveApproved} color="bg-green-600" 
                    />
                    <SummaryCard 
                        icon={<FaHourglassHalf />} text="Leave Pending" number={summary.leavePending} color="bg-yellow-600" 
                    />
                    <SummaryCard 
                        icon={<FaTimesCircle />} text="Leave Rejected" number={summary.leaveRejected} color="bg-red-600" 
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminSummary