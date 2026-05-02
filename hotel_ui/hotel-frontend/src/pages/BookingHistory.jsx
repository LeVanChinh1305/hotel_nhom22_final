import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { Calendar, Tag, CreditCard } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/bookings/my-bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => console.error("Lỗi tải lịch sử:", err));
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return { bg: '#FEF3C7', text: '#D97706' };
      case 'CONFIRMED': return { bg: '#DBEAFE', text: '#2563EB' };
      case 'COMPLETED': return { bg: '#D1FAE5', text: '#059669' };
      case 'CANCELLED': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '30px' }}>Lịch sử giao dịch</h2>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '20px' }}>
            <p style={{ color: '#64748B' }}>Bạn chưa có đơn đặt phòng nào.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map(b => {
              const status = getStatusColor(b.status);
              return (
                <div key={b.id} style={{
                  background: '#fff', padding: '24px', borderRadius: '16px',
                  border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', color: '#0F2E5A' }}>Đơn #{b.id}</span>
                      <span style={{ 
                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                        background: status.bg, color: status.text
                      }}>{b.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', color: '#64748B', fontSize: '14px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} /> {b.checkInDate} - {b.checkOutDate}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CreditCard size={14} /> {b.totalPrice?.toLocaleString()} VNĐ
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    {b.status === 'PENDING' && (
                       <button style={{ 
                         padding: '8px 16px', borderRadius: '8px', border: '1px solid #FCA5A5',
                         color: '#EF4444', background: 'transparent', cursor: 'pointer', fontWeight: '500'
                       }}>Hủy đơn</button>
                    )}
                    {b.status === 'COMPLETED' && (
                       <button style={{ 
                         padding: '8px 16px', borderRadius: '8px', border: '1px solid #3B82F6',
                         color: '#3B82F6', background: 'transparent', cursor: 'pointer', fontWeight: '500'
                       }}>Đánh giá</button>
                    )}
                  </div>
                </div>
              )})}
          </div>
        )}
      </div>
    </div>
  );
};
export default BookingHistory;