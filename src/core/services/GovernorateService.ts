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
  public static getAll(params: any = {}) {
    return ApiService.query("governorates", params).then(
      ApiService.extractPaginatedData,
    );
  }

  /**
   * @description get governorate by id
   * @param id
   * @returns
   */
  public static get(id: string | number) {
    return ApiService.get("governorates", `${id}`).then(
      ApiService.extractSingleData,
    );
  }

  /**
   * @description create new governorate
   * @param params
   * @returns
   */
  public static create(params: any) {
    return ApiService.post(
      "governorates",
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
  public static update(id: string | number, params: any) {
    return ApiService.patch(
      `governorates/${id}`,
      params,
      "Governorate updated successfully!",
    );
  }

  /**
   * @description delete governorate
   * @param id
   * @returns
   */
  public static delete(id: string | number) {
    return ApiService.delete(
      `governorates/${id}`,
      "Governorate has been deleted.",
    );
  }
}

export default GovernorateService;
