import ApiService from "@/core/services/ApiService";
import type { ClientData, AddressData } from "@/core/types";

export type { ClientData, AddressData };

class ClientService {
  /**
   * Get list of clients with pagination and filters
   */
  public static getAll(params: any) {
    return ApiService.query("clients", params).then(
      ApiService.extractPaginatedData,
    );
  }

  /**
   * Get a single client by ID
   */
  public static get(id: string | number) {
    return ApiService.get("clients", `${id}`).then(
      ApiService.extractSingleData,
    );
  }

  /**
   * Create new client
   */
  public static create(params: any) {
    return ApiService.post(
      "clients",
      params,
      "Client created successfully!",
    );
  }

  /**
   * Get all addresses for a specific client
   */
  public static getAddresses(clientId: string | number) {
    return ApiService.get(`clients/${clientId}/addresses`).then(
      (res) => res.data?.data ?? res.data ?? [],
    );
  }

  /**
   * Update client details or toggle status
   */
  public static update(id: string | number, params: any) {
    return ApiService.patch(
      `clients/${id}`,
      params,
      "Client updated successfully!",
    );
  }

  /**
   * Soft delete client
   */
  public static delete(id: string | number) {
    return ApiService.delete(
      `clients/${id}`,
      "Client deleted successfully.",
    );
  }

  /**
   * Restore soft-deleted client
   */
  public static restore(id: string | number) {
    return ApiService.post(
      `clients/restore/${id}`,
      {},
      "Client restored successfully!",
    );
  }
}

export default ClientService;
