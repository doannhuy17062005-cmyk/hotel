import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../../services/api';
import { FaBed, FaCalendarCheck, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <div className="stat-card">
          <div className="stat-icon primary">
            <FaBed />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalRooms || 0}</h3>
            <p>Tổng Số Phòng</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon gold">
            <FaCalendarCheck />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalBookings || 0}</h3>
            <p>Tổng Đặt Phòng</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>{formatPrice(stats?.monthlyRevenue)}</h3>
            <p>Doanh Thu Tháng</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{stats?.occupancyRate?.toFixed(1) || 0}%</h3>
            <p>Tỷ Lệ Lấp Đầy</p>
          </div>
        </div>
      </div>

      {/* Booking Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Trạng Thái Đặt Phòng</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--warning)' }}></span>
                  Chờ xác nhận
                </span>
                <strong>{stats?.pendingBookings || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--info)' }}></span>
                  Đã xác nhận
                </span>
                <strong>{stats?.confirmedBookings || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--success)' }}></span>
                  Hoàn thành
                </span>
                <strong>{stats?.completedBookings || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--error)' }}></span>
                  Đã hủy
                </span>
                <strong>{stats?.cancelledBookings || 0}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Thống Kê Phòng</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--success)' }}></span>
                  Phòng trống
                </span>
                <strong>{stats?.availableRooms || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--error)' }}></span>
                  Đang sử dụng
                </span>
                <strong>{stats?.occupiedRooms || 0}</strong>
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-xl)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Doanh Thu</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hôm nay:</span>
                  <strong>{formatPrice(stats?.dailyRevenue)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tháng này:</span>
                  <strong>{formatPrice(stats?.monthlyRevenue)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tổng năm:</span>
                  <strong style={{ color: 'var(--success)' }}>{formatPrice(stats?.totalRevenue)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
