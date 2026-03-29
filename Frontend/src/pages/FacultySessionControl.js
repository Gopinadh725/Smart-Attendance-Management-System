import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FacultySessionControl = () => {
    const { sessionId } = useParams(); // Gets ID from the URL
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchLiveList = async () => {
        try {
            const res = await axios.get(`/api/attendance/session/${sessionId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAttendanceData(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching list", err);
        }
    };

    const handleOverride = async (studentId, action) => {
        try {
            await axios.put('/api/attendance/manual-override', { sessionId, studentId, action }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchLiveList(); // Refresh the list after change
        } catch (err) {
            alert("Override failed");
        }
    };

    const handleLock = async () => {
        if (window.confirm("Lock session? No more scans will be accepted.")) {
            await axios.patch(`/api/attendance/lock/${sessionId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchLiveList();
        }
    };

    useEffect(() => {
        fetchLiveList();
        const interval = setInterval(fetchLiveList, 5000); // Auto-refresh every 5s
        return () => clearInterval(interval);
    }, [sessionId]);

    if (loading) return <div>Loading Live Attendance Data...</div>;

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Live Attendance: {attendanceData.subject?.subjectName}</h2>
                <button 
                    onClick={handleLock} 
                    disabled={attendanceData.isLocked}
                    style={{ padding: '10px 20px', backgroundColor: attendanceData.isLocked ? '#ccc' : '#d9534f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {attendanceData.isLocked ? "Session Locked" : "Lock Session"}
                </button>
            </div>

            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                        <th style={{ padding: '15px' }}>Roll Number</th>
                        <th style={{ padding: '15px' }}>Student Name</th>
                        <th style={{ padding: '15px' }}>Time Scanned</th>
                        <th style={{ padding: '15px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.presentStudents.map((entry) => (
                        <tr key={entry.studentId._id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                            <td style={{ padding: '12px' }}>{entry.studentId.rollNumber}</td>
                            <td style={{ padding: '12px' }}>{entry.studentId.name}</td>
                            <td style={{ padding: '12px' }}>{new Date(entry.scannedAt).toLocaleTimeString()}</td>
                            <td style={{ padding: '12px' }}>
                                <button 
                                    onClick={() => handleOverride(entry.studentId._id, 'remove')}
                                    style={{ color: '#d9534f', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Remove Proxy
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FacultySessionControl;