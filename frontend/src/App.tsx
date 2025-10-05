import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import CompleteProfile from './pages/CompleteProfile';

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (user && !user.username) {
    return <CompleteProfile />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;