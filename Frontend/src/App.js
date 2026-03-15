import React from 'react';
// Import the pages I gave you earlier
import Login from './pages/Login';
import Dashboard from './pages/FacultyDashboard';
import AdminPanel from './pages/AdminDashboard';
import ReportsPage from './pages/Reports';

function App() {
  // CHANGE THIS LINE TO SWAP PAGES:
  // Use <Login />, <Dashboard />, <AdminPanel />, or <ReportsPage />
  return (
    <div className="App">
      <Login /> 
    </div>
  );
}

export default App;