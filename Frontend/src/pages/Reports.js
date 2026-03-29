import React from 'react';

const handleDownload = async (type, subjectId) => {
    try {
        const token = localStorage.getItem('token');
        // Construct the URL: e.g., /api/reports/pdf/65f1a...
        const url = `http://localhost:5000/api/reports/${type}/${subjectId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Pass JWT for security
            },
        });

        if (!response.ok) throw new Error('Failed to generate report');

        // Convert the response to a Blob (Binary Large Object)
        const blob = await response.blob();
        
        // Create a temporary URL for the blob
        const downloadUrl = window.URL.createObjectURL(blob);
        
        // Create a hidden anchor element
        const link = document.createElement('a');
        link.href = downloadUrl;
        
        // Set the file name based on the type
        const fileName = `Attendance_Report_${new Date().toLocaleDateString()}.${type === 'excel' ? 'xlsx' : 'pdf'}`;
        link.setAttribute('download', fileName);
        
        // Append to body, click it, and remove it
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        // Clean up the memory
        window.URL.revokeObjectURL(downloadUrl);
        
    } catch (err) {
        console.error("Download error:", err);
        alert("Could not download report. Please check if you have the correct permissions.");
    }
};

const Reports = () => {
    const downloadReport = (type) => alert(`Generating ${type} report...`);



    // Inside your ReportsPage component:
return (
  <div style={{ padding: '20px' }}>
    <h2>Attendance Reports</h2>
    <div style={{ background: '#fdfdfd', border: '1px solid #eee', padding: '20px', borderRadius: '8px' }}>
      <h4>Generate Subject-wise Report</h4>
      
      {/* Assuming you have a list of subjects to choose from */}
      <select id="subjectSelect" style={{ padding: '10px', width: '200px', marginRight: '10px' }}>
        <option value="65a123bc...">MERN Stack Development</option>
        <option value="65b456de...">Computer Networks</option>
      </select>

      <button 
        onClick={() => handleDownload('pdf', document.getElementById('subjectSelect').value)}
        style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px', cursor: 'pointer' }}
      >
        Download PDF
      </button>

      <button 
        onClick={() => handleDownload('excel', document.getElementById('subjectSelect').value)}
        style={{ padding: '10px 15px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Export Excel
      </button>
    </div>
  </div>
);

};

export default Reports;