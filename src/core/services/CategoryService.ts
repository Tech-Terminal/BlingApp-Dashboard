import ApiService from "@/core/services/ApiService";

/**
 * @description service for category related api calls
 */
class CategoryService {
  /**
   * @description get list of categories
   * @param params
   * @returns
   */
  public static getAll(params: any) {
    return ApiService.query("admin/categories", params);
  }

  /**
   * @description get category by id
   * @param id
   * @returns
   */
  public static get(id: string) {
    return ApiService.get("admin/categories", id);
  }

  /**
   * @description create new category
   * @param params
   * @returns
   */
  public static create(params: any) {
    // Handle file upload if params has image
    if (params instanceof FormData) {
      return ApiService.post(
        "admin/categories",
        params,
        "Category created successfully!",
      );
    }
    return ApiService.post(
      "admin/categories",
      params,
      "Category created successfully!",
    );
  }

  /**
   * @description update category
   * @param id
   * @param params
   * @returns
   */
  public static update(id: string, params: any) {
    // If FormData (for image update), use post with _method=PUT or just post if backend handles it,
    // typically Laravel handles PUT via _method field in FormData.
    if (params instanceof FormData) {
      params.append("_method", "PUT");
      return ApiService.post(
        `admin/categories/${id}`,
        params,
        "Category updated successfully!",
      );
    }
    return ApiService.put(
      `admin/categories/${id}`,
      params,
      "Category updated successfully!",
    );
  }

  /**
   * @description delete category
   * @param id
   * @returns
   */
  public static delete(id: string) {
    return ApiService.delete(
      `admin/categories/${id}`,
      "Category has been deleted.",
    );
  }
}

export default CategoryService;
