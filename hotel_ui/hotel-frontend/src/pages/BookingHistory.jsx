import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  Calendar, CreditCard, Info, ChevronRight, 
  MapPin, Clock, Package, Gift, X 
} from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('Bạn chưa đăng nhập');
        return;
      }

      const user = JSON.parse(userStr);
      const token = user.token;
      
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Lỗi ${res.status}`);
      }

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải lịch sử:', err);
      setError(err.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn đặt phòng này?')) return;

    try {
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const token = user.token;

      const res = await fetch(`${API_BASE}/api/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        alert('Đã hủy đơn đặt phòng thành công');
        setSelectedBooking(null);
        loadBookings(); // Tải lại danh sách
      } else {
        const data = await res.json();
        alert('Lỗi: ' + (data.message || 'Không thể hủy đơn'));
      }
    } catch (err) {
      alert('Lỗi kết nối: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#FFF7ED', text: '#C2410C', label: 'Chờ xác nhận' };
      case 'CONFIRMED':
        return { bg: '#EFF6FF', text: '#1D4ED8', label: 'Đã xác nhận' };
      case 'COMPLETED':
        return { bg: '#F0FDF4', text: '#15803D', label: 'Hoàn tất' };
      case 'CANCELLED':
        return { bg: '#FEF2F2', text: '#B91C1C', label: 'Đã hủy' };
      default:
        return { bg: '#F8FAFC', text: '#475569', label: status };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />

      <div style={containerStyle}>
        <div style={headerSectionStyle}>
          <h2 style={titleStyle}>Lịch sử đặt phòng</h2>
          <p style={subtitleStyle}>Quản lý và xem lại tất cả các giao dịch của bạn</p>
        </div>

        {loading && (
          <div style={statusBoxStyle}>
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div style={{ ...statusBoxStyle, background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FCA5A5' }}>
            <Info size={20} />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div style={emptyStateStyle}>
            <Calendar size={48} color="#94A3B8" />
            <p>Bạn chưa có đơn đặt phòng nào.</p>
            <button onClick={() => window.location.href = '/rooms'} style={bookNowButtonStyle}>Đặt phòng ngay</button>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div style={gridStyle}>
            {bookings.map((b) => {
              const status = getStatusColor(b.status);
              return (
                <div key={b.id} style={bookingCardStyle}>
                  <div style={cardHeaderStyle}>
                    <div>
                      <span style={orderIdStyle}>Đơn #{b.id}</span>
                      <span style={dateBadgeStyle}>{new Date(b.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <span style={{ ...statusBadgeStyle, background: status.bg, color: status.text }}>
                      {status.label}
                    </span>
                  </div>

                  <div style={cardBodyStyle}>
                    <div style={roomInfoStyle}>
                      <div style={roomIconStyle}>
                        <MapPin size={18} color="#2563EB" />
                      </div>
                      <div>
                        <div style={roomNameStyle}>Phòng {b.roomNumber || 'N/A'}</div>
                        <div style={roomTypeStyle}>{b.roomType || 'Phòng nghỉ'}</div>
                      </div>
                    </div>

                    <div style={detailsGridStyle}>
                      <div style={detailItemStyle}>
                        <Clock size={14} color="#64748B" />
                        <span>{b.checkInDate} - {b.checkOutDate}</span>
                      </div>
                      <div style={detailItemStyle}>
                        <CreditCard size={14} color="#64748B" />
                        <span style={priceTextStyle}>{b.totalPrice?.toLocaleString()} VNĐ</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedBooking(b)} 
                    style={viewDetailButtonStyle}
                  >
                    Xem chi tiết đơn <ChevronRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div style={modalOverlayStyle} onClick={() => setSelectedBooking(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3>Chi tiết đơn đặt #{selectedBooking.id}</h3>
              <button onClick={() => setSelectedBooking(null)} style={closeButtonStyle}><X size={20} /></button>
            </div>

            <div style={modalBodyStyle}>
              {/* Customer Info Section */}
              <div style={modalSectionStyle}>
                <h4 style={sectionTitleStyle}><Info size={16} /> Thông tin khách đặt</h4>
                <div style={modalInfoBoxStyle}>
                  <div style={customerInfoRowStyle}>
                    <span style={infoLabelStyle}>Họ và tên:</span>
                    <span style={infoValueStyle}>{selectedBooking.customerName || 'N/A'}</span>
                  </div>
                  <div style={customerInfoRowStyle}>
                    <span style={infoLabelStyle}>Số điện thoại:</span>
                    <span style={infoValueStyle}>{selectedBooking.customerPhone || 'N/A'}</span>
                  </div>
                  <div style={customerInfoRowStyle}>
                    <span style={infoLabelStyle}>Email:</span>
                    <span style={infoValueStyle}>{selectedBooking.customerEmail || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Room Section */}
              <div style={modalSectionStyle}>
                <h4 style={sectionTitleStyle}><MapPin size={16} /> Chi tiết lưu trú</h4>
                <div style={modalInfoBoxStyle}>
                  <div style={{ fontWeight: '700', fontSize: '18px', color: '#0F2E5A' }}>Phòng {selectedBooking.roomNumber}</div>
                  <div style={{ color: '#64748B', fontSize: '14px', marginBottom: '10px' }}>{selectedBooking.roomType}</div>
                  <div style={stayDetailStyle}>
                    <div style={detailBoxStyle}>
                      <span style={detailLabelStyle}>Ngày nhận</span>
                      <span style={detailValueStyle}>{selectedBooking.checkInDate}</span>
                    </div>
                    <div style={detailBoxStyle}>
                      <span style={detailLabelStyle}>Ngày trả</span>
                      <span style={detailValueStyle}>{selectedBooking.checkOutDate}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '15px', padding: '10px', background: '#fff', borderRadius: '12px', border: '1px dashed #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Số lượng khách:</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F2E5A' }}>{selectedBooking.occupancy || 2} người</span>
                  </div>
                </div>
              </div>

              {/* Services Section */}
              {selectedBooking.services && selectedBooking.services.length > 0 && (
                <div style={modalSectionStyle}>
                  <h4 style={sectionTitleStyle}><Package size={16} /> Dịch vụ đã đặt</h4>
                  <div style={servicesListStyle}>
                    {selectedBooking.services.map((s, idx) => {
                      const total = s.price * s.quantity * (s.numberOfPeople || 1) * (s.numberOfDays || 1);
                      return (
                        <div key={idx} style={serviceItemStyle}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#1E293B' }}>{s.serviceName}</div>
                            <div style={{ fontSize: '12px', color: '#64748B' }}>
                              {s.price.toLocaleString()}đ x {s.quantity} 
                              {s.numberOfPeople ? ` x ${s.numberOfPeople} người` : ''} 
                              {s.numberOfDays ? ` x ${s.numberOfDays} ngày` : ''}
                            </div>
                          </div>
                          <div style={{ fontWeight: '700', color: '#2563EB' }}>{total.toLocaleString()}đ</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Payment Section */}
              <div style={modalSectionStyle}>
                <h4 style={sectionTitleStyle}><CreditCard size={16} /> Chi tiết thanh toán</h4>
                <div style={pricingBoxStyle}>
                  <div style={priceRowStyle}>
                    <span>Tiền phòng</span>
                    <span>{selectedBooking.totalRoomPrice?.toLocaleString()}đ</span>
                  </div>
                  {selectedBooking.totalServicePrice > 0 && (
                    <div style={priceRowStyle}>
                      <span>Tổng tiền dịch vụ</span>
                      <span>{selectedBooking.totalServicePrice?.toLocaleString()}đ</span>
                    </div>
                  )}
                  {selectedBooking.voucherCode && (
                    <div style={{ ...priceRowStyle, color: '#059669', background: '#ECFDF5', padding: '8px 12px', borderRadius: '10px', marginTop: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Gift size={14} />
                        <span>Mã giảm giá: <strong>{selectedBooking.voucherCode}</strong></span>
                      </div>
                      <span>-{selectedBooking.discountAmount?.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div style={totalPriceRowStyle}>
                    <span>Tổng cộng</span>
                    <span>{selectedBooking.totalPrice?.toLocaleString()}đ</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <div style={{ ...statusBadgeStyle, background: selectedBooking.paymentStatus ? '#F0FDF4' : '#FFF7ED', color: selectedBooking.paymentStatus ? '#15803D' : '#C2410C', fontSize: '12px' }}>
                      {selectedBooking.paymentStatus ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </div>
                    
                    {selectedBooking.status === 'PENDING' && (
                      <button 
                        onClick={() => handleCancelBooking(selectedBooking.id)}
                        style={cancelButtonStyle}
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

// Styles
const containerStyle = { maxWidth: '1100px', margin: '40px auto', padding: '0 20px' };
const headerSectionStyle = { marginBottom: '32px' };
const titleStyle = { fontSize: '28px', fontWeight: '800', color: '#0F2E5A', margin: '0 0 8px 0' };
const subtitleStyle = { fontSize: '15px', color: '#64748B' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '24px' };
const bookingCardStyle = { background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' };

const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const orderIdStyle = { fontWeight: '700', fontSize: '16px', color: '#0F2E5A', marginRight: '10px' };
const dateBadgeStyle = { fontSize: '12px', color: '#94A3B8', fontWeight: '500' };
const statusBadgeStyle = { padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' };

const cardBodyStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
const roomInfoStyle = { display: 'flex', gap: '12px', alignItems: 'center' };
const roomIconStyle = { width: '40px', height: '40px', background: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const roomNameStyle = { fontWeight: '700', color: '#1E293B', fontSize: '16px' };
const roomTypeStyle = { fontSize: '13px', color: '#64748B' };

const detailsGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px', background: '#F8FAFC', borderRadius: '16px' };
const detailItemStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '500' };
const priceTextStyle = { color: '#2563EB', fontWeight: '700' };

const viewDetailButtonStyle = { 
  marginTop: 'auto', padding: '12px', background: 'none', border: '1px solid #E2E8F0', 
  borderRadius: '12px', color: '#475569', fontWeight: '600', fontSize: '14px', 
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s' 
};

// Modal Styles
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 46, 90, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalContentStyle = { background: '#fff', borderRadius: '28px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' };
const modalHeaderStyle = { padding: '24px 30px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 };
const modalBodyStyle = { padding: '30px' };
const closeButtonStyle = { border: 'none', background: '#F1F5F9', color: '#64748B', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const modalSectionStyle = { marginBottom: '25px' };
const sectionTitleStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: '#64748B', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const modalInfoBoxStyle = { padding: '20px', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0' };

const servicesListStyle = { display: 'flex', flexDirection: 'column', gap: '10px' };
const serviceItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#fff', border: '1px solid #F1F5F9', borderRadius: '14px' };

const pricingBoxStyle = { padding: '20px', background: '#F0F9FF', borderRadius: '20px', border: '1px solid #BAE6FD' };
const priceRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#0369A1' };
const totalPriceRowStyle = { display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #BAE6FD', fontWeight: '800', fontSize: '20px', color: '#0284C7' };
const customerInfoRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' };
const infoLabelStyle = { color: '#64748B', fontWeight: '500' };
const infoValueStyle = { color: '#0F2E5A', fontWeight: '600' };
const stayDetailStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' };
const detailBoxStyle = { background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #F1F5F9' };
const detailLabelStyle = { display: 'block', fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' };
const detailValueStyle = { display: 'block', fontSize: '14px', fontWeight: '700', color: '#1E293B' };
const cancelButtonStyle = { 
  padding: '8px 16px', background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', 
  borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: '0.2s' 
};

const statusBoxStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px', background: '#fff', borderRadius: '24px', color: '#64748B' };
const emptyStateStyle = { textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' };
const bookNowButtonStyle = { padding: '12px 24px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' };

export default BookingHistory;