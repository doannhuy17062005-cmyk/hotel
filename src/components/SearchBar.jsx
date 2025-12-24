import { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaUsers, FaDoorOpen } from 'react-icons/fa';

const SearchBar = ({ onSearch, roomTypes = [] }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [roomTypeId, setRoomTypeId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ checkIn, checkOut, guests, roomTypeId: roomTypeId || undefined });
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="search-box">
      <h3 className="search-box-title">
        <FaSearch style={{ marginRight: '10px', color: 'var(--secondary)' }} />
        Tìm Phòng Phù Hợp
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="search-grid">
          {/* Check-in Date */}
          <div className="search-field">
            <label className="search-label">
              <FaCalendarAlt />
              <span>Ngày nhận phòng</span>
            </label>
            <input
              type="date"
              className="search-input"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
            />
          </div>

          {/* Check-out Date */}
          <div className="search-field">
            <label className="search-label">
              <FaCalendarAlt />
              <span>Ngày trả phòng</span>
            </label>
            <input
              type="date"
              className="search-input"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
            />
          </div>

          {/* Number of Guests */}
          <div className="search-field">
            <label className="search-label">
              <FaUsers />
              <span>Số khách</span>
            </label>
            <select
              className="search-input"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} người</option>
              ))}
            </select>
          </div>

          {/* Room Type */}
          <div className="search-field">
            <label className="search-label">
              <FaDoorOpen />
              <span>Loại phòng</span>
            </label>
            <select
              className="search-input"
              value={roomTypeId}
              onChange={(e) => setRoomTypeId(e.target.value)}
            >
              <option value="">Tất cả</option>
              {roomTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="search-field search-btn-wrapper">
            <button type="submit" className="search-btn">
              <FaSearch />
              <span>Tìm Phòng</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
