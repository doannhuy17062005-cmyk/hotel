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

      // ✅ FIX CHÍNH Ở ĐÂY
      const roomsData =
        roomsRes.data?.data?.content ??
        roomsRes.data?.data ??
        [];

      const roomTypesData =
        typesRes.data?.data ??
        [];

      setRooms(
        roomsData
          .filter(r => r.status === 'AVAILABLE')
          .slice(0, 6)
      );

      setRoomTypes(roomTypesData);

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
      {/* toàn bộ JSX giữ nguyên */}
    </div>
  );
};

export default HomePage;
