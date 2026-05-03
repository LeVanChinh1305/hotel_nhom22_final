import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { Gift, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const Promotions = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        // Loại bỏ Authorization để tránh lỗi 401 khi xem khuyến mãi công khai
        const res = await fetch(`${API_BASE}/api/vouchers`);
        if (!res.ok) throw new Error('Không thể tải danh sách khuyến mãi');
        
        const data = await res.json();
        setVouchers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const voucherVisuals = [
    { bg: '#EFF6FF', border: '#BFDBFE', iconBg: '#DBEAFE', iconColor: '#2563EB', titleColor: '#1E40AF' },
    { bg: '#F0FDF4', border: '#BBF7D0', iconBg: '#DCFCE7', iconColor: '#16A34A', titleColor: '#14532D' },
    { bg: '#FDF4FF', border: '#E9D5FF', iconBg: '#F3E8FF', iconColor: '#9333EA', titleColor: '#581C87' },
    { bg: '#FFF7ED', border: '#FFEDD5', iconBg: '#FFEDD5', iconColor: '#EA580C', titleColor: '#7C2D12' },
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
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ color: '#64748B' }}>Đang tải danh sách ưu đãi...</div>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '40px', background: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA' }}>
            <AlertCircle size={40} color="#EF4444" style={{ marginBottom: '12px' }} />
            <p style={{ color: '#B91C1C', fontWeight: '500' }}>{error}</p>
          </div>
        )}

        {!loading && !error && vouchers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
            <Gift size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>Hiện tại không có chương trình khuyến mãi nào.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {!loading && vouchers.map((v, i) => {
            const style = voucherVisuals[i % voucherVisuals.length];
            return (
              <div key={v.id || i} style={{ 
              background: style.bg, 
              border: `1px solid ${style.border}`, 
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
              <div style={{ width: '56px', height: '56px', background: style.iconBg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gift size={28} color={style.iconColor} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: style.titleColor, marginBottom: '10px' }}>
                  Giảm {v.discountPercent}% - Mã: {v.code}
                </h3>
                <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6 }}>
                  • Giảm tối đa: {v.maxDiscountAmount?.toLocaleString()}đ<br/>
                  • Đơn tối thiểu: {v.minOrderValue?.toLocaleString()}đ<br/>
                  • Hạn sử dụng: {v.expiryDate || 'N/A'}
                </p>
              </div>
              <button style={{ 
                marginTop: 'auto', 
                background: '#fff', 
                border: `1px solid ${style.border}`, 
                color: style.iconColor, 
                padding: '10px 20px', 
                borderRadius: '10px', 
                fontWeight: '600', 
                fontSize: '14px', 
                cursor: 'pointer',
                alignSelf: 'flex-start',
                background: '#fff'
              }}
              onClick={() => {
                navigator.clipboard.writeText(v.code);
                alert(`Đã sao chép mã: ${v.code}`);
              }}
              >
                Copy mã: {v.code}
              </button>
            </div>);
          })}
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