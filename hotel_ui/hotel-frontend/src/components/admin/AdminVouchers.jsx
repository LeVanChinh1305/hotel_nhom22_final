import React from 'react';
import { Plus } from 'lucide-react';

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

const AdminVouchers = ({ vouchers }) => (
  <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Voucher ({vouchers.length})</h2>
      <button style={{ ...addBtnStyle, background: '#3B82F6' }} onClick={() => alert('Chức năng thêm voucher chưa được triển khai')}>
        <Plus size={14} /> Thêm mới
      </button>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['ID', 'Mã', 'Loại giảm', 'Giá trị', 'Số lần dùng còn lại', 'Hết hạn', 'Trạng thái'].map(h => (
              <th key={h} style={{ padding: '10px 16px', background: '#F8FAFC', fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vouchers.length === 0 ? (
            <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>Không có dữ liệu</td></tr>
          ) : vouchers.map(v => (
            <tr key={v.id} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>#{v.id}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1E40AF', fontFamily: 'monospace', borderBottom: '1px solid #F1F5F9' }}>{v.code}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{v.discountType === 'PERCENTAGE' ? 'Phần trăm (%)' : 'Số tiền (₫)'}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : `${(v.discountValue || 0).toLocaleString('vi-VN')}₫`}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{v.usageLimit ?? '∞'}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{v.expiryDate || '—'}</td>
              <td style={{ padding: '12px 16px', fontSize: '13px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>{v.active ? 'Hoạt động' : 'Ngừng'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminVouchers;
