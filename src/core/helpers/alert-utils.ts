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

export interface ConfirmationAlertOptions {
  title?: string;
  text?: string;
  html?: string;
  icon?: "warning" | "error" | "success" | "info" | "question";
  iconHtml?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  showCancelButton?: boolean;
  reverseButtons?: boolean;
  input?: any;
  inputPlaceholder?: string;
}

const getConfirmationIconHtml = (type: string) => {
  switch (type) {
    case "error":
    case "danger":
      return `<div class="d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 76px; height: 76px; border-radius: 50%; background-color: rgba(241, 65, 108, 0.12);">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#f1416c"/>
        </svg>
      </div>`;
    case "warning":
      return `<div class="d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 76px; height: 76px; border-radius: 50%; background-color: rgba(246, 192, 0, 0.12);">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#f6c000"/>
        </svg>
      </div>`;
    case "success":
      return `<div class="d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 76px; height: 76px; border-radius: 50%; background-color: rgba(80, 205, 137, 0.12);">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#50cd89"/>
        </svg>
      </div>`;
    case "info":
    case "question":
    default:
      return `<div class="d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 76px; height: 76px; border-radius: 50%; background-color: rgba(0, 158, 247, 0.12);">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" fill="#009ef7"/>
        </svg>
      </div>`;
  }
};

/**
 * Show a confirmation alert (e.g., for deletion, deactivation, status change)
 */
export const showConfirmationAlert = (
  optionsOrTitle: string | ConfirmationAlertOptions = "Are you sure you want to delete this item?",
  descriptionOrIcon: any = "warning",
  confirmButtonText?: string,
  showCancelButton: boolean = true,
  input: any = undefined,
  inputPlaceholder: string = "",
  confirmButtonClass?: string,
): Promise<SweetAlertResult> => {
  let title = "";
  let text = "";
  let html = "";
  let iconType = "warning";
  let iconHtml = "";
  let confirmText = "";
  let cancelText = "Cancel";
  let confirmClass = "btn-danger";
  let cancelClass = "btn-light";
  let hasCancel = true;
  let reverseBtns = false;
  let inputType = input;
  let placeholder = inputPlaceholder;

  if (typeof optionsOrTitle === "object" && optionsOrTitle !== null) {
    const opts = optionsOrTitle;
    title = opts.title ? translate(opts.title) : "";
    text = opts.text ? translate(opts.text) : "";
    html = opts.html || "";
    iconType = opts.icon || "warning";
    iconHtml = opts.iconHtml || getConfirmationIconHtml(iconType);
    confirmText = opts.confirmButtonText
      ? translate(opts.confirmButtonText)
      : translate("Confirm");
    cancelText = opts.cancelButtonText
      ? translate(opts.cancelButtonText)
      : translate("Cancel");
    confirmClass = opts.confirmButtonClass || "btn-primary";
    cancelClass = opts.cancelButtonClass || "btn-light";
    hasCancel = opts.showCancelButton !== undefined ? opts.showCancelButton : true;
    reverseBtns = opts.reverseButtons || false;
    inputType = opts.input;
    placeholder = opts.inputPlaceholder || "";
  } else {
    // Positional arguments
    const isStandardIcon = [
      "warning",
      "error",
      "danger",
      "success",
      "info",
      "question",
    ].includes(descriptionOrIcon);

    if (isStandardIcon) {
      title = translate("Are you sure?");
      text = translate(optionsOrTitle);
      iconType = descriptionOrIcon === "danger" ? "error" : descriptionOrIcon;
    } else if (descriptionOrIcon && typeof descriptionOrIcon === "string") {
      title = translate(optionsOrTitle);
      text = translate(descriptionOrIcon);
      const lower = (optionsOrTitle + " " + descriptionOrIcon).toLowerCase();
      if (lower.includes("delete") || lower.includes("حذف")) {
        iconType = "error";
      } else if (lower.includes("activate") || lower.includes("تفعيل")) {
        iconType = "success";
      } else {
        iconType = "warning";
      }
    } else {
      title = translate("Are you sure?");
      text = translate(optionsOrTitle);
      iconType = "warning";
    }

    const lower = (title + " " + text).toLowerCase();
    const isDelete = lower.includes("delete") || lower.includes("حذف");
    const isActivate = lower.includes("activate") || lower.includes("تفعيل");
    const isDeactivate = lower.includes("deactivate") || lower.includes("تعطيل");

    if (confirmButtonText) {
      confirmText = translate(confirmButtonText);
    } else if (isDelete) {
      confirmText = translate("Yes, delete");
    } else if (isDeactivate) {
      confirmText = translate("Yes, deactivate");
    } else if (isActivate) {
      confirmText = translate("Yes, activate");
    } else {
      confirmText = translate("Confirm");
    }

    if (confirmButtonClass) {
      confirmClass = confirmButtonClass;
    } else if (isDelete) {
      confirmClass = "btn-danger";
    } else if (isDeactivate) {
      confirmClass = "btn-warning";
    } else if (isActivate) {
      confirmClass = "btn-success";
    } else {
      confirmClass = "btn-primary";
    }

    cancelText = translate("Cancel");
    cancelClass = "btn-light";
    hasCancel = showCancelButton;
    iconHtml = getConfirmationIconHtml(iconType);
  }

  return Swal.fire({
    title: title
      ? `<div class="fs-4 fw-bolder text-gray-900 mt-1">${title}</div>`
      : undefined,
    html:
      html ||
      (text
        ? `<div class="fs-6 fw-normal text-gray-600 mt-2 mb-2" style="line-height: 1.6; max-width: 420px; margin: 0 auto;">${text}</div>`
        : undefined),
    iconHtml: iconHtml,
    input: inputType,
    inputPlaceholder: translate(placeholder),
    showCancelButton: hasCancel,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    heightAuto: false,
    reverseButtons: reverseBtns,
    customClass: {
      popup: "swal2-metronic-popup rounded-4 p-8 shadow-lg",
      icon: "border-0 bg-transparent m-0 p-0",
      actions: "d-flex align-items-center justify-content-center gap-3 mt-4",
      confirmButton: `btn ${confirmClass} fw-bold px-6 py-3`,
      cancelButton: `btn ${cancelClass} fw-bold px-6 py-3`,
    },
    inputValidator: (value) => {
      if (inputType === "textarea" && !value) {
        return translate("Reason is required!");
      }
    },
  });
};
