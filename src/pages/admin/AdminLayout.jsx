import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHotel, FaChartPie, FaBed, FaThLarge, FaCalendarCheck, 
  FaSignOutAlt 
} from 'react-icons/fa';

const AdminLayout = ({ children, title }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: <FaChartPie />, label: 'Dashboard' },
    { path: '/admin/rooms', icon: <FaBed />, label: 'Quản Lý Phòng' },
    { path: '/admin/room-types', icon: <FaThLarge />, label: 'Loại Phòng' },
    { path: '/admin/bookings', icon: <FaCalendarCheck />, label: 'Đặt Phòng' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <FaHotel style={{ marginRight: '8px' }} />
          Luxury<span>Hotel</span>
        </div>

        <nav>
          <ul className="admin-sidebar-nav">
            {menuItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`admin-sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-2xl)' }}>
          <button 
            onClick={handleLogout}
            className="admin-sidebar-link"
            style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <FaSignOutAlt /> Đăng Xuất
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
