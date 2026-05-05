import React from 'react';
import { Plus, CheckCircle, Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';

const actionBtnStyle = {
  padding: '6px',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  borderRadius: '6px',
  transition: '0.2s',
};

const addBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '8px 16px',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

const AdminBookings = ({ bookings }) => (
  <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Đặt phòng ({bookings.length})</h2>
      <button style={{ ...addBtnStyle, background: '#2563EB' }} onClick={() => alert('Chức năng thêm đặt phòng chưa được triển khai')}>
        <Plus size={14} /> Thêm mới
      </button>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['ID', 'Khách hàng', 'Phòng', 'Nhận/Trả', 'Tổng tiền', 'Trạng thái', 'Thanh toán', 'Thao tác'].map(h => (
              <th key={h} style={{ padding: '10px 16px', background: '#F8FAFC', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: h === 'Thao tác' ? 'center' : 'left', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr><td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>Không có dữ liệu</td></tr>
          ) : bookings.map(b => (
            <tr key={b.id} style={{ transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>#{b.id}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{b.customerName || b.user?.fullName || b.user?.username || '—'}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>P.{b.roomNumber || b.room?.roomNumber || b.room?.id || '—'}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{b.checkInDate}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{b.checkOutDate}</div>
              </td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#059669', borderBottom: '1px solid #F1F5F9', fontWeight: '600' }}>{b.totalPrice ? b.totalPrice.toLocaleString('vi-VN') + '₫' : '—'}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}><StatusBadge value={b.status} /></td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}><StatusBadge value={b.paymentStatus} /></td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  {b.status === 'PENDING' && (
                    <button title="Duyệt đơn" style={{ ...actionBtnStyle, color: '#2563EB' }} onMouseEnter={e => e.currentTarget.style.background='#DBEAFE'} onMouseLeave={e => e.currentTarget.style.background='none'}><CheckCircle size={16} /></button>
                  )}
                  <button title="Xem chi tiết" style={{ ...actionBtnStyle, color: '#2563EB' }} onMouseEnter={e => e.currentTarget.style.background='#DBEAFE'} onMouseLeave={e => e.currentTarget.style.background='none'}><Eye size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminBookings;
