import ApiService from "@/core/services/ApiService";

/**
 * @description service for country related api calls
 */
class CountryService {
  /**
   * @description get list of countries
   * @param params
   * @returns
   */
  public static getAll(params: any) {
    return ApiService.query("admin/countries", params);
  }

  /**
   * @description get country by id
   * @param id
   * @returns
   */
  public static get(id: string) {
    return ApiService.get("admin/countries", id);
  }

  /**
   * @description create new country
   * @param params
   * @returns
   */
  public static create(params: any) {
    return ApiService.post(
      "admin/countries",
      params,
      "Country created successfully!",
    );
  }

  /**
   * @description update country
   * @param id
   * @param params
   * @returns
   */
  public static update(id: string, params: any) {
    // Laravel bug with PUT & multipart/form-data: use POST + _method=PUT
    params.append("_method", "PUT");
    return ApiService.post(
      `admin/countries/${id}`,
      params,
      "Country updated successfully!",
    );
  }

  /**
   * @description delete country
   * @param id
   * @returns
   */
  public static delete(id: string) {
    return ApiService.delete(
      `admin/countries/${id}`,
      "Country has been deleted.",
    );
  }
}

export default CountryService;
