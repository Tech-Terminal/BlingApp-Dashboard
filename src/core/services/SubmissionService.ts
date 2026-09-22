import ApiService from "@/core/services/ApiService";

/**
 * @description service for submission related api calls
 */
class SubmissionService {
  /**
   * @description get list of submissions
   * @param params
   * @returns
   */
  public static getAll(params: any) {
    return ApiService.query("admin/submissions", params);
  }

  /**
   * @description get submission by id
   * @param id
   * @returns
   */
  public static get(id: string) {
    return ApiService.get("admin/submissions", id);
  }

  /**
   * @description update submission status (approve/reject)
   * @param id
   * @param params
   * @returns
   */
  public static update(id: string, params: any) {
    return ApiService.put(
      `admin/submissions/${id}`,
      params,
      "Submission status updated successfully!",
    );
  }
}

export default SubmissionService;
