import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import {
  LayoutDashboard, Users, BedDouble, CalendarCheck,
  Tag, Newspaper, AlertTriangle, RefreshCw,
  Shield, Edit, Trash2,
  Plus, ConciergeBell, Eye, CheckCircle, XCircle,
} from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminBookings from '../components/admin/AdminBookings';
import AdminRooms from '../components/admin/AdminRooms';
import AdminServices from '../components/admin/AdminServices';
import AdminUsers from '../components/admin/AdminUsers';
import AdminVouchers from '../components/admin/AdminVouchers';
import AdminNews from '../components/admin/AdminNews';
import StatusBadge from '../components/admin/StatusBadge';

const API_BASE = 'http://localhost:8080';

/* ─────────────────────────────────────────────
   Helper: fetch với Bearer token
───────────────────────────────────────────── */
const getStoredToken = () => {
  // Thử lấy trực tiếp nếu bạn lưu riêng lẻ
  const token = localStorage.getItem('token');
  if (token) return token;

  // Lấy từ object 'user' mà bạn đã lưu khi đăng nhập
  const stored = localStorage.getItem('user');
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);
    // Dựa trên JSON bạn gửi: token nằm trực tiếp trong data
    return data.token || null; 
  } catch (e) {
    console.error("Lỗi parse JSON từ localStorage:", e);
    return null;
  }
};

const authFetch = (path) => {
  const token = getStoredToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(`${API_BASE}/api${path}`, { headers });
};

