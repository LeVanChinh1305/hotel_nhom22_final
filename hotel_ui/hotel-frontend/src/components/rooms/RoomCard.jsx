import React, { useState } from 'react';
import { Users, Star, ArrowRight } from 'lucide-react';

const RoomCard = ({ room }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: '18px',
        overflow: 'hidden',
        border: '1px solid #DBEAFE',
        boxShadow: hovered
          ? '0 12px 40px rgba(59,130,246,0.15), 0 4px 12px rgba(59,130,246,0.1)'
          : '0 2px 8px rgba(59,130,246,0.07)',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
        <img
          src={room.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"}
          alt={room.roomType}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15,46,90,0.25) 0%, transparent 50%)',
        }} />
        {/* Badge */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          color: '#1D4ED8',
          fontSize: '12px',
          fontWeight: '600',
          padding: '4px 10px',
          borderRadius: '20px',
          border: '1px solid #BFDBFE',
          letterSpacing: '0.02em',
        }}>Phòng mới</div>
        {/* Rating */}
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          color: '#0F2E5A',
          fontSize: '12px',
          fontWeight: '600',
          padding: '4px 10px',
          borderRadius: '20px',
          border: '1px solid #DBEAFE',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <Star size={11} fill="#F59E0B" color="#F59E0B" />
          4.8
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 22px 22px' }}>
        <div style={{ marginBottom: '8px' }}>
          <h3 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '19px',
            fontWeight: '700',
            color: '#0F2E5A',
            marginBottom: '2px',
          }}>{room.roomType}</h3>
          <span style={{
            fontSize: '12px',
            color: '#93C5FD',
            fontWeight: '600',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>Phòng số {room.roomNumber}</span>
        </div>

        <p style={{
          fontSize: '14px',
          color: '#64748B',
          lineHeight: '1.65',
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{room.description}</p>

        {/* Capacity */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: '#60A5FA',
          fontWeight: '500',
          marginBottom: '18px',
          padding: '8px 12px',
          background: '#EFF6FF',
          borderRadius: '8px',
          width: 'fit-content',
        }}>
          <Users size={14} />
          Tối đa {room.capacity} khách
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid #EFF6FF',
        }}>
          <div>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1D4ED8',
              lineHeight: 1,
              fontFamily: "'DM Sans', sans-serif",
            }}>{room.price.toLocaleString('vi-VN')} ₫</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>mỗi đêm</div>
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: hovered ? '#1D4ED8' : '#3B82F6',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Chi tiết
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;