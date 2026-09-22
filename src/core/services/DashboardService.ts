import ApiService from "@/core/services/ApiService";

/**
 * Dashboard Service
 */
class DashboardService {
  /**
   * Fetch dashboard statistics
   */
  public static getStatistics(): Promise<any> {
    return ApiService.get("admin/statistics");
  }
}

export default DashboardService;
