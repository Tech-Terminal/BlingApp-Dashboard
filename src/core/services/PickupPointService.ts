import ApiService from "@/core/services/ApiService";
import type {
  PickupPointData,
  CreatePickupPointPayload,
  UpdatePickupPointPayload,
} from "@/core/types";

export type { PickupPointData };

const PickupPointService = {
  // Get list of pickup points with pagination and filters
  getAll(params: any) {
    return ApiService.query("pickup-points", params).then(
      ApiService.extractPaginatedData,
    );
  },

  // Get a single pickup point by ID
  get(id: string | number) {
    return ApiService.get("pickup-points", `${id}`).then(
      ApiService.extractSingleData,
    );
  },

  // Create a new pickup point
  create(data: CreatePickupPointPayload) {
    return ApiService.post("pickup-points", data);
  },

  // Update an existing pickup point
  update(id: string | number, data: UpdatePickupPointPayload) {
    return ApiService.vueInstance.axios.patch(`pickup-points/${id}`, data);
  },

  // Delete a pickup point by ID
  delete(id: string | number) {
    return ApiService.delete(`pickup-points/${id}`);
  },

  // Restore soft-deleted pickup point
  restore(id: string | number) {
    return ApiService.post(`pickup-points/restore/${id}`, {});
  },
};

export default PickupPointService;
