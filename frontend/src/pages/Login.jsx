import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { API_BASE_URL } from '../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth(); // Destructuring login from your custom hook
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state on new attempt

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password }
      );

      if (response.data.success) {
        // 1. Update the global Auth state
        login(response.data.user);
        
        // 2. Store the JWT token for session persistence
        localStorage.setItem("token", response.data.token);

        // 3. Role-based navigation logic
        if (response.data.user.role === "admin") {
          navigate('/admin-dashboard');
        } else {
          // Navigates to the employee dashboard for non-admin roles
          navigate('/employee-dashboard'); 
        }
      }
    } catch (error) {
      // Catching specific backend error messages (e.g., "User Not Found")
      if (error.response && !error.response.data.success) {
        setError(error.response.data.message);
      } else {
        setError("Server Error: Please try again later.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
      <h2 className="font-serif text-3xl text-white">Employee Management System</h2>
      <div className="border shadow p-6 w-80 bg-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        
        {/* Visual feedback for errors */}
        {error && <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border rounded focus:outline-teal-600"
              placeholder='Enter Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded focus:outline-teal-600"
              placeholder='***'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" // Added to resolve browser console warnings
              required
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox text-teal-600"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2 text-gray-700 text-sm">Remember me</span>
            </label>
            <a href="#" className="text-teal-600 text-sm hover:underline">Forgot password?</a>
          </div>
          <button 
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded font-bold hover:bg-teal-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;