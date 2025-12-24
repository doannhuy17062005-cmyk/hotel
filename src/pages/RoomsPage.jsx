import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import RoomCard from '../components/RoomCard';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchRoomTypes();
    fetchRooms();
  }, [searchParams]);

  const fetchRoomTypes = async () => {
    try {
      const response = await roomAPI.getRoomTypes();
      setRoomTypes(response.data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchParams.get('checkIn')) params.checkIn = searchParams.get('checkIn');
      if (searchParams.get('checkOut')) params.checkOut = searchParams.get('checkOut');
      if (searchParams.get('guests')) params.guests = searchParams.get('guests');
      if (searchParams.get('roomTypeId')) params.roomTypeId = searchParams.get('roomTypeId');

      const response = await roomAPI.search(params);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
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
    window.location.search = queryParams.toString();
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1>Tìm Phòng</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: 'var(--spacing-sm)' }}>
            Khám phá các phòng phù hợp với nhu cầu của bạn
          </p>
        </div>

        <SearchBar onSearch={handleSearch} roomTypes={roomTypes} />

        <div style={{ marginTop: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h3>Kết Quả ({rooms.length} phòng)</h3>
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
              <div className="empty-state-icon"></div>
              <h3>Không tìm thấy phòng</h3>
              <p>Vui lòng thử lại với tiêu chí tìm kiếm khác</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
