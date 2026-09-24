import ApiService from "@/core/services/ApiService";
import type { MaidData } from "@/core/types";

export type { MaidData };

const MaidService = {
  // Get list of maids with pagination and filters
  getAll(params: any) {
    return ApiService.query("maids", params).then(
      ApiService.extractPaginatedData,
    );
  },

  // Get a single maid by ID
  get(id: string | number) {
    return ApiService.get("maids", `${id}`).then(ApiService.extractSingleData);
  },

  // Create a new maid
  create(data: any) {
    return ApiService.post("maids", data);
  },

  // Update an existing maid
  update(id: string | number, data: any) {
    return ApiService.vueInstance.axios.patch(`maids/${id}`, data);
  },

  // Delete a maid by ID
  delete(id: string | number) {
    return ApiService.delete(`maids/${id}`);
  },

  // Restore soft-deleted maid
  restore(id: string | number) {
    return ApiService.vueInstance.axios.patch(`maids/${id}/restore`);
  },
};

export default MaidService;
