import { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { toast } from 'react-toastify';

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy đặt phòng này?')) return;
    
    try {
      await bookingAPI.cancel(id);
      toast.success('Hủy đặt phòng thành công');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Hủy đặt phòng thất bại');
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

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Lịch Sử Đặt Phòng</h1>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"></div>
            <h3>Chưa có đặt phòng nào</h3>
            <p>Bạn chưa đặt phòng nào. Hãy khám phá các phòng của chúng tôi!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {bookings.map(booking => (
              <div key={booking.id} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 'var(--spacing-lg)' }}>
                  <img
                    src={`https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop`}
                    alt={booking.roomNumber}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: 'var(--spacing-lg) 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                      {getStatusBadge(booking.status)}
                      <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                        Mã đặt phòng: #{booking.id}
                      </span>
                    </div>
                    <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>
                      Phòng {booking.roomNumber} - {booking.roomTypeName}
                    </h3>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xl)', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                      <div>
                        <strong>Nhận phòng:</strong> {formatDate(booking.checkInDate)}
                      </div>
                      <div>
                        <strong>Trả phòng:</strong> {formatDate(booking.checkOutDate)}
                      </div>
                      <div>
                        <strong>Số khách:</strong> {booking.numGuests} người
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    padding: 'var(--spacing-lg)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    borderLeft: '1px solid var(--gray-100)'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 'var(--spacing-md)' }}>
                      {formatPrice(booking.totalPrice)}
                    </div>
                    {booking.status === 'PENDING' && (
                      <button 
                        onClick={() => handleCancel(booking.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Hủy đặt phòng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
