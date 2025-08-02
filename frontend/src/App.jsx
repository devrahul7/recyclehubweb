import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MyItems from './pages/MyItems';
import Profile from './pages/Profile';
import BrowseItems from './pages/BrowseItems';
import Unauthorized from './pages/Unauthorized';
import UserLikes from './pages/UserLikes';
import UserReviews from './pages/UserReviews';
import AdminLikes from './pages/AdminLikes';
import AdminReviews from './pages/AdminReviews';
import Landing from './pages/Landing';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route
          path="/"
          element={!user ? <Landing /> : <Navigate to="/dashboard" replace />}
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/my-items"
          element={
            <ProtectedRoute requiredRole="user">
              <MyItems />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <BrowseItems />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole="user">
              <Profile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/my-likes"
          element={
            <ProtectedRoute requiredRole="user">
              <UserLikes />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/my-reviews"
          element={
            <ProtectedRoute requiredRole="user">
              <UserReviews />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/likes"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLikes />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminReviews />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App
