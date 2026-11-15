"use client";

import { useBookingAll } from "@/hooks/useBookings";

type HistoryModalProps = {
  onClose: () => void;
};

const statusLabels = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  in_progress: "Đang thực hiện",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  no_show: "Không đến",
} as const;

const formatDateTime = (date: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

export function HistoryModal({ onClose }: HistoryModalProps) {
  const { data: bookings = [], isLoading, error } = useBookingAll();

  return (
    <div
      className="booking-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="booking-modal history-modal">
        <button className="booking-close" aria-label="Đóng" onClick={onClose}>
          ×
        </button>
        <div className="booking-heading">
          <p className="luna-overline">YOUR VISITS</p>
          <h2 id="history-title">
            Lịch sử
            <br />
            <em>đặt lịch.</em>
          </h2>
          <p>Các lịch hẹn đã được ghi nhận tại Tuệ Tuệ.</p>
        </div>

        {isLoading ? (
          <p className="history-state">Đang tải lịch sử đặt lịch...</p>
        ) : error ? (
          <p className="history-state history-error">
            Không thể tải lịch sử đặt lịch. Vui lòng thử lại sau.
          </p>
        ) : bookings.length === 0 ? (
          <p className="history-state">
            Bạn chưa có lịch đặt nào tại Tuệ Tuệ.
          </p>
        ) : (
          <div className="history-list">
            {bookings.map((booking) => {
              const status = statusLabels[booking.status] || booking.status;

              return (
                <article className="history-item" key={booking.id}>
                  <div className="history-item-header">
                    <div>
                      <p className="history-customer">
                        {booking.customer_name || "Khách đặt lịch"}
                      </p>
                      <p className="history-date">
                        {formatDateTime(booking.start_time)}
                      </p>
                      <p className="history-time">
                        Kết thúc: {formatDateTime(booking.end_time)}
                      </p>
                    </div>
                    <span className={`history-status ${booking.status}`}>
                      {status}
                    </span>
                  </div>
                  <div className="history-services">
                    {booking.booking_services?.length ? (
                      booking.booking_services.map((item) => (
                        <span key={item.id}>
                          {item.services?.name || "Dịch vụ Tuệ Tuệ"}
                        </span>
                      ))
                    ) : (
                      <span>Chưa có thông tin dịch vụ</span>
                    )}
                  </div>
                  <div className="history-item-footer">
                    <span>Mã lịch: {booking.id.slice(0, 8)}</span>
                    <strong>
                      {formatPrice(booking.total_estimated_price)}
                    </strong>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryModal;