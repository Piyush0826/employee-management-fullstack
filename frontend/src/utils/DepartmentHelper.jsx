import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import React from "react";


export const DepartmentButtonsColumn = ({ onDepartmentDelete }) => {
  return [
    {
      name: "S No",
      selector: (row) => row.sno
    },
    {
      name: "Department Name",
      selector: (row) => row.dep_name,
      sortable: true
    },
    {
      name: "Actions",
      cell: (row) => <DepartmentButtons _id={row._id} onDepartmentDelete={onDepartmentDelete} />
    }
  ];
};

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async (id) =>{
    const confirm = window.confirm("⚠️  WARNING: Deleting this department will permanently delete:\n\n• All employees in this department\n• All user accounts for these employees\n• All salaries for these employees\n• All leave records for these employees\n\nThis action cannot be undone. Continue?")
    if(confirm){
      setDeleting(true);
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/department/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        if(response.data.success) {
          alert('Department and all associated data deleted successfully');
          onDepartmentDelete(id);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      } finally {
        setDeleting(false);
      }
    }
  }

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
      >
        Edit
      </button>

      <button className="px-3 py-1 bg-red-600 text-white disabled:opacity-50"
        onClick={() =>handleDelete(_id)}
        disabled={deleting}>
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};
