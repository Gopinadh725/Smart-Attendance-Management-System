import React from 'react';

const Spinner = ({ message = "Loading..." }) => {
    return (
        <div style={spinnerContainerStyle}>
            {/* Inline CSS for the spinning animation */}
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
            <div style={spinnerStyle}></div>
            <p style={{ marginTop: '15px', color: '#555', fontWeight: '500' }}>{message}</p>
        </div>
    );
};

const spinnerContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh', // Centers it nicely on the page
};

const spinnerStyle = {
    width: '50px',
    height: '50px',
    border: '6px solid #f3f3f3', // Light grey background
    borderTop: '6px solid #0056b3', // Blue spinning part
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
};

export default Spinner;