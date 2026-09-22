import ApiService from "@/core/services/ApiService";

/**
 * @description service for project related api calls
 */
class ProjectService {
  /**
   * @description get list of projects
   * @param params
   * @returns
   */
  public static getAll(params: any) {
    return ApiService.query("admin/projects", params);
  }

  /**
   * @description get project by id
   * @param id
   * @returns
   */
  public static get(id: string) {
    return ApiService.get("admin/projects", id);
  }

  /**
   * @description create new project
   * @param params
   * @returns
   */
  public static create(params: any) {
    return ApiService.post(
      "admin/projects",
      params,
      "Project created successfully!",
    );
  }

  /**
   * @description update project
   * @param id
   * @param params
   * @returns
   */
  public static update(id: string, params: any) {
    if (params instanceof FormData) {
      params.append("_method", "PUT");
      return ApiService.post(
        `admin/projects/${id}`,
        params,
        "Project updated successfully!",
      );
    }
    return ApiService.put(
      `admin/projects/${id}`,
      params,
      "Project updated successfully!",
    );
  }

  /**
   * @description delete project
   * @param id
   * @returns
   */
  public static delete(id: string) {
    return ApiService.delete(
      `admin/projects/${id}`,
      "Project has been deleted.",
    );
  }
}

export default ProjectService;
