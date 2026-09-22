import type { App } from "vue";
import type { AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/JwtService";
import AlertService from "@/core/services/AlertService";

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";

    // Request Interceptor: Inject token for every request
    ApiService.vueInstance.axios.interceptors.request.use(
      (config) => {
        const token = JwtService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    let isRefreshing = false;
    let failedQueue: any[] = [];

    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });
      failedQueue = [];
    };

    // Response Interceptor
    ApiService.vueInstance.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise(function (resolve, reject) {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers["Authorization"] = "Bearer " + token;
                return ApiService.vueInstance.axios(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          const refreshToken = JwtService.getRefreshToken();
          if (!refreshToken) {
            isRefreshing = false;
            window.localStorage.clear();
            window.location.href = "/sign-in";
            return Promise.reject(error);
          }

          return new Promise(function (resolve, reject) {
            axios
              .post(
                `${ApiService.vueInstance.axios.defaults.baseURL}/auth/refresh`,
                { refresh_token: refreshToken },
              )
              .then(({ data }) => {
                const payload = data.data;
                JwtService.saveToken(payload.access_token);
                JwtService.saveRefreshToken(payload.refresh_token);
                ApiService.vueInstance.axios.defaults.headers.common[
                  "Authorization"
                ] = "Bearer " + payload.access_token;
                originalRequest.headers["Authorization"] =
                  "Bearer " + payload.access_token;
                processQueue(null, payload.access_token);
                resolve(ApiService.vueInstance.axios(originalRequest));
              })
              .catch((err) => {
                processQueue(err, null);
                window.localStorage.clear();
                window.location.href = "/sign-in";
                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        } else if (error.response?.status === 403) {
          window.location.href = "/403";
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(resource: string, params: any): Promise<AxiosResponse> {
    const finalParams = { ...params };
    if (
      finalParams &&
      finalParams.filters &&
      typeof finalParams.filters === "object"
    ) {
      finalParams.filters = JSON.stringify(finalParams.filters);
    }
    return ApiService.vueInstance.axios.get(resource, { params: finalParams });
  }

  /**
   * @description extract paginated data safely from backend response
   */
  public static extractPaginatedData<T = any>(
    response: AxiosResponse,
  ): PaginatedResponse<T> {
    const isArrayData = Array.isArray(response.data?.data);
    return {
      data: isArrayData ? response.data.data : response.data?.data?.data || [],
      meta: response.data?.meta || response.data?.data?.meta || {},
    };
  }

  /**
   * @description extract single object data safely from backend response
   */
  public static extractSingleData<T = any>(response: AxiosResponse): T {
    return response.data?.data || response.data || response;
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    slug = "" as string,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(
      `${resource}${slug ? "/" + slug : ""}`,
    );
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @param successMessage: string | undefined
   * @returns Promise<AxiosResponse>
   */
  public static post(
    resource: string,
    params: any,
    successMessage?: string,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios
      .post(`${resource}`, params)
      .then((response) => {
        if (successMessage) {
          AlertService.success(successMessage);
        }
        return response;
      });
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @param successMessage: string | undefined
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: any,
    successMessage?: string,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios
      .put(`${resource}/${slug}`, params)
      .then((response) => {
        if (successMessage) {
          AlertService.success(successMessage);
        }
        return response;
      });
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @param successMessage: string | undefined
   * @returns Promise<AxiosResponse>
   */
  public static put(
    resource: string,
    params: any,
    successMessage?: string,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios
      .put(`${resource}`, params)
      .then((response) => {
        if (successMessage) {
          AlertService.success(successMessage);
        }
        return response;
      });
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @param successMessage: string | undefined
   * @returns Promise<AxiosResponse>
   */
  public static delete(
    resource: string,
    successMessage?: string,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource).then((response) => {
      if (successMessage) {
        AlertService.success(successMessage);
      }
      return response;
    });
  }

  /**
   * @description Send the PATCH HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @param successMessage: string | undefined
   * @returns Promise<AxiosResponse>
   */
  public static patch(
    resource: string,
    params: any,
    successMessage?: string,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios
      .patch(`${resource}`, params)
      .then((response) => {
        if (successMessage) {
          AlertService.success(successMessage);
        }
        return response;
      });
  }
}

export default ApiService;
