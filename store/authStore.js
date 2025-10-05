import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import API_URL from '../constants/api.js'

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isCheckingAuth: true,

    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
            })

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({
                token: data.token,
                user: JSON.stringify(data.user),
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const userJson = await AsyncStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;

            set({ token, user });

        } catch (error) {
            console.log("Auth check failed");
        }finally{
            set({isCheckingAuth:false})
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token");
            set({
                user: null,
                token: null,
                isLoading: false
            })
            return { success: true };
        } catch (error) {
            console.log("Error while logout: ", error);
            return { success: false, error: error.message };
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            })

            const data = await response.json();
            //console.log("Data", JSON.stringify(data));
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong while login");
            }
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);
           
            set({
                token: data.token,
                user: data.user,
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            console.log("Error while login: ", error);
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    }
}))