import Swal, { type SweetAlertResult } from "sweetalert2";
import { translate } from "@/core/helpers/i18n-utils";

/**
 * Show a success alert with a standard style
 * @param text The message to display
 * @param buttonText The text for the confirm button (default: "Ok, got it!")
 */
export const showSuccessAlert = (
  text: string,
  buttonText: string = "Ok, got it!", // kept for compatibility but unused
  timer: number = 2000,
): Promise<SweetAlertResult> => {
  return Swal.fire({
    text: translate(text),
    icon: undefined,
    iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" style="overflow:visible">
      <circle cx="40" cy="40" r="37" fill="none" stroke="#a5dc86" stroke-width="3.5" opacity="0.35"/>
      <polyline points="20,42 33,56 60,25" fill="none" stroke="#a5dc86" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    buttonsStyling: false,
    showConfirmButton: false,
    timer: timer,
    heightAuto: false,
    customClass: {
      confirmButton: "btn btn-primary",
      icon: "border-0 bg-transparent",
    },
  });
};

/**
 * Show an error alert with a standard style
 * @param text The error message to display
 * @param buttonText The text for the confirm button (default: "Ok, got it!")
 */
export const showErrorAlert = (
  text: string,
  buttonText: string = "Ok, got it!",
): Promise<SweetAlertResult> => {
  return Swal.fire({
    text: translate(text),
    icon: "error",
    buttonsStyling: false,
    confirmButtonText: translate(buttonText),
    heightAuto: false,
    customClass: {
      confirmButton: "btn btn-primary",
    },
  });
};

/**
 * Show a confirmation alert (e.g., for deletion)
 * @param text The question to ask (default: "Are you sure you want to delete this item?")
 * @param icon The icon to show (default: "warning")
 * @param confirmButtonText Text for the confirm button (default: "Yes, delete it!")
 * @param showCancelButton Whether to show the cancel button (default: true)
 * @param input Type of input to show (default: undefined)
 * @param inputPlaceholder Placeholder for the input (default: "")
 * @param confirmButtonClass Class for the confirm button (default: "btn-danger")
 * @returns Promise that resolves to the Swal result (check result.isConfirmed)
 */
export const showConfirmationAlert = (
  text: string = "Are you sure you want to delete this item?",
  icon: any = "warning",
  confirmButtonText: string = "Yes, delete it!",
  showCancelButton: boolean = true,
  input: any = undefined,
  inputPlaceholder: string = "",
  confirmButtonClass: string = "btn-danger",
): Promise<SweetAlertResult> => {
  return Swal.fire({
    text: translate(text),
    icon: icon,
    input: input,
    inputPlaceholder: translate(inputPlaceholder),
    showCancelButton: showCancelButton,
    confirmButtonText: translate(confirmButtonText),
    cancelButtonText: translate("No, cancel"),
    buttonsStyling: false,
    heightAuto: false,
    customClass: {
      confirmButton: `btn ${confirmButtonClass} mx-2`,
      cancelButton: "btn btn-primary mx-2",
    },
    inputValidator: (value) => {
      if (input === "textarea" && !value) {
        return translate("Reason is required!");
      }
    },
  });
};
