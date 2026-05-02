import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { ConciergeBell, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Thêm state để lưu lỗi

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/services`);
        if (!response.ok) {
          throw new Error(`Lỗi tải dịch vụ: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) { // Kiểm tra nếu data không phải là mảng
          throw new Error("Dữ liệu dịch vụ trả về không hợp lệ.");
        }
        setServices(data);
      } catch (err) {
        setError(err.message); // Lưu lỗi vào state
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#0F2E5A' }}>Dịch vụ của chúng tôi</h1>
          <p style={{ color: '#64748B' }}>Nâng tầm trải nghiệm kỳ nghỉ của bạn</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải dịch vụ...</div>
        ) : error ? ( // Hiển thị lỗi nếu có
          <div style={{ textAlign: 'center', padding: '40px', background: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA' }}>
            <AlertCircle size={40} color="#EF4444" style={{ marginBottom: '12px' }} />
            <p style={{ color: '#B91C1C', fontWeight: '500' }}>{error}</p>
            <p style={{ color: '#B91C1C', fontWeight: '500' }}>Vui lòng kiểm tra console log của backend để biết chi tiết.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {services.map(svc => (
              <div key={svc.id} style={{
                background: '#fff',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  width: '48px', height: '48px', background: '#EFF6FF', 
                  borderRadius: '12px', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', marginBottom: '16px' 
                }}>
                  <ConciergeBell size={24} color="#3B82F6" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
                  {svc.serviceName}
                </h3>
                <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '16px' }}>{svc.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', color: '#2563EB' }}>
                    {svc.price?.toLocaleString()} VNĐ
                  </span>
                  {svc.isAvailable && (
                    <span style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={14} /> Sẵn sàng
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;