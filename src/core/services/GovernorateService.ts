import ApiService from "@/core/services/ApiService";

/**
 * @description service for governorate related api calls
 */
class GovernorateService {
  /**
   * @description get list of governorates
   * @param params
   * @returns
   */
  public static getAll(params: any) {
    return ApiService.query("admin/governorates", params);
  }

  /**
   * @description get governorate by id
   * @param id
   * @returns
   */
  public static get(id: string) {
    return ApiService.get("admin/governorates", id);
  }

  /**
   * @description create new governorate
   * @param params
   * @returns
   */
  public static create(params: any) {
    return ApiService.post(
      "admin/governorates",
      params,
      "Governorate created successfully!",
    );
  }

  /**
   * @description update governorate
   * @param id
   * @param params
   * @returns
   */
  public static update(id: string, params: any) {
    return ApiService.put(
      `admin/governorates/${id}`,
      params,
      "Governorate updated successfully!",
    );
  }

  /**
   * @description delete governorate
   * @param id
   * @returns
   */
  public static delete(id: string) {
    return ApiService.delete(
      `admin/governorates/${id}`,
      "Governorate has been deleted.",
    );
  }
}

export default GovernorateService;
