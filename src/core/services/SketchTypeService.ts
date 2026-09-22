import ApiService from "@/core/services/ApiService";

/**
 * @description service for sketch type related api calls
 */
class SketchTypeService {
  public static getAll(params: any) {
    return ApiService.query("admin/sketch-types", params);
  }

  public static get(id: string) {
    return ApiService.get("admin/sketch-types", id);
  }

  public static create(params: any) {
    return ApiService.post(
      "admin/sketch-types",
      params,
      "Sketch type created successfully!",
    );
  }

  public static update(id: string, params: any) {
    // Laravel bug with PUT & multipart/form-data: use POST + _method=PUT
    params.append("_method", "PUT");
    return ApiService.post(
      `admin/sketch-types/${id}`,
      params,
      "Sketch type updated successfully!",
    );
  }

  public static delete(id: string) {
    return ApiService.delete(
      `admin/sketch-types/${id}`,
      "Sketch type has been deleted.",
    );
  }
}

export default SketchTypeService;
