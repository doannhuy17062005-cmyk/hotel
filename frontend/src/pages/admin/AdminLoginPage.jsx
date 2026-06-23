import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';

const AdminLoginPage = () => {
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
      
      // Kiểm tra role admin
      if (user.role !== 'ADMIN') {
        // Logout ngay để ngăn redirect tự động
        logout();
        toast.error('Tài khoản không có quyền Admin. Vui lòng sử dụng trang đăng nhập User.');
        setLoading(false);
        return;
      }
      
      toast.success('Đăng nhập Admin thành công!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth">
      <div className="auth-card">
        <div className="auth-header">
          <div className="admin-auth-icon">
            <FaShieldAlt />
          </div>
          <div className="auth-logo">Admin<span>Panel</span></div>
          <h1 className="auth-title">Đăng Nhập Quản Trị</h1>
          <p className="auth-subtitle">Dành cho quản trị viên hệ thống</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FaEnvelope style={{ marginRight: '8px' }} />
              Email Admin
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="Nhập email quản trị viên"
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
            {loading ? 'Đang xác thực...' : 'Đăng Nhập Admin'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/">← Về trang chủ</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
