"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
  accessToken?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Get current user
export function useCurrentUser() {
  const router = useRouter();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<User | null> => {
      try {
        // Check if we have user data in localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && parsedUser.accessToken) {
            return parsedUser;
          }
        }

        // If not in localStorage or no token, fetch from API
        const response = await axiosInstance.get("/auth/me");
        const data = response.data;

        // Get the access token from the cookie or response
        const accessToken = data.accessToken;

        if (!accessToken) {
          const cookies = document.cookie.split(";");
          const accessTokenCookie = cookies.find((cookie) =>
            cookie.trim().startsWith("access_token=")
          );
          const cookieToken = accessTokenCookie
            ? accessTokenCookie.split("=")[1].trim()
            : null;

          if (cookieToken) {
            data.user.accessToken = cookieToken;
          }
        }

        // Store user data with access token in localStorage
        const userWithToken = {
          ...data.user,
          accessToken: data.accessToken || data.user.accessToken,
        };

        localStorage.setItem("user", JSON.stringify(userWithToken));
        return userWithToken;
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        localStorage.removeItem("user");
        return null;
      }
    },
  });
}

// Register hook
export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await axiosInstance.post("/auth/register", credentials);

      // Store user data in localStorage
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data.user;
      }

      throw new Error("Registration failed: No user data returned");
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Registration error:", error);
      if (axios.isAxiosError(error)) {
        return error.response?.data?.error || "Registration failed";
      }
      return (error as Error).message || "Registration failed";
    },
  });
}

// Login hook
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await axiosInstance.post("/auth/login", credentials);

      // Get the access token from cookies
      const cookies = document.cookie.split(";");
      const accessTokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("access_token=")
      );
      const accessToken = accessTokenCookie
        ? accessTokenCookie.split("=")[1].trim()
        : null;

      // Store user data with access token in localStorage
      if (response.data.user) {
        const userWithToken = {
          ...response.data.user,
          accessToken: accessToken || response.data.user.accessToken, // Use token from response or cookie
        };
        localStorage.setItem("user", JSON.stringify(userWithToken));
        return userWithToken;
      }

      throw new Error("Login failed: No user data returned");
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        return error.response?.data?.error || "Login failed";
      }
      return (error as Error).message || "Login failed";
    },
  });
}

// Logout hook
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("user");
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      queryClient.removeQueries({ queryKey: ["events"] });
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
}
