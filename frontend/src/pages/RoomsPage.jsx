import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { roomAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import RoomCard from '../components/RoomCard';

const ROOMS_PER_PAGE = 6;

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams] = useSearchParams();

  const resultSectionRef = useRef(null);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    fetchRooms();

    // Khi thay đổi tiêu chí tìm kiếm thì quay về trang đầu tiên
    setCurrentPage(1);
  }, [searchParams]);

  const fetchRoomTypes = async () => {
    try {
      const response = await roomAPI.getRoomTypes();

      setRoomTypes(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error('Lỗi lấy loại phòng:', error);
      setRoomTypes([]);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);

    try {
      const params = {};

      if (searchParams.get('checkIn')) {
        params.checkIn = searchParams.get('checkIn');
      }

      if (searchParams.get('checkOut')) {
        params.checkOut = searchParams.get('checkOut');
      }

      if (searchParams.get('guests')) {
        params.guests = searchParams.get('guests');
      }

      if (searchParams.get('roomTypeId')) {
        params.roomTypeId = searchParams.get('roomTypeId');
      }

      const response = await roomAPI.search(params);

      setRooms(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error('Lỗi lấy danh sách phòng:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    const queryParams = new URLSearchParams();

    if (params.checkIn) {
      queryParams.set('checkIn', params.checkIn);
    }

    if (params.checkOut) {
      queryParams.set('checkOut', params.checkOut);
    }

    if (params.guests) {
      queryParams.set('guests', params.guests);
    }

    if (params.roomTypeId) {
      queryParams.set('roomTypeId', params.roomTypeId);
    }

    window.location.search = queryParams.toString();
  };

  const totalPages = Math.ceil(
    rooms.length / ROOMS_PER_PAGE
  );

  const currentRooms = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ROOMS_PER_PAGE;

    const endIndex =
      startIndex + ROOMS_PER_PAGE;

    return rooms.slice(startIndex, endIndex);
  }, [rooms, currentPage]);

  const handleChangePage = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages ||
      pageNumber === currentPage
    ) {
      return;
    }

    setCurrentPage(pageNumber);

    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (
        let page = 1;
        page <= totalPages;
        page += 1
      ) {
        pages.push(page);
      }

      return pages;
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2
    ];
  };

  const startRoomNumber =
    rooms.length === 0
      ? 0
      : (currentPage - 1) *
          ROOMS_PER_PAGE +
        1;

  const endRoomNumber = Math.min(
    currentPage * ROOMS_PER_PAGE,
    rooms.length
  );

  return (
    <div className="page">
      <div className="container">
        <div
          style={{
            marginBottom: 'var(--spacing-2xl)'
          }}
        >
          <h1>Tìm Phòng</h1>

          <p
            style={{
              color: 'var(--gray-500)',
              marginTop: 'var(--spacing-sm)'
            }}
          >
            Khám phá các phòng phù hợp với nhu cầu của bạn
          </p>
        </div>

        <SearchBar
          onSearch={handleSearch}
          roomTypes={roomTypes}
        />

        <div
          ref={resultSectionRef}
          style={{
            marginTop: 'var(--spacing-2xl)',
            scrollMarginTop: '100px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: 'var(--spacing-lg)'
            }}
          >
            <h3>
              Kết Quả ({rooms.length} phòng)
            </h3>

            {!loading && rooms.length > 0 && (
              <span
                style={{
                  color: 'var(--gray-500)',
                  fontSize: '0.95rem'
                }}
              >
                Hiển thị {startRoomNumber}–{endRoomNumber} trong tổng số{' '}
                {rooms.length} phòng
              </span>
            )}
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <p>Đang tải...</p>
            </div>
          ) : rooms.length > 0 ? (
            <>
              <div className="room-grid">
                {currentRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginTop: 'var(--spacing-2xl)',
                    marginBottom: 'var(--spacing-xl)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleChangePage(
                        currentPage - 1
                      )
                    }
                    disabled={currentPage === 1}
                    style={{
                      ...paginationButtonStyle,
                      opacity:
                        currentPage === 1
                          ? 0.45
                          : 1,
                      cursor:
                        currentPage === 1
                          ? 'not-allowed'
                          : 'pointer'
                    }}
                  >
                    <FaChevronLeft />
                    Trước
                  </button>

                  {getPageNumbers().map(
                    (pageNumber) => {
                      const isCurrentPage =
                        currentPage === pageNumber;

                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() =>
                            handleChangePage(
                              pageNumber
                            )
                          }
                          style={{
                            ...pageNumberStyle,
                            background:
                              isCurrentPage
                                ? 'var(--primary)'
                                : 'var(--white)',
                            color:
                              isCurrentPage
                                ? 'var(--white)'
                                : 'var(--primary)',
                            borderColor:
                              isCurrentPage
                                ? 'var(--primary)'
                                : 'var(--gray-300)',
                            boxShadow:
                              isCurrentPage
                                ? 'var(--shadow-md)'
                                : 'none'
                          }}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleChangePage(
                        currentPage + 1
                      )
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    style={{
                      ...paginationButtonStyle,
                      opacity:
                        currentPage === totalPages
                          ? 0.45
                          : 1,
                      cursor:
                        currentPage === totalPages
                          ? 'not-allowed'
                          : 'pointer'
                    }}
                  >
                    Sau
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon" />
              <h3>Không tìm thấy phòng</h3>
              <p>
                Vui lòng thử lại với tiêu chí tìm kiếm khác
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const paginationButtonStyle = {
  minHeight: '42px',
  padding: '0 16px',
  border: '1px solid var(--gray-300)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--white)',
  color: 'var(--primary)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontWeight: 600,
  transition: 'all 0.2s ease'
};

const pageNumberStyle = {
  width: '42px',
  height: '42px',
  border: '1px solid var(--gray-300)',
  borderRadius: 'var(--radius-md)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

export default RoomsPage;