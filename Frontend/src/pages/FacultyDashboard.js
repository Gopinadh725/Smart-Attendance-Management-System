import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
    const [isLive, setIsLive] = useState(false);
    
    // Defining the missing currentSessionId. 
    // (Later, this will be dynamically fetched from your database based on the selected subject)
    const [currentSessionId, setCurrentSessionId] = useState("test-session-123"); 
    const navigate = useNavigate();

    const toggleSession = async () => {
        const endpoint = isLive ? 'end' : 'start';
        
        try {
            // Updated to point directly to your local backend server
            await axios.patch(`http://localhost:5000/api/attendance/${endpoint}/${currentSessionId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            setIsLive(!isLive);
            
            if (!isLive) {
                toast.success("Attendance Session LIVE!");
                // If you want it to automatically jump to the QR code page, uncomment the line below:
                // navigate(`/faculty/session/${currentSessionId}`);
            } else {
                toast.success("Session Ended & Saved.");
            }
            
        } catch (err) {
            toast.error("Error updating session status. Check terminal for backend errors.");
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Faculty Dashboard</h2>
            <p style={{ color: 'gray', marginBottom: '30px' }}>Manage your MCA classes here</p>

            <div style={{ 
                padding: '20px', 
                backgroundColor: isLive ? '#d4edda' : '#f8d7da',
                border: `2px solid ${isLive ? '#c3e6cb' : '#f5c6cb'}`,
                color: isLive ? '#155724' : '#721c24',
                borderRadius: '8px',
                marginBottom: '30px',
                fontSize: '1.2rem'
            }}>
                Status: <strong>{isLive ? "LIVE - Accepting Scans" : "INACTIVE"}</strong>
            </div>
            
            <button 
                onClick={toggleSession}
                style={{
                    padding: '15px 30px',
                    fontSize: '18px',
                    backgroundColor: isLive ? '#dc3545' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: '0.3s'
                }}
            >
                {isLive ? "End Session" : "Start Attendance Session"}
            </button>
        </div>
    );
};

export default FacultyDashboard;