const actionBtnStyle = {
  padding: '6px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', transition: '0.2s'
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

/* ─────────────────────────────────────────────
   MAIN ADMIN PAGE
───────────────────────────────────────────── */
const Admin = () => {
  const navigate = useNavigate();

  /* Auth guard */
  const [authOk, setAuthOk] = useState(null); // null=loading, true/false
  useEffect(() => {
    const token = getStoredToken();
    const stored = localStorage.getItem('user');
    if (!token || !stored) { setAuthOk(false); return; }
    try {
      const data = JSON.parse(stored);
      const role = (data.user || data)?.role;
      setAuthOk(role === 'ADMIN');
    } catch { setAuthOk(false); }
  }, []);

  /* Data states */
  const [bookings, setBookings] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [news,     setNews]     = useState([]);
  const [rooms,    setRooms]    = useState([]);
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastFetch, setLastFetch] = useState(null);

  /* Modal states */
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    type: '',
    basePrice: '',
    address: '',
    description: '',
    maxOccupancy: '',
    amenities: [],
    images: []
  });
  const [creatingRoom, setCreatingRoom] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [bRes, uRes, vRes, nRes, rRes, sRes] = await Promise.all([
        authFetch('/admin/bookings'),
        authFetch('/admin/users'),
        authFetch('/admin/vouchers'),
        authFetch('/admin/news'),
        authFetch('/admin/rooms'),
        authFetch('/admin/services'),
      ]);
      const responses = [bRes, uRes, vRes, nRes, rRes, sRes];
      const failed = responses.find(res => !res.ok);
      if (failed) {
        if (failed.status === 401 || failed.status === 403) {
          throw new Error('Không có quyền truy cập hoặc token không hợp lệ. Vui lòng đăng nhập lại bằng tài khoản Admin.');
        }
        throw new Error(`Server trả về lỗi ${failed.status}`);
      }
      const [b, u, v, n, r, s] = await Promise.all([bRes.json(), uRes.json(), vRes.json(), nRes.json(), rRes.json(), sRes.json()]);
      setBookings(Array.isArray(b) ? b : []);
      setUsers(Array.isArray(u) ? u : []);
      setVouchers(Array.isArray(v) ? v : []);
      setNews(Array.isArray(n) ? n : []);
      setRooms(Array.isArray(r) ? r : []);
      setServices(Array.isArray(s) ? s : []);
      setLastFetch(new Date().toLocaleTimeString('vi-VN'));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    if (!roomForm.roomNumber.trim() || !roomForm.type.trim() || !roomForm.basePrice) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc: Số phòng, Loại phòng, Giá cơ bản');
      return;
    }

    setCreatingRoom(true);
    try {
      const requestData = {
        roomNumber: roomForm.roomNumber.trim(),
        type: roomForm.type.trim(),
        basePrice: parseFloat(roomForm.basePrice),
        address: roomForm.address.trim() || null,
        description: roomForm.description.trim() || null,
        maxOccupancy: roomForm.maxOccupancy ? parseInt(roomForm.maxOccupancy) : null,
        amenities: roomForm.amenities.filter(a => a.trim()).map(a => a.trim()),
        images: roomForm.images.filter(i => i.trim()).map(i => i.trim())
      };

      const response = await fetch(`${API_BASE}/api/admin/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getStoredToken()}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Không có quyền truy cập hoặc token không hợp lệ');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Lỗi ${response.status}`);
      }

      const newRoom = await response.json();
      setRooms(prev => [...prev, newRoom]);
      setShowAddRoomModal(false);
      setRoomForm({
        roomNumber: '',
        type: '',
        basePrice: '',
        address: '',
        description: '',
        maxOccupancy: '',
        amenities: [],
        images: []
      });
      alert('Thêm phòng thành công!');
    } catch (e) {
      alert('Lỗi khi thêm phòng: ' + e.message);
    } finally {
      setCreatingRoom(false);
    }
  };

  useEffect(() => {
    if (authOk === true) loadData();
  }, [authOk]);

  /* ── Render: loading auth ── */
  if (authOk === null) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 68px)' }}>
          <p style={{ color: '#64748B' }}>Đang xác thực...</p>
        </div>
      </div>
    );
  }

  /* ── Render: not admin ── */
  if (authOk === false) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
        <Navbar />
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', height: 'calc(100vh - 68px)', gap: '16px',
        }}>
          <AlertTriangle size={48} color="#EF4444" />
          <h2 style={{ color: '#0F2E5A', margin: 0 }}>Không có quyền truy cập</h2>
          <p style={{ color: '#64748B', margin: 0 }}>Bạn cần đăng nhập bằng tài khoản Admin.</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 24px', background: '#2563EB', color: '#fff',
              border: 'none', borderRadius: '10px', cursor: 'pointer',
              fontWeight: '600', fontSize: '14px',
            }}
          >Đăng nhập</button>
        </div>
      </div>
    );
  }

  /* ── Derived stats ── */
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'PAID')
    .reduce((s, b) => s + (b.totalPrice || 0), 0);

  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const activeVouchers  = vouchers.filter(v => v.active).length;

  /* ── TABLE STYLES ── */
  const th = {
    padding: '10px 16px', background: '#F8FAFC',
    fontSize: '12px', fontWeight: '700', color: '#64748B',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    textAlign: 'left', borderBottom: '1px solid #E2E8F0',
  };
  const td = {
    padding: '12px 16px', fontSize: '13px',
    color: '#334155', borderBottom: '1px solid #F1F5F9',
  };

  const menuBtn = {
    width: '100%', padding: '12px 20px', border: 'none',
    background: 'transparent', textAlign: 'left', cursor: 'pointer',
    fontSize: '14px', color: '#334155', fontWeight: '500',
    borderRadius: '8px', marginBottom: '4px',
  };

  const activeMenuBtn = { ...menuBtn, background: '#F0F6FF', color: '#2563EB', fontWeight: '600' };

  const getTabTitle = (tab) => {
    const titles = {
      dashboard: 'Dashboard',
      bookings: 'Đặt phòng',
      rooms: 'Quản lý Phòng',
      services: 'Dịch vụ khách sạn',
      users: 'Người dùng',
      vouchers: 'Voucher',
      news: 'Tin tức',
    };
    return titles[tab] || 'Dashboard';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F6FF', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
        {/* Sidebar */}
        <div style={{
          width: '250px', background: '#fff', borderRight: '1px solid #E2E8F0',
          padding: '20px 0', boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            padding: '0 20px 20px', borderBottom: '1px solid #E2E8F0',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <Shield size={20} color="#2563EB" />
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0F2E5A' }}>Quản trị</h3>
          </div>

          <nav style={{ padding: '20px 0' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={activeTab === 'dashboard' ? activeMenuBtn : menuBtn}
            >
              <LayoutDashboard size={16} style={{ marginRight: '8px' }} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              style={activeTab === 'bookings' ? activeMenuBtn : menuBtn}
            >
              <CalendarCheck size={16} style={{ marginRight: '8px' }} />
              Đặt phòng
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              style={activeTab === 'rooms' ? activeMenuBtn : menuBtn}
            >
              <BedDouble size={16} style={{ marginRight: '8px' }} />
              Phòng nghỉ
            </button>
            <button
              onClick={() => setActiveTab('services')}
              style={activeTab === 'services' ? activeMenuBtn : menuBtn}
            >
              <ConciergeBell size={16} style={{ marginRight: '8px' }} />
              Dịch vụ
            </button>
            <button
              onClick={() => setActiveTab('users')}
              style={activeTab === 'users' ? activeMenuBtn : menuBtn}
            >
              <Users size={16} style={{ marginRight: '8px' }} />
              Người dùng
            </button>
            <button
              onClick={() => setActiveTab('vouchers')}
              style={activeTab === 'vouchers' ? activeMenuBtn : menuBtn}
            >
              <Tag size={16} style={{ marginRight: '8px' }} />
              Voucher
            </button>
            <button
              onClick={() => setActiveTab('news')}
              style={activeTab === 'news' ? activeMenuBtn : menuBtn}
            >
              <Newspaper size={16} style={{ marginRight: '8px' }} />
              Tin tức
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '28px',
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0F2E5A' }}>
                {getTabTitle(activeTab)}
              </h1>
              {lastFetch && activeTab === 'dashboard' && (
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>
                  Cập nhật lúc {lastFetch}
                </p>
              )}
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', background: '#2563EB', color: '#fff',
                border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600', fontSize: '14px', opacity: loading ? 0.7 : 1,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#FEF2F2', border: '1px solid #FCA5A5',
              color: '#EF4444', padding: '14px 18px', borderRadius: '12px',
              marginBottom: '24px', fontSize: '14px',
            }}>
              <AlertTriangle size={18} />
              <span>{error} — Kiểm tra kết nối backend và đăng nhập lại nếu cần.</span>
            </div>
          )}

          {/* Content based on activeTab */}
          {activeTab === 'dashboard' && (
            <AdminDashboard
              bookings={bookings}
              rooms={rooms}
              users={users}
              services={services}
              vouchers={vouchers}
              lastFetch={lastFetch}
            />
          )}

          {activeTab === 'bookings' && <AdminBookings bookings={bookings} />}

          {activeTab === 'rooms' && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Quản lý Phòng ({rooms.length})</h2>
                <button style={{ ...addBtnStyle, background: '#3B82F6' }} onClick={() => setShowAddRoomModal(true)}>
                  <Plus size={14} /> Thêm mới
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Số phòng', 'Loại phòng', 'Giá cơ bản', 'Trạng thái', 'Thao tác'].map(h => (
                        <th key={h} style={{...th, textAlign: h === 'Thao tác' ? 'center' : 'left'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.length === 0 ? (
                      <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Không có dữ liệu</td></tr>
                    ) : rooms.map(r => (
                      <tr key={r.id} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{...td, fontWeight: '700'}}>P.{r.roomNumber}</td>
                        <td style={td}>{r.type || r.roomType}</td>
                        <td style={{...td, fontWeight: '600'}}>{r.basePrice?.toLocaleString()}₫</td>
                        <td style={td}><StatusBadge value={r.status || 'AVAILABLE'} /></td>
                        <td style={{...td, textAlign: 'center'}}>
                          <div style={{display: 'flex', gap: '4px', justifyContent: 'center'}}>
                            <button style={{...actionBtnStyle, color: '#2563EB'}} onMouseEnter={e => e.currentTarget.style.background='#DBEAFE'} onMouseLeave={e => e.currentTarget.style.background='none'}><Edit size={16}/></button>
                            <button style={{...actionBtnStyle, color: '#EF4444'}} onMouseEnter={e => e.currentTarget.style.background='#FEE2E2'} onMouseLeave={e => e.currentTarget.style.background='none'}><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Dịch vụ khách sạn ({services.length})</h2>
                <button style={{ ...addBtnStyle, background: '#2563EB' }} onClick={() => alert('Chức năng thêm dịch vụ chưa được triển khai')}>
                  <Plus size={14} /> Thêm mới
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Tên dịch vụ', 'Giá', 'Đơn vị', 'Trạng thái', 'Thao tác'].map(h => (
                        <th key={h} style={{...th, textAlign: h === 'Thao tác' ? 'center' : 'left'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.length === 0 ? (
                      <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Không có dữ liệu</td></tr>
                    ) : services.map(s => (
                      <tr key={s.id} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{...td, fontWeight: '600'}}>{s.serviceName}</td>
                        <td style={td}>{s.price?.toLocaleString()}₫</td>
                        <td style={{...td, fontSize: '12px', color: '#64748B'}}>{s.unit}</td>
                        <td style={td}>
                          {s.available !== false 
                            ? <span style={{color: '#059669', fontSize: '12px', fontWeight: '600'}}>Đang bán</span>
                            : <span style={{color: '#94A3B8', fontSize: '12px', fontWeight: '600'}}>Ngừng</span>
                          }
                        </td>
                        <td style={{...td, textAlign: 'center'}}>
                          <div style={{display: 'flex', gap: '4px', justifyContent: 'center'}}>
                            <button style={{...actionBtnStyle, color: '#2563EB'}} onMouseEnter={e => e.currentTarget.style.background='#DBEAFE'} onMouseLeave={e => e.currentTarget.style.background='none'}><Edit size={16}/></button>
                            <button style={{...actionBtnStyle, color: '#EF4444'}} onMouseEnter={e => e.currentTarget.style.background='#FEE2E2'} onMouseLeave={e => e.currentTarget.style.background='none'}><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Người dùng ({users.length})</h2>
                <button style={{ ...addBtnStyle, background: '#1E40AF' }} onClick={() => alert('Chức năng thêm người dùng chưa được triển khai')}>
                  <Plus size={14} /> Thêm mới
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['ID', 'Họ tên', 'Email', 'Vai trò', 'Trạng thái'].map(h => (
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Không có dữ liệu</td></tr>
                    ) : users.map(u => (
                      <tr key={u.id}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={td}>#{u.id}</td>
                        <td style={td}>{u.fullName || '—'}</td>
                        <td style={td}>{u.email || '—'}</td>
                        <td style={td}>
                          <span style={{
                            background: u.role === 'ADMIN' ? '#DBEAFE' : '#EFF6FF',
                            color: u.role === 'ADMIN' ? '#1E40AF' : '#2563EB',
                            padding: '2px 10px', borderRadius: '20px',
                            fontSize: '12px', fontWeight: '600',
                          }}>{u.role || 'USER'}</span>
                        </td>
                        <td style={td}>
                          {u.active === false
                            ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontSize: '13px' }}><XCircle size={14} /> Bị khoá</span>
                            : <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '13px' }}><CheckCircle size={14} /> Hoạt động</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'vouchers' && (
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
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vouchers.length === 0 ? (
                      <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Không có dữ liệu</td></tr>
                    ) : vouchers.map(v => (
                      <tr key={v.id}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={td}>#{v.id}</td>
                        <td style={{ ...td, fontWeight: '700', fontFamily: 'monospace', color: '#1E40AF' }}>{v.code}</td>
                        <td style={td}>{v.discountType === 'PERCENTAGE' ? 'Phần trăm (%)' : 'Số tiền (₫)'}</td>
                        <td style={{ ...td, fontWeight: '600' }}>
                          {v.discountType === 'PERCENTAGE'
                            ? `${v.discountValue}%`
                            : `${(v.discountValue || 0).toLocaleString('vi-VN')}₫`}
                        </td>
                        <td style={td}>{v.usageLimit ?? '∞'}</td>
                        <td style={td}>{v.expiryDate || '—'}</td>
                        <td style={td}><StatusBadge value={v.active ? 'ACTIVE' : 'INACTIVE'} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0F2E5A' }}>Tin tức ({news.length})</h2>
                <button style={{ ...addBtnStyle, background: '#2563EB' }} onClick={() => alert('Chức năng thêm tin tức chưa được triển khai')}>
                  <Plus size={14} /> Thêm mới
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['ID', 'Tiêu đề', 'Tác giả', 'Ngày tạo'].map(h => (
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {news.length === 0 ? (
                      <tr><td colSpan={4} style={{ ...td, textAlign: 'center', color: '#94A3B8', padding: '24px' }}>Không có dữ liệu</td></tr>
                    ) : news.map(n => (
                      <tr key={n.id}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={td}>#{n.id}</td>
                        <td style={{ ...td, fontWeight: '600', maxWidth: '300px' }}>{n.title || '—'}</td>
                        <td style={td}>{n.author?.fullName || n.author?.username || '—'}</td>
                        <td style={td}>{n.createdAt ? new Date(n.createdAt).toLocaleDateString('vi-VN') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal thêm phòng */}
      {showAddRoomModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', width: '100%',
            maxWidth: '600px', maxHeight: '90vh', overflow: 'auto'
          }}>
            <div style={{
              padding: '24px', borderBottom: '1px solid #E2E8F0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#0F2E5A' }}>Thêm phòng mới</h2>
              <button
                onClick={() => setShowAddRoomModal(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#64748B', padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Số phòng <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={roomForm.roomNumber}
                    onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})}
                    placeholder="VD: 101"
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Loại phòng <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({...roomForm, type: e.target.value})}
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  >
                    <option value="">Chọn loại phòng</option>
                    <option value="STANDARD">Standard</option>
                    <option value="DELUXE">Deluxe</option>
                    <option value="SUITE">Suite</option>
                    <option value="PRESIDENTIAL">Presidential</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Giá cơ bản (₫) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={roomForm.basePrice}
                    onChange={(e) => setRoomForm({...roomForm, basePrice: e.target.value})}
                    placeholder="VD: 500000"
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Sức chứa tối đa
                  </label>
                  <input
                    type="number"
                    value={roomForm.maxOccupancy}
                    onChange={(e) => setRoomForm({...roomForm, maxOccupancy: e.target.value})}
                    placeholder="VD: 2"
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={roomForm.address}
                  onChange={(e) => setRoomForm({...roomForm, address: e.target.value})}
                  placeholder="VD: Tầng 1, Khách sạn ABC"
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Mô tả
                </label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({...roomForm, description: e.target.value})}
                  placeholder="Mô tả chi tiết về phòng..."
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Tiện nghi (mỗi tiện nghi một dòng)
                </label>
                <textarea
                  value={roomForm.amenities.join('\n')}
                  onChange={(e) => setRoomForm({...roomForm, amenities: e.target.value.split('\n').filter(a => a.trim())})}
                  placeholder="WiFi miễn phí&#10;Điều hòa&#10;Tivi&#10;Minibar"
                  rows={4}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  URL hình ảnh (mỗi URL một dòng)
                </label>
                <textarea
                  value={roomForm.images.join('\n')}
                  onChange={(e) => setRoomForm({...roomForm, images: e.target.value.split('\n').filter(i => i.trim())})}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowAddRoomModal(false)}
                  style={{
                    padding: '10px 20px', background: '#F3F4F6', color: '#374151',
                    border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '14px', fontWeight: '600'
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={createRoom}
                  disabled={creatingRoom}
                  style={{
                    padding: '10px 20px', background: '#2563EB', color: '#fff',
                    border: 'none', borderRadius: '8px', cursor: creatingRoom ? 'not-allowed' : 'pointer',
                    fontSize: '14px', fontWeight: '600', opacity: creatingRoom ? 0.7 : 1
                  }}
                >
                  {creatingRoom ? 'Đang tạo...' : 'Tạo phòng'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Admin;