import ApiService from "@/core/services/ApiService";
import type { AddressData } from "@/core/types";

export type { AddressData };

class AddressService {
  /**
   * Get list of addresses with pagination and filters
   */
  public static getAll(params: any) {
    return ApiService.query("addresses", params).then(
      ApiService.extractPaginatedData,
    );
  }

  /**
   * Get a single address by ID
   */
  public static get(id: string | number) {
    return ApiService.get("addresses", `${id}`).then(
      ApiService.extractSingleData,
    );
  }

  /**
   * Create new address
   */
  public static create(params: any) {
    return ApiService.post(
      "addresses",
      params,
      "Address created successfully!",
    );
  }

  /**
   * Update address details
   */
  public static update(id: string | number, params: any) {
    return ApiService.patch(
      `addresses/${id}`,
      params,
      "Address updated successfully!",
    );
  }

  /**
   * Soft delete address
   */
  public static delete(id: string | number) {
    return ApiService.delete(
      `addresses/${id}`,
      "Address deleted successfully.",
    );
  }

  /**
   * Restore soft-deleted address
   */
  public static restore(id: string | number) {
    return ApiService.post(
      `addresses/restore/${id}`,
      {},
      "Address restored successfully!",
    );
  }
}

export default AddressService;
