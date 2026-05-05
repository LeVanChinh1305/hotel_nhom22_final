import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { Calendar, CreditCard } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');

      // Lấy user object từ localStorage
      const userStr = localStorage.getItem('user');

      if (!userStr) {
        setError('Bạn chưa đăng nhập');
        return;
      }

      const user = JSON.parse(userStr);
      const token = user.token;

      if (!token) {
        setError('Không tìm thấy token đăng nhập');
        return;
      }

      console.log("TOKEN gửi lên backend:", token);

      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Lỗi ${res.status}`);
      }

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải lịch sử:', err);
      setError(err.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'CONFIRMED':
        return { bg: '#DBEAFE', text: '#2563EB' };
      case 'COMPLETED':
        return { bg: '#D1FAE5', text: '#059669' };
      case 'CANCELLED':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <h2>Lịch sử giao dịch</h2>

        {loading && <p>Đang tải dữ liệu...</p>}

        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '16px',
            borderRadius: '12px'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <p>Bạn chưa có đơn đặt phòng nào.</p>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bookings.map((b) => {
              const status = getStatusColor(b.status);

              return (
                <div key={b.id} style={{
                  background: '#fff',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <strong>Đơn #{b.id}</strong>

                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      background: status.bg,
                      color: status.text
                    }}>
                      {b.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 20 }}>
                    <span>
                      <Calendar size={14} /> {b.checkInDate} - {b.checkOutDate}
                    </span>

                    <span>
                      <CreditCard size={14} /> {b.totalPrice?.toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;