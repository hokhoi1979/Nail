"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { serviceService, ServiceItem } from "@/lib/services/services";

// ========================================================
// QUERIES
// ========================================================

// Lấy danh sách dịch vụ active (dành cho Khách)
export const useActiveServices = () => {
  return useQuery({
    queryKey: ["services", "active"],
    queryFn: async () => {
      console.log("Calling getActiveList");

      const result = await serviceService.getActiveList();

      console.log("API result:", result);

      return result;
    },
    placeholderData: [],
  });
};

// Lấy tất cả dịch vụ (dành cho Admin)
export const useAllServices = () => {
  return useQuery({
    queryKey: ["services", "all"],
    queryFn: serviceService.getAll,
    placeholderData: [],
  });
};

// ========================================================
// MUTATIONS (Admin CRUD Services)
// ========================================================

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (payload: Partial<ServiceItem>) =>
      serviceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      message.success("Thêm dịch vụ thành công!");
    },
    onError: (error: Error) => {
      message.error(error?.message || "Không thể thêm dịch vụ!");
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ServiceItem>;
    }) => serviceService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      message.success("Cập nhật dịch vụ thành công!");
    },
    onError: (error: Error) => {
      message.error(error?.message || "Cập nhật thất bại!");
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (id: string) => serviceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      message.success("Xóa dịch vụ thành công!");
    },
    onError: (error: Error) => {
      message.error(error?.message || "Xóa dịch vụ thất bại!");
    },
  });
};
