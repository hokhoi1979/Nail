"use client";

import { useMemo, useState } from "react";
import {
  UserRound,
  Phone,
  CalendarDays,
  Clock3,
  Sparkles,
  MessageSquareText,
  CheckCircle2,
  CalendarX,
} from "lucide-react";
import { useBookingAll, useCancelBookingByCustomer } from "@/hooks/useBookings";
import CancelBookingModal from "../cancelBookingModal/page";

const STORAGE_KEY = "nail_booking_ids";

type HistoryModalProps = {
  onClose: () => void;
};

const statusLabels = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
} as const;

type BookingStatus = keyof typeof statusLabels;

type LocalBooking = {
  id?: string;
  booking_code?: string;
  status?: string;
  customer_name: string;
  customer_phone: string;
  customer_note?: string;
  start_time: string;
  end_time: string;
  total_estimated_price: number;
  service_type: string;
};

type BookingResponse =
  | LocalBooking[]
  | { data?: LocalBooking[]; bookings?: LocalBooking[] };

const formatDateTime = (date: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

export function HistoryModal({ onClose }: HistoryModalProps) {
  const { data: book, isLoading, error } = useBookingAll();

  const [selectedBooking, setSelectedBooking] = useState<LocalBooking | null>(
    null,
  );

  const cancelbooking = useCancelBookingByCustomer();

  // Lấy danh sách lịch đặt của khách hàng
  const bookings = useMemo(() => {
    if (typeof window === "undefined") return [];

    let savedIds: string[] = [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        savedIds = JSON.parse(raw);
      }
    } catch {
      savedIds = [];
    }

    const typedBook = book as BookingResponse | undefined;

    const allBookings: LocalBooking[] = Array.isArray(typedBook)
      ? typedBook
      : Array.isArray(typedBook?.data)
        ? typedBook.data
        : Array.isArray(typedBook?.bookings)
          ? typedBook.bookings
          : [];

    return allBookings.filter(
      (item) =>
        (item.id && savedIds.includes(item.id)) ||
        (item.booking_code && savedIds.includes(item.booking_code)),
    );
  }, [book]);

  // Thống kê lịch đặt
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  const completedBookings = bookings.filter(
    (b) => b.status === "completed",
  ).length;

  const cancelledBookings = bookings.filter(
    (b) => b.status === "cancelled",
  ).length;

  // Hủy lịch
  const handleCancelBooking = (bookingId: string) => {
    if (!bookingId) return;

    cancelbooking.mutate(
      {
        id: bookingId,
        cancel_reason: "Khách hàng hủy lịch đặt",
      },
      {
        onSuccess: () => {
          setSelectedBooking(null);
        },
      },
    );
  };

  return (
    <div
      className="booking-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="booking-modal history-modal overflow-hidden rounded-[28px] border border-[#eee4df] shadow-2xl">
        <button className="booking-close" aria-label="Đóng" onClick={onClose}>
          ×
        </button>

        <div className="booking-heading">
          <h2 id="history-title">
            Lịch sử
            <em> đặt lịch.</em>
          </h2>

          <p>Các lịch hẹn đã được ghi nhận tại Tuệ Tuệ.</p>

          {/* BOOKING STATISTICS */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Tổng lịch đặt */}
            <div className="min-w-0 rounded-2xl border border-[#eee4df] bg-[#faf5f1] p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0e3dd] sm:h-9 sm:w-9">
                  <CalendarDays size={18} className="text-[#a77969]" />
                </div>

                <span className="hidden text-[9px] font-semibold tracking-wide text-[#a77969] sm:block">
                  TỔNG QUAN
                </span>
              </div>

              <p className="mt-3 text-2xl font-bold text-[#694b40] sm:text-3xl">
                {totalBookings}
              </p>

              <p className="mt-1 text-[10px] font-medium leading-tight text-[#92796f] sm:text-xs">
                Tổng lịch đặt
              </p>
            </div>

            {/* Chờ xác nhận */}
            <div className="min-w-0 rounded-2xl border border-[#f1e5ca] bg-[#fff9ed] p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f8edda] sm:h-9 sm:w-9">
                  <Clock3 size={18} className="text-[#c18b36]" />
                </div>
              </div>

              <p className="mt-3 text-2xl font-bold text-[#a87526] sm:text-3xl">
                {pendingBookings}
              </p>

              <p className="mt-1 text-[10px] font-medium leading-tight text-[#a58a65] sm:text-xs">
                Chờ xác nhận
              </p>
            </div>

            {/* Đã hoàn thành */}
            <div className="min-w-0 rounded-2xl border border-[#dcebdd] bg-[#f0f8f2] p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e1f0e4] sm:h-9 sm:w-9">
                  <CheckCircle2 size={18} className="text-[#57966c]" />
                </div>
              </div>

              <p className="mt-3 text-2xl font-bold text-[#43845a] sm:text-3xl">
                {completedBookings}
              </p>

              <p className="mt-1 text-[10px] font-medium leading-tight text-[#7b9b82] sm:text-xs">
                Đã hoàn thành
              </p>
            </div>

            {/* Đã hủy */}
            <div className="min-w-0 rounded-2xl border border-[#f0deda] bg-[#fff3f1] p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f8e5e1] sm:h-9 sm:w-9">
                  <CalendarX size={18} className="text-[#bc756b]" />
                </div>
              </div>

              <p className="mt-3 text-2xl font-bold text-[#ad655b] sm:text-3xl">
                {cancelledBookings}
              </p>

              <p className="mt-1 text-[10px] font-medium leading-tight text-[#a9827b] sm:text-xs">
                Đã hủy
              </p>
            </div>
          </div>
        </div>

        {/* BOOKING LIST */}
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
            {[...bookings].reverse().map((booking) => {
              const rawStatus = booking.status ?? "pending";

              const currentStatus: BookingStatus =
                rawStatus in statusLabels
                  ? (rawStatus as BookingStatus)
                  : "pending";

              const status = statusLabels[currentStatus];

              return (
                <article
                  className="group overflow-hidden rounded-2xl border border-[#eee4df] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#dfc5ba] hover:shadow-lg"
                  key={booking.id ?? booking.start_time}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f7eeea] text-[#ae8174]">
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
                          completed:
                            "border-emerald-100 bg-emerald-50 text-emerald-700",
                          cancelled: "border-rose-100 bg-rose-50 text-rose-700",
                        }[currentStatus]
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Date and time */}
                  <div className="mx-4 grid grid-cols-2 gap-2 rounded-xl bg-[#faf7f5] p-3">
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
                  <div className="flex items-center justify-between px-4 pb-3 pt-3">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Sparkles size={15} className="text-[#b18478]" />

                        <span className="text-[10px] font-bold tracking-[1.2px] text-[#a77b70]">
                          DỊCH VỤ ĐÃ CHỌN
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-[#51413b]">
                        {booking.service_type === "nail" && "Dịch vụ nail"}

                        {booking.service_type === "nail + gội đầu" &&
                          "Dịch vụ nail + Gội đầu"}

                        {booking.service_type === "gội đầu" &&
                          "Dịch vụ gội đầu"}

                        {!["nail", "nail + gội đầu", "gội đầu"].includes(
                          booking.service_type,
                        ) && booking.service_type}
                      </span>
                    </div>

                    {/* Tổng tiền */}
                    <div className="text-right">
                      <p className="mb-2 text-[10px] font-bold tracking-[1.2px] text-[#a77b70]">
                        TỔNG TIỀN DỰ KIẾN
                      </p>

                      <p className="text-sm font-bold text-[#a66f62]">
                        {booking.total_estimated_price?.toLocaleString("vi-VN")}
                        đ
                      </p>
                    </div>
                  </div>

                  {/* Customer note */}
                  {booking.customer_note && (
                    <div className="mx-4 mb-3 flex items-start gap-2 rounded-lg border-l-2 border-[#d4a89b] bg-[#fdf9f6] px-3 py-2">
                      <MessageSquareText
                        size={15}
                        className="mt-0.5 shrink-0 text-[#ad8377]"
                      />

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-[#a17c70]">
                          GHI CHÚ
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-[#776761]">
                          {booking.customer_note}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Cancel booking button */}
                  {booking.status === "pending" && (
                    <div className="px-5 pb-5">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        type="button"
                        className="w-full rounded-xl border border-[#ead5cf] bg-white px-4 py-3 text-xs font-semibold tracking-wide text-[#ad7468] transition-all duration-300 hover:border-[#c99589] hover:bg-[#fdf6f3] hover:text-[#92594e]"
                      >
                        Hủy lịch đặt
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* CANCEL MODAL */}
        {selectedBooking && (
          <CancelBookingModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onConfirm={() => handleCancelBooking(selectedBooking.id ?? "")}
          />
        )}
      </div>
    </div>
  );
}

export default HistoryModal;
