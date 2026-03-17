import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const EditDepartment = () => {
  const {id} = useParams();
  const [department, setDepartment]=useState([]);
  const [departmentLoading, setDepartmentLoading]=useState(false);
  const navigate = useNavigate();
useEffect(() => {
  const fetchDepartments = async () => {
    setDepartmentLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/department/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success) {
        setDepartment(response.data.department);
       
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
  const handleChange =async (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/department/${id}`,
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
       } catch (error) {
          if (error.response && !error.response.data.success) {
           alert(error.response.data.error);
   }
       } finally {
         setDepartmentLoading(false);
        }
 
  };

  return (
    <>{departmentLoading ? <div>Loading...</div> :
   <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Department</h2>

      {/* 🔥 FORM MUST HAVE onSubmit */}
      <form onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Department Name
          </label>
          <input
            type="text"
            name="dep_name"
            value={department.dep_name}
            onChange={handleChange}
            placeholder="Department Name"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mt-3">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={department.description}
            onChange={handleChange}
            placeholder="Description"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Edit Department
        </button>
      </form>
    </div>
}</>
  )
}

export default EditDepartment