import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const AdminSettings = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [cleanupLoading, setCleanupLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [cleanupMessage, setCleanupMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleCleanupEmployees = async () => {
    const confirm = window.confirm(
      '⚠️  WARNING: This will permanently delete all employees that have no department assigned, including:\n\n• Employee records\n• User accounts\n• Associated salaries\n• Associated leaves\n\nThis action cannot be undone. Continue?'
    )
    
    if (!confirm) return

    setCleanupLoading(true)
    setCleanupMessage('')
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/employee/cleanup/no-department`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.data.success) {
        setCleanupMessage(`✅ ${response.data.message} (${response.data.deletedCount} employees deleted)`)
        setTimeout(() => setCleanupMessage(''), 3000)
      }
    } catch (error) {
      setCleanupMessage(`❌ ${error.response?.data?.error || 'Failed to cleanup employees'}`)
      setTimeout(() => setCleanupMessage(''), 3000)
    } finally {
      setCleanupLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous messages
    setSuccessMessage('')
    setErrorMessage('')

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setErrorMessage('All fields are required')
      return
    }

    if (formData.newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('New password and confirm password do not match')
      return
    }

    if (formData.oldPassword === formData.newPassword) {
      setErrorMessage('New password must be different from old password')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/change-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.data.success) {
        setSuccessMessage('Password changed successfully!')
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          navigate('/admin-dashboard')
        }, 2000)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || 'Failed to change password')
      } else {
        setErrorMessage('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Settings</h2>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h3>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md border border-green-300">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md font-semibold text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Database Cleanup</h3>

          {cleanupMessage && (
            <div className={`mb-6 p-4 rounded-md border ${
              cleanupMessage.includes('✅')
                ? 'bg-green-100 text-green-700 border-green-300'
                : 'bg-red-100 text-red-700 border-red-300'
            }`}>
              {cleanupMessage}
            </div>
          )}

          <p className="text-gray-600 mb-6">
            Remove all employees that don't have a department assigned. This will also delete their associated user accounts, salaries, and leave records.
          </p>

          <button
            onClick={handleCleanupEmployees}
            disabled={cleanupLoading}
            className={`w-full py-2 rounded-md font-semibold text-white transition-colors ${
              cleanupLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {cleanupLoading ? 'Cleaning up...' : 'Delete Employees Without Department'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
