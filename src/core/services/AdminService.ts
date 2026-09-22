import ApiService from "@/core/services/ApiService";

const AdminService = {
  // Get list of admins with pagination and filters
  getAll(params: any) {
    return ApiService.query("admins", params).then(
      ApiService.extractPaginatedData,
    );
  },

  // Get a single admin by ID
  get(id: string) {
    return ApiService.get("admins", id).then(ApiService.extractSingleData);
  },

  // Create a new admin
  create(data: any) {
    return ApiService.post("admins", data);
  },

  // Update an existing admin
  update(id: string, data: any) {
    return ApiService.vueInstance.axios.patch(`admins/${id}`, data);
  },

  // Delete an admin by ID
  delete(id: string) {
    return ApiService.delete(`admins/${id}`);
  },
};

export default AdminService;
