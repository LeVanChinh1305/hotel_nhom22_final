import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import RoomCard from '../components/rooms/RoomCard';
import { Mail, Phone, MapPin, Gift, Newspaper, ChevronRight, Shield, Coffee, Wifi, Car } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [roomsRes, vouchersRes] = await Promise.all([
          fetch(`${API_BASE}/api/rooms`, { headers }),
          fetch(`${API_BASE}/api/vouchers`, { headers })
        ]);

        if (!roomsRes.ok) throw new Error(`Lỗi tải phòng: ${roomsRes.status}`);
        
        const roomsData = await roomsRes.json();
        setRooms(roomsData);

        if (vouchersRes.ok) {
          const vouchersData = await vouchersRes.json();
          setVouchers(vouchersData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const amenities = [
    { icon: Wifi, label: 'Wi-Fi miễn phí', desc: 'Tốc độ cao toàn khu' },
    { icon: Coffee, label: 'Bữa sáng', desc: 'Buffet từ 6h–10h' },
    { icon: Car, label: 'Đưa đón sân bay', desc: 'Đặt lịch trước 24h' },
    { icon: Shield, label: 'An ninh 24/7', desc: 'Camera & bảo vệ' },
  ];

  const voucherVisuals = [
    { bg: '#EFF6FF', border: '#BFDBFE', iconBg: '#DBEAFE', iconColor: '#2563EB', titleColor: '#1E40AF' },
    { bg: '#F0FDF4', border: '#BBF7D0', iconBg: '#DCFCE7', iconColor: '#16A34A', titleColor: '#14532D' },
    { bg: '#FDF4FF', border: '#E9D5FF', iconBg: '#F3E8FF', iconColor: '#9333EA', titleColor: '#581C87' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* HERO */}
      <header style={{
        position: 'relative', minHeight: '580px', display: 'flex', alignItems: 'center',
        overflow: 'hidden', background: 'linear-gradient(135deg, #0F2E5A 0%, #1E40AF 40%, #3B82F6 100%)',
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '420px', height: '420px', borderRadius: '50%', background: 'rgba(147,197,253,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-120px', left: '30%', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(96,165,250,0.1)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 2rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 14px', marginBottom: '28px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#93C5FD', display: 'inline-block' }} />
            <span style={{ color: '#BFDBFE', fontSize: '13px', fontWeight: '500' }}>Khách sạn 5 sao — Đà Nẵng</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: '700', color: '#fff', lineHeight: 1.15, marginBottom: '24px', maxWidth: '680px', letterSpacing: '-0.5px' }}>
            Trải nghiệm nghỉ dưỡng{' '}<span style={{ color: '#93C5FD' }}>đẳng cấp</span>{' '}giữa lòng thành phố
          </h1>
          <p style={{ color: '#BFDBFE', fontSize: '17px', lineHeight: 1.7, maxWidth: '520px', marginBottom: '40px' }}>
            Không gian tinh tế, dịch vụ tận tâm và view triệu đô đang chào đón bạn. Khám phá sự khác biệt của Hotel 22.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a href="/rooms" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#1D4ED8', padding: '14px 28px', borderRadius: '12px', fontWeight: '600', fontSize: '15px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(59,130,246,0.25)' }}>
              Khám phá phòng <ChevronRight size={18} />
            </a>
            <a href="#support" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '14px 28px', borderRadius: '12px', fontWeight: '500', fontSize: '15px', textDecoration: 'none' }}>
              Liên hệ ngay
            </a>
          </div>
        </div>
      </header>

      {/* AMENITIES BAR */}
      <section style={{ background: '#fff', borderBottom: '1px solid #DBEAFE', padding: '0 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {amenities.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '22px 20px', borderRight: i < amenities.length - 1 ? '1px solid #EFF6FF' : 'none' }}>
              <div style={{ width: '42px', height: '42px', background: '#EFF6FF', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.icon size={20} color="#3B82F6" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0F2E5A' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VOUCHER BANNER */}
      <section id="vouchers" style={{ padding: '60px 2rem 40px', background: '#F8FBFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Ưu đãi đặc biệt</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '700', color: '#0F2E5A', margin: 0 }}>Khuyến mãi hấp dẫn</h2>
          </div>
          <a href="/promotions" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563EB', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
            Xem tất cả <ChevronRight size={16} />
          </a>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
          {vouchers.length > 0 ? vouchers.map((v, i) => {
            const style = voucherVisuals[i % voucherVisuals.length];
            return (
              <div key={v.id || i} style={{ flexShrink: 0, minWidth: '280px', background: style.bg, border: `1px solid ${style.border}`, borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '46px', height: '46px', background: style.iconBg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Gift size={22} color={style.iconColor} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: style.titleColor, marginBottom: '3px' }}>
                  {v.discountPercent ? `Giảm ${v.discountPercent}%` : 'Giảm giá'} - {v.code || 'N/A'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {v.minOrderValue ? `Đơn từ ${v.minOrderValue.toLocaleString()}đ` : 'Mọi đơn hàng'} · Hạn {v.expiryDate || 'N/A'}
                </div>
              </div>
            </div>);
          }) : !loading && (
            <p style={{ color: '#94A3B8', fontSize: '14px', fontStyle: 'italic' }}>Hiện không có khuyến mãi nào khả dụng.</p>
          )}
        </div>
      </section>

      {/* ROOM LIST */}
      <section style={{ padding: '20px 2rem 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
          <div>
            <p style={{ fontSize: '13px', color: '#60A5FA', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Lựa chọn của bạn</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: '700', color: '#0F2E5A' }}>Phòng nghỉ của chúng tôi</h2>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB', fontWeight: '600', fontSize: '14px', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '10px 18px', borderRadius: '9px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Xem tất cả <ChevronRight size={16} />
          </button>
        </div>

        {/* Skeleton Loading */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: '#fff', borderRadius: '18px', border: '1px solid #DBEAFE', overflow: 'hidden' }}>
                <div style={{ height: '200px', background: 'linear-gradient(90deg, #EFF6FF 0%, #DBEAFE 50%, #EFF6FF 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ height: '20px', background: '#EFF6FF', borderRadius: '6px', width: '55%' }} />
                  <div style={{ height: '13px', background: '#EFF6FF', borderRadius: '6px' }} />
                  <div style={{ height: '13px', background: '#EFF6FF', borderRadius: '6px', width: '75%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: '64px', height: '64px', background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>⚠️</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#0F2E5A', fontSize: '20px', marginBottom: '8px' }}>Không thể tải dữ liệu</h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '20px' }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ background: '#3B82F6', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '9px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>
              Thử lại
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && rooms.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏨</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#0F2E5A', fontSize: '20px', marginBottom: '8px' }}>Chưa có phòng nào</h3>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Vui lòng quay lại sau.</p>
          </div>
        )}

        {/* Room Grid */}
        {!loading && !error && rooms.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {rooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer id="support" style={{ background: '#0F2E5A', color: '#94A3B8', padding: '64px 2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '48px', paddingBottom: '48px' }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>Hotel 22</div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#64748B' }}>Nghỉ dưỡng sang trọng giữa lòng Đà Nẵng. Nơi mỗi khoảnh khắc đều trở nên đáng nhớ.</p>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#E2E8F0', fontSize: '18px', marginBottom: '20px' }}>Liên hệ</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[{ Icon: Phone, text: '090 000 0000' }, { Icon: Mail, text: 'support@hotel22.com' }, { Icon: MapPin, text: '123 Đường Ven Biển, Đà Nẵng' }].map(({ Icon, text }) => (
                <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} color="#60A5FA" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#E2E8F0', fontSize: '18px', marginBottom: '20px' }}>Chính sách</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Chính sách hủy phòng', 'Điều khoản sử dụng', 'Bảo mật thông tin'].map(item => (
                <li key={item}>
                  <a href="#" style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = '#93C5FD'}
                    onMouseLeave={e => e.target.style.color = '#64748B'}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#E2E8F0', fontSize: '18px', marginBottom: '12px' }}>Đăng ký nhận tin</h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: 1.6 }}>Nhận ưu đãi sớm nhất thẳng vào hộp thư của bạn.</p>
            <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.3)' }}>
              <input type="email" placeholder="Email của bạn" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: 'none', padding: '11px 14px', color: '#E2E8F0', fontSize: '14px', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} />
              <button style={{ background: '#3B82F6', color: '#fff', border: 'none', padding: '11px 18px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}
                onMouseEnter={e => e.target.style.background = '#2563EB'}
                onMouseLeave={e => e.target.style.background = '#3B82F6'}
              >Gửi</button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '24px 0', textAlign: 'center', fontSize: '13px', color: '#334155', maxWidth: '1200px', margin: '0 auto' }}>
          © 2026 Hotel 22. All rights reserved.
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Home;