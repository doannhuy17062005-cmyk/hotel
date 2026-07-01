import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPaperPlane
} from 'react-icons/fa';

import { contactAPI } from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    content: ''
  });

  const [loading, setLoading] = useState(false);

  /*
   * Khi mở trang liên hệ, tự lấy thông tin
   * người dùng đang đăng nhập từ localStorage.
   */
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');

      if (savedUser) {
        const user = JSON.parse(savedUser);

        setFormData((previousData) => ({
          ...previousData,
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || ''
        }));
      }
    } catch (error) {
      console.error('Không thể đọc thông tin người dùng:', error);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');

    /*
     * Backend đang yêu cầu đăng nhập mới được gửi liên hệ.
     */
    if (!token) {
      toast.warning('Bạn cần đăng nhập trước khi gửi liên hệ.');
      return;
    }

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.content.trim()
    ) {
      toast.warning('Vui lòng nhập đầy đủ các trường bắt buộc.');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject,
        content: formData.content.trim()
      };

      const response = await contactAPI.send(requestData);

      console.log('Liên hệ đã được lưu:', response.data);

      toast.success(
        'Cảm ơn bạn đã liên hệ! Nội dung đã được gửi đến quản trị viên.'
      );

      /*
       * Giữ lại thông tin cá nhân,
       * chỉ xóa chủ đề và nội dung sau khi gửi.
       */
      setFormData((previousData) => ({
        ...previousData,
        subject: '',
        content: ''
      }));
    } catch (error) {
      console.error('Lỗi gửi liên hệ:', error);

      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        toast.error('Bạn không có quyền gửi liên hệ.');
      } else if (error.response?.status === 400) {
        const validationErrors = error.response?.data?.errors;

        if (validationErrors) {
          const firstError = Object.values(validationErrors)[0];
          toast.error(firstError || 'Dữ liệu liên hệ không hợp lệ.');
        } else {
          toast.error('Vui lòng kiểm tra lại thông tin đã nhập.');
        }
      } else {
        toast.error(
          error.response?.data?.message ||
          'Không thể gửi liên hệ. Vui lòng thử lại sau.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: 'Địa chỉ',
      content: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'
    },
    {
      icon: <FaPhone />,
      title: 'Điện thoại',
      content: '+84 28 1234 5678'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      content: 'contact@luxuryhotel.vn'
    },
    {
      icon: <FaClock />,
      title: 'Giờ làm việc',
      content: '24/7 - Phục vụ suốt ngày đêm'
    }
  ];

  const socialLinks = [
    {
      icon: <FaFacebook />,
      url: '#',
      name: 'Facebook'
    },
    {
      icon: <FaInstagram />,
      url: '#',
      name: 'Instagram'
    },
    {
      icon: <FaTwitter />,
      url: '#',
      name: 'Twitter'
    },
    {
      icon: <FaYoutube />,
      url: '#',
      name: 'YouTube'
    }
  ];

  return (
    <div className="page">
      {/* Hero Section */}
      <section
        style={{
          background: 'var(--gradient-primary)',
          color: 'var(--white)',
          padding: 'var(--spacing-3xl) 0',
          textAlign: 'center',
          marginTop: '-3rem'
        }}
      >
        <div className="container">
          <h1
            style={{
              color: 'var(--white)',
              marginBottom: 'var(--spacing-md)'
            }}
          >
            Liên Hệ
          </h1>

          <p
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              opacity: 0.9
            }}
          >
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section style={{ padding: 'var(--spacing-3xl) 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr',
              gap: 'var(--spacing-3xl)'
            }}
          >
            {/* Contact Info */}
            <div>
              <h3
                style={{
                  marginBottom: 'var(--spacing-xl)',
                  color: 'var(--primary)'
                }}
              >
                Thông Tin Liên Hệ
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-lg)'
                }}
              >
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-md)'
                    }}
                  >
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        background: 'var(--gradient-gold)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary-dark)',
                        fontSize: '1.2rem',
                        flexShrink: 0
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <h4
                        style={{
                          fontSize: '0.9rem',
                          color: 'var(--gray-500)',
                          marginBottom: '4px'
                        }}
                      >
                        {item.title}
                      </h4>

                      <p
                        style={{
                          color: 'var(--gray-800)',
                          fontWeight: 500
                        }}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                <h4
                  style={{
                    marginBottom: 'var(--spacing-md)',
                    color: 'var(--gray-700)'
                  }}
                >
                  Theo dõi chúng tôi
                </h4>

                <div
                  style={{
                    display: 'flex',
                    gap: 'var(--spacing-md)'
                  }}
                >
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      style={{
                        width: '45px',
                        height: '45px',
                        background: 'var(--gray-100)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--gray-600)',
                        fontSize: '1.2rem',
                        transition: 'all 0.3s ease'
                      }}
                      title={social.name}
                      onClick={(event) => {
                        if (social.url === '#') {
                          event.preventDefault();
                        }
                      }}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card">
              <div
                className="card-body"
                style={{ padding: 'var(--spacing-2xl)' }}
              >
                <h3
                  style={{
                    marginBottom: 'var(--spacing-xl)',
                    color: 'var(--primary)'
                  }}
                >
                  Gửi Tin Nhắn
                </h3>

                <form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 'var(--spacing-md)'
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">
                        Họ và tên *
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        className="form-input"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Nhập họ và tên"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Email *
                      </label>

                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Nhập email"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 'var(--spacing-md)'
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">
                        Số điện thoại
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Chủ đề *
                      </label>

                      <select
                        name="subject"
                        className="form-select"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="Đặt phòng">Đặt phòng</option>
                        <option value="Hỗ trợ">Hỗ trợ</option>
                        <option value="Phản hồi">Phản hồi</option>
                        <option value="Hợp tác">Hợp tác</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Nội dung *
                    </label>

                    <textarea
                      name="content"
                      className="form-textarea"
                      value={formData.content}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Nhập nội dung tin nhắn..."
                      disabled={loading}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    disabled={loading}
                  >
                    <FaPaperPlane />

                    {loading
                      ? 'Đang gửi...'
                      : 'Gửi Tin Nhắn'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section
        style={{
          background: 'var(--gray-100)',
          padding: 'var(--spacing-3xl) 0'
        }}
      >
        <div className="container">
          <div
            style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-xl)'
            }}
          >
            <h2>Vị Trí Của Chúng Tôi</h2>

            <p
              style={{
                color: 'var(--gray-500)',
                marginTop: 'var(--spacing-sm)'
              }}
            >
              Tọa lạc tại trung tâm thành phố, dễ dàng tiếp cận mọi điểm tham quan
            </p>
          </div>

          <div
            style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580567417!2d106.70232647476974!3d10.771594989376855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670640629%3A0x5a2d9f5e5c9c6f36!2zMTIzIE5ndXnhu4VuIEh14buHLCBC4bqvbiBOZ2jDqSwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1702648800000!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Luxury Hotel Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;