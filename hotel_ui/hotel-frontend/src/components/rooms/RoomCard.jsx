import React, { useState } from 'react';
import { Users, Star, ArrowRight, ImageOff } from 'lucide-react';

// Lấy ảnh đầu tiên từ mảng images, fallback về nền xám nếu không có
const getFirstImage = (images) => {
  if (Array.isArray(images) && images.length > 0 && images[0]) return images[0];
  return null;
};

const RoomCard = ({ room }) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const firstImage = getFirstImage(room.images);
  const hasImage = firstImage && !imgError;

  // Hiển thị tên loại phòng + số phòng
  const title = room.type || 'Phòng';
  const roomNum = room.roomNumber || '';

  // Giá: basePrice (từ API)
  const price = room.basePrice;

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
      {/* Ảnh hoặc nền xám placeholder */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
        {hasImage ? (
          <img
            src={firstImage}
            alt={title}
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          // Nền xám mặc định khi không có ảnh
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '10px',
          }}>
            <ImageOff size={36} color="#64748B" strokeWidth={1.5} />
            <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '500' }}>Chưa có ảnh</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,46,90,0.2) 0%, transparent 55%)' }} />

        {/* Badge loại phòng */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
          color: '#1D4ED8', fontSize: '12px', fontWeight: '600',
          padding: '4px 10px', borderRadius: '20px', border: '1px solid #BFDBFE',
          letterSpacing: '0.02em',
        }}>{title}</div>

        {/* Rating */}
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
          color: '#0F2E5A', fontSize: '12px', fontWeight: '600',
          padding: '4px 10px', borderRadius: '20px', border: '1px solid #DBEAFE',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <Star size={11} fill="#F59E0B" color="#F59E0B" />
          4.8
        </div>
      </div>

      {/* Nội dung card */}
      <div style={{ padding: '20px 22px 22px' }}>
        <div style={{ marginBottom: '8px' }}>
          <h3 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '19px', fontWeight: '700', color: '#0F2E5A', marginBottom: '2px',
          }}>{title}</h3>
          {roomNum && (
            <span style={{ fontSize: '12px', color: '#93C5FD', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Phòng số {roomNum}
            </span>
          )}
        </div>

        {/* Mô tả */}
        {room.description && (
          <p style={{
            fontSize: '14px', color: '#64748B', lineHeight: '1.65', marginBottom: '12px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{room.description}</p>
        )}

        {/* Địa chỉ */}
        {room.address && (
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '12px' }}>📍 {room.address}</p>
        )}

        {/* Tiện nghi */}
        {Array.isArray(room.amenities) && room.amenities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {room.amenities.slice(0, 4).map((a, i) => (
              <span key={i} style={{
                fontSize: '11px', color: '#2563EB', background: '#EFF6FF',
                border: '1px solid #BFDBFE', padding: '3px 8px', borderRadius: '20px', fontWeight: '500',
              }}>{a}</span>
            ))}
            {room.amenities.length > 4 && (
              <span style={{ fontSize: '11px', color: '#94A3B8', padding: '3px 8px' }}>+{room.amenities.length - 4}</span>
            )}
          </div>
        )}

        {/* Sức chứa */}
        {room.maxOccupancy && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: '#60A5FA', fontWeight: '500',
            padding: '6px 12px', background: '#EFF6FF', borderRadius: '8px',
            marginBottom: '18px',
          }}>
            <Users size={14} />
            Tối đa {room.maxOccupancy} khách
          </div>
        )}

        {/* Giá & Nút */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #EFF6FF' }}>
          <div>
            {price != null ? (
              <>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#1D4ED8', lineHeight: 1, fontFamily: "'DM Sans', sans-serif" }}>
                  {price.toLocaleString('vi-VN')} ₫
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>mỗi đêm</div>
              </>
            ) : (
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>Liên hệ báo giá</div>
            )}
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: hovered ? '#1D4ED8' : '#3B82F6',
            color: '#fff', border: 'none', padding: '10px 18px',
            borderRadius: '10px', fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
          }}>
            Chi tiết <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;