import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHotel, FaUser, FaSignOutAlt, FaBars, FaTimes, FaHistory, FaCog } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <FaHotel />
          Luxury<span>Hotel</span>
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
              Trang Chủ
            </Link>
          </li>
          <li>
            <Link to="/rooms" className={`navbar-link ${isActive('/rooms') ? 'active' : ''}`}>
              Phòng
            </Link>
          </li>
          <li>
            <Link to="/about" className={`navbar-link ${isActive('/about') ? 'active' : ''}`}>
              Giới Thiệu
            </Link>
          </li>
          <li>
            <Link to="/contact" className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}>
              Liên Hệ
            </Link>
          </li>
          {isAdmin() && (
            <li>
              <Link to="/admin" className={`navbar-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                Quản Trị
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu-container" ref={userMenuRef}>
              <button 
                className="user-menu-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="user-avatar">
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user.fullName}</span>
                <svg 
                  className={`dropdown-arrow ${userMenuOpen ? 'open' : ''}`}
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12"
                >
                  <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
              </button>
              
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-avatar-large">
                      {user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="user-dropdown-name">{user.fullName}</div>
                      <div className="user-dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  
                  {/* Chỉ hiển thị cho user thường, ẩn cho admin */}
                  {!isAdmin() && (
                    <>
                      <Link to="/profile" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <FaUser />
                        Thông tin cá nhân
                      </Link>
                      <Link to="/my-bookings" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <FaHistory />
                        Lịch sử đặt phòng
                      </Link>
                    </>
                  )}
                  
                  {/* Chỉ hiển thị cho admin */}
                  {isAdmin() && (
                    <Link to="/admin" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FaCog />
                      Quản trị hệ thống
                    </Link>
                  )}
                  <div className="user-dropdown-divider"></div>
                  <button onClick={handleLogout} className="user-dropdown-item logout">
                    <FaSignOutAlt />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Đăng Nhập</Link>
              <Link to="/register" className="btn btn-primary">Đăng Ký</Link>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang Chủ</Link>
          <Link to="/rooms" onClick={() => setMobileMenuOpen(false)}>Phòng</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Giới Thiệu</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Liên Hệ</Link>
          {/* Chỉ hiển thị cho user thường */}
          {user && !isAdmin() && (
            <>
              <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>Lịch Sử Đặt Phòng</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Thông Tin Cá Nhân</Link>
            </>
          )}
          {isAdmin() && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Quản Trị</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
