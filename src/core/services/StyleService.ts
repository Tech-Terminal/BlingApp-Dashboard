import ApiService from "@/core/services/ApiService";

/**
 * @description service for style related api calls
 */
class StyleService {
  public static getAll(params: any) {
    return ApiService.query("admin/styles", params);
  }

  public static get(id: string) {
    return ApiService.get("admin/styles", id);
  }

  public static create(params: any) {
    return ApiService.post(
      "admin/styles",
      params,
      "Style created successfully!",
    );
  }

  public static update(id: string, params: any) {
    // Laravel bug with PUT & multipart/form-data: use POST + _method=PUT
    params.append("_method", "PUT");
    return ApiService.post(
      `admin/styles/${id}`,
      params,
      "Style updated successfully!",
    );
  }

  public static delete(id: string) {
    return ApiService.delete(`admin/styles/${id}`, "Style has been deleted.");
  }
}

export default StyleService;
