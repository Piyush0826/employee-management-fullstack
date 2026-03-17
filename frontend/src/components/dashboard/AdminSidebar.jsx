import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBuilding, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaCogs 
} from 'react-icons/fa'

const AdminSidebar = () => {
  return (
    <div className="bg-slate-800 text-white h-screen fixed left-0 top-0 bottom-0 w-64 font-sans">
      {/* Sidebar Header / Logo */}
      <div className="bg-teal-600 h-16 flex items-center justify-center">
        <h3 className="text-2xl font-cursive italic">Employee MS</h3>
      </div>

      {/* Navigation Links */}
      <div className="px-2 py-4 space-y-1">
        <NavLink 
          to="/admin-dashboard" 
          className={({isActive}) => 
            `${isActive ? "bg-teal-600" : "hover:bg-teal-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors duration-200`
          }
          end
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/employees" 
          className={({isActive}) => 
            `${isActive ? "bg-teal-600" : "hover:bg-teal-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors duration-200`
          }
        >
          <FaUsers />
          <span>Employees</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/departments" 
          className={({isActive}) => 
            `${isActive ? "bg-teal-600" : "hover:bg-teal-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors duration-200`
          }
        >
          <FaBuilding />
          <span>Departments</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/leaves" 
          className={({isActive}) => 
            `${isActive ? "bg-teal-600" : "hover:bg-teal-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors duration-200`
          }
        >
          <FaCalendarAlt />
          <span>Leaves</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/salary" 
          className={({isActive}) => 
            `${isActive ? "bg-teal-600" : "hover:bg-teal-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors duration-200`
          }
        >
          <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/setting" 
          className={({isActive}) => 
            `${isActive ? "bg-teal-600" : "hover:bg-teal-700"} flex items-center space-x-4 py-2.5 px-4 rounded transition-colors duration-200`
          }
        >
          <FaCogs />
          <span>Setting</span>
        </NavLink>
      </div>
    </div>
  )
}

export default AdminSidebar