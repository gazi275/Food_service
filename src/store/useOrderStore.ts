/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosInstance from "@/Axios/Axios";
import { CheckoutSessionRequest, OrderState } from "@/types/orderType";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";



export const useOrderStore = create<OrderState>()(persist((set => ({
    loading: false,
    orders: [],
    createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
            set({ loading: true });
            const response = await axiosInstance.post(`/order/checkout/create-checkout-session`, checkoutSession, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            window.location.href = response.data.session.url;
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },
    getOrderDetails: async () => {
        try {
            set({loading:true});
            const response = await axiosInstance.get(`order/`);
          
            set({loading:false, orders:response.data.orders});
        } catch (error) {
            set({loading:false});
        }
    }
})), {
    name: 'order-name',
    storage: createJSONStorage(() => localStorage)
}))