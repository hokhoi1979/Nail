"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { bookingService, CreateBookingPayload } from "@/lib/services/bookings";
import { ServiceItem } from "@/lib/services/services";

// ========================================================
// QUERIES
// ========================================================

// Tra cứu lịch đặt theo mã booking_code (Khách xem thông tin đơn)
export const useBookingAll = () => {
  return useQuery({
    queryKey: ["bookings", "all"],
    queryFn: () => bookingService.getAll(),
    retry: false, // Thêm dòng này để tắt auto-retry
    placeholderData: [],
  });
};

// export const useBookingByCode = (bookingCode: string) => {
//   return useQuery({
//     queryKey: ["bookings", bookingCode],
//     queryFn: () => bookingService.getByCode(bookingCode),
//     enabled: !!bookingCode,
//   });
// };

// Lấy các khung giờ bận để hiển thị / chặn trên Calendar
export const useBusySlots = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["bookings", "busySlots", startDate, endDate],
    queryFn: () => bookingService.getBusySlots(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

// ========================================================
// MUTATIONS
// ========================================================
const STORAGE_KEY = "nail_booking_ids";
// Khách tạo đơn đặt lịch
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: ({
      bookingData,
      selectedServices,
    }: {
      bookingData: CreateBookingPayload;
      selectedServices: ServiceItem[];
    }) => bookingService.create(bookingData, selectedServices),
    onSuccess: (data) => {
      if (typeof window !== "undefined" && data?.id) {
        const savedIds: string[] = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]",
        );

        if (!savedIds.includes(data.id)) {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([data.id, ...savedIds]),
          );
        }
      }

      // 2. Làm mới danh sách bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // message.success(`Đặt lịch thành công! Mã đơn: ${data.id}`);
    },
    onError: (error: Error) => {
      message.error(error?.message || "Đặt lịch thất bại, vui lòng thử lại!");
    },
  });
};

// Khách tự hủy đơn
export const useCancelBookingByCustomer = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: ({
      id,
      cancel_reason,
    }: {
      id: string;
      cancel_reason?: string;
    }) => bookingService.cancelByCustomer(id, cancel_reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", variables.id] });
      message.success("Hủy đơn thành công!");
    },
    onError: (error: Error) => {
      message.error(
        error?.message || "Không thể hủy đơn (Đơn đã duyệt hoặc sai mã).",
      );
    },
  });
};
