import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaBed, FaWifi, FaTv, FaSnowflake, FaCoffee, FaCheck } from 'react-icons/fa';

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await roomAPI.getById(id);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
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

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=600&fit=crop';
    }
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8080${imageUrl}`;
    }
    return imageUrl;
  };

  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${room.id}`);
  };

  const amenities = [
    { icon: <FaWifi />, name: 'WiFi Miễn Phí' },
    { icon: <FaTv />, name: 'Smart TV' },
    { icon: <FaSnowflake />, name: 'Điều Hòa' },
    { icon: <FaCoffee />, name: 'Minibar' },
  ];

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
            <button onClick={() => navigate('/rooms')} className="btn btn-primary">
              Quay lại danh sách phòng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-2xl)' }}>
          {/* Left Column - Room Details */}
          <div>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <span className="badge badge-confirmed" style={{ marginBottom: 'var(--spacing-sm)' }}>
                {room.roomTypeName}
              </span>
              <h1>Phòng {room.roomNumber}</h1>
            </div>

            <img
              src={getImageUrl(room.imageUrl)}
              alt={room.roomNumber}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-xl)',
                marginBottom: 'var(--spacing-xl)'
              }}
            />

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Mô Tả</h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>
                {room.description || 'Phòng sang trọng với đầy đủ tiện nghi hiện đại, view đẹp và không gian thoáng đãng. Phù hợp cho cả công tác và nghỉ dưỡng.'}
              </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Tiện Nghi</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
                {amenities.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <span style={{ color: 'var(--secondary)' }}>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Chính Sách</h3>
              <ul style={{ color: 'var(--gray-600)', paddingLeft: 'var(--spacing-lg)' }}>
                <li style={{ marginBottom: 'var(--spacing-sm)' }}>Nhận phòng từ 14:00</li>
                <li style={{ marginBottom: 'var(--spacing-sm)' }}>Trả phòng trước 12:00</li>
                <li style={{ marginBottom: 'var(--spacing-sm)' }}>Không hút thuốc trong phòng</li>
                <li>Miễn phí hủy đặt phòng trước 24 giờ</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-lg)' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {formatPrice(room.price)}
                  </span>
                  <span style={{ color: 'var(--gray-500)' }}>/ đêm</span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-lg)', 
                  marginBottom: 'var(--spacing-lg)',
                  padding: 'var(--spacing-md)',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <FaUsers style={{ color: 'var(--secondary)' }} />
                    <span>{room.capacity} người</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <FaBed style={{ color: 'var(--secondary)' }} />
                    <span>1 giường lớn</span>
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Bao gồm:</h4>
                  <ul style={{ listStyle: 'none' }}>
                    {['Bữa sáng miễn phí', 'WiFi tốc độ cao', 'Dịch vụ phòng 24/7', 'Gym & Spa'].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                        <FaCheck style={{ color: 'var(--success)', fontSize: '0.8rem' }} />
                        <span style={{ fontSize: '0.9rem' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {room.status === 'AVAILABLE' ? (
                  <button 
                    onClick={handleBooking} 
                    className="btn btn-secondary btn-lg"
                    style={{ width: '100%' }}
                  >
                    Đặt Phòng Ngay
                  </button>
                ) : (
                  <button className="btn btn-lg" style={{ width: '100%', background: 'var(--gray-300)' }} disabled>
                    Phòng Không Khả Dụng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
