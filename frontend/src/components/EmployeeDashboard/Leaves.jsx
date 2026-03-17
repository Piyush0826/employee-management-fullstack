import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const Leaves = () => {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [employeeProfile, setEmployeeProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchStatus, setSearchStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    description: ''
  })

  useEffect(() => {
    fetchEmployeeProfile()
  }, [user])

  useEffect(() => {
    if (employeeProfile) {
      fetchLeaves()
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

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token")
      if (user && user._id) {
        const response = await axios.get(
          `${API_BASE_URL}/api/leave/user/${user._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
        if (response.data.success) {
          setLeaves(response.data.leaves)
        }
      }
    } catch (error) {
      console.error('Error fetching leaves:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitLeave = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      
      if (!employeeProfile || !employeeProfile._id) {
        alert('Employee profile not loaded')
        return
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/leave/add`,
        {
          employeeId: employeeProfile._id,
          leaveType: formData.leaveType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        alert('Leave request submitted successfully')
        setFormData({
          leaveType: '',
          startDate: '',
          endDate: '',
          description: ''
        })
        setShowForm(false)
        fetchLeaves()
      }
    } catch (error) {
      console.error('Error submitting leave:', error)
      alert(error.response?.data?.error || 'Failed to submit leave request')
    }
  }

  const handleDeleteLeave = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.delete(
          `${API_BASE_URL}/api/leave/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (response.data.success) {
          alert('Leave request deleted successfully')
          fetchLeaves()
        }
      } catch (error) {
        console.error('Error deleting leave:', error)
        alert(error.response?.data?.error || 'Failed to delete leave request')
      }
    }
  }

  const filteredLeaves = searchStatus 
    ? leaves.filter(leave => leave.status.toLowerCase() === searchStatus.toLowerCase())
    : leaves

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600">Loading leaves...</p>
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen px-8 py-8'>
      <h2 className='text-4xl font-bold text-center mb-8 text-gray-800'>Manage Leaves</h2>

      {showForm && (
        <div className='mb-8 bg-white p-6 rounded-lg shadow-sm'>
          <h3 className='text-2xl font-bold mb-4 text-gray-800'>Submit Leave Request</h3>
          <form onSubmit={handleSubmitLeave}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Leave Type</label>
                <select
                  name='leaveType'
                  value={formData.leaveType}
                  onChange={handleFormChange}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600'
                >
                  <option value=''>Select Leave Type</option>
                  <option value='Sick Leave'>Sick Leave</option>
                  <option value='Casual Leave'>Casual Leave</option>
                  <option value='Earned Leave'>Earned Leave</option>
                  <option value='Maternity Leave'>Maternity Leave</option>
                  <option value='Paternity Leave'>Paternity Leave</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Start Date</label>
                <input
                  type='date'
                  name='startDate'
                  value={formData.startDate}
                  onChange={handleFormChange}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>End Date</label>
                <input
                  type='date'
                  name='endDate'
                  value={formData.endDate}
                  onChange={handleFormChange}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                <input
                  type='text'
                  name='description'
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder='Reason for leave'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600'
                />
              </div>
            </div>
            <button
              type='submit'
              className='bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700'
            >
              Submit Request
            </button>
          </form>
        </div>
      )}

      <div className='flex justify-end mb-8 gap-4'>
        <input
          type='text'
          placeholder='Search By Status'
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className='w-64 px-5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600'
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className='bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700'
        >
          {showForm ? 'Cancel' : 'Add Leave'}
        </button>
      </div>

      <div className='bg-white rounded-lg shadow-sm overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b-2 border-gray-200'>
            <tr>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>SNO</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>LEAVE TYPE</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>FROM</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>TO</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>DESCRIPTION</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>APPLIED DATE</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>STATUS</th>
              <th className='px-8 py-4 text-left text-sm font-bold text-gray-800'>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave, index) => (
                <tr key={leave._id} className='border-b hover:bg-gray-50 transition-colors'>
                  <td className='px-8 py-4 text-sm text-gray-700'>{index + 1}</td>
                  <td className='px-8 py-4 text-sm text-gray-700'>{leave.leaveType}</td>
                  <td className='px-8 py-4 text-sm text-gray-700'>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td className='px-8 py-4 text-sm text-gray-700'>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td className='px-8 py-4 text-sm text-gray-700'>{leave.description || '-'}</td>
                  <td className='px-8 py-4 text-sm text-gray-700'>{new Date(leave.appliedDate).toLocaleDateString()}</td>
                  <td className='px-8 py-4 text-sm'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      leave.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className='px-8 py-4 text-sm'>
                    {leave.status === 'Pending' && (
                      <button
                        onClick={() => handleDeleteLeave(leave._id)}
                        className='text-red-600 hover:text-red-900 font-semibold'
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='8' className='px-8 py-6 text-center text-gray-600'>
                  No leaves found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Leaves
