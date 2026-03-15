import React from 'react';

const AdminPanel = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>System Administration</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1, background: '#007bff', color: 'white', padding: '20px', borderRadius: '8px' }}>Total Students: 1200</div>
        <div style={{ flex: 1, background: '#6c757d', color: 'white', padding: '20px', borderRadius: '8px' }}>Total Faculty: 45</div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Role</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Bethamsetty Gopinadh</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>MCA Student</td>
            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}><span style={{ color: 'green' }}>Active</span></td>
            <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}><button>Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;