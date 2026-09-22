import ApiService from "@/core/services/ApiService";

/**
 * @description service for finishing type related api calls
 */
class FinishTypeService {
  public static getAll(params: any) {
    return ApiService.query("admin/finishing-types", params);
  }

  public static get(id: string) {
    return ApiService.get("admin/finishing-types", id);
  }

  public static create(params: any) {
    return ApiService.post(
      "admin/finishing-types",
      params,
      "Finishing type created successfully!",
    );
  }

  public static update(id: string, params: any) {
    // Laravel bug with PUT & multipart/form-data: use POST + _method=PUT
    params.append("_method", "PUT");
    return ApiService.post(
      `admin/finishing-types/${id}`,
      params,
      "Finishing type updated successfully!",
    );
  }

  public static delete(id: string) {
    return ApiService.delete(
      `admin/finishing-types/${id}`,
      "Finishing type has been deleted.",
    );
  }
}

export default FinishTypeService;
