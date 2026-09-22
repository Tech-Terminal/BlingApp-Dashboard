import type { AxiosResponse } from "axios";
import ApiService from "@/core/services/ApiService";

/**
 * @description service for Role
 */
class RoleService {
  /**
   * @description get all roles
   * @param params
   * @returns
   */
  public static getAll(params?: any): Promise<any> {
    return ApiService.query("roles", params).then(
      ApiService.extractPaginatedData,
    );
  }

  /**
   * @description get role by id
   * @param id
   * @returns
   */
  public static get(id: number | string): Promise<any> {
    return ApiService.get("roles", id.toString()).then(
      ApiService.extractSingleData,
    );
  }

  /**
   * @description create new role
   * @param params
   * @returns
   */
  public static create(params: any): Promise<any> {
    return ApiService.post("roles", params).then(ApiService.extractSingleData);
  }

  /**
   * @description update role
   * @param id
   * @param params
   * @returns
   */
  public static update(id: number | string, params: any): Promise<any> {
    return ApiService.vueInstance.axios
      .patch(`roles/${id}`, params)
      .then(ApiService.extractSingleData);
  }

  /**
   * @description delete role
   * @param id
   * @returns
   */
  public static delete(id: number | string): Promise<any> {
    return ApiService.delete(`roles/${id}`).then(ApiService.extractSingleData);
  }

  /**
   * @description get all permissions
   * @returns {Promise<AxiosResponse<any>>}
   */
  public static getPermissions(): Promise<any> {
    return ApiService.get("roles/permissions").then(
      ApiService.extractSingleData,
    );
  }
}

export default RoleService;
