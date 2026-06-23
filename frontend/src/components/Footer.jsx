import { Link } from 'react-router-dom';
import { FaHotel, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <FaHotel style={{ marginRight: '8px' }} />
              Luxury<span>Hotel</span>
            </div>
            <p style={{ color: 'var(--gray-300)', marginBottom: 'var(--spacing-lg)' }}>
              Trải nghiệm đẳng cấp 5 sao với dịch vụ hoàn hảo và không gian sang trọng.
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <a href="#" style={{ color: 'var(--gray-300)', fontSize: '1.25rem' }}><FaFacebook /></a>
              <a href="#" style={{ color: 'var(--gray-300)', fontSize: '1.25rem' }}><FaInstagram /></a>
              <a href="#" style={{ color: 'var(--gray-300)', fontSize: '1.25rem' }}><FaTwitter /></a>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Liên Kết</h4>
            <ul className="footer-links">
              <li><Link to="/">Trang Chủ</Link></li>
              <li><Link to="/rooms">Phòng</Link></li>
              <li><Link to="/my-bookings">Đặt Phòng</Link></li>
              <li><a href="#">Về Chúng Tôi</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Loại Phòng</h4>
            <ul className="footer-links">
              <li><a href="#">Phòng Standard</a></li>
              <li><a href="#">Phòng Deluxe</a></li>
              <li><a href="#">Phòng Suite</a></li>
              <li><a href="#">Phòng VIP</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Liên Hệ</h4>
            <ul className="footer-links">
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaMapMarkerAlt /> 123 Đường Nguyễn Huệ, Q.1, TP.HCM
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaPhone /> +84 28 1234 5678
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaEnvelope /> contact@luxuryhotel.vn
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Luxury Hotel. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
