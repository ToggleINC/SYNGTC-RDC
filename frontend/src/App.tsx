import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CriminalList from './pages/Criminals/CriminalList';
import CriminalForm from './pages/Criminals/CriminalForm';
import CriminalDetail from './pages/Criminals/CriminalDetail';
import CaseList from './pages/Cases/CaseList';
import CaseForm from './pages/Cases/CaseForm';
import MapView from './pages/Map/MapView';
import Alerts from './pages/Alerts';
import UserList from './pages/Admin/UserList';
import Profile from './pages/Profile';
import BackupList from './pages/Backup/BackupList';
import OfflineIndicator from './components/OfflineIndicator';
import { useAuth } from './context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>Chargement...</Box>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <OfflineIndicator />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/criminels" element={<CriminalList />} />
                    <Route path="/criminels/nouveau" element={<CriminalForm />} />
                    <Route path="/criminels/:id" element={<CriminalDetail />} />
                    <Route path="/criminels/:id/modifier" element={<CriminalForm />} />
                    <Route path="/cas" element={<CaseList />} />
                    <Route path="/cas/nouveau" element={<CaseForm />} />
                    <Route path="/carte" element={<MapView />} />
                    <Route path="/alertes" element={<Alerts />} />
                    <Route path="/admin" element={<UserList />} />
                    <Route path="/backups" element={<BackupList />} />
                    <Route path="/profil" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;
