import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    
    if (!token) return <Navigate to="/login" />;

    try {
        const decoded = jwtDecode(token);
        if (!allowedRoles.includes(decoded.role)) {
            // If a student tries to access Faculty pages, send them to their own dashboard
            return <Navigate to="/student-dashboard" />;
        }
        return children;
    } catch (error) {
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;