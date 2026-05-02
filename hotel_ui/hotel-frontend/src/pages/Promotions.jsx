import React from 'react';
import Navbar from '../components/layout/Navbar';
import { Gift, Newspaper, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';

const Promotions = () => {
  const promoList = [
    { icon: Gift, title: 'Giảm 20% Hè rực rỡ', sub: 'Mã: SUM22 · Áp dụng cho phòng Deluxe và Suite. Hạn đến 30/06/2026', bg: '#EFF6FF', border: '#BFDBFE', iconBg: '#DBEAFE', iconColor: '#2563EB', titleColor: '#1E40AF' },
    { icon: Newspaper, title: 'Hồ bơi vô cực mở cửa', sub: 'Thưởng thức Cocktail miễn phí từ 17h–19h hàng ngày cho khách lưu trú.', bg: '#F0FDF4', border: '#BBF7D0', iconBg: '#DCFCE7', iconColor: '#16A34A', titleColor: '#14532D' },
    { icon: Gift, title: 'Voucher 500k khách mới', sub: 'Đăng ký tài khoản và đặt phòng lần đầu để nhận ngay ưu đãi từ 2 triệu đồng.', bg: '#FDF4FF', border: '#E9D5FF', iconBg: '#F3E8FF', iconColor: '#9333EA', titleColor: '#581C87' },
    { icon: Gift, title: 'Ưu đãi đặt sớm 30 ngày', sub: 'Giảm trực tiếp 15% tổng hóa đơn khi đặt phòng trước ngày nhận ít nhất 1 tháng.', bg: '#FFF7ED', border: '#FFEDD5', iconBg: '#FFEDD5', iconColor: '#EA580C', titleColor: '#7C2D12' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* Tiêu đề đơn giản có gạch dưới */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 2rem 0' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: '700', color: '#0F2E5A', borderBottom: '3px solid #3B82F6', display: 'inline-block', paddingBottom: '8px' }}>
          Khuyến mãi
        </h2>
      </div>

      {/* Main Content */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 2rem 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {promoList.map((v, i) => (
            <div key={i} style={{ 
              background: v.bg, 
              border: `1px solid ${v.border}`, 
              borderRadius: '20px', 
              padding: '30px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px', 
              transition: 'all 0.3s ease' 
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '56px', height: '56px', background: v.iconBg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <v.icon size={28} color={v.iconColor} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: v.titleColor, marginBottom: '10px' }}>{v.title}</h3>
                <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6 }}>{v.sub}</p>
              </div>
              <button style={{ 
                marginTop: 'auto', 
                background: '#fff', 
                border: `1px solid ${v.border}`, 
                color: v.iconColor, 
                padding: '10px 20px', 
                borderRadius: '10px', 
                fontWeight: '600', 
                fontSize: '14px', 
                cursor: 'pointer',
                alignSelf: 'flex-start'
              }}>
                Chi tiết ưu đãi
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER (Copy from Home.jsx) */}
      <footer style={{ background: '#0F2E5A', color: '#94A3B8', padding: '64px 2rem 0', marginTop: '40px' }}>
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
                  <a href="#" style={{ color: '#64748B', fontSize: '14px', textDecoration: 'none' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#E2E8F0', fontSize: '18px', marginBottom: '12px' }}>Đăng ký nhận tin</h3>
            <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.3)', marginTop: '16px' }}>
              <input type="email" placeholder="Email của bạn" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: 'none', padding: '11px 14px', color: '#E2E8F0', fontSize: '14px', outline: 'none' }} />
              <button style={{ background: '#3B82F6', color: '#fff', border: 'none', padding: '11px 18px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Gửi</button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '24px 0', textAlign: 'center', fontSize: '13px', color: '#334155', maxWidth: '1200px', margin: '0 auto' }}>
          © 2026 Hotel 22. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Promotions;