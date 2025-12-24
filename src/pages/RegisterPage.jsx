import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address
      });
      toast.success('Đăng ký thành công!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <div className="auth-logo">Luxury<span>Hotel</span></div>
          <h1 className="auth-title">Đăng Ký</h1>
          <p className="auth-subtitle">Tạo tài khoản để đặt phòng</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <FaUser style={{ marginRight: '8px' }} />
              Họ và tên *
            </label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              placeholder="Nhập họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaEnvelope style={{ marginRight: '8px' }} />
              Email *
            </label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
            <div className="form-group">
              <label className="form-label">
                <FaLock style={{ marginRight: '8px' }} />
                Mật khẩu *
              </label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaLock style={{ marginRight: '8px' }} />
                Xác nhận *
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaPhone style={{ marginRight: '8px' }} />
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaMapMarkerAlt style={{ marginRight: '8px' }} />
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="Nhập địa chỉ"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Đã có tài khoản?{' '}
            <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
