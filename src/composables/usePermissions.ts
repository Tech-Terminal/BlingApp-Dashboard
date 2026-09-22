import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

export function usePermissions() {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);

  /**
   * Check if user has permission for a specific module
   * @param permission The module name (e.g., 'products', 'orders')
   * @returns boolean
   */
  const hasPermission = (permission?: string): boolean => {
    if (!permission) return true;

    // @ts-ignore
    let permissions = user.value?.role?.permissions;
    if (typeof permissions === "string") {
      try {
        permissions = JSON.parse(permissions);
      } catch (e) {
        return false;
      }
    }
    if (!permissions || typeof permissions !== "object") return false;

    const modulePermissions = permissions[permission];
    if (!modulePermissions || !Array.isArray(modulePermissions)) return false;

    // Check for list_view or detailed_view as requested for sidebar visibility
    return (
      modulePermissions.includes("list_view") ||
      modulePermissions.includes("detailed_view")
    );
  };

  /**
   * Check if user can perform a specific action on a module
   * @param action The action name (e.g., 'create', 'update', 'delete')
   * @param module The module name (e.g., 'products')
   * @returns boolean
   */
  const can = (action: string, module: string): boolean => {
    // @ts-ignore
    let permissions = user.value?.role?.permissions;
    if (typeof permissions === "string") {
      try {
        permissions = JSON.parse(permissions);
      } catch (e) {
        return false;
      }
    }
    if (!permissions || typeof permissions !== "object") return false;

    const modulePermissions = permissions[module];
    if (!modulePermissions || !Array.isArray(modulePermissions)) return false;

    return modulePermissions.includes(action);
  };

  /**
   * Check if user has any of the specified actions for a module
   * @param module The module name (e.g., 'products')
   * @param actions Array of actions to check (e.g., ['update', 'delete', 'detailed_view'])
   * @returns boolean
   */
  const hasAnyAction = (module: string, actions: string[]): boolean => {
    return actions.some((action) => can(action, module));
  };

  return {
    user,
    hasPermission,
    can,
    hasAnyAction,
  };
}
