import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'
import { handleImageError } from '../../utils/EmployeeHelper'

const Profile = () => {
  const { user } = useAuth()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
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
            setEmployee(response.data.employee)
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading profile details...</p>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto m-5 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-3xl font-bold mb-8">Employee Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Profile Image */}
        <div className="flex flex-col items-center">
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
                className="w-48 h-48 bg-teal-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mb-4"
                style={{ display: 'none' }}
              >
                {employee.userId?.name?.charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <div className="w-48 h-48 bg-teal-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mb-4">
              {employee.userId?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Right Column - Detailed Information */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-gray-700">Name:</label>
            <p className="text-lg text-gray-900">{employee.userId?.name}</p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-gray-700">Employee ID:</label>
            <p className="text-lg text-gray-900">{employee.employeeId}</p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-gray-700">Date of Birth:</label>
            <p className="text-lg text-gray-900">{employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}</p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-gray-700">Gender:</label>
            <p className="text-lg text-gray-900">{employee.gender || 'N/A'}</p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-gray-700">Department:</label>
            <p className="text-lg text-gray-900">{employee.department?.dep_name || 'N/A'}</p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-gray-700">Marital Status:</label>
            <p className="text-lg text-gray-900">{employee.maritalStatus || 'N/A'}</p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-gray-700">Designation:</label>
            <p className="text-lg text-gray-900">{employee.designation || 'N/A'}</p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-gray-700">Salary:</label>
            <p className="text-lg text-gray-900">${employee.salary?.toLocaleString() || 'N/A'}</p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-gray-700">Email:</label>
            <p className="text-lg text-gray-900">{employee.userId?.email || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
