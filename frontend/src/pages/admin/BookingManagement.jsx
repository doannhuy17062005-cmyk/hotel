import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await adminAPI.getAllBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleStatusChange = async (id, status) => {
    try {
      await adminAPI.updateBookingStatus(id, status);
      toast.success('Cập nhật trạng thái thành công');
      fetchBookings();
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { class: 'badge-pending', text: 'Chờ xác nhận' },
      CONFIRMED: { class: 'badge-confirmed', text: 'Đã xác nhận' },
      COMPLETED: { class: 'badge-completed', text: 'Hoàn thành' },
      CANCELLED: { class: 'badge-cancelled', text: 'Đã hủy' }
    };
    const badge = badges[status] || badges.PENDING;
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  const filteredBookings = filter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <AdminLayout title="Quản Lý Đặt Phòng">
      <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)' }}>
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`btn ${filter === status ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          >
            {status === 'ALL' ? 'Tất cả' : 
             status === 'PENDING' ? 'Chờ xác nhận' :
             status === 'CONFIRMED' ? 'Đã xác nhận' :
             status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <p>Không có đặt phòng nào</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Khách Hàng</th>
                <th>Phòng</th>
                <th>Nhận Phòng</th>
                <th>Trả Phòng</th>
                <th>Số Khách</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td><strong>#{booking.id}</strong></td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500 }}>{booking.userFullName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{booking.userEmail}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500 }}>{booking.roomNumber}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{booking.roomTypeName}</div>
                    </div>
                  </td>
                  <td>{formatDate(booking.checkInDate)}</td>
                  <td>{formatDate(booking.checkOutDate)}</td>
                  <td>{booking.numGuests}</td>
                  <td><strong>{formatPrice(booking.totalPrice)}</strong></td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="form-select"
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '0.85rem' }}
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="CONFIRMED">Xác nhận</option>
                      <option value="COMPLETED">Hoàn thành</option>
                      <option value="CANCELLED">Hủy</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default BookingManagement;
