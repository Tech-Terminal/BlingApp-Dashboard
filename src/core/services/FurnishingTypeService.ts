import ApiService from "@/core/services/ApiService";

/**
 * @description service for furnishing type related api calls
 */
class FurnishingTypeService {
  public static getAll(params: any) {
    return ApiService.query("admin/furnishing-types", params);
  }

  public static get(id: string) {
    return ApiService.get("admin/furnishing-types", id);
  }

  public static create(params: any) {
    return ApiService.post(
      "admin/furnishing-types",
      params,
      "Furnishing type created successfully!",
    );
  }

  public static update(id: string, params: any) {
    // Laravel bug with PUT & multipart/form-data: use POST + _method=PUT
    params.append("_method", "PUT");
    return ApiService.post(
      `admin/furnishing-types/${id}`,
      params,
      "Furnishing type updated successfully!",
    );
  }

  public static delete(id: string) {
    return ApiService.delete(
      `admin/furnishing-types/${id}`,
      "Furnishing type has been deleted.",
    );
  }
}

export default FurnishingTypeService;
