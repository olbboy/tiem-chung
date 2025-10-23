import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { PersonalInfo } from './pages/PersonalInfo';
import { VaccinationHistory } from './pages/VaccinationHistory';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
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
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
