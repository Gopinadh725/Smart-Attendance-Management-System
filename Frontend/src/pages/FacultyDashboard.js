import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h2>Faculty Dashboard</h2>
        <span>Welcome, Prof. Gopinadh</span>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Generate QR Code</h3>
          <div style={{ background: '#eee', height: '150px', width: '150px', margin: '20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            [QR Preview]
          </div>
          <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}>Generate New QR</button>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>Attempts: 1/5</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Recent Session Stats</h3>
          <p>Subject: Web Technologies</p>
          <p>Students Present: 45 / 50</p>
          <p>Status: Active</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;