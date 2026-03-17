import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!department.dep_name.trim()) {
      alert("Department name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/department/add`,
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        alert("Department added successfully");
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || "Failed to add department");
      } else {
        alert("Server not reachable. Make sure the backend is running on port 5000");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Department</h2>

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
          disabled={loading}
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Department"}
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
