import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import RoomCard from '../components/RoomCard';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 🔒 ÉP KIỂU AN TOÀN TUYỆT ĐỐI
  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const safeRoomTypes = Array.isArray(roomTypes) ? roomTypes : [];

  useEffect(() => {
    fetchRoomTypes();
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const normalizeArray = (data, fallbackKeys = []) => {
    if (Array.isArray(data)) return data;

    for (const key of fallbackKeys) {
      if (Array.isArray(data?.[key])) {
        return data[key];
      }
    }
    return [];
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await roomAPI.getRoomTypes();

      const types = normalizeArray(res.data, ['data', 'roomTypes']);
      setRoomTypes(types);
    } catch (err) {
      console.error('Error fetching room types:', err);
      setRoomTypes([]);
    }
  };
const raw =
  res.data?.data?.content ??   // Pageable
  res.data?.data ??            // list
  res.data?.content ??         // fallback
  res.data ??                  // fallback
  [];

setRooms(Array.isArray(raw) ? raw : []);

  const fetchRooms = async () => {
  setLoading(true);
  try {
    const params = {};
    if (searchParams.get('checkIn')) params.checkIn = searchParams.get('checkIn');
    if (searchParams.get('checkOut')) params.checkOut = searchParams.get('checkOut');
    if (searchParams.get('guests')) params.guests = searchParams.get('guests');
    if (searchParams.get('roomTypeId')) params.roomTypeId = searchParams.get('roomTypeId');

    const res =
      Object.keys(params).length === 0
        ? await roomAPI.getAll()
        : await roomAPI.search(params);

    const raw =
      res.data?.data?.content ??
      res.data?.data ??
      res.data?.content ??
      res.data ??
      [];

    setRooms(Array.isArray(raw) ? raw : []);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    setRooms([]);
  } finally {
    setLoading(false);
  }
};


  const handleSearch = (params) => {
    const query = new URLSearchParams();

    if (params.checkIn) query.set('checkIn', params.checkIn);
    if (params.checkOut) query.set('checkOut', params.checkOut);
    if (params.guests) query.set('guests', params.guests);
    if (params.roomTypeId) query.set('roomTypeId', params.roomTypeId);

    navigate({ search: query.toString() });
  };

  return (
    <div className="page">
      <div className="container">
        <h1>Tìm Phòng</h1>

        <SearchBar
          onSearch={handleSearch}
          roomTypes={safeRoomTypes}
        />

        <h3 style={{ marginTop: 24 }}>
          Kết quả ({safeRooms.length} phòng)
        </h3>

        {loading ? (
          <p>Đang tải...</p>
        ) : safeRooms.length > 0 ? (
          <div className="room-grid">
            {safeRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <p>Không tìm thấy phòng</p>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
