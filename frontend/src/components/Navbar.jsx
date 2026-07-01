import {
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import {
  FaHotel,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHistory,
  FaCog,
  FaBell
} from 'react-icons/fa';

import {
  useState,
  useRef,
  useEffect
} from 'react';

import { contactAPI } from '../services/api';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();

    setUnreadCount(0);
    setUserMenuOpen(false);

    navigate('/');
  };

  /*
   * Lấy số phản hồi chưa đọc của khách hàng.
   */
  const loadUnreadCount = async () => {
    if (!user || isAdmin()) {
      setUnreadCount(0);
      return;
    }

    try {
      const response =
        await contactAPI.getUnreadCount();

      setUnreadCount(
        Number(response.data?.count) || 0
      );
    } catch (error) {
      console.error(
        'Không thể tải số thông báo chưa đọc:',
        error
      );

      setUnreadCount(0);
    }
  };

  /*
   * Tải số thông báo khi người dùng đăng nhập
   * hoặc chuyển trang.
   */
  useEffect(() => {
    loadUnreadCount();
  }, [user, location.pathname]);

  /*
   * Tự kiểm tra thông báo mới mỗi 30 giây.
   */
  useEffect(() => {
    if (!user || isAdmin()) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [user]);

  /*
   * Đóng menu tài khoản khi bấm ra ngoài.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const isActive = (path) =>
    location.pathname === path;

  const notificationBadgeStyle = {
    minWidth: '20px',
    height: '20px',
    padding: '0 6px',
    borderRadius: '999px',
    background: '#ef4444',
    color: '#ffffff',
    fontSize: '0.72rem',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto'
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link
          to="/"
          className="navbar-logo"
        >
          <FaHotel />
          Luxury<span>Hotel</span>
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link
              to="/"
              className={`navbar-link ${
                isActive('/') ? 'active' : ''
              }`}
            >
              Trang Chủ
            </Link>
          </li>

          <li>
            <Link
              to="/rooms"
              className={`navbar-link ${
                isActive('/rooms') ? 'active' : ''
              }`}
            >
              Phòng
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className={`navbar-link ${
                isActive('/about') ? 'active' : ''
              }`}
            >
              Giới Thiệu
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className={`navbar-link ${
                isActive('/contact') ? 'active' : ''
              }`}
            >
              Liên Hệ
            </Link>
          </li>

          {isAdmin() && (
            <li>
              <Link
                to="/admin"
                className={`navbar-link ${
                  location.pathname.startsWith('/admin')
                    ? 'active'
                    : ''
                }`}
              >
                Quản Trị
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <div
              className="user-menu-container"
              ref={userMenuRef}
            >
              <button
                className="user-menu-trigger"
                onClick={() =>
                  setUserMenuOpen(!userMenuOpen)
                }
              >
                <div className="user-avatar">
                  {user.fullName
                    ?.charAt(0)
                    .toUpperCase() || 'U'}
                </div>

                <span className="user-name">
                  {user.fullName}
                </span>

                {!isAdmin() && unreadCount > 0 && (
                  <span
                    style={{
                      ...notificationBadgeStyle,
                      marginLeft: '6px'
                    }}
                  >
                    {unreadCount > 99
                      ? '99+'
                      : unreadCount}
                  </span>
                )}

                <svg
                  className={`dropdown-arrow ${
                    userMenuOpen ? 'open' : ''
                  }`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M3 5L6 8L9 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-avatar-large">
                      {user.fullName
                        ?.charAt(0)
                        .toUpperCase() || 'U'}
                    </div>

                    <div>
                      <div className="user-dropdown-name">
                        {user.fullName}
                      </div>

                      <div className="user-dropdown-email">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="user-dropdown-divider" />

                  {!isAdmin() && (
                    <>
                      <Link
                        to="/profile"
                        className="user-dropdown-item"
                        onClick={() =>
                          setUserMenuOpen(false)
                        }
                      >
                        <FaUser />
                        Thông tin cá nhân
                      </Link>

                      <Link
                        to="/my-bookings"
                        className="user-dropdown-item"
                        onClick={() =>
                          setUserMenuOpen(false)
                        }
                      >
                        <FaHistory />
                        Lịch sử đặt phòng
                      </Link>

                      <Link
                        to="/notifications"
                        className="user-dropdown-item"
                        onClick={() =>
                          setUserMenuOpen(false)
                        }
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <FaBell />
                        Thông báo

                        {unreadCount > 0 && (
                          <span
                            style={notificationBadgeStyle}
                          >
                            {unreadCount > 99
                              ? '99+'
                              : unreadCount}
                          </span>
                        )}
                      </Link>
                    </>
                  )}

                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="user-dropdown-item"
                      onClick={() =>
                        setUserMenuOpen(false)
                      }
                    >
                      <FaCog />
                      Quản trị hệ thống
                    </Link>
                  )}

                  <div className="user-dropdown-divider" />

                  <button
                    onClick={handleLogout}
                    className="user-dropdown-item logout"
                  >
                    <FaSignOutAlt />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-ghost"
              >
                Đăng Nhập
              </Link>

              <Link
                to="/register"
                className="btn btn-primary"
              >
                Đăng Ký
              </Link>
            </>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
        >
          {mobileMenuOpen
            ? <FaTimes />
            : <FaBars />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link
            to="/"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            Trang Chủ
          </Link>

          <Link
            to="/rooms"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            Phòng
          </Link>

          <Link
            to="/about"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            Giới Thiệu
          </Link>

          <Link
            to="/contact"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            Liên Hệ
          </Link>

          {user && !isAdmin() && (
            <>
              <Link
                to="/profile"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                Thông Tin Cá Nhân
              </Link>

              <Link
                to="/my-bookings"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                Lịch Sử Đặt Phòng
              </Link>

              <Link
                to="/notifications"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                Thông Báo
                {unreadCount > 0
                  ? ` (${unreadCount})`
                  : ''}
              </Link>
            </>
          )}

          {isAdmin() && (
            <Link
              to="/admin"
              onClick={() =>
                setMobileMenuOpen(false)
              }
            >
              Quản Trị
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;