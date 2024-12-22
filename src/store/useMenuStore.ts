/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useRestaurantStore } from "./useRestaurantStore";
import axiosInstance from "@/Axios/Axios";

type MenuState = {
  loading: boolean;
  menu: any; // Update the type if you have a specific Menu interface
  createMenu: (formData: FormData) => Promise<void>;
  editMenu: (menuId: string, formData: FormData) => Promise<void>;
};

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      loading: false,
      menu: null,

      createMenu: async (formData: FormData) => {
        set({ loading: true });
        try {
          const response = await axiosInstance.post(`/menu/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            toast.success(response.data.message);
            set({ menu: response.data.menu });
            // Update restaurant store
            useRestaurantStore.getState().addMenuToRestaurant(response.data.menu);
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to create menu.";
          toast.error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      editMenu: async (menuId: string, formData: FormData) => {
        set({ loading: true });
        try {
          const response = await axiosInstance.put(`/menu/${menuId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            toast.success(response.data.message);
            set({ menu: response.data.menu });
            // Update restaurant menu in store
            useRestaurantStore.getState().updateMenuToRestaurant(response.data.menu);
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to edit menu.";
          toast.error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "menu-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
