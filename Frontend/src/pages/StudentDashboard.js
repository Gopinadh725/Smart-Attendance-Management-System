import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
    const [stats, setStats] = useState({ totalClasses: 0, attended: 0, percentage: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/attendance/student-stats', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                toast.error("Could not fetch attendance data.");
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading your profile...</div>;

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <h1>My Attendance Dashboard</h1>
                <p>Track your progress for the current semester</p>
            </header>

            <div style={statsGrid}>
                <div style={statCard}>
                    <h3>Total Classes</h3>
                    <p style={numberStyle}>{stats.totalClasses}</p>
                </div>
                <div style={statCard}>
                    <h3>Attended</h3>
                    <p style={{ ...numberStyle, color: '#28a745' }}>{stats.attended}</p>
                </div>
                <div style={statCard}>
                    <h3>Percentage</h3>
                    <p style={{ ...numberStyle, color: stats.percentage < 75 ? '#dc3545' : '#007bff' }}>
                        {stats.percentage}%
                    </p>
                </div>
            </div>

            {/* Attendance Progress Bar */}
            <div style={progressContainer}>
                <div style={{ ...progressFill, width: `${stats.percentage}%` }}></div>
            </div>
            <p style={{ textAlign: 'center', color: '#666' }}>
                {stats.percentage < 75 ? "⚠️ Warning: Attendance below 75%" : "✅ You are eligible for exams!"}
            </p>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <Link to="/student/scan" style={scanButtonStyle}>
                    Open QR Scanner
                </Link>
            </div>
        </div>
    );
};

// --- Styles ---
const containerStyle = { maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' };
const headerStyle = { textAlign: 'center', marginBottom: '40px' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' };
const statCard = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #eee' };
const numberStyle = { fontSize: '32px', fontWeight: 'bold', margin: '10px 0' };
const progressContainer = { width: '100%', height: '20px', backgroundColor: '#e9ecef', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' };
const progressFill = { height: '100%', backgroundColor: '#007bff', transition: 'width 0.5s ease-in-out' };
const scanButtonStyle = { backgroundColor: '#28a745', color: 'white', padding: '15px 40px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)' };

export default StudentDashboard;