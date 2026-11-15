"use client";

import { useActiveServices } from "@/hooks/useServices";
import { BookingModal } from "@/components/bookingModal/page";
import { HistoryModal } from "@/components/historyModal/page";
import { useState } from "react";

const fallbackImages = [
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85",
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const {
    data: services = [],
    isLoading: isServicesLoading,
    error: servicesError,
  } = useActiveServices();

  const openBooking = (serviceId = selectedService) => {
    setSelectedService(serviceId);
    setIsBookingOpen(true);
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
        <div className="luna-nav-actions">
          <button className="luna-nav-history" onClick={() => setIsHistoryOpen(true)}>
            Lịch sử
          </button>
          <button className="luna-nav-cta" onClick={() => openBooking()}>
            Đặt lịch <b></b>
          </button>
        </div>
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
              Đặt lịch của bạn <span></span>
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
          <p style={{ fontSize: "15px" }}>Chọn một nghi thức cho hôm nay.</p>
        </div>
        <div className="luna-service-list">
          {isServicesLoading ? (
            <p className="luna-loading">Đang tải dịch vụ...</p>
          ) : servicesError ? (
            <p className="luna-error">
              Không thể tải dịch vụ. Vui lòng thử lại sau.
            </p>
          ) : (
            services.slice(0, 4).map((service, index) => (
              <button
                className="luna-service"
                onClick={() => openBooking(service.id)}
                key={service.id}
              >
                <span
                  className="luna-service-image"
                  style={{
                    backgroundImage: `url(${service.image_url || fallbackImages[index % fallbackImages.length]})`,
                  }}
                />
                <span className="luna-service-no">
                  0{index + 1} ·{" "}
                  {service.name.toLowerCase().includes("gội")
                    ? "Gội đầu"
                    : "Nail"}
                </span>
                <span className="luna-service-info">
                  <strong>{service.name}</strong>
                  <small>
                    {service.description ||
                      "Chăm sóc tỉ mỉ theo nhu cầu của bạn."}
                  </small>
                </span>
                <span className="luna-service-meta">
                  <span className="luna-service-price">
                    {formatPrice(service.price)}
                    <small>{service.duration_minutes} phút</small>
                  </span>
                  <b>Đặt gói này </b>
                </span>
              </button>
            ))
          )}
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
            Ghé thăm Tuệ Tuệ <span></span>
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
        <BookingModal
          selectedService={selectedService}
          onServiceChange={setSelectedService}
          onClose={() => setIsBookingOpen(false)}
        />
      ) : null}
      {isHistoryOpen ? (
        <HistoryModal onClose={() => setIsHistoryOpen(false)} />
      ) : null}
    </main>
  );
}
