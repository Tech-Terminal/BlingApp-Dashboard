import type { AxiosResponse } from "axios";
import ApiService from "@/core/services/ApiService";

/**
 * @description Order Interface
 */
export interface Order {
  id: number;
  notes: string;
  sub_total: number;
  total_price: number;
  status: string;
  opened_at: string;
  date: string;
  time: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  company?: {
    id: number;
    name: string;
  };
}

export class OrderService {
  /**
   * @description Get all orders
   * @returns Promise<AxiosResponse>
   */
  public static getAll(params: any = {}): Promise<AxiosResponse> {
    return ApiService.query("admin/orders", params);
  }

  /**
   * @description Get order by id
   * @param id
   * @returns Promise<AxiosResponse>
   */
  public static get(id: number): Promise<AxiosResponse> {
    return ApiService.get("admin/orders", String(id));
  }

  /**
   * @description Create order (usually done by user, but admin might need it)
   * @param params
   * @returns Promise<AxiosResponse>
   */
  public static create(params: any): Promise<AxiosResponse> {
    return ApiService.post("admin/orders", params);
  }

  /**
   * @description Update order
   * @param id
   * @param params
   * @returns Promise<AxiosResponse>
   */
  public static update(id: number, params: any): Promise<AxiosResponse> {
    return ApiService.put(`admin/orders/${id}`, params);
  }

  /**
   * @description Change order status
   * @param id
   * @param status
   * @returns Promise<AxiosResponse>
   */
  public static changeStatus(
    id: number,
    status: string,
    comment: string = "",
  ): Promise<AxiosResponse> {
    return ApiService.post(`admin/orders/${id}/change-status`, {
      status,
      comment,
    });
  }

  /**
   * @description Delete order
   * @param id
   * @returns Promise<AxiosResponse>
   */
  public static delete(id: number): Promise<AxiosResponse> {
    return ApiService.delete(`admin/orders/${id}`);
  }
}

export default OrderService;
