import React, { useState } from 'react';

const RoomCalendar = ({ roomId, bookings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Lọc bookings của phòng này
  const roomBookings = bookings.filter(b => b.room?.id === roomId || b.roomId === roomId);

  // Tạo set các ngày đã đặt
  const bookedDates = new Set();
  roomBookings.forEach(booking => {
    if (booking.checkInDate && booking.checkOutDate) {
      const start = new Date(booking.checkInDate);
      const end = new Date(booking.checkOutDate);
      const current = new Date(start);

      while (current <= end) {
        bookedDates.add(current.toDateString());
        current.setDate(current.getDate() + 1);
      }
    }
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Thêm các ngày trống đầu tháng
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Thêm các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const isBooked = (date) => {
    return date && bookedDates.has(date.toDateString());
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header điều hướng tháng */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px', padding: '0 8px'
      }}>
        <button
          onClick={() => navigateMonth(-1)}
          style={{
            background: '#F3F4F6', border: 'none', borderRadius: '8px',
            padding: '8px 12px', cursor: 'pointer', color: '#374151'
          }}
        >
          ‹ Trước
        </button>
        <h4 style={{
          margin: 0, fontSize: '16px', fontWeight: '600', color: '#0F2E5A'
        }}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        <button
          onClick={() => navigateMonth(1)}
          style={{
            background: '#F3F4F6', border: 'none', borderRadius: '8px',
            padding: '8px 12px', cursor: 'pointer', color: '#374151'
          }}
        >
          Sau ›
        </button>
      </div>

      {/* Header ngày trong tuần */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px',
        background: '#E2E8F0', borderRadius: '8px', overflow: 'hidden'
      }}>
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
          <div key={day} style={{
            background: '#F8FAFC', padding: '12px 8px', textAlign: 'center',
            fontSize: '12px', fontWeight: '600', color: '#64748B'
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Lưới ngày */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px',
        background: '#E2E8F0', borderRadius: '8px', overflow: 'hidden', marginTop: '1px'
      }}>
        {days.map((date, index) => (
          <div
            key={index}
            style={{
              background: date ? (isBooked(date) ? '#2563EB' : '#FFFFFF') : '#F8FAFC',
              padding: '12px 8px', textAlign: 'center', minHeight: '60px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: date ? 'pointer' : 'default',
              border: isToday(date) ? '2px solid #EF4444' : 'none',
              opacity: isPast(date) ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (date && !isBooked(date)) {
                e.currentTarget.style.background = '#F8FAFC';
              }
            }}
            onMouseLeave={(e) => {
              if (date && !isBooked(date)) {
                e.currentTarget.style.background = '#FFFFFF';
              }
            }}
          >
            {date && (
              <>
                <span style={{
                  fontSize: '14px', fontWeight: '600',
                  color: isBooked(date) ? '#FFFFFF' : (isToday(date) ? '#EF4444' : '#334155')
                }}>
                  {date.getDate()}
                </span>
                {isBooked(date) && (
                  <span style={{
                    fontSize: '10px', color: '#BFDBFE', marginTop: '2px'
                  }}>
                    Đã đặt
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Chú thích */}
      <div style={{
        display: 'flex', gap: '16px', justifyContent: 'center',
        marginTop: '16px', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '16px', height: '16px', background: '#FFFFFF',
            border: '1px solid #E2E8F0', borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Trống</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '16px', height: '16px', background: '#2563EB',
            borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Đã đặt</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '16px', height: '16px', background: '#FFFFFF',
            border: '2px solid #EF4444', borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Hôm nay</span>
        </div>
      </div>
    </div>
  );
};

export default RoomCalendar;