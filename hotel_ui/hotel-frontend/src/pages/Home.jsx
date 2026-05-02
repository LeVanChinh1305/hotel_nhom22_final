import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import RoomCard from '../components/rooms/RoomCard';
import { Mail, Phone, MapPin, Gift, Newspaper, ChevronRight, Shield, Coffee, Wifi, Car } from 'lucide-react';

const Home = () => {
  const rooms = [
    {
      id: 1,
      roomNumber: "101",
      roomType: "Deluxe Ocean",
      price: 1200000,
      capacity: 2,
      description: "Phòng hạng sang hướng biển với ban công rộng, tầm nhìn toàn cảnh đại dương tuyệt đẹp.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      roomNumber: "202",
      roomType: "Standard Queen",
      price: 800000,
      capacity: 2,
      description: "Phòng tiêu chuẩn ấm cúng, đầy đủ tiện nghi hiện đại dành cho cặp đôi.",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      roomNumber: "305",
      roomType: "Family Suite",
      price: 2500000,
      capacity: 4,
      description: "Suite rộng rãi cho gia đình, có phòng khách riêng biệt và khu vui chơi trẻ em.",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const amenities = [
    { icon: Wifi, label: 'Wi-Fi miễn phí', desc: 'Tốc độ cao toàn khu' },
    { icon: Coffee, label: 'Bữa sáng', desc: 'Buffet từ 6h–10h' },
    { icon: Car, label: 'Đưa đón sân bay', desc: 'Đặt lịch trước 24h' },
    { icon: Shield, label: 'An ninh 24/7', desc: 'Camera & bảo vệ' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* HERO */}
      <header style={{
        position: 'relative',
        minHeight: '580px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0F2E5A 0%, #1E40AF 40%, #3B82F6 100%)',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-80px', right: '-80px',
          width: '420px', height: '420px',
          borderRadius: '50%',
          background: 'rgba(147,197,253,0.12)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-120px', left: '30%',
          width: '320px', height: '320px',
          borderRadius: '50%',
          background: 'rgba(96,165,250,0.1)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 2rem',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '6px 14px',
            marginBottom: '28px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#93C5FD', display: 'inline-block' }} />
            <span style={{ color: '#BFDBFE', fontSize: '13px', fontWeight: '500' }}>Khách sạn 5 sao — Hotel 22 - Hà Nội</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(36px, 6vw, 68px)',
            fontWeight: '700',
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '24px',
            maxWidth: '680px',
            letterSpacing: '-0.5px',
          }}>
            Trải nghiệm nghỉ dưỡng{' '}
            <span style={{ color: '#93C5FD' }}>đẳng cấp</span>{' '}
            giữa lòng thành phố
          </h1>
          <p style={{
            color: '#BFDBFE',
            fontSize: '17px',
            lineHeight: 1.7,
            maxWidth: '520px',
            marginBottom: '40px',
          }}>
            Không gian tinh tế, dịch vụ tận tâm và view triệu đô đang chào đón bạn. Khám phá sự khác biệt của Hotel 22.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a href="/rooms" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#fff',
              color: '#1D4ED8',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '15px',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(59,130,246,0.25)',
              transition: 'all 0.2s',
            }}>
              Khám phá phòng
              <ChevronRight size={18} />
            </a>
            <a href="#support" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: '500',
              fontSize: '15px',
              textDecoration: 'none',
            }}>
              Liên hệ ngay
            </a>
          </div>
        </div>
      </header>

      {/* AMENITIES BAR */}
      <section style={{
        background: '#fff',
        borderBottom: '1px solid #DBEAFE',
        padding: '0 2rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0',
        }}>
          {amenities.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '22px 20px',
              borderRight: i < amenities.length - 1 ? '1px solid #EFF6FF' : 'none',
            }}>
              <div style={{
                width: '42px', height: '42px',
                background: '#EFF6FF',
                borderRadius: '11px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
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
      <section id="vouchers" style={{
        padding: '40px 2rem',
        background: '#F8FBFF',
        overflowX: 'auto',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '16px',
        }}>
          {[
            {
              icon: Gift,
              title: 'Giảm 20% Hè rực rỡ',
              sub: 'Mã: SUM22 · Hạn 30/06',
              bg: '#EFF6FF', border: '#BFDBFE',
              iconBg: '#DBEAFE', iconColor: '#2563EB',
              titleColor: '#1E40AF',
            },
            {
              icon: Newspaper,
              title: 'Hồ bơi vô cực mở cửa',
              sub: 'Cocktail miễn phí 17h–19h',
              bg: '#F0FDF4', border: '#BBF7D0',
              iconBg: '#DCFCE7', iconColor: '#16A34A',
              titleColor: '#14532D',
            },
            {
              icon: Gift,
              title: 'Voucher 500k khách mới',
              sub: 'Áp dụng đơn từ 2 triệu đồng',
              bg: '#FDF4FF', border: '#E9D5FF',
              iconBg: '#F3E8FF', iconColor: '#9333EA',
              titleColor: '#581C87',
            },
          ].map((v, i) => (
            <div key={i} style={{
              flexShrink: 0,
              minWidth: '280px',
              background: v.bg,
              border: `1px solid ${v.border}`,
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.07)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: '46px', height: '46px',
                background: v.iconBg,
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <v.icon size={22} color={v.iconColor} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: v.titleColor, marginBottom: '3px' }}>{v.title}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{v.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROOM LIST */}
      <section style={{
        padding: '20px 2rem 80px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '36px',
        }}>
          <div>
            <p style={{ fontSize: '13px', color: '#60A5FA', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Lựa chọn của bạn
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(26px, 4vw, 36px)',
              fontWeight: '700',
              color: '#0F2E5A',
            }}>Phòng nghỉ của chúng tôi</h2>
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#2563EB',
            fontWeight: '600',
            fontSize: '14px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            padding: '10px 18px',
            borderRadius: '9px',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Xem tất cả <ChevronRight size={16} />
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="support" style={{
        background: '#0F2E5A',
        color: '#94A3B8',
        padding: '64px 2rem 0',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '48px',
          paddingBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '12px',
            }}>Hotel 22</div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#64748B', marginBottom: '20px' }}>
              Nghỉ dưỡng sang trọng giữa lòng Đà Nẵng. Nơi mỗi khoảnh khắc đều trở nên đáng nhớ.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#E2E8F0', fontSize: '18px', marginBottom: '20px' }}>Liên hệ</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { Icon: Phone, text: '090 000 0000' },
                { Icon: Mail, text: 'support@hotel22.com' },
                { Icon: MapPin, text: '123 Đường Ven Biển, Đà Nẵng' },
              ].map(({ Icon, text }) => (
                <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} color="#60A5FA" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#E2E8F0', fontSize: '18px', marginBottom: '20px' }}>Chính sách</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Chính sách hủy phòng', 'Điều khoản sử dụng', 'Bảo mật thông tin'].map(item => (
                <li key={item}>
                  <a href="#" style={{
                    color: '#64748B',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#93C5FD'}
                  onMouseLeave={e => e.target.style.color = '#64748B'}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#E2E8F0', fontSize: '18px', marginBottom: '12px' }}>Đăng ký nhận tin</h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: 1.6 }}>
              Nhận ưu đãi sớm nhất thẳng vào hộp thư của bạn.
            </p>
            <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.3)' }}>
              <input
                type="email"
                placeholder="Email của bạn"
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  padding: '11px 14px',
                  color: '#E2E8F0',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button style={{
                background: '#3B82F6',
                color: '#fff',
                border: 'none',
                padding: '11px 18px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = '#2563EB'}
              onMouseLeave={e => e.target.style.background = '#3B82F6'}
              >Gửi</button>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '24px 0',
          textAlign: 'center',
          fontSize: '13px',
          color: '#334155',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          © 2026 Hotel 22. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;