import {
  useEffect,
  useState
} from 'react';

import { toast } from 'react-toastify';

import {
  FaBell,
  FaEnvelope,
  FaCheckCircle,
  FaClock,
  FaPaperPlane
} from 'react-icons/fa';

import { contactAPI } from '../services/api';

const NotificationsPage = () => {
  const [contacts, setContacts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [readingId, setReadingId] =
    useState(null);

  const loadContacts = async () => {
    setLoading(true);

    try {
      const response =
        await contactAPI.getMyContacts();

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setContacts(data);
    } catch (error) {
      console.error(
        'Lỗi tải thông báo:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Không thể tải danh sách thông báo.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleMarkAsRead = async (contact) => {
    if (
      contact.status !== 'REPLIED' ||
      contact.readByUser
    ) {
      return;
    }

    setReadingId(contact.id);

    try {
      const response =
        await contactAPI.markAsRead(contact.id);

      const updatedContact = response.data;

      setContacts((previousContacts) =>
        previousContacts.map((item) =>
          item.id === updatedContact.id
            ? updatedContact
            : item
        )
      );

      window.dispatchEvent(
        new Event('contact-notification-updated')
      );
    } catch (error) {
      console.error(
        'Lỗi đánh dấu thông báo đã đọc:',
        error
      );

      toast.error(
        'Không thể đánh dấu thông báo đã đọc.'
      );
    } finally {
      setReadingId(null);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return 'Chưa cập nhật';
    }

    return new Date(dateTime).toLocaleString(
      'vi-VN'
    );
  };

  const repliedContacts =
    contacts.filter(
      (contact) =>
        contact.status === 'REPLIED' &&
        contact.adminReply
    );

  return (
    <div className="page">
      <section
        style={{
          background:
            'var(--gradient-primary)',
          color: 'var(--white)',
          padding: 'var(--spacing-3xl) 0',
          textAlign: 'center',
          marginTop: '-3rem'
        }}
      >
        <div className="container">
          <FaBell
            style={{
              fontSize: '2.5rem',
              marginBottom:
                'var(--spacing-md)'
            }}
          />

          <h1
            style={{
              color: 'var(--white)',
              marginBottom:
                'var(--spacing-md)'
            }}
          >
            Thông Báo
          </h1>

          <p
            style={{
              maxWidth: '650px',
              margin: '0 auto',
              opacity: 0.9
            }}
          >
            Xem phản hồi từ quản trị viên
            đối với các liên hệ của bạn
          </p>
        </div>
      </section>

      <section
        style={{
          padding: 'var(--spacing-3xl) 0'
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '950px'
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px'
              }}
            >
              <div className="spinner" />

              <p
                style={{
                  marginTop: '15px'
                }}
              >
                Đang tải thông báo...
              </p>
            </div>
          ) : repliedContacts.length === 0 ? (
            <div
              className="card"
              style={{
                padding: '60px 20px',
                textAlign: 'center'
              }}
            >
              <FaEnvelope
                style={{
                  fontSize: '3.5rem',
                  color: 'var(--gray-400)',
                  marginBottom: '18px'
                }}
              />

              <h3>Chưa có phản hồi nào</h3>

              <p
                style={{
                  color: 'var(--gray-500)',
                  marginTop: '8px'
                }}
              >
                Khi quản trị viên trả lời liên hệ,
                thông báo sẽ xuất hiện tại đây.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-lg)'
              }}
            >
              {repliedContacts.map((contact) => {
                const unread =
                  !contact.readByUser;

                return (
                  <article
                    key={contact.id}
                    className="card"
                    onClick={() =>
                      handleMarkAsRead(contact)
                    }
                    style={{
                      cursor: unread
                        ? 'pointer'
                        : 'default',
                      borderLeft: unread
                        ? '5px solid #ef4444'
                        : '5px solid #22c55e',
                      background: unread
                        ? '#fffdf7'
                        : 'var(--white)',
                      transition:
                        'all 0.25s ease'
                    }}
                  >
                    <div
                      className="card-body"
                      style={{
                        padding:
                          'var(--spacing-xl)'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems:
                            'flex-start',
                          gap: '15px',
                          marginBottom: '18px'
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems:
                                'center',
                              gap: '10px',
                              marginBottom:
                                '8px'
                            }}
                          >
                            <FaBell
                              style={{
                                color: unread
                                  ? '#ef4444'
                                  : '#22c55e'
                              }}
                            />

                            <h3
                              style={{
                                margin: 0,
                                color:
                                  'var(--primary)'
                              }}
                            >
                              {contact.subject}
                            </h3>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems:
                                'center',
                              gap: '7px',
                              color:
                                'var(--gray-500)',
                              fontSize:
                                '0.9rem'
                            }}
                          >
                            <FaClock />

                            Phản hồi lúc:{' '}
                            {formatDateTime(
                              contact.repliedAt
                            )}
                          </div>
                        </div>

                        <span
                          style={{
                            padding: '6px 12px',
                            borderRadius:
                              '999px',
                            fontSize:
                              '0.82rem',
                            fontWeight: 700,
                            background: unread
                              ? '#fee2e2'
                              : '#dcfce7',
                            color: unread
                              ? '#b91c1c'
                              : '#15803d'
                          }}
                        >
                          {unread
                            ? 'Chưa đọc'
                            : 'Đã đọc'}
                        </span>
                      </div>

                      <div
                        style={{
                          padding:
                            'var(--spacing-md)',
                          background:
                            'var(--gray-100)',
                          borderRadius:
                            'var(--radius-md)',
                          marginBottom:
                            'var(--spacing-lg)'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems:
                              'center',
                            gap: '8px',
                            marginBottom:
                              '8px',
                            fontWeight: 600
                          }}
                        >
                          <FaPaperPlane />
                          Nội dung bạn đã gửi
                        </div>

                        <p
                          style={{
                            whiteSpace:
                              'pre-wrap',
                            margin: 0,
                            color:
                              'var(--gray-700)'
                          }}
                        >
                          {contact.content}
                        </p>

                        <div
                          style={{
                            marginTop: '10px',
                            color:
                              'var(--gray-500)',
                            fontSize:
                              '0.85rem'
                          }}
                        >
                          Gửi lúc:{' '}
                          {formatDateTime(
                            contact.createdAt
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          padding:
                            'var(--spacing-lg)',
                          background: '#eff6ff',
                          border:
                            '1px solid #bfdbfe',
                          borderRadius:
                            'var(--radius-md)'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems:
                              'center',
                            gap: '8px',
                            marginBottom:
                              '10px',
                            color: '#1d4ed8',
                            fontWeight: 700
                          }}
                        >
                          <FaCheckCircle />
                          Phản hồi từ khách sạn
                        </div>

                        <p
                          style={{
                            whiteSpace:
                              'pre-wrap',
                            margin: 0,
                            lineHeight: 1.7,
                            color:
                              'var(--gray-800)'
                          }}
                        >
                          {contact.adminReply}
                        </p>
                      </div>

                      {unread && (
                        <p
                          style={{
                            marginTop: '12px',
                            color:
                              'var(--gray-500)',
                            fontSize:
                              '0.85rem',
                            textAlign: 'right'
                          }}
                        >
                          {readingId ===
                          contact.id
                            ? 'Đang cập nhật...'
                            : 'Bấm vào thông báo để đánh dấu đã đọc'}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NotificationsPage;