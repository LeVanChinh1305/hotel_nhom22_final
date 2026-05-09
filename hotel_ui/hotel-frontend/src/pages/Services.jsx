import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ConciergeBell, CheckCircle, AlertCircle, Sparkles, Star, Zap, Coffee } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/services`);
        if (!response.ok) {
          throw new Error(`Lỗi tải dịch vụ: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu dịch vụ trả về không hợp lệ.");
        }
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF', fontFamily: "'Outfit', sans-serif" }}>
      <Navbar />
      
      {/* Premium Hero Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0F172A 0%, #1E40AF 100%)',
        padding: '100px 2rem 140px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%', width: '30%', height: '50%',
          background: 'rgba(59, 130, 246, 0.2)', filter: 'blur(100px)', borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%', width: '30%', height: '50%',
          background: 'rgba(30, 64, 175, 0.3)', filter: 'blur(100px)', borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
            padding: '6px 16px', borderRadius: '20px', color: '#BFDBFE',
            fontSize: '13px', fontWeight: '600', marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles size={14} /> TIỆN NGHI CAO CẤP
          </div>
          <h1 style={{ 
            fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#FFFFFF', 
            marginBottom: '20px', lineHeight: '1.2', fontWeight: '700'
          }}>
            Dịch vụ của chúng tôi
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Khám phá những đặc quyền dành riêng cho bạn, từ những món ăn tinh tế đến các hoạt động thư giãn đỉnh cao.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-60px auto 80px', padding: '0 2rem', position: 'relative', zIndex: 2 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div className="spinner" style={{ 
              width: '40px', height: '40px', border: '4px solid #F1F5F9', 
              borderTop: '4px solid #2563EB', borderRadius: '50%', margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#64748B', fontWeight: '500' }}>Đang chuẩn bị các dịch vụ tốt nhất cho bạn...</p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', padding: '60px 40px', background: '#FFF1F2', 
            borderRadius: '24px', border: '1px solid #FECACA',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              width: '64px', height: '64px', background: '#FFE4E6', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
            }}>
              <AlertCircle size={32} color="#EF4444" />
            </div>
            <h3 style={{ color: '#991B1B', fontSize: '20px', marginBottom: '8px' }}>Không thể tải thông tin</h3>
            <p style={{ color: '#B91C1C', marginBottom: '24px', fontSize: '14px' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px', background: '#EF4444', color: '#fff', 
                border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer'
              }}
            >Thử lại ngay</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {services.map(svc => (
              <div key={svc.id} className="service-card" style={{
                background: '#fff',
                padding: '40px 32px',
                borderRadius: '24px',
                border: '1px solid #F1F5F9',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: '64px', height: '64px', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', 
                  borderRadius: '20px', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', marginBottom: '28px' 
                }}>
                  <ConciergeBell size={30} color="#2563EB" />
                </div>
                
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
                  {svc.serviceName}
                </h3>
                
                <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px', minHeight: '4.8em' }}>
                  {svc.description}
                </p>
                
                <div style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: '24px', borderTop: '1px solid #F1F5F9'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Giá dịch vụ</span>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#1E40AF' }}>
                      {svc.price?.toLocaleString()} <small style={{ fontSize: '13px', fontWeight: '600' }}>VNĐ</small>
                    </span>
                  </div>
                  
                  {svc.isAvailable && (
                    <div style={{ 
                      background: '#F0FDF4', color: '#16A34A', padding: '6px 12px', 
                      borderRadius: '10px', fontSize: '12px', fontWeight: '700',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      border: '1px solid #DCFCE7'
                    }}>
                      <div style={{ width: '6px', height: '6px', background: '#16A34A', borderRadius: '50%' }} />
                      SẴN SÀNG
                    </div>
                  )}
                </div>

                <style>{`
                  .service-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
                    border-color: #DBEAFE;
                  }
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Services;