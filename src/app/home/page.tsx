"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  image: string;
};

const services: Service[] = [
  {
    id: "nail-signature",
    name: "Tuệ Tuệ Signature",
    category: "Nail",
    description: "Cắt da, tạo form và sơn gel màu bạn yêu thích.",
    duration: "60 phút",
    price: "350.000đ",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "nail-art",
    name: "Nail Art",
    category: "Nail",
    description: "Bộ móng được thiết kế riêng, tỉ mỉ đến từng nét.",
    duration: "90 phút",
    price: "550.000đ",
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "head-spa",
    name: "Gội đầu dưỡng sinh",
    category: "Thư giãn",
    description: "Thả lỏng cơ thể với liệu trình gội và massage nhẹ nhàng.",
    duration: "75 phút",
    price: "290.000đ",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "combo",
    name: "Tuệ Tuệ Reset",
    category: "Combo",
    description: "Một buổi chăm sóc trọn vẹn cho bạn rời đi thật nhẹ.",
    duration: "150 phút",
    price: "690.000đ",
    image:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85",
  },
];

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

export default function Home() {
  const [today, setToday] = useState<Date | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(services[0].id);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    setToday(currentDate);
    setSelectedDate(getDateKey(currentDate));
  }, []);

  const calendarDays = useMemo(() => {
    if (!today) return [];

    return Array.from({ length: 14 }, (_, index) => {
      const date = new Date(today);
      date.setHours(12, 0, 0, 0);
      date.setDate(today.getDate() + index);
      return {
        key: getDateKey(date),
        day: weekDays[date.getDay()],
        date: formatDay(date),
        isToday: date.toDateString() === today.toDateString(),
      };
    });
  }, [today]);

  const openBooking = (serviceId = selectedService) => {
    setSelectedService(serviceId);
    setSubmitted(false);
    setIsBookingOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTime) return;
    setSubmitted(true);
  };

  return (
    <main className="luna-page">
      <header className="luna-nav">
        <a className="luna-brand" href="#home" aria-label="Tuệ Tuệ Beauty">
          <span>T</span>
          <strong>
            TUỆ TUỆ <i>beauty</i>
          </strong>
        </a>
        <nav>
          <a href="#services">Dịch vụ</a>
          <a href="#experience">Không gian</a>
          <a href="#about">Về Tuệ Tuệ</a>
        </nav>
        <button className="luna-nav-cta" onClick={() => openBooking()}>
          Đặt lịch <b>↗</b>
        </button>
      </header>

      <section className="luna-hero" id="home">
        <div className="luna-hero-copy reveal-up">
          <p className="luna-overline">A SLOW BEAUTY RITUAL · 2024</p>
          <h1>
            Đẹp theo
            <br />
            <em>cách của bạn.</em>
          </h1>
          <p className="luna-lead">
            Một studio nhỏ cho những buổi chăm sóc thật chậm. Nơi bạn có thể
            dừng lại, thở sâu và để Tuệ Tuệ nâng niu từng chi tiết.
          </p>
          <div className="luna-actions">
            <button className="luna-primary" onClick={() => openBooking()}>
              Đặt lịch của bạn <span>↗</span>
            </button>
            <a className="luna-text-link" href="#services">
              Xem dịch vụ <span>↓</span>
            </a>
          </div>
          <div className="luna-proof">
            <strong>4.9</strong>
            <span>★★★★★</span>
            <small>
              từ hơn 200 vị khách
              <br />
              đã ghé thăm Tuệ Tuệ
            </small>
          </div>
        </div>
        <div className="luna-hero-art reveal-soft">
          <div className="luna-main-photo" />
          <div className="luna-photo-small" />
          <div className="luna-round-note">
            slow
            <br />
            <b>beauty</b>
          </div>
        </div>
      </section>

      <section
        className="luna-intro"
        id="about"
        style={{ marginBottom: "90px" }}
      >
        <p className="luna-overline">THE TUỆ TUỆ EXPERIENCE</p>
        <h2>
          Một chút chăm sóc
          <br />
          <em>thay đổi cả ngày.</em>
        </h2>
        <div>
          <p>
            Tuệ Tuệ tin rằng vẻ đẹp đẹp nhất là vẻ đẹp khiến bạn cảm thấy thoải
            mái trong chính mình.
          </p>
          <p>
            Từ nail care tinh tế đến head spa thư giãn, mỗi trải nghiệm được
            chuẩn bị riêng để bạn rời đi nhẹ nhõm hơn lúc đến.
          </p>
        </div>
        <div
          className="luna-intro-photo"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(55, 33, 29, 0.02), rgba(55, 33, 29, 0.2)), url('https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=700&q=85')",
          }}
        />
      </section>

      <section className="luna-services" id="services">
        <div className="luna-section-head">
          <div>
            <p className="luna-overline">CHOOSE YOUR RITUAL</p>
            <h2>Dịch vụ của Tuệ Tuệ</h2>
          </div>
          <p>
            Chọn một nghi thức
            <br />
            cho hôm nay.
          </p>
        </div>
        <div className="luna-service-list">
          {services.map((service, index) => (
            <button
              className="luna-service"
              onClick={() => openBooking(service.id)}
              key={service.id}
            >
              <span
                className="luna-service-image"
                style={{ backgroundImage: `url(${service.image})` }}
              />
              <span className="luna-service-no">
                0{index + 1} · {service.category}
              </span>
              <span className="luna-service-info">
                <strong>{service.name}</strong>
                <small>{service.description}</small>
              </span>
              <span className="luna-service-meta">
                <span className="luna-service-price">
                  {service.price}
                  <small>{service.duration}</small>
                </span>
                <b>Đặt gói này ↗</b>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="luna-experience" id="experience">
        <div className="luna-experience-image" />
        <div className="luna-experience-copy">
          <p className="luna-overline">A SPACE TO EXHALE</p>
          <h2>
            Không gian để
            <br />
            <em>thở ra.</em>
          </h2>
          <p>
            Ánh sáng dịu, hương thơm nhẹ và những đôi tay chăm sóc bằng sự tập
            trung. Mọi thứ ở Tuệ Tuệ được thiết kế để bạn chậm lại.
          </p>
          <button className="luna-text-link" onClick={() => openBooking()}>
            Ghé thăm Tuệ Tuệ <span>↗</span>
          </button>
        </div>
      </section>

      <footer className="luna-footer">
        <a className="luna-brand" href="#home">
          <span>T</span>
          <strong>
            TUỆ TUỆ <i>beauty</i>
          </strong>
        </a>
        <p>
          Đường Nguyễn Trãi, Lê Lợi
          <br />
          Tỉnh Đồng Tháp, Thành Phố Mỹ Tho, Tiền Giang
          <br />
        </p>
        <div>
          <a href="#home">Instagram</a>
          <a href="#home">Facebook</a>
        </div>
        <small>© 2024 Tuệ Tuệ Beauty</small>
      </footer>

      {isBookingOpen ? (
        <div
          className="booking-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setIsBookingOpen(false)
          }
        >
          <div className="booking-modal">
            <button
              className="booking-close"
              aria-label="Đóng"
              onClick={() => setIsBookingOpen(false)}
            >
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
                  Thông tin đặt lịch của bạn đã được ghi nhận. Tuệ Tuệ sẽ liên
                  hệ để xác nhận trong ít phút.
                </p>
                <button
                  className="luna-primary"
                  onClick={() => setIsBookingOpen(false)}
                >
                  Đóng cửa sổ <span>↗</span>
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
                        <input required name="name" placeholder="Tên của bạn" />
                        <input
                          required
                          name="phone"
                          type="tel"
                          placeholder="Số điện thoại"
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
                              selectedService === "nail-signature"
                                ? "service-choice-option active"
                                : "service-choice-option"
                            }
                            onClick={() => setSelectedService("nail-signature")}
                          >
                            Nail
                          </button>
                          <button
                            type="button"
                            className={
                              selectedService === "head-spa"
                                ? "service-choice-option active"
                                : "service-choice-option"
                            }
                            onClick={() => setSelectedService("head-spa")}
                          >
                            Gội đầu
                          </button>
                          <button
                            type="button"
                            className={
                              selectedService === "both"
                                ? "service-choice-option active"
                                : "service-choice-option"
                            }
                            onClick={() => setSelectedService("both")}
                          >
                            Nail + Gội đầu
                          </button>
                        </div>
                      </div>
                      <textarea
                        name="note"
                        rows={3}
                        placeholder="Bạn muốn Tuệ Tuệ lưu ý điều gì? (không bắt buộc)"
                      />
                    </div>
                  </div>
                  <button
                    className="booking-submit"
                    type="submit"
                    disabled={!selectedTime}
                  >
                    Xác nhận đặt lịch <span>↗</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
