/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";
import axiosInstance from "@/Axios/Axios";


type User = {
  fullname: string;
  email: string;
  contact: number;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  role: 'admin'|'owner'|'user',
  isVerified: boolean;
};

type UserState = {
  users:string[],
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  signup: (input: SignupInputState) => Promise<void>;
  login: (input: LoginInputState) => Promise<void>;
  checkAuthentication: () => Promise<void>;
  getAlluser:()=>Promise<void>;
  updateRole:(id:string,role:string)=>Promise<void>
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (formData: FormData) => Promise<any>;
};

export const useUserStore = create<UserState>()(
  persist((set) => ({
    users:[],
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    loading: false,
    

    signup: async (input: SignupInputState) => {
      try {
        set({ loading: true });
        const response = await axiosInstance.post(`/user/signup`, input, {
          headers: {
            "Content-Type": "application/json",
          },
        });


        if (response.data.success) {
          toast.success(response.data.message);
          set({ loading: false,user:response.data.user })
        
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Signup failed.");
        set({ loading: false });
      }
    },

    login: async (input: LoginInputState) => {
      try {
        set({ loading: true });
        const response = await axiosInstance.post(`/user/login`, input, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.success) {
          localStorage.setItem("authToken", response.data.token); // Store token
          toast.success("Login successful!");
          set({ loading: false, user: response.data.user, isAuthenticated: true });
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Login failed.");
        set({ loading: false });
      }
    },

    checkAuthentication: async () => {
      try {
        const response = await axiosInstance.get(`/user/auth`);
        if (response.data.success) {
          set({
            user: response.data.user,
            isAuthenticated: true,
            isCheckingAuth: false,
          });
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        set({ isAuthenticated: false, isCheckingAuth: false });
        localStorage.removeItem("authToken"); // Clear any invalid token
      }
    },
    getAlluser:async()=>{
      try {
        const response=await axiosInstance.get('/user/');
        console.log(response);
        if (response.data.success) {
          set({users:response.data.user})
        }
      } catch (error:any) {
        toast.error(error.response?.data?.message || "Failed to fetch users."); 
      }

    },
    updateRole:async(id:string,role:string)=>{
      try {
        const response=await axiosInstance.post(`/user/role/${id}`,{role})
        if (response.data.success) {
          alert('user role is updated suuccessfully')
        }
      } catch (error:any) {
        toast.error(error.response?.data?.message || "Failed to update user role."); 
      }

    },
    

    logout: async () => {
      try {
        await axiosInstance.post(`/user/logout`);
        localStorage.removeItem("authToken"); // Clear token
        set({ user: null, isAuthenticated: false });
      } catch (error) {
        console.error(error);
      }
    },

    forgotPassword: async (email: string) => {
      try {
        await axiosInstance.post(`/user/forgot-password`, { email });
        toast.success("Password reset link sent.");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to send password reset link.");
      }
    },

    resetPassword: async (token: string, newPassword: string) => {
      try {
        await axiosInstance.post(`/reset-password`, { token, newPassword });
        toast.success("Password reset successfully.");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to reset password.");
      }
    },

    updateProfile: async (formData: FormData) => {
        try {
            
            const response = await axiosInstance.put(`/user/profile/update`, formData);
    
            set({ user: response.data.user });
            toast.success("Profile updated successfully!");
            return response.data.user;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Profile update failed.");
            throw error;
        }
    }
    
      
  }), {
    name: "user-storage",
    storage: createJSONStorage(() => localStorage),
  })
);
