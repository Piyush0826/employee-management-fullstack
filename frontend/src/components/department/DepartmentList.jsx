import React, { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import DataTable from  "react-data-table-component"
import { DepartmentButtonsColumn, DepartmentButtons } from "../../utils/DepartmentHelper"
import { API_BASE_URL } from "../../config/api"


const DepartmentList = () => {
  const [departments, setDepartments] = useState([])
  const [departmentLoading, setDepartmentLoading] = useState(false)
  const [filteredDepartments, setFilterDepartments] = useState([])

  const onDepartmentDelete = (id)=>{
    const data = departments.filter((dep) => dep._id !== id);
    setDepartments(data);
    setFilterDepartments(data);
  }

  const columns = DepartmentButtonsColumn({ onDepartmentDelete });

useEffect(() => {
  const fetchDepartments = async () => {
    setDepartmentLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/department`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success) {
        const data = response.data.departments.map((dep, index) => (
          {
            _id: dep._id,
            sno: index + 1,
            dep_name: dep.dep_name
      }))
      setDepartments(data);
      setFilterDepartments(data);
      }
    } catch (error) {
     if (error.response && !error.response.data.success) {
    alert(error.response.data.error)
     }
  }finally{
    setDepartmentLoading(false);
  }
};
fetchDepartments();
}, []);

const filterDepartments=(e)=>{
    const records=departments.filter(dep=>dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase()));
    setFilterDepartments(records);
}

  return (
    <>{departmentLoading ? <div>Loading...</div>:
    <div className="p-5">

      {/* Heading */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">Manage Departments</h3>
      </div>

      {/* Search + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search By Dep Name"
          className="px-4 py-2 border rounded w-64"
          onChange={filterDepartments}
        />

        <Link
          to="/admin-dashboard/add-department"
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Add New Department
        </Link>
      </div>
         <div className="mt-5">
          <DataTable columns={columns} data={filteredDepartments} pagination/>
         </div>
    </div>
    }</>
  )
}

export default DepartmentList
