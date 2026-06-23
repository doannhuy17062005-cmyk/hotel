import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      updateUser({ ...user, ...response.data });
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Hồ Sơ Cá Nhân</h1>

        <div className="card">
          <div className="card-body">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-lg)', 
              marginBottom: 'var(--spacing-2xl)',
              paddingBottom: 'var(--spacing-xl)',
              borderBottom: '1px solid var(--gray-100)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                fontSize: '2rem',
                fontWeight: 700
              }}>
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{user?.fullName}</h3>
                <p style={{ color: 'var(--gray-500)' }}>{user?.email}</p>
                <span className={`badge ${user?.role === 'ADMIN' ? 'badge-confirmed' : 'badge-pending'}`}>
                  {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                </span>
              </div>
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
                  value={user?.email || ''}
                  disabled
                  style={{ background: 'var(--gray-100)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaUser style={{ marginRight: '8px' }} />
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaPhone style={{ marginRight: '8px' }} />
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaMapMarkerAlt style={{ marginRight: '8px' }} />
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={loading}
              >
                <FaSave /> {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
