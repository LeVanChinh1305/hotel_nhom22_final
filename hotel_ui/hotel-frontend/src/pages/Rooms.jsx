import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import RoomCard from '../components/rooms/RoomCard';

const API_BASE = 'http://localhost:8080';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/rooms`)
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(err => console.error("Lỗi tải phòng:", err));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 2rem' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#0F2E5A', fontSize: '36px' }}>
            Danh sách phòng nghỉ
          </h1>
          <p style={{ color: '#64748B' }}>Khám phá không gian nghỉ dưỡng phù hợp với nhu cầu của bạn</p>
        </header>

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
    </div>
  );
};

export default Rooms;