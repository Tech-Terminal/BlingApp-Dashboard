import ApiService from "@/core/services/ApiService";

/**
 * @description service for ticket related api calls
 */
class TicketService {
  /**
   * @description get list of tickets
   * @param params
   * @returns
   */
  public static getAll(params: any) {
    return ApiService.query("admin/tickets", params);
  }

  /**
   * @description get ticket by id
   * @param id
   * @returns
   */
  public static get(id: string) {
    return ApiService.get("admin/tickets", id);
  }

  /**
   * @description create new ticket
   * @param params
   * @returns
   */
  public static create(params: any) {
    return ApiService.post(
      "admin/tickets",
      params,
      "Ticket created successfully!",
    );
  }

  /**
   * @description update ticket
   * @param id
   * @param params
   * @returns
   */
  public static update(id: string, params: any) {
    if (params instanceof FormData) {
      params.append("_method", "PUT");
      return ApiService.post(
        `admin/tickets/${id}`,
        params,
        "Ticket updated successfully!",
      );
    }
    return ApiService.put(
      `admin/tickets/${id}`,
      params,
      "Ticket updated successfully!",
    );
  }

  /**
   * @description delete ticket
   * @param id
   * @returns
   */
  public static delete(id: string) {
    return ApiService.delete(`admin/tickets/${id}`, "Ticket has been deleted.");
  }

  /**
   * @description add comment to ticket
   * @param id
   * @param comment
   * @returns
   */
  public static addComment(id: string, comment: string) {
    return ApiService.post(
      `admin/tickets/${id}/comments`,
      { comment },
      "", // Empty string prevents the Swal alert
    );
  }
}

export default TicketService;
