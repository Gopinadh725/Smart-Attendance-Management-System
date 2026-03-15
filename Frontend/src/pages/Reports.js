import React from 'react';

const ReportsPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Attendance Reports</h2>
      <div style={{ background: '#fdfdfd', border: '1px solid #eee', padding: '20px', borderRadius: '8px' }}>
        <h4>Generate Subject-wise Report</h4>
        <select style={{ padding: '10px', width: '200px', marginRight: '10px' }}>
          <option>Select Subject</option>
          <option>MERN Stack Development</option>
          <option>Computer Networks</option>
        </select>
        <button style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
          Download PDF
        </button>
        <button style={{ padding: '10px 15px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '4px' }}>
          Export Excel
        </button>
      </div>
      <div style={{ marginTop: '30px' }}>
        <h4>Recent Reports Generated</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>📄 Attendance_March_15_MERN.pdf - 10:30 AM</li>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>📊 Attendance_Summary_Final.xlsx - 09:15 AM</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsPage;