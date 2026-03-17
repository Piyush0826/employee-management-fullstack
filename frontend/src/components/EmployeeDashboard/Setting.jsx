import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const Settings = () => {
  const [showModal, setShowModal] = useState(true)
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage('All fields are required')
      setMessageType('error')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New password and confirm password do not match')
      setMessageType('error')
      return
    }

    if (formData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long')
      setMessageType('error')
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
        setMessage('Password changed successfully')
        setMessageType('success')
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          setShowModal(false)
        }, 2000)
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setMessage(error.response?.data?.error || 'Failed to change password')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setMessage('')
  }

  return (
    <>
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 pointer-events-none'>
          <div className='bg-white rounded-lg shadow-lg p-8 w-96 relative pointer-events-auto'>
            <button
              onClick={closeModal}
              className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold'
            >
              ×
            </button>

            <h3 className='text-2xl font-bold mb-6 text-gray-800'>Change Password</h3>

            {message && (
              <div className={`mb-6 p-4 rounded-md text-sm ${
                messageType === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Old Password
                </label>
                <input
                  type='password'
                  name='oldPassword'
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder='Enter your old password'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600'
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  New Password
                </label>
                <input
                  type='password'
                  name='newPassword'
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder='Enter your new password'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600'
                />
              </div>

              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='Confirm your new password'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600'
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-teal-600 text-white py-2 rounded-md font-bold hover:bg-teal-700 disabled:bg-teal-400 transition-colors'
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Settings
