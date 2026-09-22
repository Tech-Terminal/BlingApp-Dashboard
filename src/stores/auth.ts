import { ref, computed } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  api_token: string;
  phone?: string;
  role?: {
    id: number;
    name: string;
    name_ar: string;
    name_en: string;
    is_system_role: boolean;
    permissions?: any; // Can be array or object
  };
  image?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>(JwtService.getUser() || ({} as User));
  const isLoading = ref(false);
  const isAuthenticated = ref(!!JwtService.getToken());
  const isVerified = ref(false);

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.api_token);
    JwtService.saveUser(user.value);
  }

  function setError(error: any, statusCode?: number) {
    if (typeof error === "string") {
      errors.value = { message: error, statusCode };
    } else {
      errors.value = { ...error, statusCode };
    }
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    isVerified.value = false;
    user.value = {} as User;
    errors.value = {};
    JwtService.destroyToken();
    JwtService.destroyRefreshToken();
    JwtService.destroyUser();
  }

  function login(credentials: User) {
    return ApiService.post("auth/sign-in", credentials)
      .then(({ data }) => {
        const payload = data.data;
        const authData = {
          ...payload.admin,
          api_token: payload.access_token,
        };
        JwtService.saveRefreshToken(payload.refresh_token);
        setAuth(authData);
      })
      .catch(({ response }) => {
        setError(
          response?.data?.errors || response?.data?.message || "Sign in failed",
          response?.status,
        );
      });
  }

  function logout() {
    purgeAuth();
  }

  function register(credentials: User) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        setAuth(data.data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("auth/forgot-password", { email })
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError({ message: response?.data?.message || "Operation failed" });
        throw response;
      });
  }

  function verifyOtp(email: string, otp: string) {
    return ApiService.post("auth/verify-otp", { email, otp })
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors || { message: response.data.message });
        throw response;
      });
  }

  function resetPassword(payload: any) {
    return ApiService.post("auth/reset-password", payload)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError({ message: response?.data?.message || "Reset failed" });
        throw response;
      });
  }

  function resendOtp(email: string) {
    return ApiService.post("auth/forgot-password", { email })
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors || { message: response.data.message });
        throw response;
      });
  }

  // ... registry functions ...

  function verifyAuth() {
    if (!JwtService.getToken()) {
      purgeAuth();
      return;
    }

    // Skip redundant API calls if already verified in current session
    if (isVerified.value) {
      return;
    }

    // Show skeleton immediately
    isLoading.value = true;

    ApiService.get("admins/me")
      .then(({ data }) => {
        const user = data.data;
        user.api_token = JwtService.getToken();
        setAuth(user);
        isVerified.value = true;
      })
      .catch(({ response }) => {
        console.error("Auth verification failed:", response);
        purgeAuth();
      })
      .finally(() => {
        // Wait a bit before hiding the skeleton to ensure it's seen (minimum display time)
        setTimeout(() => {
          isLoading.value = false;
        }, 600);
      });
  }

  const isCompany = computed(() => {
    return (
      !!(user.value as any)?.companyId ||
      !!(user.value as any)?.company_id ||
      !!(user.value as any)?.company?.id ||
      user.value?.role?.name === "Company Admin" ||
      user.value?.role?.name === "company"
    );
  });

  return {
    errors,
    user,
    isAuthenticated,
    isLoading,
    isCompany,
    login,
    logout,
    register,
    forgotPassword,
    verifyOtp,
    resetPassword,
    resendOtp,
    verifyAuth,
    setAuth,
  };
});
