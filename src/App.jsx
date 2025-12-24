import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Customer Pages
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import BookingPage from './pages/BookingPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PaymentResultPage from './pages/PaymentResultPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import RoomManagement from './pages/admin/RoomManagement';
import RoomTypeManagement from './pages/admin/RoomTypeManagement';
import BookingManagement from './pages/admin/BookingManagement';

// Component chặn admin truy cập trang user
const BlockAdmin = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }
  
  // Nếu là admin -> redirect về trang admin
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

// Protected Route Component - yêu cầu đăng nhập
const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }
  
  // Chưa đăng nhập
  if (!user) {
    if (adminOnly) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  
  // Yêu cầu admin nhưng user không phải admin
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  // Yêu cầu user nhưng đang là admin -> redirect về admin
  if (userOnly && user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={
          user ? (
            user.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />
          ) : (
            <LoginPage />
          )
        } />
        <Route path="/register" element={
          user?.role === 'ADMIN' ? (
            <Navigate to="/admin" replace />
          ) : user ? (
            <Navigate to="/" replace />
          ) : (
            <RegisterPage />
          )
        } />
        
        {/* Admin Login - Riêng biệt */}
        <Route path="/admin/login" element={
          user ? (
            user.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />
          ) : (
            <AdminLoginPage />
          )
        } />
        
        {/* User Pages - Admin bị chặn hoàn toàn */}
        <Route path="/" element={
          <BlockAdmin>
            <Navbar />
            <HomePage />
            <Footer />
          </BlockAdmin>
        } />
        <Route path="/rooms" element={
          <BlockAdmin>
            <Navbar />
            <RoomsPage />
            <Footer />
          </BlockAdmin>
        } />
        <Route path="/rooms/:id" element={
          <BlockAdmin>
            <Navbar />
            <RoomDetailPage />
            <Footer />
          </BlockAdmin>
        } />
        <Route path="/about" element={
          <BlockAdmin>
            <Navbar />
            <AboutPage />
            <Footer />
          </BlockAdmin>
        } />
        <Route path="/contact" element={
          <BlockAdmin>
            <Navbar />
            <ContactPage />
            <Footer />
          </BlockAdmin>
        } />
        
        {/* Payment Result - public route for VNPay callback */}
        <Route path="/payment/result" element={
          <>
            <Navbar />
            <PaymentResultPage />
            <Footer />
          </>
        } />
        
        {/* Protected User Routes - yêu cầu đăng nhập + chặn admin */}
        <Route path="/booking/:roomId" element={
          <ProtectedRoute userOnly>
            <Navbar />
            <BookingPage />
            <Footer />
          </ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute userOnly>
            <Navbar />
            <BookingHistoryPage />
            <Footer />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute userOnly>
            <Navbar />
            <ProfilePage />
            <Footer />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/rooms" element={
          <ProtectedRoute adminOnly>
            <RoomManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/room-types" element={
          <ProtectedRoute adminOnly>
            <RoomTypeManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute adminOnly>
            <BookingManagement />
          </ProtectedRoute>
        } />
        
        {/* Catch all - redirect admin về /admin, user về / */}
        <Route path="*" element={
          user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />
        } />
      </Routes>
    </div>
  );
}

export default App;


