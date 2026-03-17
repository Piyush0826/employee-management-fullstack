import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const LeaveView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [leave, setLeave] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeave = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/api/leave/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data.success) {
          setLeave(response.data.leave)
        }
      } catch (error) {
        console.error('Error fetching leave:', error)
        alert('Failed to load leave details')
      } finally {
        setLoading(false)
      }
    }
    fetchLeave()
  }, [id])

  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/leave/${id}/status`,
        { status: 'Approved' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.data.success) {
        alert('Leave approved successfully')
        setLeave(response.data.leave)
      }
    } catch (error) {
      console.error('Error approving leave:', error)
      alert('Failed to approve leave')
    }
  }

  const handleReject = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/leave/${id}/status`,
        { status: 'Rejected' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.data.success) {
        alert('Leave rejected successfully')
        setLeave(response.data.leave)
      }
    } catch (error) {
      console.error('Error rejecting leave:', error)
      alert('Failed to reject leave')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600">Loading leave details...</p>
      </div>
    )
  }

  if (!leave) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600">Leave not found</p>
      </div>
    )
  }

  const startDate = new Date(leave.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
  const endDate = new Date(leave.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })

  return (
    <div className="bg-gray-50 min-h-screen px-8 py-8">
      <button
        onClick={() => navigate('/admin-dashboard/leaves')}
        className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 font-semibold"
      >
        Back
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-10">Leave Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Profile Image */}
          <div className="flex flex-col items-center justify-start">
            {leave.userId?.profileImage ? (
              <img
                src={`${API_BASE_URL}/uploads/${leave.userId.profileImage}`}
                alt={leave.userId?.name}
                className="w-64 h-64 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-64 h-64 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-6xl font-bold text-white">
                {leave.userId?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Right Column - Leave Details */}
          <div className="space-y-5">
            <div className="flex">
              <span className="font-bold text-gray-800 w-32">Name:</span>
              <span className="text-gray-700">{leave.userId?.name || 'N/A'}</span>
            </div>

            <div className="flex">
              <span className="font-bold text-gray-800 w-32">Employee ID:</span>
              <span className="text-gray-700">{leave.employeeId?.employeeId || 'N/A'}</span>
            </div>

            <div className="flex">
              <span className="font-bold text-gray-800 w-32">Leave Type:</span>
              <span className="text-gray-700">{leave.leaveType}</span>
            </div>

            <div className="flex">
              <span className="font-bold text-gray-800 w-32">Reason:</span>
              <span className="text-gray-700">{leave.description || 'N/A'}</span>
            </div>

            <div className="flex">
              <span className="font-bold text-gray-800 w-32">Department:</span>
              <span className="text-gray-700">{leave.employeeId?.department?.dep_name || 'N/A'}</span>
            </div>

            <div className="flex">
              <span className="font-bold text-gray-800 w-32">Start Date:</span>
              <span className="text-gray-700">{startDate}</span>
            </div>

            <div className="flex">
              <span className="font-bold text-gray-800 w-32">End Date:</span>
              <span className="text-gray-700">{endDate}</span>
            </div>

            <div className="flex gap-3 mt-8">
              {leave.status === 'Pending' ? (
                <>
                  <button
                    onClick={handleApprove}
                    className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 font-semibold"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 font-semibold"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <div className={`px-6 py-2 rounded-md font-semibold text-white ${
                  leave.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {leave.status}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaveView
