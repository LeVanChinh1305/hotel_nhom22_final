import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Maximize, ArrowRight } from 'lucide-react';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#fff',
      borderRadius: '18px',
      border: '1px solid #DBEAFE',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    }}>
      {/* Ảnh minh họa */}
      <div style={{ height: '200px', background: '#E2E8F0', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          padding: '4px 12px', background: 'rgba(255,255,255,0.9)',
          borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: '#1E40AF'
        }}>
          {room.type}
        </div>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
          Ảnh phòng {room.roomNumber}
        </div>
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0F2E5A' }}>Phòng {room.roomNumber}</h3>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#2563EB' }}>{room.basePrice?.toLocaleString()}đ</span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>/đêm</span>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {room.description || 'Không có mô tả cho phòng này.'}
        </p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '13px' }}>
            <Users size={14} /> {room.maxOccupancy} người
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '13px' }}>
            <Maximize size={14} /> 30m²
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: 'auto' }}>
          <button
            onClick={() => navigate(`/rooms/${room.id}`)}
            style={{
              padding: '10px', borderRadius: '10px', border: '1px solid #DBEAFE',
              background: '#F8FBFF', color: '#2563EB', fontWeight: '600',
              fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.target.style.background = '#EFF6FF'}
            onMouseLeave={e => e.target.style.background = '#F8FBFF'}
          >
            Chi tiết <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate(`/rooms/${room.id}`)}
            style={{
              padding: '10px', borderRadius: '10px', border: 'none',
              background: '#3B82F6', color: '#fff', fontWeight: '600',
              fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.target.style.background = '#2563EB'}
            onMouseLeave={e => e.target.style.background = '#3B82F6'}
          >
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;