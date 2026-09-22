import ApiService from "@/core/services/ApiService";

/**
 * @description service for attribute related api calls
 */
class AttributeService {
  /**
   * @description get list of attributes
   * @param params
   * @returns
   */
  public static getAll(params: any) {
    return ApiService.query("admin/attributes", params);
  }

  /**
   * @description get attribute by id
   * @param id
   * @returns
   */
  public static get(id: string | number) {
    return ApiService.get("admin/attributes", String(id));
  }

  /**
   * @description create new attribute
   * @param params
   * @returns
   */
  public static create(params: any) {
    return ApiService.post("admin/attributes", params);
  }

  /**
   * @description update attribute
   * @param id
   * @param params
   * @returns
   */
  public static update(id: string | number, params: any) {
    return ApiService.put(`admin/attributes/${id}`, params);
  }

  /**
   * @description delete attribute
   * @param id
   * @returns
   */
  public static delete(id: string | number) {
    return ApiService.delete(`admin/attributes/${id}`);
  }

  /**
   * @description add value to attribute
   * @param attributeId
   * @param params
   * @returns
   */
  public static addValue(attributeId: string | number, params: any) {
    return ApiService.post(`admin/attributes/${attributeId}/values`, params);
  }
}

export default AttributeService;
