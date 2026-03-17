import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { handleImageError } from '../../utils/EmployeeHelper'
import { API_BASE_URL } from '../../config/api'

const View = () => {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        if (response.data.success) {
          setEmployee(response.data.employee)
        }
      } catch (error) {
        console.error('Error fetching employee:', error)
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchEmployee()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading employee details...</p>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Employee not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-8">Employee Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Profile Image and Basic Info */}
        <div className="flex flex-col items-center relative">
          {employee.userId?.profileImage ? (
            <>
              <img
                src={`${API_BASE_URL}/uploads/${employee.userId.profileImage}`}
                alt={employee.userId?.name}
                className="w-48 h-48 rounded-full object-cover mb-4"
                onError={(e) => handleImageError(e, employee.userId.profileImage)}
              />
              <div 
                data-fallback-avatar
                className="w-48 h-48 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold mb-4"
                style={{ display: 'none' }}
              >
                {employee.userId?.name?.charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <div className="w-48 h-48 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold mb-4">
              {employee.userId?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <h3 className="text-2xl font-bold text-center">{employee.userId?.name}</h3>
          <p className="text-gray-600 text-center">{employee.designation}</p>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{employee.userId?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Employee ID</label>
            <p className="mt-1 text-gray-900">{employee.employeeId}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <p className="mt-1 text-gray-900">
              {employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <p className="mt-1 text-gray-900">{employee.gender || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Marital Status</label>
            <p className="mt-1 text-gray-900">{employee.maritalStatus || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <p className="mt-1 text-gray-900">{employee.department?.dep_name || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Designation</label>
            <p className="mt-1 text-gray-900">{employee.designation}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <p className="mt-1 text-gray-900">₹{employee.salary?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default View