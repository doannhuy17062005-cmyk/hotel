import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import RoomCard from '../components/RoomCard';
import {
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaConciergeBell
} from 'react-icons/fa';

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [roomsRes, typesRes] = await Promise.all([
          roomAPI.getAll(),
          roomAPI.getRoomTypes()
        ]);

        // Chuẩn hoá dữ liệu phòng
        const rawRooms =
          roomsRes?.data?.data?.content ??
          roomsRes?.data?.content ??
          roomsRes?.data?.data ??
          roomsRes?.data ??
          [];

        const roomList = Array.isArray(rawRooms) ? rawRooms : [];

        // Chỉ lấy phòng AVAILABLE + tối đa 6 phòng
        const featuredRooms = roomList
          .filter(r => r.status === 'AVAILABLE')
          .slice(0, 6);

        // Chuẩn hoá loại phòng
        const rawTypes =
          typesRes?.data?.data ??
          typesRes?.data ??
          [];

        if (mounted) {
          setRooms(featuredRooms);
          setRoomTypes(Array.isArray(rawTypes) ? rawTypes : []);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  const handleSearch = (params) => {
    const queryParams = new URLSearchParams(params);
    navigate(`/rooms?${queryParams.toString()}`);
  };

  const features = [
    { icon: <FaWifi />, title: 'WiFi Miễn Phí', desc: 'Kết nối tốc độ cao' },
    { icon: <FaParking />, title: 'Bãi Đỗ Xe', desc: 'Miễn phí cho khách' },
    { icon: <FaSwimmingPool />, title: 'Hồ Bơi', desc: 'Mở cửa 24/7' },
    { icon: <FaConciergeBell />, title: 'Dịch Vụ 5★', desc: 'Phục vụ tận tình' }
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>
            Trải Nghiệm Đẳng Cấp <span>5 Sao</span>
          </h1>

          <SearchBar
            onSearch={handleSearch}
            roomTypes={roomTypes}
          />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              {f.icon}
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="page">
        <div className="container">
          {loading ? (
            <p>Đang tải phòng nổi bật...</p>
          ) : rooms.length > 0 ? (
            <div className="room-grid">
              {rooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <p>Hiện chưa có phòng trống</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
