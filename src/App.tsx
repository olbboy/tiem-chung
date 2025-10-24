import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { Login } from './pages/Login';
import { PersonalInfo } from './pages/PersonalInfo';
import { VaccinationHistory } from './pages/VaccinationHistory';
import { ChangePassword } from './pages/ChangePassword';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes - redirect if authenticated */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <PublicRoute>
                <ChangePassword />
              </PublicRoute>
            }
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/personal-info"
            element={
              <ProtectedRoute>
                <PersonalInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vaccination-history/:memberId"
            element={
              <ProtectedRoute>
                <VaccinationHistory />
              </ProtectedRoute>
            }
          />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
