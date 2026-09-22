import { ref, nextTick } from "vue";
import { translate } from "@/core/helpers/i18n-utils";

export function useApiValidation() {
  const errors = ref<Record<string, string[]>>({});
  const message = ref<string>("");

  /**
   * Sets the errors from an API response.
   * Expects the response to follow the standard format:
   * { data: { message: string, errors: Record<string, string[]> } }
   * or axios error object: { response: { data: ... } }
   */
  const setErrors = (errorResponse: any) => {
    // If it's an axios error wrapper
    const data =
      errorResponse?.response?.data || errorResponse?.data || errorResponse;

    if (data && data.errors) {
      errors.value = data.errors;
      message.value = data.message || "Validation failed";
    } else if (data && data.message) {
      // Fallback if no specific field errors were returned
      message.value = data.message;
      errors.value = {
        general: Array.isArray(data.message) ? data.message : [data.message],
      };
    } else {
      clearErrors();
    }

    // Scroll to the first validation error
    if (Object.keys(errors.value).length > 0) {
      nextTick(() => {
        const firstErrorEl = document.querySelector(
          ".is-invalid, .invalid-feedback, .fv-row .text-danger",
        );
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    }
  };

  /**
   * Clears all current validation errors.
   */
  const clearErrors = () => {
    errors.value = {};
    message.value = "";
  };

  /**
   * Checks if a specific field has an error.
   */
  const hasError = (field: string): boolean => {
    return !!(errors.value[field] && errors.value[field].length > 0);
  };

  /**
   * Gets the first error message for a specific field, translated.
   */
  const getError = (field: string): string => {
    if (hasError(field)) {
      return translate(errors.value[field][0]);
    }
    return "";
  };

  return {
    errors,
    message,
    setErrors,
    clearErrors,
    hasError,
    getError,
  };
}
