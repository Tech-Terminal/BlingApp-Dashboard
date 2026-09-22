import { ref } from "vue";
import StorageService from "@/core/services/StorageService";

export function useStorage() {
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);
  const uploadedUrl = ref<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    isUploading.value = true;
    uploadError.value = null;

    try {
      const url = await StorageService.uploadFile(file);
      uploadedUrl.value = url;
      return url;
    } catch (err: any) {
      console.error("File upload failed", err);
      uploadError.value = err.message || "File upload failed";
      return null;
    } finally {
      isUploading.value = false;
    }
  };

  return {
    isUploading,
    uploadError,
    uploadedUrl,
    uploadFile,
  };
}
