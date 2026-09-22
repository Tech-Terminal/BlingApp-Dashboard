import ApiService from "@/core/services/ApiService";

/**
 * @description service for settings related api calls
 */
class SettingService {
  /**
   * @description get list of settings
   * @returns
   */
  public static getAll() {
    return ApiService.get("settings", "");
  }

  /**
   * @description update settings
   * @param params
   * @returns
   */
  public static update(params: any) {
    return ApiService.vueInstance.axios
      .patch("settings", params)
      .then((response) => {
        import("@/core/helpers/alert-utils").then(({ showSuccessAlert }) => {
          showSuccessAlert("Settings updated successfully!");
        });
        return response;
      });
  }
}

export default SettingService;
