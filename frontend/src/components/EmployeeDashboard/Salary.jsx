import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const Salary = () => {
  const { user } = useAuth()
  const [salaries, setSalaries] = useState([])
  const [employeeProfile, setEmployeeProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEmployeeProfile()
  }, [user])

  useEffect(() => {
    if (employeeProfile) {
      fetchSalaries()
    }
  }, [employeeProfile])

  const fetchEmployeeProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      if (user && user._id) {
        const response = await axios.get(
          `${API_BASE_URL}/api/employee/profile/${user._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
        if (response.data.success) {
          setEmployeeProfile(response.data.employee)
        }
      }
    } catch (error) {
      console.error('Error fetching employee profile:', error)
      setLoading(false)
    }
  }

  const fetchSalaries = async () => {
    try {
      const token = localStorage.getItem("token")
      if (employeeProfile && employeeProfile._id) {
        const response = await axios.get(
          `${API_BASE_URL}/api/salary`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
        if (response.data.success) {
          // Filter salaries for current employee
          const employeeSalaries = response.data.salaries.filter(
            sal => sal.employee?._id === employeeProfile._id
          )
          setSalaries(employeeSalaries)
        }
      }
    } catch (error) {
      console.error('Error fetching salaries:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSalaries = searchTerm
    ? salaries.filter(salary =>
        salary.employee?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : salaries

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600">Loading salary history...</p>
      </div>
    )
  }

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h2 className='text-4xl font-bold text-center mb-8 text-gray-800'>Salary History</h2>

      <div className='mb-8 flex justify-end'>
        <input
          type='text'
          placeholder='Search By Emp ID'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='px-5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 w-64'
        />
      </div>

      <div className='bg-white rounded-lg shadow-sm overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='bg-gray-50 border-b-2 border-gray-200'>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>SNO</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>EMP ID</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>SALARY</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>ALLOWANCE</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>DEDUCTION</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>TOTAL</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>PAY DATE</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.length > 0 ? (
              filteredSalaries.map((salary, index) => (
                <tr key={salary._id} className='border-b border-gray-100 hover:bg-gray-50'>
                  <td className='px-8 py-4 text-sm text-gray-700'>{index + 1}</td>
                  <td className='px-8 py-4 text-sm text-gray-700'>{salary.employee?.employeeId || 'N/A'}</td>
                  <td className='px-8 py-4 text-sm text-gray-700'>{salary.basicSalary || 'N/A'}</td>
                  <td className='px-8 py-4 text-sm text-gray-700'>{salary.allowance || 0}</td>
                  <td className='px-8 py-4 text-sm text-gray-700'>{salary.deduction || 0}</td>
                  <td className='px-8 py-4 text-sm font-semibold text-gray-900'>
                    {(salary.basicSalary || 0) + (salary.allowance || 0) - (salary.deduction || 0)}
                  </td>
                  <td className='px-8 py-4 text-sm text-gray-700'>
                    {salary.payDate ? new Date(salary.payDate).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='7' className='px-8 py-8 text-center text-gray-500 text-sm'>
                  No salary records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredSalaries.length > 0 && (
        <div className='mt-4 text-sm text-gray-600'>
          Showing {filteredSalaries.length} salary record(s)
        </div>
      )}
    </div>
  )
}

export default Salary
