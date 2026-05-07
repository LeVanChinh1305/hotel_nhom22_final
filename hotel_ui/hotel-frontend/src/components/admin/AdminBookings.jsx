import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, Eye, Info, 
  User, Calendar, CreditCard, Package, X 
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const actionBtnStyle = {
  padding: '6px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', transition: '0.2s',
};

const AdminBookings = ({ bookings, onUpdateStatus }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleApprove = (id) => {
    onUpdateStatus(id, 'CONFIRMED');
  };

  const handleCancel = (id) => {
    onUpdateStatus(id, 'CANCELLED');
  };

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Quản lý Đặt phòng ({bookings.length})</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID', 'Khách hàng', 'Phòng', 'Nhận/Trả', 'Tổng tiền', 'Trạng thái', 'Thanh toán', 'Thao tác'].map(h => (
                <th key={h} style={thStyle(h)}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={8} style={emptyTdStyle}>Không có dữ liệu đơn đặt phòng</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id} style={trStyle} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={tdStyle}><strong>#{b.id}</strong></td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: '600' }}>{b.guestFullName || b.customerName || b.user?.fullName || '—'}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{b.guestPhone || b.user?.phone || ''}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontWeight: '600' }}>P.{b.roomNumber || '—'}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{b.roomType}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ fontSize: '12px' }}>{b.checkInDate}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{b.checkOutDate}</div>
                </td>
                <td style={{ ...tdStyle, color: '#2563EB', fontWeight: '700' }}>
                  {b.totalPrice?.toLocaleString()}₫
                </td>
                <td style={tdStyle}><StatusBadge value={b.status} /></td>
                <td style={tdStyle}><StatusBadge value={b.paymentStatus ? 'PAID' : 'UNPAID'} /></td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                    <button 
                      title="Xem chi tiết" 
                      style={{ ...actionBtnStyle, color: '#2563EB' }} 
                      onClick={() => setSelectedBooking(b)}
                    >
                      <Eye size={18} />
                    </button>
                    
                    {b.status === 'PENDING' && (
                      <>
                        <button 
                          title="Duyệt đơn" 
                          style={{ ...actionBtnStyle, color: '#059669' }} 
                          onClick={() => handleApprove(b.id)}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          title="Hủy đơn" 
                          style={{ ...actionBtnStyle, color: '#EF4444' }} 
                          onClick={() => handleCancel(b.id)}
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div style={modalOverlayStyle} onClick={() => setSelectedBooking(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Chi tiết Đơn hàng #{selectedBooking.id}</h3>
              <button onClick={() => setSelectedBooking(null)} style={closeButtonStyle}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={infoBoxStyle}>
                  <h4 style={sectionTitleStyle}><User size={16} /> Khách hàng</h4>
                  <div style={{ fontWeight: '700' }}>{selectedBooking.guestFullName || selectedBooking.user?.fullName}</div>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>{selectedBooking.guestEmail || selectedBooking.user?.email}</div>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>{selectedBooking.guestPhone || selectedBooking.user?.phone}</div>
                </div>
                <div style={infoBoxStyle}>
                  <h4 style={sectionTitleStyle}><Calendar size={16} /> Thời gian</h4>
                  <div style={{ fontSize: '14px' }}><strong>Nhận:</strong> {selectedBooking.checkInDate}</div>
                  <div style={{ fontSize: '14px' }}><strong>Trả:</strong> {selectedBooking.checkOutDate}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Ngày đặt: {new Date(selectedBooking.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div style={infoBoxStyle}>
                <h4 style={sectionTitleStyle}><Package size={16} /> Dịch vụ & Thanh toán</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
                  <span>Phòng {selectedBooking.roomNumber} ({selectedBooking.roomType})</span>
                  <strong>{selectedBooking.totalRoomPrice?.toLocaleString()}đ</strong>
                </div>
                
                {selectedBooking.services?.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                    <span>{s.serviceName} (x{s.quantity})</span>
                    <span>{(s.price * s.quantity).toLocaleString()}đ</span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: '800', fontSize: '18px', color: '#2563EB' }}>
                  <span>Tổng tiền</span>
                  <span>{selectedBooking.totalPrice?.toLocaleString()}đ</span>
                </div>
              </div>

              {selectedBooking.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button 
                    onClick={() => { handleApprove(selectedBooking.id); setSelectedBooking(null); }}
                    style={{ flex: 1, padding: '12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Duyệt & Xác nhận
                  </button>
                  <button 
                    onClick={() => { handleCancel(selectedBooking.id); setSelectedBooking(null); }}
                    style={{ flex: 1, padding: '12px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Hủy đơn hàng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = (h) => ({
  padding: '12px 16px', background: '#F8FAFC', fontSize: '11px', fontWeight: '700', color: '#64748B',
  textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: h === 'Thao tác' ? 'center' : 'left', borderBottom: '1px solid #E2E8F0'
});

const tdStyle = { padding: '16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' };
const trStyle = { transition: 'background 0.15s' };
const emptyTdStyle = { padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 };
const modalContentStyle = { background: '#fff', borderRadius: '20px', width: '90%', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' };
const modalHeaderStyle = { padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const closeButtonStyle = { border: 'none', background: '#F1F5F9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const infoBoxStyle = { padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' };
const sectionTitleStyle = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '10px', margin: 0 };

export default AdminBookings;
