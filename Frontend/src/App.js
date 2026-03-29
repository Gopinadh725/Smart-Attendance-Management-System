import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import FacultyDashboard from './pages/Dashboard/FacultyDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import AttendanceMarking from './pages/Attendance/AttendanceMarking';
import StudentAttendance from './pages/Attendance/StudentAttendance';
import AdminUserManagement from './pages/Admin/AdminUserManagement';
import AdminAllocationPage from './pages/Admin/AdminAllocationPage';
import ManualAttendance from './pages/Attendance/ManualAttendance';
import QRScannerPage from './pages/Attendance/QRScannerPage';
import SettingsPage from './pages/Settings/SettingsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import LandingPage from './pages/LandingPage';

const DashboardSelector = () => {
    const { user } = useAuth();
    if (user?.role === 'Admin') return <AdminDashboard />;
    if (user?.role === 'Faculty') return <FacultyDashboard />;
    return <StudentDashboard />;
};

const AttendanceSelector = () => {
    const { user } = useAuth();
    if (user?.role === 'Student') return <StudentAttendance />;
    return <AttendanceMarking />;
};

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
    
    return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/*" element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardSelector />} />
                    <Route path="/attendance" element={<AttendanceSelector />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/admin/users" element={<AdminUserManagement />} />
                    <Route path="/admin/allocations" element={<AdminAllocationPage />} />
                    <Route path="/faculty/manual-attendance" element={<ManualAttendance />} />
                    <Route path="/qr-scanner" element={<QRScannerPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;