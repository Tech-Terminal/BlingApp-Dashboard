import ApiService from "@/core/services/ApiService";

/**
 * @description service for user related api calls
 */
class UserService {
  /**
   * @description get list of users
   * @param params
   * @returns
   */
  public static getAll(params: any) {
    return ApiService.query("admin/users", params);
  }

  /**
   * @description get user by id
   * @param id
   * @returns
   */
  public static get(id: string) {
    return ApiService.get("admin/users", id);
  }

  /**
   * @description delete user
   * @param id
   * @returns
   */
  public static delete(id: string) {
    return ApiService.delete(`admin/users/${id}`, "User has been deleted.");
  }

  /**
   * @description create user
   * @param params
   * @returns
   */
  public static create(params: any) {
    return ApiService.post("admin/users", params);
  }

  /**
   * @description update user
   * @param id
   * @param params
   * @returns
   */
  public static update(id: string, params: any) {
    return ApiService.put(`admin/users/${id}`, params);
  }
}

export default UserService;
