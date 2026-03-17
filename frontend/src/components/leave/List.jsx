import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const LeaveList = () => {
  const [leaves, setLeaves] = useState([])
  const [filteredLeaves, setFilteredLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchLeaves()
  }, [])

  useEffect(() => {
    let filtered = leaves

    // Filter by status if selected
    if (statusFilter) {
      filtered = filtered.filter(leave => leave.status === statusFilter)
    }

    // Filter by search term (employee name or ID)
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(leave =>
        leave.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.employeeId?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLeaves(filtered)
  }, [searchTerm, statusFilter, leaves])

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leave`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        setLeaves(response.data.leaves)
      }
    } catch (error) {
      console.error('Error fetching leaves:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700'
      case 'Rejected':
        return 'bg-red-100 text-red-700'
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600">Loading leaves...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Manage Leaves</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              statusFilter === 'Pending' 
                ? 'bg-teal-600 text-white' 
                : 'bg-white text-teal-600 border border-teal-600 hover:bg-teal-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('Approved')}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              statusFilter === 'Approved' 
                ? 'bg-teal-600 text-white' 
                : 'bg-white text-teal-600 border border-teal-600 hover:bg-teal-50'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter('Rejected')}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              statusFilter === 'Rejected' 
                ? 'bg-teal-600 text-white' 
                : 'bg-white text-teal-600 border border-teal-600 hover:bg-teal-50'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search By Emp ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 px-5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">S No</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Emp ID</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Leave Type</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Department</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Days</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Status</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-800">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave, index) => {
                const startDate = new Date(leave.startDate)
                const endDate = new Date(leave.endDate)
                const daysCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
                
                return (
                  <tr key={leave._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{leave.employeeId?.employeeId || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{leave.userId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{leave.leaveType}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{leave.employeeId?.department?.dep_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{daysCount}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        onClick={() => navigate(`/admin-dashboard/leave/${leave._id}`)}
                        className="bg-teal-600 text-white px-4 py-1 rounded-md hover:bg-teal-700 text-xs font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-600">
                  No leaves found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredLeaves.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredLeaves.length} of {leaves.length} leaves
        </div>
      )}
    </div>
  )
}

export default LeaveList
