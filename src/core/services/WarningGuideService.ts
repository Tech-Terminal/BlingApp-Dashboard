import ApiService from "@/core/services/ApiService";

export interface WarningGuide {
  id?: number;
  titleAr: string;
  titleEn: string;
  isActive: boolean;
  createdAt?: string;
}

class WarningGuideService {
  /**
   * Get all warning guides
   */
  public async getGuides(page: number = 1, search: string = ""): Promise<any> {
    const response = await ApiService.query("warning-guides", { page, search });
    return ApiService.extractPaginatedData(response);
  }

  /**
   * Get a single warning guide by ID
   */
  public async getGuide(id: string | number): Promise<WarningGuide> {
    const response = await ApiService.get("warning-guides", id.toString());
    return ApiService.extractSingleData(response);
  }

  /**
   * Create a new warning guide
   */
  public async createGuide(data: Partial<WarningGuide>): Promise<WarningGuide> {
    const response = await ApiService.post("warning-guides", data);
    return ApiService.extractSingleData(response);
  }

  /**
   * Update an existing warning guide
   */
  public async updateGuide(
    id: string | number,
    data: Partial<WarningGuide>,
  ): Promise<WarningGuide> {
    const response = await ApiService.patch(`warning-guides/${id}`, data);
    return ApiService.extractSingleData(response);
  }

  /**
   * Delete a warning guide
   */
  public async deleteGuide(id: string | number): Promise<void> {
    await ApiService.delete(`warning-guides/${id}`);
  }

  /**
   * Alias for compatibility with SearchableSelect
   */
  public async getAll(params: any = {}): Promise<any> {
    return await this.getGuides(params.page || 1, params.search || "");
  }
}

export default new WarningGuideService();
