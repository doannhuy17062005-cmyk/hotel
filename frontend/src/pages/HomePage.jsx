import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import RoomCard from '../components/RoomCard';
import { FaWifi, FaParking, FaSwimmingPool, FaConciergeBell } from 'react-icons/fa';

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, typesRes] = await Promise.all([
        roomAPI.getAll(),
        roomAPI.getRoomTypes()
      ]);
      setRooms(roomsRes.data.filter(r => r.status === 'AVAILABLE').slice(0, 6));
      setRoomTypes(typesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    const queryParams = new URLSearchParams();
    if (params.checkIn) queryParams.set('checkIn', params.checkIn);
    if (params.checkOut) queryParams.set('checkOut', params.checkOut);
    if (params.guests) queryParams.set('guests', params.guests);
    if (params.roomTypeId) queryParams.set('roomTypeId', params.roomTypeId);
    navigate(`/rooms?${queryParams.toString()}`);
  };

  const features = [
    { icon: <FaWifi />, title: 'WiFi Miễn Phí', desc: 'Kết nối tốc độ cao' },
    { icon: <FaParking />, title: 'Bãi Đỗ Xe', desc: 'Miễn phí cho khách' },
    { icon: <FaSwimmingPool />, title: 'Hồ Bơi', desc: 'Mở cửa 24/7' },
    { icon: <FaConciergeBell />, title: 'Dịch Vụ 5★', desc: 'Phục vụ tận tình' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Trải Nghiệm Đẳng Cấp<br />
              <span style={{ color: 'var(--secondary)' }}>5 Sao</span>
            </h1>
            <p className="hero-subtitle">
              Khám phá không gian nghỉ dưỡng sang trọng với dịch vụ hoàn hảo. 
              Đặt phòng ngay để nhận ưu đãi đặc biệt!
            </p>
            <SearchBar onSearch={handleSearch} roomTypes={roomTypes} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="page" style={{ background: 'var(--white)', padding: 'var(--spacing-3xl) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2>Tiện Ích Hàng Đầu</h2>
            <p style={{ color: 'var(--gray-500)', marginTop: 'var(--spacing-sm)' }}>
              Chúng tôi mang đến những tiện nghi tốt nhất cho kỳ nghỉ của bạn
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-xl)' }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-xl)',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-xl)',
                  transition: 'all var(--transition-normal)'
                }}
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  margin: '0 auto var(--spacing-lg)',
                  background: 'var(--gradient-gold)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'var(--primary-dark)'
                }}>
                  {feature.icon}
                </div>
                <h4>{feature.title}</h4>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="page">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2>Phòng Nổi Bật</h2>
            <p style={{ color: 'var(--gray-500)', marginTop: 'var(--spacing-sm)' }}>
              Đặt phòng ngay để nhận ưu đãi hấp dẫn
            </p>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Đang tải...</p>
            </div>
          ) : rooms.length > 0 ? (
            <div className="room-grid">
              {rooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Không có phòng nào khả dụng</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-2xl)' }}>
            <button onClick={() => navigate('/rooms')} className="btn btn-outline btn-lg">
              Xem Tất Cả Phòng
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'var(--gradient-primary)',
        padding: 'var(--spacing-3xl) 0',
        textAlign: 'center',
        color: 'var(--white)'
      }}>
        <div className="container">
          <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-md)' }}>
            Sẵn Sàng Cho Kỳ Nghỉ Hoàn Hảo?
          </h2>
          <p style={{ marginBottom: 'var(--spacing-xl)', opacity: 0.9 }}>
            Đặt phòng ngay hôm nay để nhận giá ưu đãi đặc biệt
          </p>
          <button onClick={() => navigate('/rooms')} className="btn btn-secondary btn-lg">
            Đặt Phòng Ngay
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
