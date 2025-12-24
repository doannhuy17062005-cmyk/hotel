import { FaHotel, FaStar, FaUsers, FaAward, FaHeart } from 'react-icons/fa';

const AboutPage = () => {
  const stats = [
    { icon: <FaStar />, value: '15+', label: 'Năm Kinh Nghiệm' },
    { icon: <FaUsers />, value: '50,000+', label: 'Khách Hàng' },
    { icon: <FaHotel />, value: '200+', label: 'Phòng Sang Trọng' },
    { icon: <FaAward />, value: '25+', label: 'Giải Thưởng' },
  ];

  const team = [
    { name: 'Nguyễn Văn A', role: 'Giám đốc điều hành', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' },
    { name: 'Trần Thị B', role: 'Quản lý khách sạn', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop' },
    { name: 'Lê Văn C', role: 'Trưởng phòng dịch vụ', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop' },
  ];

  return (
    <div className="page">
      {/* Hero Section */}
      <section style={{
        background: 'var(--gradient-primary)',
        color: 'var(--white)',
        padding: 'var(--spacing-3xl) 0',
        textAlign: 'center',
        marginTop: '-3rem'
      }}>
        <div className="container">
          <h1 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-md)' }}>Về Chúng Tôi</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            Luxury Hotel - Nơi mang đến trải nghiệm nghỉ dưỡng đẳng cấp 5 sao với dịch vụ hoàn hảo
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section style={{ padding: 'var(--spacing-3xl) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3xl)', alignItems: 'center' }}>
            <div>
              <h2 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--primary)' }}>
                <FaHeart style={{ marginRight: '10px', color: 'var(--secondary)' }} />
                Câu Chuyện Của Chúng Tôi
              </h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-md)', lineHeight: 1.8 }}>
                Được thành lập từ năm 2009, Luxury Hotel đã không ngừng phát triển và trở thành một trong những 
                khách sạn hàng đầu tại Việt Nam. Chúng tôi tự hào mang đến cho khách hàng những trải nghiệm 
                nghỉ dưỡng tuyệt vời nhất.
              </p>
              <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-md)', lineHeight: 1.8 }}>
                Với đội ngũ nhân viên chuyên nghiệp, tận tâm và các tiện nghi hiện đại, chúng tôi cam kết 
                mang đến sự hài lòng tuyệt đối cho mỗi vị khách khi đến với Luxury Hotel.
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>
                Sứ mệnh của chúng tôi là tạo nên những kỷ niệm đáng nhớ và mang đến sự thoải mái như ở nhà 
                cho mỗi vị khách.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"
                alt="Luxury Hotel"
                style={{ width: '100%', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: 'var(--gray-50)', padding: 'var(--spacing-3xl) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-xl)' }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto var(--spacing-md)',
                  background: 'var(--gradient-gold)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'var(--primary-dark)'
                }}>
                  {stat.icon}
                </div>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: 'var(--spacing-xs)' }}>
                  {stat.value}
                </h3>
                <p style={{ color: 'var(--gray-500)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: 'var(--spacing-3xl) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2>Đội Ngũ Lãnh Đạo</h2>
            <p style={{ color: 'var(--gray-500)', marginTop: 'var(--spacing-sm)' }}>
              Những người đứng sau thành công của Luxury Hotel
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-xl)' }}>
            {team.map((member, index) => (
              <div key={index} className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto var(--spacing-md)',
                    border: '4px solid var(--secondary)'
                  }}
                />
                <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{member.name}</h4>
                <p style={{ color: 'var(--secondary)', fontWeight: 500 }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ background: 'var(--primary-dark)', color: 'var(--white)', padding: 'var(--spacing-3xl) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <h2 style={{ color: 'var(--white)' }}>Giá Trị Cốt Lõi</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-xl)' }}>
            {[
              { title: 'Chất Lượng', desc: 'Cam kết mang đến dịch vụ chất lượng cao nhất' },
              { title: 'Tận Tâm', desc: 'Phục vụ khách hàng bằng cả trái tim' },
              { title: 'Đổi Mới', desc: 'Không ngừng cải tiến để hoàn thiện hơn' },
            ].map((value, index) => (
              <div key={index} style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                <h4 style={{ color: 'var(--secondary)', marginBottom: 'var(--spacing-sm)' }}>{value.title}</h4>
                <p style={{ opacity: 0.8 }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
