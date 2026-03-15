import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react'; // Updated library usage

const FacultyQR = ({ subjectId }) => {
    const [qrData, setQrData] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    const handleGenerate = async () => {
        try {
            const res = await axios.post('/api/attendance/generate', { subjectId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setQrData(res.data);
            // Calculate seconds until expiration
            setTimeLeft(Math.floor((new Date(res.data.expiresAt) - new Date()) / 1000));
        } catch (err) {
            alert(err.response?.data?.message || "Error generating QR");
        }
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    return (
        <div className="p-4 border rounded">
            <h3>Generate Attendance QR</h3>
            <button onClick={handleGenerate} disabled={qrData?.attemptsLeft === 0}>
                Generate QR ({qrData?.attemptsLeft ?? 5} attempts left)
            </button>

            {timeLeft > 0 && qrData && (
                <div className="mt-4">
                    <QRCodeSVG value={qrData.token} size={200} />
                    <p>Expires in: {timeLeft} seconds</p>
                </div>
            )}
            {timeLeft === 0 && qrData && <p className="text-red-500">QR Expired. Generate again.</p>}
        </div>
    );
};