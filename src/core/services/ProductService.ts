import ApiService from "@/core/services/ApiService";

/**
 * @description service for product related api calls
 */
class ProductService {
  /**
   * @description get list of products
   * @param params
   * @returns
   */
  public static getAll(params: any) {
    return ApiService.query("admin/products", params);
  }

  /**
   * @description get product by id
   * @param id
   * @returns
   */
  public static get(id: string) {
    return ApiService.get("admin/products", id);
  }

  /**
   * @description create new product
   * @param params
   * @returns
   */
  public static create(params: any) {
    return ApiService.post(
      "admin/products",
      params,
      "Product Created Successfully",
    );
  }

  /**
   * @description update product
   * @param id
   * @param params
   * @returns
   */
  public static update(id: string, params: any) {
    if (params instanceof FormData) {
      params.append("_method", "PUT");
      return ApiService.post(
        `admin/products/${id}`,
        params,
        "Product Updated Successfully",
      );
    }
    return ApiService.update(
      "admin/products",
      id,
      params,
      "Product Updated Successfully",
    );
  }

  /**
   * @description delete product
   * @param id
   * @returns
   */
  public static delete(id: string) {
    return ApiService.delete(
      `admin/products/${id}`,
      "Product Deleted Successfully",
    );
  }

  /**
   * @description approve product
   * @param id
   * @returns
   */
  public static approve(id: string) {
    return ApiService.post(
      `admin/products/${id}/approve`,
      {},
      "Product Approved Successfully",
    );
  }

  /**
   * @description reject product
   * @param id
   * @param reason
   * @returns
   */
  public static reject(id: string, reason: string | null = null) {
    return ApiService.post(
      `admin/products/${id}/reject`,
      { reason: reason },
      "Product Rejected Successfully",
    );
  }
}

export default ProductService;
