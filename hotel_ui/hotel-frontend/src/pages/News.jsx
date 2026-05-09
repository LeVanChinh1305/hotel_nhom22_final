import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ChevronRight } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const News = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/news`);
        if (!res.ok) throw new Error(`Lỗi tải tin tức: ${res.status}`);
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      
      <header style={{ 
        padding: '80px 2rem 60px', 
        background: 'linear-gradient(135deg, #0F2E5A 0%, #1E40AF 100%)', 
        textAlign: 'center', 
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '700', marginBottom: '16px' }}>Tin tức & Sự kiện</h1>
          <p style={{ color: '#BFDBFE', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Cập nhật những thông tin mới nhất và các hoạt động sôi nổi tại Hotel 22</p>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 2rem' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#64748B' }}>Đang tải tin tức...</p>
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '40px', background: '#FEF2F2', borderRadius: '12px', border: '1px solid #FCA5A5' }}>
            <p style={{ color: '#EF4444' }}>{error}</p>
          </div>
        )}
        
        {!loading && !error && news.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#64748B' }}>Hiện chưa có tin tức nào được đăng tải.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          {news.map(n => (
            <div key={n.id} style={{ 
              background: '#fff', 
              borderRadius: '20px', 
              border: '1px solid #E2E8F0', 
              overflow: 'hidden', 
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                <img src={n.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: '#2563EB' }}>
                  Hotel 22
                </div>
              </div>
              <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '13px', marginBottom: '12px' }}>
                  <span>Tin tức</span>
                  <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#CBD5E1' }} />
                  <span>{new Date(n.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F2E5A', marginBottom: '16px', lineHeight: 1.4, height: '56px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {n.title}
                </h3>
                <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    onClick={() => navigate(`/news/${n.id}`)}
                    style={{ color: '#2563EB', background: 'none', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
                  >
                    Đọc tiếp <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default News;
