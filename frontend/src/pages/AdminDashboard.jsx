import React from 'react'
import AdminSidebar from '../components/dashboard/AdminSidebar'
import Navbar from '../components/dashboard/Navbar'
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
    // Note: useAuth is imported but only needed here if you use 'user' data in this specific file
    return (
        <div className='flex'>
            <AdminSidebar />
            <div className='flex-1 ml-64 bg-gray-100 h-screen'>
                <Navbar />
                {/* Child routes like AdminSummary and DepartmentList render here */}
                <Outlet /> 
            </div>
        </div>
    )
}

export default AdminDashboard