"use client";

import { useBookingAll } from "@/hooks/useBookings";
import {
  UserRound,
  Phone,
  CalendarDays,
  Clock3,
  Sparkles,
  Hash,
  MessageSquareText,
} from "lucide-react";
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
  console.log("first", bookings);

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
          <p className="history-state">Bạn chưa có lịch đặt nào tại Tuệ Tuệ.</p>
        ) : (
          <div className="history-list">
            {bookings.map((booking) => {
              const status = statusLabels[booking.status] || booking.status;

              return (
                <article
                  className="group overflow-hidden rounded-2xl border border-[#eee4df] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#dfc5ba] hover:shadow-lg"
                  key={booking.id}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 p-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f7eeea] text-[#ae8174]">
                        <UserRound size={21} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-[#493832]">
                          {booking.customer_name || "Khách đặt lịch"}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-[#9b8982]">
                          <Phone size={12} />
                          {booking.customer_phone}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                        {
                          pending:
                            "border-amber-100 bg-amber-50 text-amber-700",
                          confirmed: "border-blue-100 bg-blue-50 text-blue-700",
                          in_progress:
                            "border-violet-100 bg-violet-50 text-violet-700",
                          completed:
                            "border-emerald-100 bg-emerald-50 text-emerald-700",
                          cancelled: "border-rose-100 bg-rose-50 text-rose-700",
                          no_show:
                            "border-stone-200 bg-stone-100 text-stone-600",
                        }[booking.status]
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Date and time */}
                  <div className="mx-5 grid grid-cols-2 gap-3 rounded-xl bg-[#faf7f5] p-4">
                    <div className="flex items-start gap-2.5">
                      <CalendarDays
                        size={17}
                        className="mt-0.5 shrink-0 text-[#b18478]"
                      />
                      <div>
                        <p className="text-[10px] text-[#a4958e]">Ngày hẹn</p>
                        <p className="mt-1 text-xs font-semibold leading-relaxed text-[#51413b]">
                          {formatDateTime(booking.start_time)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock3
                        size={17}
                        className="mt-0.5 shrink-0 text-[#b18478]"
                      />
                      <div>
                        <p className="text-[10px] text-[#a4958e]">Kết thúc</p>
                        <p className="mt-1 text-xs font-semibold text-[#51413b]">
                          {formatDateTime(booking.end_time)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="px-5 pb-4 pt-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles size={15} className="text-[#b18478]" />
                      <span className="text-[10px] font-bold tracking-[1.2px] text-[#a77b70]">
                        DỊCH VỤ ĐÃ CHỌN
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {booking.booking_services?.length ? (
                        booking.booking_services.map((item) => (
                          <span
                            key={item.id}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#eee3dd] bg-[#fdfaf8] px-3 py-2 text-xs font-medium text-[#69544d]"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#c39486]" />
                            {item.services?.name || "Dịch vụ Tuệ Tuệ"}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs italic text-[#a99b95]">
                          Chưa có thông tin dịch vụ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer note */}
                  {booking.customer_note && (
                    <div className="mx-5 mb-4 flex items-start gap-2 rounded-lg border-l-2 border-[#d4a89b] bg-[#fdf9f6] px-3 py-3">
                      <MessageSquareText
                        size={15}
                        className="mt-0.5 shrink-0 text-[#ad8377]"
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-[#a17c70]">
                          GHI CHÚ
                        </p>
                        <p className="mt-1 break-words text-xs leading-relaxed text-[#776761]">
                          {booking.customer_note}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-end justify-between gap-3 border-t border-dashed border-[#eee5df] px-5 py-4">
                    <div>
                      <p className="flex items-center gap-1 text-[10px] text-[#aa9b94]">
                        <Hash size={12} />
                        MÃ LỊCH
                      </p>
                      <p className="mt-1 text-xs font-semibold tracking-wider text-[#79665e]">
                        {booking.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="mb-1 text-[10px] text-[#a18e86]">
                        TỔNG TIỀN DỰ KIẾN
                      </p>
                      <strong className="text-lg font-bold text-[#a66f62]">
                        {formatPrice(booking.total_estimated_price)}
                      </strong>
                    </div>
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
