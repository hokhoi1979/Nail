import { supabase } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export interface ServiceItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  buffer_minutes: number;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export const serviceService = {
  // Lấy danh sách dịch vụ active cho khách
  getActiveList: async (): Promise<ServiceItem[]> => {
    console.log("1. Start Supabase request");

    const { data, error } = await supabase
      .from(endpoints.services)
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    console.log("2. Supabase response received");
    console.log("Data:", data);
    console.log("Error:", error);

    if (error) throw error;

    return data || [];
  },

  // Admin: Lấy tất cả dịch vụ
  getAll: async (): Promise<ServiceItem[]> => {
    const { data, error } = await supabase
      .from(endpoints.services)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Admin: Thêm/Sửa/Xóa dịch vụ
  create: async (payload: Partial<ServiceItem>) => {
    const { data, error } = await supabase
      .from(endpoints.services)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id: string, payload: Partial<ServiceItem>) => {
    const { data, error } = await supabase
      .from(endpoints.services)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from(endpoints.services)
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};
