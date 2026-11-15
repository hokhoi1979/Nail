import { supabase } from "../apis/client";
import { endpoints } from "../apis/endpoints";
import { ServiceItem } from "./services";

export type ServiceType = "nail" | "gội đầu" | "nail + gội đầu";

// 1. Khớp chính xác các cột được truyền lên bảng `bookings`
export interface CreateBookingPayload {
  customer_name: string;
  customer_phone: string;
  customer_note?: string | null;
  start_time: string;
  end_time: string;
  total_estimated_price: number;
  service_type: ServiceType;
}

export interface BookingServiceResponse {
  id: string;
  booking_id: string;
  service_id: string;
  price_at_booking: number;
  duration_at_booking: number;
  services: {
    id: string;
    name: string;
  } | null;
}

export interface BookingResponse {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_note: string | null;
  start_time: string;
  end_time: string;
  total_estimated_price: number;
  service_type: ServiceType;
  status:
    | "pending"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  cancelled_by: "customer" | "admin" | null;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;

  // Bổ sung quan hệ dịch vụ
  booking_services: BookingServiceResponse[];
}

// 2. Khớp chính xác các cột trả về từ bảng `bookings`
export interface BookingResponse {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_note: string | null;
  start_time: string;
  end_time: string;
  total_estimated_price: number;
  service_type: ServiceType;
  status:
    | "pending"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  cancelled_by: "customer" | "admin" | null;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
}

export const bookingService = {
  // Khách bấm đặt lịch
  create: async (
    bookingData: CreateBookingPayload,
    selectedServices: ServiceItem[],
  ): Promise<BookingResponse> => {
    // Bước 1: Tạo đơn trong bảng `bookings`
    const { data: booking, error: bookingErr } = await supabase
      .from(endpoints.bookings)
      .insert({
        customer_name: bookingData.customer_name,
        customer_phone: bookingData.customer_phone,
        customer_note: bookingData.customer_note || null,
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
        total_estimated_price: bookingData.total_estimated_price,
        service_type: bookingData.service_type,
        status: "pending",
      })
      .select()
      .single();

    if (bookingErr) throw bookingErr;

    // Bước 2: Tạo danh sách dịch vụ đi kèm trong bảng `booking_services`
    const serviceItems = selectedServices.map((service) => ({
      booking_id: booking.id,
      service_id: service.id,
      price_at_booking: service.price,
      duration_at_booking: service.duration_minutes,
    }));

    // SỬA LỖI Ở ĐÂY: Trỏ đúng vào bảng "booking_services" thay vì endpoints.services
    const { error: serviceErr } = await supabase
      .from("booking_services")
      .insert(serviceItems);

    if (serviceErr) throw serviceErr;

    return booking;
  },

  // Tra cứu theo ID đơn (vì bảng bookings của bạn hiện không có cột booking_code)
  getById: async (bookingId: string): Promise<BookingResponse> => {
    const { data, error } = await supabase
      .from(endpoints.bookings)
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error) throw error;
    return data;
  },

  // Khách tự hủy đơn pending (theo id)
  cancelByCustomer: async (bookingId: string, cancelReason?: string) => {
    const { data, error } = await supabase
      .from(endpoints.bookings)
      .update({
        status: "cancelled",
        cancelled_by: "customer",
        cancel_reason: cancelReason || null,
      })
      .eq("id", bookingId)
      .eq("status", "pending")
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("Khóa hủy bị từ chối (Đơn đã duyệt hoặc sai mã).");
    }
    return data[0];
  },

  // Lấy các khung giờ bận để chặn trùng lịch
  getBusySlots: async (startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from(endpoints.bookings)
      .select("start_time, end_time")
      .in("status", ["pending", "confirmed", "in_progress"])
      .gte("start_time", startDate)
      .lte("end_time", endDate);

    if (error) throw error;
    return data || [];
  },

  getAll: async (): Promise<BookingResponse[]> => {
    const { data, error } = await supabase
      .from(endpoints.bookings)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        [
          `Không thể lấy bookings: ${error.message}`,
          error.code ? `code=${error.code}` : "",
          error.details ? `details=${error.details}` : "",
          error.hint ? `hint=${error.hint}` : "",
        ]
          .filter(Boolean)
          .join(" | "),
      );
    }

    return data ?? [];
  },
};
