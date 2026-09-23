import ApiService from "@/core/services/ApiService";

/**
 * @description service for area related api calls
 */
class AreaService {
  /**
   * @description get list of areas
   * @param params
   * @returns
   */
  public static getAll(params: any = {}) {
    return ApiService.query("areas", params).then(
      ApiService.extractPaginatedData,
    );
  }

  /**
   * @description get area by id
   * @param id
   * @returns
   */
  public static get(id: string | number) {
    return ApiService.get("areas", `${id}`).then(
      ApiService.extractSingleData,
    );
  }

  /**
   * @description create new area
   * @param params
   * @returns
   */
  public static create(params: any) {
    return ApiService.post("areas", params, "Area created successfully!");
  }

  /**
   * @description update area
   * @param id
   * @param params
   * @returns
   */
  public static update(id: string | number, params: any) {
    return ApiService.patch(
      `areas/${id}`,
      params,
      "Area updated successfully!",
    );
  }

  /**
   * @description delete area
   * @param id
   * @returns
   */
  public static delete(id: string | number) {
    return ApiService.delete(`areas/${id}`, "Area has been deleted.");
  }
}

export default AreaService;
