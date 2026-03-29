import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
// Look here! Changed 'Context' to 'context' (lowercase c)
import { AuthContext } from '../context/AuthContext'; 

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    // If no one is logged in, don't show the navbar (or show a very basic one)
    if (!user) return null; 

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '15px 30px', 
            backgroundColor: '#0056b3', 
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div>
                <h2 style={{ margin: 0, fontSize: '20px' }}>Smart Attendance</h2>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>Logged in as: {user.role}</span>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {/* Dynamic Links Based on Role */}
                {user.role === 'Admin' && (
                    <>
                        <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>
                        <Link to="/admin/reports" style={linkStyle}>Reports</Link>
                    </>
                )}
                
                {user.role === 'Faculty' && (
                    <>
                        <Link to="/faculty/dashboard" style={linkStyle}>Dashboard</Link>
                    </>
                )}

                {user.role === 'Student' && (
                    <>
                        <Link to="/student/dashboard" style={linkStyle}>My Progress</Link>
                        <Link to="/student/scan" style={linkStyle}>Scan QR</Link>
                    </>
                )}

                <button 
                    onClick={logout} 
                    style={{ 
                        padding: '8px 15px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

// Simple reusable style for links
const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500'
};

export default Navbar;