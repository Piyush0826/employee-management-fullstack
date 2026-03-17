import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'
import { handleImageError } from '../../utils/EmployeeHelper'

const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [newImage, setNewImage] = useState(null)

  useEffect(() => {
    const fetchEmployee = async () => {
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
          setImagePreview(response.data.employee.userId?.profileImage || null)
          setFormData({
            name: response.data.employee.userId?.name || '',
            email: response.data.employee.userId?.email || '',
            employeeId: response.data.employee.employeeId,
            dob: response.data.employee.dob ? response.data.employee.dob.split('T')[0] : '',
            gender: response.data.employee.gender || '',
            maritalStatus: response.data.employee.maritalStatus || '',
            designation: response.data.employee.designation,
            department: response.data.employee.department?._id || '',
            salary: response.data.employee.salary
          })
        }
      } catch (error) {
        console.error('Error fetching employee:', error)
        alert('Failed to load employee details')
      }
    }

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/department`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data.success) {
          setDepartments(response.data.departments)
        }
      } catch (error) {
        console.error('Error fetching departments:', error)
      }
    }

    fetchEmployee()
    fetchDepartments()
    setLoading(false)
  }, [id])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      if (files && files[0]) {
        setNewImage(files[0])
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(files[0])
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.designation || !formData.department) {
      alert('Please fill in all required fields')
      return
    }

    try {
      let submitData

      if (newImage) {
        // Use FormData for file upload
        submitData = new FormData()
        submitData.append('name', formData.name)
        submitData.append('maritalStatus', formData.maritalStatus)
        submitData.append('designation', formData.designation)
        submitData.append('department', formData.department)
        submitData.append('salary', formData.salary)
        submitData.append('image', newImage)
      } else {
        // Use JSON if no image
        submitData = formData
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/employee/${id}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            ...(newImage ? {} : { 'Content-Type': 'application/json' })
          }
        }
      )

      if (response.data.success) {
        alert('Employee updated successfully')
        navigate('/admin-dashboard/employees')
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      if (error.response) {
        alert(error.response.data.error || 'Failed to update employee')
      } else {
        alert('Server not reachable. Make sure the backend is running on port 5000')
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading employee details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>

      <form onSubmit={handleSubmit}>
        {/* Profile Image Section */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            {imagePreview ? (
              <div className="relative">
                {imagePreview.startsWith('data:') ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={`${API_BASE_URL}/uploads/${imagePreview}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                    onError={(e) => handleImageError(e, imagePreview)}
                  />
                )}
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Photo</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Department */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Update Employee
        </button>
      </form>
    </div>
  )
}

export default Edit
