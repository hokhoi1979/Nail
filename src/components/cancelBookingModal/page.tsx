"use client";

import {
  X,
  AlertTriangle,
  CalendarDays,
  Clock3,
  Sparkles,
  UserRound,
} from "lucide-react";

type CancelBookingModalProps = {
  booking: {
    customer_name: string;
    start_time: string;
    end_time: string;
    service_type: string;
    total_estimated_price: number;
  };
  onClose: () => void;
  onConfirm: () => void;
};

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

export function CancelBookingModal({
  booking,
  onClose,
  onConfirm,
}: CancelBookingModalProps) {
  const serviceName =
    booking.service_type === "nail"
      ? "Dịch vụ nail"
      : booking.service_type === "nail + gội đầu"
        ? "Dịch vụ nail + Gội đầu"
        : booking.service_type === "gội đầu"
          ? "Dịch vụ gội đầu"
          : booking.service_type;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2c211e]/50 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-booking-title"
    >
      <div className="relative w-full max-w-[440px] overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f4f1] text-[#9b8982] transition hover:bg-[#f0e5e0] hover:text-[#8f5e52]"
        >
          <X size={18} />
        </button>

        <div className="px-6 pb-6 pt-8 sm:px-8">
          {/* Warning icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fcf0ed] text-[#bd796b]">
            <AlertTriangle size={30} strokeWidth={1.7} />
          </div>

          {/* Heading */}
          <div className="mt-5 text-center">
            <h2
              id="cancel-booking-title"
              className="text-xl font-bold text-[#493832]"
            >
              Xác nhận hủy lịch?
            </h2>

            <p className="mx-auto mt-2 max-w-[310px] text-sm leading-relaxed text-[#95827a]">
              Bạn có chắc chắn muốn hủy lịch hẹn này không? Vui lòng kiểm tra
              lại thông tin trước khi xác nhận.
            </p>
          </div>

          {/* Booking information */}
          <div className="mt-6 rounded-2xl border border-[#eee4df] bg-[#fcfaf8] p-4">
            <div className="flex items-center gap-3 border-b border-[#eee4df] pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3e8e2] text-[#a77b70]">
                <UserRound size={19} />
              </div>

              <div>
                <p className="text-[10px] font-semibold tracking-wider text-[#aa958c]">
                  KHÁCH HÀNG
                </p>
                <p className="mt-1 text-sm font-bold text-[#51413b]">
                  {booking.customer_name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-b border-[#eee4df] py-4">
              <div className="flex items-start gap-2">
                <CalendarDays
                  size={16}
                  className="mt-0.5 shrink-0 text-[#b18478]"
                />
                <div className="min-w-0">
                  <p className="text-[10px] text-[#a4958e]">Thời gian hẹn</p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-[#51413b]">
                    {formatDateTime(booking.start_time)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock3 size={16} className="mt-0.5 shrink-0 text-[#b18478]" />
                <div className="min-w-0">
                  <p className="text-[10px] text-[#a4958e]">Kết thúc</p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-[#51413b]">
                    {formatDateTime(booking.end_time)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4">
              <div className="flex min-w-0 items-center gap-2">
                <Sparkles size={16} className="shrink-0 text-[#b18478]" />
                <div className="min-w-0">
                  <p className="text-[10px] text-[#a4958e]">Dịch vụ</p>
                  <p className="mt-1 text-xs font-semibold text-[#51413b]">
                    {serviceName}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[10px] text-[#a4958e]">Tổng tiền dự kiến</p>
                <p className="mt-1 text-sm font-bold text-[#a66f62]">
                  {formatPrice(booking.total_estimated_price)}
                </p>
              </div>
            </div>
          </div>

          {/* Warning note */}
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#f1e4d8] bg-[#fdf8f2] px-3 py-3">
            <AlertTriangle
              size={15}
              className="mt-0.5 shrink-0 text-[#b58a62]"
            />
            <p className="text-xs leading-relaxed text-[#947b68]">
              Sau khi xác nhận, lịch hẹn sẽ được yêu cầu hủy. Bạn có thể liên hệ
              Tuệ Tuệ nếu cần hỗ trợ.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#e9ddd7] bg-white px-4 py-3 text-sm font-semibold text-[#806d65] transition hover:bg-[#faf6f3]"
            >
              Quay lại
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-[#ad7468] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#965e53] hover:shadow-md"
            >
              Xác nhận hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelBookingModal;
