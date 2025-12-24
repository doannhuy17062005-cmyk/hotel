import { Link } from 'react-router-dom';
import { FaUsers, FaBed } from 'react-icons/fa';

const RoomCard = ({ room }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="room-card-badge">Còn Phòng</span>;
      case 'OCCUPIED':
        return <span className="room-card-badge" style={{ background: 'var(--error)' }}>Đã Đặt</span>;
      case 'MAINTENANCE':
        return <span className="room-card-badge" style={{ background: 'var(--warning)' }}>Bảo Trì</span>;
      default:
        return null;
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop';
    }
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8080${imageUrl}`;
    }
    return imageUrl;
  };

  return (
    <div className="room-card">
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <img
          src={getImageUrl(room.imageUrl)}
          alt={room.roomNumber}
          className="room-card-image"
        />
        {getStatusBadge(room.status)}
      </div>
      <div className="room-card-content">
        <div className="room-card-type">{room.roomTypeName}</div>
        <h3 className="room-card-name">Phòng {room.roomNumber}</h3>
        <p className="card-text" style={{ marginBottom: 'var(--spacing-md)', minHeight: '48px' }}>
          {room.description || 'Phòng sang trọng với đầy đủ tiện nghi hiện đại'}
        </p>
        <div className="room-card-features">
          <span><FaUsers /> {room.capacity} người</span>
          <span><FaBed /> 1 giường</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-md)' }}>
          <div className="room-card-price">
            <strong>{formatPrice(room.price)}</strong>
            <span>/ đêm</span>
          </div>
          <Link to={`/rooms/${room.id}`} className="btn btn-primary btn-sm">
            Xem Chi Tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
