import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaEnvelope,
  FaReply,
  FaSyncAlt,
  FaTimes,
  FaUser,
  FaPhone,
  FaClock
} from 'react-icons/fa';

import AdminLayout from './AdminLayout';
import { adminAPI } from '../../services/api';

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replying, setReplying] = useState(false);

  const loadContacts = async () => {
    setLoading(true);

    try {
      const response = await adminAPI.getAllContacts();

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setContacts(data);
    } catch (error) {
      console.error('Lỗi lấy danh sách liên hệ:', error);

      toast.error(
        error.response?.data?.message ||
        'Không thể tải danh sách liên hệ.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const openReplyModal = (contact) => {
    setSelectedContact(contact);
    setReplyContent(contact.adminReply || '');
  };

  const closeReplyModal = () => {
    if (replying) {
      return;
    }

    setSelectedContact(null);
    setReplyContent('');
  };

  const handleReply = async (event) => {
    event.preventDefault();

    if (!selectedContact) {
      return;
    }

    if (!replyContent.trim()) {
      toast.warning('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    setReplying(true);

    try {
      const response = await adminAPI.replyContact(
        selectedContact.id,
        replyContent.trim()
      );

      const updatedContact = response.data;

      setContacts((previousContacts) =>
        previousContacts.map((contact) =>
          contact.id === updatedContact.id
            ? updatedContact
            : contact
        )
      );

      toast.success('Đã gửi phản hồi đến khách hàng.');

      setSelectedContact(null);
      setReplyContent('');
    } catch (error) {
      console.error('Lỗi phản hồi liên hệ:', error);

      if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.errors?.reply ||
          'Nội dung phản hồi không hợp lệ.'
        );
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền thực hiện chức năng này.');
      } else {
        toast.error(
          error.response?.data?.message ||
          'Không thể gửi phản hồi.'
        );
      }
    } finally {
      setReplying(false);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return 'Chưa cập nhật';
    }

    return new Date(dateTime).toLocaleString('vi-VN');
  };

  const getStatusStyle = (status) => {
    if (status === 'REPLIED') {
      return {
        background: '#dcfce7',
        color: '#15803d'
      };
    }

    return {
      background: '#fef3c7',
      color: '#b45309'
    };
  };

  return (
    <AdminLayout title="Quản Lý Liên Hệ">
      <div
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--gray-200)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--spacing-md)'
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                color: 'var(--primary)'
              }}
            >
              Danh Sách Liên Hệ
            </h3>

            <p
              style={{
                marginTop: '6px',
                color: 'var(--gray-500)'
              }}
            >
              Tổng cộng: {contacts.length} liên hệ
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={loadContacts}
            disabled={loading}
          >
            <FaSyncAlt />
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        {loading ? (
          <div
            style={{
              padding: '60px',
              textAlign: 'center'
            }}
          >
            <div className="spinner"></div>
            <p style={{ marginTop: '15px' }}>
              Đang tải danh sách liên hệ...
            </p>
          </div>
        ) : contacts.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: 'var(--gray-500)'
            }}
          >
            <FaEnvelope
              style={{
                fontSize: '3rem',
                marginBottom: '15px'
              }}
            />

            <h3>Chưa có liên hệ nào</h3>

            <p>
              Các tin nhắn khách hàng gửi sẽ xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'var(--gray-100)',
                    textAlign: 'left'
                  }}
                >
                  <th style={tableHeaderStyle}>Khách hàng</th>
                  <th style={tableHeaderStyle}>Chủ đề</th>
                  <th style={tableHeaderStyle}>Nội dung</th>
                  <th style={tableHeaderStyle}>Ngày gửi</th>
                  <th style={tableHeaderStyle}>Trạng thái</th>
                  <th style={tableHeaderStyle}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    style={{
                      borderBottom: '1px solid var(--gray-200)'
                    }}
                  >
                    <td style={tableCellStyle}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--gray-800)'
                        }}
                      >
                        {contact.fullName}
                      </div>

                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--gray-500)',
                          marginTop: '4px'
                        }}
                      >
                        {contact.email}
                      </div>

                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--gray-500)',
                          marginTop: '4px'
                        }}
                      >
                        {contact.phone || 'Không có số điện thoại'}
                      </div>
                    </td>

                    <td style={tableCellStyle}>
                      {contact.subject}
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        maxWidth: '300px'
                      }}
                    >
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={contact.content}
                      >
                        {contact.content}
                      </div>
                    </td>

                    <td style={tableCellStyle}>
                      {formatDateTime(contact.createdAt)}
                    </td>

                    <td style={tableCellStyle}>
                      <span
                        style={{
                          ...getStatusStyle(contact.status),
                          display: 'inline-block',
                          padding: '6px 10px',
                          borderRadius: '999px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        {contact.status === 'REPLIED'
                          ? 'Đã trả lời'
                          : 'Chờ xử lý'}
                      </span>
                    </td>

                    <td style={tableCellStyle}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => openReplyModal(contact)}
                      >
                        <FaReply />

                        {contact.status === 'REPLIED'
                          ? 'Xem / Sửa'
                          : 'Trả lời'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedContact && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--gray-200)',
                paddingBottom: 'var(--spacing-md)'
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: 'var(--primary)'
                }}
              >
                Phản Hồi Liên Hệ
              </h3>

              <button
                type="button"
                onClick={closeReplyModal}
                disabled={replying}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: 'var(--gray-500)'
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div
              style={{
                marginTop: 'var(--spacing-lg)',
                display: 'grid',
                gap: '12px'
              }}
            >
              <div>
                <FaUser style={{ marginRight: '8px' }} />
                <strong>Khách hàng:</strong>{' '}
                {selectedContact.fullName}
              </div>

              <div>
                <FaEnvelope style={{ marginRight: '8px' }} />
                <strong>Email:</strong>{' '}
                {selectedContact.email}
              </div>

              <div>
                <FaPhone style={{ marginRight: '8px' }} />
                <strong>Số điện thoại:</strong>{' '}
                {selectedContact.phone || 'Không có'}
              </div>

              <div>
                <FaClock style={{ marginRight: '8px' }} />
                <strong>Thời gian gửi:</strong>{' '}
                {formatDateTime(selectedContact.createdAt)}
              </div>
            </div>

            <div
              style={{
                marginTop: 'var(--spacing-lg)',
                padding: 'var(--spacing-md)',
                background: 'var(--gray-100)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <strong>Chủ đề:</strong>
              <p style={{ marginTop: '6px' }}>
                {selectedContact.subject}
              </p>

              <strong>Nội dung khách gửi:</strong>
              <p
                style={{
                  marginTop: '6px',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {selectedContact.content}
              </p>
            </div>

            <form
              onSubmit={handleReply}
              style={{ marginTop: 'var(--spacing-lg)' }}
            >
              <div className="form-group">
                <label className="form-label">
                  Nội dung phản hồi *
                </label>

                <textarea
                  className="form-textarea"
                  rows="6"
                  value={replyContent}
                  onChange={(event) =>
                    setReplyContent(event.target.value)
                  }
                  placeholder="Nhập nội dung phản hồi cho khách hàng..."
                  disabled={replying}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 'var(--spacing-md)',
                  marginTop: 'var(--spacing-lg)'
                }}
              >
                <button
                  type="button"
                  className="btn"
                  onClick={closeReplyModal}
                  disabled={replying}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={replying}
                >
                  <FaReply />

                  {replying
                    ? 'Đang gửi...'
                    : 'Gửi Phản Hồi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

const tableHeaderStyle = {
  padding: '15px',
  fontWeight: 600,
  color: 'var(--gray-700)',
  whiteSpace: 'nowrap'
};

const tableCellStyle = {
  padding: '15px',
  color: 'var(--gray-700)',
  verticalAlign: 'middle'
};

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  zIndex: 9999
};

const modalContentStyle = {
  background: 'var(--white)',
  width: '100%',
  maxWidth: '720px',
  maxHeight: '90vh',
  overflowY: 'auto',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--spacing-xl)',
  boxShadow: 'var(--shadow-xl)'
};

export default AdminContactsPage;