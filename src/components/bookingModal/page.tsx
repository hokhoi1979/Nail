"use client";

import { useCreateBooking } from "@/hooks/useBookings";
import { useActiveServices } from "@/hooks/useServices";
import type { ServiceType } from "@/lib/services/bookings";
import { useState } from "react";
import type { FormEvent } from "react";

type CalendarDay = {
  key: string;
  day: string;
  date: string;
  isToday: boolean;
};

type BookingModalProps = {
  selectedService: string;
  onServiceChange: (serviceId: string) => void;
  onClose: () => void;
};

const timeSlots = [
  "09:00",
  "10:30",
  "12:00",
  "13:30",
  "15:00",
  "16:30",
  "18:00",
];
const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const serviceIds = {
  nail: "32ecf2e5-06cd-4c40-8fb9-cb6edfdb1b51",
  headSpa: "f3a642ab-d9a6-4297-8028-8941ee3b55f6",
  both: "016b38ff-f227-462d-9f61-12066c73d60f",
};
const serviceTypeById: Record<string, ServiceType> = {
  [serviceIds.nail]: "nail",
  [serviceIds.headSpa]: "gội đầu",
  [serviceIds.both]: "nail + gội đầu",
};

const formatDay = (date: Date) =>
  new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(
    date,
  );

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCalendarDays = (currentDate: Date): CalendarDay[] =>
  Array.from({ length: 14 }, (_, index) => {
    const date = new Date(currentDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(currentDate.getDate() + index);
    return {
      key: getDateKey(date),
      day: weekDays[date.getDay()],
      date: formatDay(date),
      isToday: date.toDateString() === currentDate.toDateString(),
    };
  });

export function BookingModal({
  selectedService,
  onServiceChange,
  onClose,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date()),
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [calendarDays] = useState(() => getCalendarDays(new Date()));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const { data: services = [] } = useActiveServices();
  const createBooking = useCreateBooking();

  const selectedServiceItem = services.find(
    (service) => service.id === selectedService,
  );
  const selectedServiceType = serviceTypeById[selectedService];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTime || !selectedServiceItem || !selectedServiceType) {
      console.error("Không thể đặt lịch: dịch vụ hoặc khung giờ chưa hợp lệ.");
      return;
    }

    const startDate = new Date(`${selectedDate}T${selectedTime}:00`);
    if (Number.isNaN(startDate.getTime())) {
      console.error("Không thể đặt lịch: ngày hoặc giờ không hợp lệ.");
      return;
    }

    const endDate = new Date(
      startDate.getTime() + selectedServiceItem.duration_minutes * 60 * 1000,
    );

    console.log("Booking data:", {
      name,
      phone,
      note,
      date: selectedDate,
      time: selectedTime,
      service: selectedService,
    });
    //
    const bookingData = {
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_note: note,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      total_estimated_price: selectedServiceItem.price,
      service_type: selectedServiceType,
    };

    createBooking.mutate(
      {
        bookingData,
        selectedServices: [selectedServiceItem],
      },
      {
        onSuccess: () => setSubmitted(true),
        onError: (error) => console.error("Booking error:", error),
      },
    );
  };

  return (
    <div
      className="booking-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="booking-modal">
        <button className="booking-close" aria-label="Đóng" onClick={onClose}>
          ×
        </button>
        {submitted ? (
          <div className="booking-success">
            <span className="success-mark">✓</span>
            <p className="luna-overline">TUỆ TUỆ ĐÃ NHẬN ĐƯỢC LỜI HẸN</p>
            <h2>
              Hẹn gặp bạn
              <br />
              <em>thật sớm.</em>
            </h2>
            <p>
              Thông tin đặt lịch của bạn đã được ghi nhận. Tuệ Tuệ sẽ liên hệ để
              xác nhận trong ít phút.
            </p>
            <button className="luna-primary" onClick={onClose}>
              Đóng cửa sổ <span></span>
            </button>
          </div>
        ) : (
          <>
            <div className="booking-heading">
              <p className="luna-overline">YOUR NEXT PAUSE</p>
              <h2 id="booking-title">
                Đặt lịch
                <br />
                <em>của bạn.</em>
              </h2>
              <p>Chọn ngày và khung giờ phù hợp trong 2 tuần tới.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="booking-step">
                <span>01</span>
                <div>
                  <label>Chọn ngày · 2 tuần tới</label>
                  <div className="date-picker">
                    {calendarDays.map((date) => (
                      <button
                        type="button"
                        className={
                          selectedDate === date.key
                            ? "date-option active"
                            : "date-option"
                        }
                        key={date.key}
                        onClick={() => setSelectedDate(date.key)}
                      >
                        <small>{date.day}</small>
                        <strong>{date.date.split("/")[0]}</strong>
                        {date.isToday && <i>Hôm nay</i>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="booking-step">
                <span>02</span>
                <div>
                  <label>Chọn khung giờ</label>
                  <div className="time-grid">
                    {timeSlots.map((time, index) => (
                      <button
                        type="button"
                        className={
                          selectedTime === time
                            ? "time-option active"
                            : "time-option"
                        }
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        disabled={index === 2}
                      >
                        {time}
                        {index === 2 && <small>Đã kín</small>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="booking-step">
                <span>03</span>
                <div className="booking-fields">
                  <label>Thông tin của bạn</label>
                  <div className="field-row">
                    <input
                      required
                      name="name"
                      placeholder="Tên của bạn"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder="Số điện thoại"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </div>
                  <div className="service-choice">
                    <span className="service-choice-label">
                      Bạn quan tâm đến
                    </span>
                    <div
                      className="service-choice-options"
                      role="group"
                      aria-label="Chọn gói dịch vụ"
                    >
                      <button
                        type="button"
                        className={
                          selectedService === serviceIds.nail
                            ? "service-choice-option active"
                            : "service-choice-option"
                        }
                        onClick={() => onServiceChange(serviceIds.nail)}
                      >
                        Nail
                      </button>
                      <button
                        type="button"
                        className={
                          selectedService === serviceIds.headSpa
                            ? "service-choice-option active"
                            : "service-choice-option"
                        }
                        onClick={() => onServiceChange(serviceIds.headSpa)}
                      >
                        Gội đầu
                      </button>
                      <button
                        type="button"
                        className={
                          selectedService === serviceIds.both
                            ? "service-choice-option active"
                            : "service-choice-option"
                        }
                        onClick={() => onServiceChange(serviceIds.both)}
                      >
                        Nail + Gội đầu
                      </button>
                    </div>
                  </div>
                  <textarea
                    name="note"
                    rows={3}
                    placeholder="Bạn muốn Tuệ Tuệ lưu ý điều gì? (không bắt buộc)"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                  />
                </div>
              </div>
              <button
                className="booking-submit"
                type="submit"
                disabled={
                  !selectedTime ||
                  !selectedServiceItem ||
                  createBooking.isPending
                }
              >
                Xác nhận đặt lịch <span></span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
