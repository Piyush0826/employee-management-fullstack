import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { API_BASE_URL } from "../config/api";

export const fetchDepartments = async () => {
  let departments;
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/department`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success) {
      departments = response.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return departments;
};

export const fetchEmployees = async () => {
  let employees;
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/employee`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success) {
      employees = response.data.employees;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return employees;
};

// Get image URL for employee
export const getEmployeeImage = (filename) => {
  if (!filename || filename.trim() === '') return null;
  return `${API_BASE_URL}/uploads/${filename}`;
};

// Handle image loading errors with fallback for extension mismatch (.jpg vs .jpeg)
export const handleImageError = (e, filename) => {
  if (!filename) {
    e.target.style.visibility = "hidden";
    return;
  }
  
  // Try alternative extension
  const baseName = filename.replace(/\.(jpeg|jpg|png|gif)$/i, '');
  const currentExt = filename.match(/\.(jpeg|jpg|png|gif)$/i)?.[1] || 'jpeg';
  let altExt;
  
  if (currentExt.toLowerCase() === 'jpeg') {
    altExt = 'jpg';
  } else if (currentExt.toLowerCase() === 'jpg') {
    altExt = 'jpeg';
  } else {
    // For other formats, just hide the image
    e.target.style.visibility = "hidden";
    return;
  }
  
  const altFilename = `${baseName}.${altExt}`;
  const altSrc = `${API_BASE_URL}/uploads/${altFilename}`;
  
  if (e.target.src !== altSrc) {
    // Try the alternative extension
    e.target.onerror = () => {
      // Both extensions failed, hide the image
      console.warn(`Image not found with either extension: ${filename} or ${altFilename}`);
      e.target.style.visibility = "hidden";
      const fallback = e.target.parentElement.querySelector('[data-initials], [data-fallback-avatar]');
      if (fallback) {
        fallback.style.display = 'flex';
      }
    };
    e.target.src = altSrc;
  } else {
    // Both extensions failed
    console.warn(`Image not found: ${filename} or ${altFilename}`);
    e.target.style.visibility = "hidden";
    const fallback = e.target.parentElement.querySelector('[data-initials], [data-fallback-avatar]');
    if (fallback) {
      fallback.style.display = 'flex';
    }
  }
};

export const EmployeeButtons = ({ _id, onEmployeeDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Do you want to delete this employee?");
    if (confirm) {
      setDeleting(true);
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          onEmployeeDelete(id);
        }
      } catch (error) {
        alert(error.response?.data?.error || "Failed to delete employee");
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        className="px-3 py-1 bg-teal-600 text-white rounded text-xs hover:bg-teal-700"
        onClick={() => navigate(`/admin-dashboard/employee/${_id}`)}
      >
        View
      </button>

      <button
        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        onClick={() => navigate(`/admin-dashboard/employee/${_id}/edit`)}
      >
        Edit
      </button>

      <button
        className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
        onClick={() => navigate(`/admin-dashboard/employee/${_id}/salary`)}
      >
        Salary
      </button>

      <button
        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
        disabled={deleting}
        onClick={() => handleDelete(_id)}
      >
        Leave
      </button>
    </div>
  );
};
