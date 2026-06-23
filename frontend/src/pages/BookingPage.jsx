import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI, bookingAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaCalendar, FaUsers, FaCreditCard } from 'react-icons/fa';

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numGuests: 1,
    paymentMethod: 'CASH'
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    calculatePrice();
  }, [formData.checkInDate, formData.checkOutDate, room]);

  const fetchRoom = async () => {
    try {
      const response = await roomAPI.getById(roomId);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
      toast.error('Không thể tải thông tin phòng');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (formData.checkInDate && formData.checkOutDate && room) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = checkOut - checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setNights(diffDays);
        setTotalPrice(diffDays * room.price);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=400&fit=crop';
    }
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8080${imageUrl}`;
    }
    return imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (nights <= 0) {
      toast.error('Vui lòng chọn ngày hợp lệ');
      return;
    }

    if (formData.numGuests > room.capacity) {
      toast.error(`Số khách tối đa là ${room.capacity} người`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await bookingAPI.create({
        roomId: parseInt(roomId),
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numGuests: formData.numGuests,
        paymentMethod: formData.paymentMethod
      });
      
      // Nếu có paymentUrl (thanh toán online) -> redirect đến VNPay
      if (response.data.paymentUrl) {
        toast.info('Đang chuyển đến trang thanh toán...');
        window.location.href = response.data.paymentUrl;
      } else {
        // Thanh toán khi nhận phòng -> chuyển đến trang booking
        toast.success('Đặt phòng thành công! Vui lòng thanh toán khi nhận phòng.');
        navigate('/my-bookings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đặt phòng thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

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

  if (!room) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <h3>Không tìm thấy phòng</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Đặt Phòng</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-2xl)' }}>
          {/* Booking Form */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ marginBottom: 'var(--spacing-xl)' }}>Thông Tin Đặt Phòng</h3>
              
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div className="form-group">
                    <label className="form-label">
                      <FaCalendar style={{ marginRight: '8px' }} />
                      Ngày Nhận Phòng *
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                      min={today}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaCalendar style={{ marginRight: '8px' }} />
                      Ngày Trả Phòng *
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.checkOutDate}
                      onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                      min={formData.checkInDate || today}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaUsers style={{ marginRight: '8px' }} />
                    Số Khách * (Tối đa {room.capacity} người)
                  </label>
                  <select
                    className="form-select"
                    value={formData.numGuests}
                    onChange={(e) => setFormData({ ...formData, numGuests: parseInt(e.target.value) })}
                    required
                  >
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} người</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaCreditCard style={{ marginRight: '8px' }} />
                    Phương Thức Thanh Toán
                  </label>
                  <select
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    <option value="CASH">Thanh toán khi nhận phòng</option>
                    <option value="ONLINE">Thanh toán online (VNPay)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-secondary btn-lg"
                  style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}
                  disabled={submitting || nights <= 0}
                >
                  {submitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Phòng'}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <img
                src={getImageUrl(room.imageUrl)}
                alt={room.roomNumber}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <span className="badge badge-confirmed" style={{ marginBottom: 'var(--spacing-sm)' }}>
                  {room.roomTypeName}
                </span>
                <h3>Phòng {room.roomNumber}</h3>
                
                <div style={{ 
                  marginTop: 'var(--spacing-lg)',
                  padding: 'var(--spacing-md)',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                    <span>Giá phòng</span>
                    <span>{formatPrice(room.price)} / đêm</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                    <span>Số đêm</span>
                    <span>{nights} đêm</span>
                  </div>
                  <hr style={{ margin: 'var(--spacing-md) 0', border: 'none', borderTop: '1px solid var(--gray-200)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                    <span>Tổng cộng</span>
                    <span style={{ color: 'var(--primary)' }}>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
