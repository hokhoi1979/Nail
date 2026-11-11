import { supabase } from "../apis/client";
import { endpoints } from "../apis/endpoints";
import { ServiceItem } from "./services";

export interface CreateBookingPayload {
  customer_name: string;
  customer_phone: string;
  customer_note?: string;
  start_time: string;
  end_time: string;
  total_estimated_price: number;
}

export interface BookingResponse {
  id: string;
  booking_code: string;
  customer_name: string;
  customer_phone: string;
  customer_note: string | null;
  start_time: string;
  end_time: string;
  total_estimated_price: number;
  status:
    | "pending"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  cancelled_by: "customer" | "admin" | null;
}

export const bookingService = {
  // Khách bấm đặt lịch
  create: async (
    bookingData: CreateBookingPayload,
    selectedServices: ServiceItem[],
  ): Promise<BookingResponse> => {
    // 1. Tạo đơn trong bảng bookings
    const { data: booking, error: bookingErr } = await supabase
      .from(endpoints.bookings)
      .insert({
        ...bookingData,
        status: "pending",
      })
      .select()
      .single();

    if (bookingErr) throw bookingErr;

    // 2. Tạo danh sách dịch vụ đi kèm trong booking_services
    const serviceItems = selectedServices.map((service) => ({
      booking_id: booking.id,
      service_id: service.id,
      price_at_booking: service.price,
      duration_at_booking: service.duration_minutes,
    }));

    const { error: serviceErr } = await supabase
      .from(endpoints.bookingServices)
      .insert(serviceItems);

    if (serviceErr) throw serviceErr;

    return booking;
  },

  // Tra cứu theo mã booking_code
  getByCode: async (bookingCode: string): Promise<BookingResponse> => {
    const { data, error } = await supabase
      .from(endpoints.bookings)
      .select(
        `
        *,
        booking_services (
          id,
          price_at_booking,
          duration_at_booking,
          services ( name, description )
        )
      `,
      )
      .eq("booking_code", bookingCode)
      .single();

    if (error) throw error;
    return data;
  },

  // Khách tự hủy đơn pending
  cancelByCustomer: async (bookingCode: string) => {
    const { data, error } = await supabase
      .from(endpoints.bookings)
      .update({
        status: "cancelled",
        cancelled_by: "customer",
      })
      .eq("booking_code", bookingCode)
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
    const { data, error } = await supabase.from(endpoints.bookings).select();
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
