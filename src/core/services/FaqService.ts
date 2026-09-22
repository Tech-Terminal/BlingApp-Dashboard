import type { AxiosResponse } from "axios";
import ApiService from "@/core/services/ApiService";

/**
 * @description service for Faq
 */
class FaqService {
  /**
   * @description get all faqs
   * @returns {Promise<AxiosResponse<any>>}
   */
  public static getAll(params: any): Promise<AxiosResponse<any>> {
    return ApiService.query("admin/faqs", params);
  }

  /**
   * @description get faq by id
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  public static get(id: string): Promise<AxiosResponse<any>> {
    return ApiService.get("admin/faqs", id);
  }

  /**
   * @description create new faq
   * @param params
   * @returns {Promise<AxiosResponse<any>>}
   */
  public static create(params: any): Promise<AxiosResponse<any>> {
    return ApiService.post("admin/faqs", params);
  }

  /**
   * @description update faq
   * @param id
   * @param params
   * @returns {Promise<AxiosResponse<any>>}
   */
  public static update(id: string, params: any): Promise<AxiosResponse<any>> {
    return ApiService.put(`admin/faqs/${id}`, params);
  }

  /**
   * @description delete faq
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  public static delete(id: string): Promise<AxiosResponse<any>> {
    return ApiService.delete(`admin/faqs/${id}`);
  }
}

export default FaqService;
