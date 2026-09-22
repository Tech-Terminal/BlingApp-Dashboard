import ApiService from "@/core/services/ApiService";

/**
 * @description service for room related api calls
 */
class RoomService {
  /**
   * @description get list of rooms
   * @param params
   * @returns
   */
  public static getAll(params: any) {
    return ApiService.query("admin/rooms", params);
  }

  /**
   * @description get room by id
   * @param id
   * @returns
   */
  public static get(id: string) {
    return ApiService.get("admin/rooms", id);
  }

  /**
   * @description create new room
   * @param params
   * @returns
   */
  public static create(params: any) {
    // Handle file upload if params has image
    if (params instanceof FormData) {
      return ApiService.post(
        "admin/rooms",
        params,
        "Room created successfully!",
      );
    }
    return ApiService.post("admin/rooms", params, "Room created successfully!");
  }

  /**
   * @description update room
   * @param id
   * @param params
   * @returns
   */
  public static update(id: string, params: any) {
    // If FormData (for image update), use post with _method=PUT
    if (params instanceof FormData) {
      params.append("_method", "PUT");
      return ApiService.post(
        `admin/rooms/${id}`,
        params,
        "Room updated successfully!",
      );
    }
    return ApiService.put(
      `admin/rooms/${id}`,
      params,
      "Room updated successfully!",
    );
  }

  /**
   * @description delete room
   * @param id
   * @returns
   */
  public static delete(id: string) {
    return ApiService.delete(`admin/rooms/${id}`, "Room has been deleted.");
  }
}

export default RoomService;
