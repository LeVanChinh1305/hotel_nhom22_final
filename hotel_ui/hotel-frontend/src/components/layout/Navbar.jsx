import React, { useState, useEffect } from 'react';
import { Menu, User, LogIn, UserPlus, Heart, BookOpen, X } from 'lucide-react';

const Navbar = ({ isLoggedIn = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #DBEAFE',
      boxShadow: scrolled ? '0 2px 16px rgba(59,130,246,0.09)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '68px',
    }}>
      {/* Logo */}
      <a href="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '700',
          color: '#fff',
          letterSpacing: '-0.5px',
          fontFamily: "'DM Sans', sans-serif",
        }}>H22</div>
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '22px',
          fontWeight: '700',
          color: '#0F2E5A',
          letterSpacing: '-0.3px',
        }}>Hotel 22</span>
      </a>

      {/* Desktop Nav */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
      }} className="nav-desktop">
        {[
          { label: 'Trang chủ', href: '/' },
          { label: 'Phòng nghỉ', href: '/rooms' },
          { label: 'Khuyến mãi', href: '#vouchers' },
          { label: 'Hỗ trợ', href: '#support' },
        ].map(item => (
          <a key={item.label} href={item.href} style={{
            color: '#475569',
            fontSize: '15px',
            fontWeight: '500',
            padding: '6px 2px',
            borderBottom: '2px solid transparent',
            transition: 'all 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={e => {
            e.target.style.color = '#2563EB';
            e.target.style.borderBottomColor = '#93C5FD';
          }}
          onMouseLeave={e => {
            e.target.style.color = '#475569';
            e.target.style.borderBottomColor = 'transparent';
          }}
          >{item.label}</a>
        ))}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!isLoggedIn && (
          <a href="/login" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#2563EB',
            fontSize: '14px',
            fontWeight: '500',
            padding: '8px 16px',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            background: '#EFF6FF',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          className="nav-login-btn"
          >
            <LogIn size={15} />
            Đăng nhập
          </a>
        )}

        {/* Hamburger */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              border: '1px solid #DBEAFE',
              background: isMenuOpen ? '#EFF6FF' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: '#1D4ED8',
            }}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {isMenuOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 10px)',
              width: '220px',
              background: '#fff',
              border: '1px solid #DBEAFE',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(59,130,246,0.14)',
              padding: '8px',
              overflow: 'hidden',
            }}>
              {!isLoggedIn ? (
                <>
                  <a href="/login" style={menuItemStyle}>
                    <div style={{ ...iconWrap, background: '#EFF6FF' }}><LogIn size={15} color="#3B82F6" /></div>
                    Đăng nhập
                  </a>
                  <a href="/register" style={menuItemStyle}>
                    <div style={{ ...iconWrap, background: '#F0FDF4' }}><UserPlus size={15} color="#22C55E" /></div>
                    Đăng ký
                  </a>
                </>
              ) : (
                <>
                  <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid #DBEAFE', marginBottom: '4px' }}>
                    <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>Xin chào,</p>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#0F2E5A', margin: 0 }}>Người dùng</p>
                  </div>
                  <a href="/profile" style={menuItemStyle}>
                    <div style={{ ...iconWrap, background: '#EFF6FF' }}><User size={15} color="#3B82F6" /></div>
                    Tài khoản
                  </a>
                  <a href="/bookings" style={menuItemStyle}>
                    <div style={{ ...iconWrap, background: '#F5F3FF' }}><BookOpen size={15} color="#8B5CF6" /></div>
                    Đơn đặt phòng
                  </a>
                  <a href="/wishlist" style={menuItemStyle}>
                    <div style={{ ...iconWrap, background: '#FFF1F2' }}><Heart size={15} color="#F43F5E" /></div>
                    Yêu thích
                  </a>
                  <button style={{
                    ...menuItemStyle,
                    width: '100%',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    borderTop: '1px solid #DBEAFE',
                    marginTop: '4px',
                    paddingTop: '10px',
                    color: '#EF4444',
                    justifyContent: 'center',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                  }}>
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '9px 10px',
  borderRadius: '8px',
  color: '#334155',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  transition: 'background 0.15s',
  cursor: 'pointer',
};

const iconWrap = {
  width: '28px',
  height: '28px',
  borderRadius: '7px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export default Navbar;