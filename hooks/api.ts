import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
import Cookies from "js-cookie";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
};

const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};

const clearTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  Cookies.remove("access_token");
  Cookies.remove("user_role");
  Cookies.remove("first_name");
  Cookies.remove("last_name");
  Cookies.remove("hospital_id");
  Cookies.remove("hospital_name");
  Cookies.remove("hospital_type");
  Cookies.remove("profile_picture");
  Cookies.remove("email");
  Cookies.remove("mobile");
  Cookies.remove("country_code");
  Cookies.remove("address");
  Cookies.remove("speciality");

  window.location.href = "/auth/login";
};

const setUserCookies = (userData: any) => {
  if (typeof window === "undefined") return;

  const cookieOptions = {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  Cookies.set("access_token", userData.tokens.access, cookieOptions);
  Cookies.set("refresh_token", userData.tokens.refresh, cookieOptions);

  Cookies.set("user_role", userData.user_type, cookieOptions);
  Cookies.set("first_name", userData.first_name, cookieOptions);
  Cookies.set("last_name", userData.last_name, cookieOptions);
  Cookies.set("profile_picture", userData.profile_picture, cookieOptions);
  Cookies.set("email", userData.email, cookieOptions);
  Cookies.set("mobile", userData.mobile, cookieOptions);
  Cookies.set("country_code", userData.country_code, cookieOptions);
  Cookies.set("address", userData.address, cookieOptions);
  Cookies.set("speciality", userData.address, cookieOptions);

  if (userData.hospital?.id) {
    Cookies.set("hospital_id", userData.hospital.id, cookieOptions);
    Cookies.set("hospital_name", userData.hospital.name, cookieOptions);
    Cookies.set("hospital_type", userData.hospital.type, cookieOptions);
  }
};

export const request = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = new Headers(options.headers as HeadersInit);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });
  if (res.status === 204) {
    return null; // Don't call .json()
  }
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 && data.code === "token_not_valid") {
      clearTokens();
    }
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const useApiQuery = <T>(
  key: string[],
  url: string,
  options?: UseQueryOptions<T>,
) => useQuery<T>({ queryKey: key, queryFn: () => request(url), ...options });

export const useApiMutation = <T>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  options?: UseMutationOptions<T, Error, any>,
) =>
  useMutation<T, Error, any>({
    mutationFn: (data) => {
      const isFormData = data instanceof FormData;

      return request(url, {
        method,
        body: isFormData ? data : JSON.stringify(data),
        headers: isFormData ? {} : { "Content-Type": "application/json" },
      });
    },
    ...options,
  });

export const useCustomUrlApiMutation = <T>(
  options?: UseMutationOptions<T, Error, any>,
) =>
  useMutation<T, Error, any>({
    mutationFn: (data: { url: string; data: any }) => {
      const isFormData = data.data instanceof FormData;

      return request(data.url, {
        method: "POST",
        body: isFormData ? data.data : JSON.stringify(data.data),
        headers: isFormData ? {} : { "Content-Type": "application/json" },
      });
    },
    ...options,
  });

export const useAdminRegister = (
  options?: UseMutationOptions<any, Error, any>,
) => {
  return useMutation<any, Error, any>({
    mutationFn: async (data) => {
      const response = await request("/auth/admin/register/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (response.tokens?.access && response.tokens?.refresh) {
        setTokens(response.tokens.access, response.tokens.refresh);
        setUserCookies(response);
      }
      return response;
    },
    ...options,
  });
};

export const useLogin = (options?: UseMutationOptions<any, Error, any>) => {
  return useMutation<any, Error, any>({
    mutationFn: async (data) => {
      const response = await request("/auth/login/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (response.tokens?.access && response.tokens?.refresh) {
        setTokens(response.tokens.access, response.tokens.refresh);
        setUserCookies(response);
      }
      return response;
    },
    ...options,
  });
};

export const useStaffRegister = (
  options?: UseMutationOptions<any, Error, any>,
) => {
  return useMutation<any, Error, any>({
    mutationFn: async (data) => {
      const response = await request("/auth/register/staff/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (response.tokens?.access && response.tokens?.refresh) {
        setTokens(response.tokens.access, response.tokens.refresh);
        setUserCookies(response);
      }
      return response;
    },
    ...options,
  });
};

export { getToken, getRefreshToken, setTokens, clearTokens };
