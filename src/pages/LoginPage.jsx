import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      
      // Từ chối nếu là admin - phải dùng trang admin login
      if (user.role === 'ADMIN') {
        // Logout ngay để ngăn redirect tự động
        logout();
        toast.error('Tài khoản Admin vui lòng đăng nhập tại trang Quản Trị.');
        setLoading(false);
        return;
      }
      
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">Luxury<span>Hotel</span></div>
          <h1 className="auth-title">Đăng Nhập</h1>
          <p className="auth-subtitle">Chào mừng bạn trở lại</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FaEnvelope style={{ marginRight: '8px' }} />
              Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaLock style={{ marginRight: '8px' }} />
              Mật khẩu
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Chưa có tài khoản?{' '}
            <Link to="/register">Đăng ký ngay</Link>
          </p>
          <p style={{ marginTop: '10px', fontSize: '0.9em' }}>
            <Link to="/admin/login">Đăng nhập Quản Trị →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

