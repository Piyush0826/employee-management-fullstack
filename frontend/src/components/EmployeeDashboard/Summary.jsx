import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext'
import SummaryCard from '../dashboard/SummaryCard'
import { FaUser, FaBuilding, FaCalendarAlt } from 'react-icons/fa'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const Summary = () => {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (user && user._id) {
          const response = await axios.get(`${API_BASE_URL}/api/employee/profile/${user._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (response.data.success) {
            setProfileData(response.data.employee)
          }
        }
      } catch (error) {
        console.log("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  return (
    <div className='p-6'>
      {/* Welcome Section */}
      <div className='mb-8 flex items-center space-x-4'>
        <div className='bg-teal-600 text-white w-20 h-20 rounded flex items-center justify-center'>
          <FaUser size={40} />
        </div>
        <div>
          <h2 className='text-3xl font-bold'>Welcome Back</h2>
          <p className='text-xl font-semibold text-gray-800'>{user?.name || 'Employee'}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <SummaryCard icon={<FaUser />} text={"My Profile"} number={user?.name} color={"bg-teal-600"} />
        <SummaryCard icon={<FaBuilding />} text={"Department"} number={profileData?.department?.dep_name || user?.department} color={"bg-blue-600"} />
        <SummaryCard icon={<FaCalendarAlt />} text={"Leaves Balance"} number={"12"} color={"bg-red-600"} />
      </div>
    </div>
  )
}

export default Summary
