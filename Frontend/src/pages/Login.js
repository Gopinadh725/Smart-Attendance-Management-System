import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' }}>
      <div style={{ padding: '40px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Smart Attendance</h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>Sign in to your account</p>
        <div style={{ marginTop: '20px' }}>
          <label>Email Address</label>
          <input type="email" style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ddd' }} placeholder="Enter email" />
          <label>Password</label>
          <input type="password" style={{ width: '100%', padding: '10px', margin: '8px 0', border: '1px solid #ddd' }} placeholder="Enter password" />
          <button style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;