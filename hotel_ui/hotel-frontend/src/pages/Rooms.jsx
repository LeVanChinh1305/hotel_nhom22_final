import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RoomCard from '../components/rooms/RoomCard';

const API_BASE = 'http://localhost:8080';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [error, setError] = useState('');

  const loadRooms = (checkIn, checkOut) => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (checkIn) params.set('checkInDate', checkIn);
    if (checkOut) params.set('checkOutDate', checkOut);

    fetch(`${API_BASE}/api/rooms${params.toString() ? `?${params.toString()}` : ''}`)
      .then(res => {
        if (!res.ok) throw new Error('Lấy phòng thất bại');
        return res.json();
      })
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi tải phòng:', err);
        setError('Không thể tải dữ liệu phòng. Vui lòng thử lại.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleSearch = () => {
    if (checkInDate && checkOutDate && checkOutDate < checkInDate) {
      setError('Ngày trả phải sau ngày nhận.');
      return;
    }
    loadRooms(checkInDate, checkOutDate);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 2rem' }}>
        <header style={{ marginBottom: '24px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#0F2E5A', fontSize: '36px' }}>
            Danh sách phòng nghỉ
          </h1>
          <p style={{ color: '#64748B' }}>Khám phá không gian nghỉ dưỡng phù hợp với nhu cầu của bạn</p>
        </header>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'flex-end',
          marginBottom: '24px',
          padding: '20px',
          borderRadius: '18px',
          background: '#fff',
          boxShadow: '0 8px 24px rgba(15, 46, 90, 0.04)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#475569' }}>Ngày nhận</label>
            <input
              type="date"
              value={checkInDate}
              onChange={e => setCheckInDate(e.target.value)}
              style={{
                padding: '12px 14px', borderRadius: '14px', border: '1px solid #E2E8F0',
                minWidth: '210px', background: '#F8FAFC', color: '#0F172A'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#475569' }}>Ngày trả</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={e => setCheckOutDate(e.target.value)}
              style={{
                padding: '12px 14px', borderRadius: '14px', border: '1px solid #E2E8F0',
                minWidth: '210px', background: '#F8FAFC', color: '#0F172A'
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            style={{
              padding: '14px 22px', borderRadius: '14px', border: 'none',
              background: '#2563EB', color: '#fff', cursor: 'pointer',
              fontWeight: '700', boxShadow: '0 12px 24px rgba(37, 99, 235, 0.18)'
            }}
          >
            Tìm phòng trống
          </button>
        </div>

        {error && (
          <div style={{
            marginBottom: '24px', padding: '14px 18px', borderRadius: '14px',
            background: '#FEF3F2', color: '#B91C1C', border: '1px solid #FECACA'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải danh sách phòng...</div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {rooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
        
        {!loading && rooms.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: '60px' }}>
            Hiện tại không có phòng nào khả dụng.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Rooms;