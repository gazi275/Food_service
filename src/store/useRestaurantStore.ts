/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/Axios/Axios";
import { Orders } from "@/types/orderType";
import { MenuItem, RestaurantState } from "@/types/restaurantType";

import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";




export const useRestaurantStore = create<RestaurantState>()(persist((set, get) => ({
    loading: false,
    restaurant: null,
    searchedRestaurant: null,
    appliedFilter: [],
    singleRestaurant: null,
    restaurantOrder: [],
    createRestaurant: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axiosInstance.post(`/resturant/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                throw new Error("Failed to create restaurant");
            }
        } catch (error: any) {
            console.error("Create restaurant error:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ loading: false });
        }
    },
    
    getRestaurant: async () => {
        try {
            set({ loading: true });
            const response = await axiosInstance.get(`/resturant/`);
            if (response.data.success) {
                set({ loading: false, restaurant: response.data.restaurant });
            }
        } catch (error: any) {
            if (error.response.status === 404) {
                set({ restaurant: null });
            }
            set({ loading: false });
        }
    },
    updateRestaurant: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axiosInstance.put(`/resturant/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines: any) => {
        try {
            set({ loading: true });

            const params = new URLSearchParams();
            params.set("searchQuery", searchQuery);
            params.set("selectedCuisines", selectedCuisines.join(","));

            // await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axiosInstance.get(`/resturant/search/${searchText}?${params.toString()}`);
            if (response.data.success) {
                set({ loading: false, searchedRestaurant: response.data });
            }
        } catch (error) {
            set({ loading: false });
        }
    },
    addMenuToRestaurant: (menu: MenuItem) => {
        set((state: any) => ({
            restaurant: state.restaurant ? { ...state.restaurant, menus: [...state.restaurant.menus, menu] } : null,
        }))
    },
    updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state: any) => {
            
            if (state.restaurant) {
                const updatedMenuList = state.restaurant.menus.map((menu: any) => menu._id === updatedMenu._id ? updatedMenu : menu);
                return {
                    restaurant: {
                        ...state.restaurant,
                        menus: updatedMenuList
                    }
                }
            }
            // if state.restaruant is undefined then return state
            return state;
        })
    },
    setAppliedFilter: (value: string) => {
        set((state) => {
            const isAlreadyApplied = state.appliedFilter.includes(value);
            const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item) => item !== value) : [...state.appliedFilter, value];
            return { appliedFilter: updatedFilter }
        })
    },
    resetAppliedFilter: () => {
        set({ appliedFilter: [] })
    },
    getSingleRestaurant: async (restaurantId: string) => {
        try {
            const response = await axiosInstance.get(`/resturant/${restaurantId}`);
            if (response.data.success) {
                set({ singleRestaurant: response.data.restaurant })
            }
        } catch(error){
            console.log(error); 
        }

        
    },
    getRestaurantOrders: async () => {
        try {
            const response = await axiosInstance.get(`/resturant/order`);
            if (response.data.success) {
                set({ restaurantOrder: response.data.orders });
            }
        } catch (error) {
            console.log(error);
        }
    },
    updateRestaurantOrder: async (orderId: string, status: string) => {
        try {
            const response = await axiosInstance.put(`/resturant/order/${orderId}/status`, { status }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                const updatedOrder = get().restaurantOrder.map((order: Orders) => {
                    return order._id === orderId ? { ...order, status: response.data.status } : order;
                })
                set({ restaurantOrder: updatedOrder });
                toast.success(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

}), {
    name: 'restaurant-name',
    storage: createJSONStorage(() => localStorage)
}))