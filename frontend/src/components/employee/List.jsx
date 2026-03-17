import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { handleImageError } from '../../utils/EmployeeHelper'
import { API_BASE_URL } from '../../config/api'


const List = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmployeeLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/employee`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          console.log('Raw employee data:', response.data.employees);
          const data = response.data.employees.map((emp, index) => ({
            _id: emp._id,
            sno: index + 1,
            name: emp.userId?.name || 'N/A',
            email: emp.userId?.email || 'N/A',
            profileImage: emp.userId?.profileImage || '',
            employeeId: emp.employeeId,
            designation: emp.designation,
            dob: emp.dob,
            dep_name: emp.department?.dep_name || 'N/A',
            department: emp.department
          }));
          console.log('Mapped employee data:', data);
          setEmployees(data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmployeeLoading(false);
      }
    };
    fetchEmployees();
  }, []);
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">Manage Employees</h3>
      </div>

      {/* Search + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search By Name or Department"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-64 focus:outline-teal-600"
        />

        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        >
          Add New Employee
        </Link>
      </div>

      {/* Employee Table */}
      {employeeLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading employees...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No employees found. Add a new employee to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="px-6 py-3 text-left text-sm font-semibold">S No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">DOB</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees
                .filter((emp) =>
                  emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  emp.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{emp.sno}</td>
                    <td className="px-6 py-4 text-sm font-medium">{emp.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center relative">
                        {emp.profileImage && emp.profileImage.trim() !== "" ? (
                          <img
                            src={`${API_BASE_URL}/uploads/${emp.profileImage}`}
                            alt={emp.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => handleImageError(e, emp.profileImage)}
                          />
                        ) : null}
                        <div 
                          data-initials
                          className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-white absolute"
                          style={{ display: (!emp.profileImage || emp.profileImage.trim() === "") ? 'flex' : 'none' }}
                        >
                          {emp.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{emp.dep_name}</td>
                    <td className="px-6 py-4 text-sm">{emp.dob ? new Date(emp.dob).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <Link
                        to={`/admin-dashboard/employee/${emp._id}`}
                        className="px-3 py-1 bg-teal-500 text-white rounded text-xs hover:bg-teal-600"
                        title="View Employee Details"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin-dashboard/employee/${emp._id}/edit`}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        title="Edit Employee Details"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => navigate(`/admin-dashboard/salary/${emp.employeeId}`)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 font-semibold transition duration-200"
                        title="View and Manage Salary"
                      >
                        💰 Salary
                      </button>
                      <button 
                        onClick={() => navigate(`/admin-dashboard/leaves`)}
                        className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 font-semibold transition duration-200"
                        title="View Leaves"
                      >
                        📅 Leaves
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default List