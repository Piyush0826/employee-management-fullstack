import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE_URL } from '../../config/api'

const List = () => {
  const [salaries, setSalaries] = useState([])
  const [filteredSalaries, setFilteredSalaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { employeeId } = useParams()

  useEffect(() => {
    fetchSalaries()
  }, [])

  useEffect(() => {
    // Filter salaries by employee ID (exact match) or by URL parameter
    let filtered = salaries

    // If employeeId is in URL, filter to that employee
    if (employeeId) {
      filtered = filtered.filter(
        (salary) =>
          salary.employee?.employeeId?.toString() === employeeId.toString()
      )
      // Auto-fill search term to show which employee is being viewed
      if (filtered.length > 0) {
        setSearchTerm(employeeId)
      }
    } else if (searchTerm.trim() !== '') {
      // Otherwise, filter by search term if provided
      filtered = filtered.filter(
        (salary) =>
          salary.employee?.employeeId
            ?.toString()
            .toLowerCase()
            === searchTerm.toLowerCase()
      )
    }

    setFilteredSalaries(filtered)
  }, [searchTerm, salaries, employeeId])

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/salary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        setSalaries(response.data.salaries)
      }
    } catch (error) {
      console.error('Error fetching salaries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/salary/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data.success) {
          alert('Salary deleted successfully')
          fetchSalaries()
        }
      } catch (error) {
        console.error('Error deleting salary:', error)
        alert('Failed to delete salary')
      }
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  return (
    <div className="p-6">
      {employeeId && (
        <button
          onClick={() => navigate('/admin-dashboard/employees')}
          className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-semibold"
        >
          ← Back to Employees
        </button>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {employeeId ? `Salary Management - Employee ID: ${employeeId}` : 'Salary Management'}
        </h2>
        <button
          onClick={() => navigate('/admin-dashboard/add-salary')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Add New Salary
        </button>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search By Emp ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredSalaries.length === 0 ? (
        <div className="text-center p-4 bg-gray-100 rounded">
          <p>No salary records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">SNO</th>
                <th className="border p-3 text-left">EMP ID</th>
                <th className="border p-3 text-left">SALARY</th>
                <th className="border p-3 text-left">ALLOWANCE</th>
                <th className="border p-3 text-left">DEDUCTION</th>
                <th className="border p-3 text-left">TOTAL</th>
                <th className="border p-3 text-left">PAY DATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map((salary, index) => (
                <tr key={salary._id} className="border-b hover:bg-gray-50">
                  <td className="border p-3">{index + 1}</td>
                  <td className="border p-3">
                    {salary.employee?.employeeId || 'N/A'}
                  </td>
                  <td className="border p-3">{salary.basicSalary}</td>
                  <td className="border p-3">{salary.allowances}</td>
                  <td className="border p-3">{salary.deductions}</td>
                  <td className="border p-3 font-bold">{salary.netSalary}</td>
                  <td className="border p-3">
                    {new Date(salary.payDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default List
