import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import PrivateRoutes from './utils/PrivateRoutes'
import RoleBasedRoutes from './utils/RoleBasedRoutes'
import AdminSummary from './components/dashboard/AdminSummary'
import AdminSettings from './components/dashboard/AdminSettings'
import Summary from './components/EmployeeDashboard/Summary'
import Profile from './components/EmployeeDashboard/Profile'
import Leaves from './components/EmployeeDashboard/Leaves'
import Salary from './components/EmployeeDashboard/Salary'
import Settings from './components/EmployeeDashboard/setting'
import { AuthContextProvider } from './context/authContext'
import DepartmentList from './components/department/DepartmentList'
import AddDepartment from './components/department/AddDepartment'
import EditDepartment from './components/department/EditDepartment'
import List from './components/employee/List'
import Add from './components/employee/Add'
import View from './components/employee/view'
import Edit from './components/employee/Edit'
import SalaryList from './components/salary/List'
import SalaryAdd from './components/salary/Add'
import LeaveList from './components/leave/List'
import LeaveView from './components/leave/View'


function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          {/* Redirect base path to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin-dashboard" />} />
          <Route path="/login" element={<Login />} />
          
          {/* Main Admin Dashboard Route with Nested Routing */}
          <Route 
            path="/admin-dashboard" 
            element={
              <PrivateRoutes>
                <RoleBasedRoutes requiredRole={["admin"]}>
                  <AdminDashboard />
                </RoleBasedRoutes>
              </PrivateRoutes>
            }
          >
            {/* These routes render inside the <Outlet /> of AdminDashboard */}
            <Route index element={<AdminSummary />} /> 
            <Route path="/admin-dashboard/departments" element={<DepartmentList />} />
            <Route path="/admin-dashboard/add-department" element={<AddDepartment />} />
            <Route path="/admin-dashboard/department/:id" element={<EditDepartment />} />

 
            <Route path="/admin-dashboard/employees" element={<List />} />
            <Route path="/admin-dashboard/employee/:id" element={<View />} />
            <Route path="/admin-dashboard/employee/:id/edit" element={<Edit />} />
            <Route path="/admin-dashboard/add-employee" element={<Add />} />

            {/* Salary Routes */}
            <Route path="/admin-dashboard/salary" element={<SalaryList />} />
            <Route path="/admin-dashboard/salary/:employeeId" element={<SalaryList />} />
            <Route path="/admin-dashboard/add-salary" element={<SalaryAdd />} />

            {/* Leave Routes */}
            <Route path="/admin-dashboard/leaves" element={<LeaveList />} />
            <Route path="/admin-dashboard/leave/:id" element={<LeaveView />} />

            {/* Settings Route */}
            <Route path="/admin-dashboard/setting" element={<AdminSettings />} />
          </Route>

          {/* Employee Dashboard Route */}
          <Route path="/employee-dashboard" element={
            <PrivateRoutes>
               <EmployeeDashboard />
            </PrivateRoutes>
          }>
            {/* Nested routes for employee dashboard */}
            <Route index element={<Summary />} />
            <Route path="/employee-dashboard/profile" element={<Profile />} />
            <Route path="/employee-dashboard/leaves" element={<Leaves />} />
            <Route path="/employee-dashboard/salary" element={<Salary />} />
            <Route path="/employee-dashboard/settings" element={<Settings />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App