import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

const FacultyQR = ({ subjectId }) => {
    const [token, setToken] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);

    const getNewToken = async () => {
        try {
            const res = await axios.post('/api/attendance/generate', { subjectId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setToken(res.data.token);
            setTimeLeft(res.data.expiresIn);
        } catch (err) {
            console.error("Attempt limit reached or error");
        }
    };

    useEffect(() => {
        getNewToken();
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    getNewToken(); // Fetch new token when current one expires
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [subjectId]);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3>Scan to Mark Attendance</h3>
            {token ? (
                <>
                    <QRCodeCanvas value={token} size={256} />
                    <p style={{ marginTop: '10px', color: 'red' }}>
                        QR refreshes in: {timeLeft}s
                    </p>
                </>
            ) : (
                <p>Maximum attempts reached for today.</p>
            )}
        </div>
    );
};

export default FacultyQR;