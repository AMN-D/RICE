import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import CompleteProfile from './pages/CompleteProfile';
import CreateRice from './pages/CreateRice';
import ManageRices from './pages/ManageRices';
import RiceDetail from './pages/RiceDetail';
import UserProfile from './pages/UserProfile';
import SearchResults from './pages/SearchResults';

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
      <Route path="/search" element={<SearchResults />} />
      <Route path="/rice/:id" element={<RiceDetail />} />
      <Route path="/user/:id" element={<UserProfile />} />
      <Route path="/create" element={<CreateRice />} />
      <Route path="/manage" element={<ManageRices />} />
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