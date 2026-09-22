import ApiService from "@/core/services/ApiService";

export interface PresignedUrlResponse {
  url: string;
  path: string;
  extension: string;
  originalName: string;
  expectedPublicUrl: string;
}

export default class StorageService {
  /**
   * Request a presigned URL from the backend.
   * @param fileName The original file name
   * @param contentType The MIME type of the file
   */
  public static async getPresignedUrl(
    fileName: string,
    contentType: string,
  ): Promise<PresignedUrlResponse> {
    const response = await ApiService.post("storage/presigned-url", {
      fileName,
      contentType,
    });
    return response.data.data;
  }

  /**
   * Upload a file directly to the S3 compatible storage using the presigned URL.
   * @param file The file object from the input
   * @param presignedUrl The presigned URL received from the backend
   * @param contentType The MIME type of the file
   */
  public static async uploadToS3(
    file: File,
    presignedUrl: string,
    contentType: string,
  ): Promise<void> {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": contentType,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
  }

  /**
   * Complete flow: Gets a presigned URL and uploads the file immediately.
   * Returns the expected public URL of the uploaded file.
   * @param file The file object to upload
   */
  public static async uploadFile(file: File): Promise<string> {
    const presignedData = await this.getPresignedUrl(file.name, file.type);
    await this.uploadToS3(file, presignedData.url, file.type);

    // We return the expected public URL to be saved in the database models
    // like admin.image or company.image
    return presignedData.expectedPublicUrl;
  }
}
