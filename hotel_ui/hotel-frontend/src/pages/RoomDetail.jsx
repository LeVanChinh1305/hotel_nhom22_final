import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { 
  CheckCircle2, Plus, Calendar as CalendarIcon, 
  Info, CreditCard, Gift, ChevronRight, Clock
} from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [services, setServices] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedServices, setSelectedServices] = useState([]); // Array of {serviceId, quantity, numberOfPeople, numberOfDays}
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomRes, svcRes, vchRes] = await Promise.all([
          fetch(`${API_BASE}/api/rooms/${id}`),
          fetch(`${API_BASE}/api/services`),
          fetch(`${API_BASE}/api/vouchers`)
        ]);
        
        if (roomRes.ok) setRoom(await roomRes.json());
        if (svcRes.ok) setServices(await svcRes.json());
        if (vchRes.ok) setVouchers(await vchRes.json());
      } catch (err) {
        console.error("Lỗi tải dữ liệu chi tiết:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Phân loại dịch vụ
  const includedServices = useMemo(() => services.filter(s => s.price === 0), [services]);
  const addonServices = useMemo(() => services.filter(s => s.price > 0), [services]);

  // Tính toán hóa đơn
  const invoice = useMemo(() => {
    if (!room || !checkIn || !checkOut) return null;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    
    if (isNaN(nights) || nights <= 0) return null;

    const roomTotal = room.basePrice * nights;
    const serviceTotal = selectedServices.reduce((sum, item) => {
      const svc = services.find(s => s.id === item.serviceId);
      if (!svc) return sum;
      
      // Logic tính tiền dịch vụ theo đơn vị (khớp với Backend)
      if (svc.unit === 'Người/Ngày') {
        return sum + (svc.price * (item.numberOfPeople || 1) * (item.numberOfDays || 1));
      } else if (svc.unit === 'Người') {
        return sum + (svc.price * (item.numberOfPeople || 1));
      } else if (svc.unit === 'Ngày') {
        return sum + (svc.price * (item.numberOfDays || nights));
      }
      return sum + (svc.price * (item.quantity || 1));
    }, 0);

    const subtotal = roomTotal + serviceTotal;
    let discount = 0;

    if (selectedVoucher) {
      // Logic tính discount dựa trên phần trăm
      if (selectedVoucher.discountPercent) {
        discount = (subtotal * selectedVoucher.discountPercent) / 100;
      } else {
        // Nếu voucher là số tiền cố định (tùy theo thiết kế DB của bạn)
        // discount = selectedVoucher.discountAmount || 0;
        discount = 0;
      }

      // Kiểm tra giá trị giảm tối đa
      if (selectedVoucher.maxDiscountAmount && discount > selectedVoucher.maxDiscountAmount) {
        discount = selectedVoucher.maxDiscountAmount;
      }
    }

    return { nights, roomTotal, serviceTotal, subtotal, discount, total: subtotal - discount };
  }, [room, checkIn, checkOut, selectedServices, selectedVoucher, services]);

  const handleServiceToggle = (svc) => {
    setSelectedServices(prev => {
      const isExist = prev.find(s => s.serviceId === svc.id);
      if (isExist) {
        return prev.filter(s => s.serviceId !== svc.id);
      }
      return [...prev, { 
        serviceId: svc.id, 
        quantity: 1, 
        numberOfPeople: 1, 
        numberOfDays: 1 
      }];
    });
  };

  const updateServiceField = (svcId, field, value) => {
    const val = parseInt(value) || 0;
    setSelectedServices(prev => prev.map(s => 
      s.serviceId === svcId ? { ...s, [field]: val } : s
    ));
  };

  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vui lòng đăng nhập để tiếp tục!");
      return navigate('/login');
    }

    if (!checkIn || !checkOut) {
      alert("Vui lòng chọn ngày nhận phòng và ngày trả phòng!");
      return;
    }

    // Thay vì gọi API trực tiếp, chuyển sang trang xác nhận kèm theo thông tin đã chọn
    navigate('/booking-confirmation', { 
      state: { 
        room, 
        checkIn, 
        checkOut, 
        selectedServices, 
        selectedVoucher,
        invoice 
      } 
    });
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Đang tải thông tin phòng...</div>;
  if (!room) return <div style={{ padding: '100px', textAlign: 'center' }}>Không tìm thấy phòng.</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <Navbar />
      
      <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
        
        {/* CỘT TRÁI: THÔNG TIN PHÒNG & DỊCH VỤ */}
        <section>
          <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0', marginBottom: '30px' }}>
            <div style={{ height: '400px', background: '#CBD5E1' }}>
               {/* Chỗ này sau này để thẻ img */}
               <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>Ảnh minh họa phòng {room.roomNumber}</div>
            </div>
            <div style={{ padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#0F2E5A', margin: 0 }}>Phòng {room.roomNumber} - {room.type}</h1>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#2563EB' }}>{room.basePrice.toLocaleString()}đ<small style={{ fontSize: '14px', color: '#64748B', fontWeight: '400' }}>/đêm</small></span>
              </div>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '16px' }}>{room.description}</p>
              
              <div style={{ display: 'flex', gap: '20px', marginTop: '25px', padding: '20px', background: '#F1F5F9', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontSize: '14px' }}><Clock size={18} /> Nhận: 14:00</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontSize: '14px' }}><Clock size={18} /> Trả: 12:00</div>
              </div>
            </div>
          </div>

          {/* Dịch vụ bao gồm (Miễn phí) */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0F2E5A', marginBottom: '15px' }}>Dịch vụ bao gồm</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {includedServices.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#ECFDF5', color: '#059669', borderRadius: '10px', fontSize: '14px', fontWeight: '500' }}>
                  <CheckCircle2 size={16} /> {s.serviceName}
                </div>
              ))}
            </div>
          </div>

          {/* Dịch vụ bổ sung (Trả phí) */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0F2E5A', marginBottom: '15px' }}>Nâng tầm trải nghiệm (Có phí)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {addonServices.map(s => {
                const selectedItem = selectedServices.find(item => item.serviceId === s.id);
                const isSelected = !!selectedItem;
                
                return (
                  <div key={s.id} style={{ 
                    padding: '16px', 
                    border: `2px solid ${isSelected ? '#3B82F6' : '#E2E8F0'}`, 
                    borderRadius: '16px', background: isSelected ? '#EFF6FF' : '#fff',
                    transition: '0.2s'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}>
                        <input type="checkbox" checked={isSelected} onChange={() => handleServiceToggle(s)} style={{ width: '18px', height: '18px' }} />
                        <div>
                          <div style={{ fontWeight: '600', color: '#1E293B' }}>{s.serviceName}</div>
                          <div style={{ fontSize: '13px', color: '#64748B' }}>
                            +{s.price.toLocaleString()}đ / {s.unit}
                          </div>
                        </div>
                      </label>
                      <Plus size={18} color={isSelected ? '#3B82F6' : '#94A3B8'} />
                    </div>

                    {isSelected && (
                      <div style={{ marginTop: '15px', padding: '12px', background: '#fff', borderRadius: '12px', display: 'flex', gap: '20px', border: '1px solid #DBEAFE' }}>
                        {/* Trường hợp: Người/Ngày -> Nhập cả 2 */}
                        {s.unit === 'Người/Ngày' && (
                          <>
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Số người</label>
                              <input 
                                type="number" min="1" 
                                value={selectedItem.numberOfPeople} 
                                onChange={(e) => updateServiceField(s.id, 'numberOfPeople', e.target.value)}
                                style={{ ...inputStyle, padding: '8px' }} 
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Số ngày</label>
                              <input 
                                type="number" min="1" 
                                value={selectedItem.numberOfDays} 
                                onChange={(e) => updateServiceField(s.id, 'numberOfDays', e.target.value)}
                                style={{ ...inputStyle, padding: '8px' }} 
                              />
                            </div>
                          </>
                        )}

                        {/* Trường hợp: Người -> Chỉ nhập số người */}
                        {s.unit === 'Người' && (
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Số người</label>
                            <input 
                              type="number" min="1" 
                              value={selectedItem.numberOfPeople} 
                              onChange={(e) => updateServiceField(s.id, 'numberOfPeople', e.target.value)}
                              style={{ ...inputStyle, padding: '8px' }} 
                            />
                          </div>
                        )}

                        {/* Trường hợp: Ngày -> Nhập số ngày, mặc định lấy số đêm ở */}
                        {s.unit === 'Ngày' && (
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>Số ngày (Mặc định: {invoice?.nights || 1} đêm)</label>
                            <input 
                              type="number" min="1" 
                              value={selectedItem.numberOfDays} 
                              onChange={(e) => updateServiceField(s.id, 'numberOfDays', e.target.value)}
                              style={{ ...inputStyle, padding: '8px' }} 
                              placeholder={invoice?.nights}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voucher */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0F2E5A', marginBottom: '15px' }}>Ưu đãi áp dụng</h3>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
              {vouchers.map(v => (
                <div key={v.id} onClick={() => setSelectedVoucher(selectedVoucher?.id === v.id ? null : v)} style={{
                  minWidth: '200px', padding: '15px', borderRadius: '16px', border: `2px solid ${selectedVoucher?.id === v.id ? '#8B5CF6' : '#E2E8F0'}`,
                  background: selectedVoucher?.id === v.id ? '#F5F3FF' : '#fff', cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7C3AED', fontWeight: '700', marginBottom: '4px' }}>
                    <Gift size={16} /> Giảm {v.discountPercent}%
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Mã: {v.code}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CỘT PHẢI: ĐẶT PHÒNG & HÓA ĐƠN */}
        <aside>
          <div style={{ position: 'sticky', top: '100px', background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700' }}>Thời gian lưu trú</h4>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}><CalendarIcon size={14} /> Ngày nhận phòng</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} style={inputStyle} />
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}><CalendarIcon size={14} /> Ngày trả phòng</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} style={inputStyle} />
            </div>

            {invoice ? (
              <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '20px' }}>
                <div style={priceRowStyle}>
                  <span>Tiền phòng ({invoice.nights} đêm)</span>
                  <span>{invoice.roomTotal.toLocaleString()}đ</span>
                </div>
                {invoice.serviceTotal > 0 && (
                  <div style={priceRowStyle}>
                    <span>Dịch vụ bổ sung</span>
                    <span>{invoice.serviceTotal.toLocaleString()}đ</span>
                  </div>
                )}
                {invoice.discount > 0 && (
                  <div style={{ ...priceRowStyle, color: '#059669', fontWeight: '600' }}>
                    <span>Giảm giá (Voucher)</span>
                    <span>-{invoice.discount.toLocaleString()}đ</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #F1F5F9' }}>
                  <span style={{ fontWeight: '700', fontSize: '18px' }}>Tổng thanh toán</span>
                  <span style={{ fontWeight: '800', fontSize: '22px', color: '#2563EB' }}>{invoice.total.toLocaleString()}đ</span>
                </div>

                <button onClick={handleBooking} style={{ 
                  width: '100%', padding: '16px', background: '#2563EB', color: '#fff', 
                  border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', 
                  marginTop: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', gap: '8px' 
                }}>
                  Xác nhận đặt ngay <ChevronRight size={20} />
                </button>
              </div>
            ) : (
              <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '12px', textAlign: 'center' }}>
                <Info size={20} color="#94A3B8" style={{ marginBottom: '8px' }} />
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Vui lòng chọn ngày để xem giá chi tiết</p>
              </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#94A3B8', fontSize: '12px', justifyContent: 'center' }}>
              <CreditCard size={14} /> Thanh toán an toàn & bảo mật
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#475569',
  marginBottom: '8px'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #E2E8F0',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
};

const priceRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  color: '#64748B',
  marginBottom: '10px'
};

export default RoomDetail;