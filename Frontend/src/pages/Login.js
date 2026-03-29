import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext'; // Added this

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from context

  const handleLogin = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Authenticating...");
    
    try {
      // src/pages/Login.js
const res = await axios.post('http://localhost:5000/api/auth/login', { 
    email, 
    password, 
    currentDeviceId: "browser-id" 
});

      console.log("Backend Response:", res.data); // DEBUG: See what the backend sent

      // 1. Save the token immediately
      const token = res.data.token;
      localStorage.setItem('token', token);

      // 2. Update Context (if function exists)
      if (login) {
          login(token);
      }

      toast.dismiss(loadingToast);
      toast.success("Welcome!");

      // 3. Simple Routing (Using the role directly from the response)
      const role = res.data.role;
      
      if (role === 'Admin') navigate('/admin/dashboard');
      else if (role === 'Faculty') navigate('/faculty/dashboard');
      else if (role === 'Student') navigate('/student/dashboard');
      else navigate('/');

    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Frontend Login Error:", err); // This tells us WHY it failed
      
      // Show the specific error from the backend if available
      const errorMsg = err.response?.data?.message || "Login failed. Check your connection.";
      toast.error(errorMsg);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>Smart Attendance</h2>
        <p style={{ color: '#666', marginBottom: '25px' }}>MCA Department Portal</p>
        
        <form onSubmit={handleLogin} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="e.g. teja@student.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          
          <div style={inputGroup}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          
          <button type="submit" style={buttonStyle}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Styles for a Professional Look ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f4f7f6' };
const cardStyle = { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: 'center' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#555' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', transition: 'border 0.3s' };
const buttonStyle = { padding: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', marginTop: '10px' };

export default Login;