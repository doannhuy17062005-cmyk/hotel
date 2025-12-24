import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import api from '../services/api';

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    processPaymentResult();
  }, []);

  const processPaymentResult = async () => {
    try {
      // Get all query params from VNPay callback
      const params = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      // Call backend to verify and process payment
      const response = await api.get('/payment/vnpay-return', { params });
      setResult(response.data);
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi xử lý thanh toán'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <FaSpinner className="spinner" style={{ fontSize: '3rem', color: 'var(--primary)' }} />
          <p style={{ marginTop: 'var(--spacing-lg)', color: 'var(--gray-600)' }}>
            Đang xử lý kết quả thanh toán...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <div className="card-body" style={{ padding: 'var(--spacing-2xl)' }}>
            {result?.success ? (
              <>
                <FaCheckCircle style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: 'var(--spacing-lg)' }} />
                <h2 style={{ color: 'var(--success)', marginBottom: 'var(--spacing-md)' }}>
                  Thanh toán thành công!
                </h2>
                <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-lg)' }}>
                  {result.message}
                </p>
                
                {result.bookingId && (
                  <div style={{ 
                    background: 'var(--gray-50)', 
                    padding: 'var(--spacing-lg)', 
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-xl)'
                  }}>
                    <p><strong>Mã đặt phòng:</strong> #{result.bookingId}</p>
                    {result.transactionNo && (
                      <p><strong>Mã giao dịch:</strong> {result.transactionNo}</p>
                    )}
                  </div>
                )}

                <Link to="/my-bookings" className="btn btn-primary" style={{ marginRight: 'var(--spacing-md)' }}>
                  Xem đặt phòng của tôi
                </Link>
                <Link to="/" className="btn btn-ghost">
                  Về trang chủ
                </Link>
              </>
            ) : (
              <>
                <FaTimesCircle style={{ fontSize: '4rem', color: 'var(--error)', marginBottom: 'var(--spacing-lg)' }} />
                <h2 style={{ color: 'var(--error)', marginBottom: 'var(--spacing-md)' }}>
                  Thanh toán thất bại
                </h2>
                <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-xl)' }}>
                  {result?.message || 'Có lỗi xảy ra trong quá trình thanh toán'}
                </p>

                <Link to="/my-bookings" className="btn btn-primary" style={{ marginRight: 'var(--spacing-md)' }}>
                  Xem đặt phòng
                </Link>
                <Link to="/" className="btn btn-ghost">
                  Về trang chủ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;
