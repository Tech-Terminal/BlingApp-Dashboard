import Swal from "sweetalert2";

class AlertService {
  /**
   * Show a success message with a timer and no confirm button.
   * @param text The message to display
   * @param title Optional title (defaults to "Success!")
   */
  public static success(
    text: string,
    title: string = "Success!",
  ): Promise<any> {
    return Swal.fire({
      text: text,
      icon: "success",
      title: title,
      showConfirmButton: false,
      timer: 2000,
      buttonsStyling: false,
      heightAuto: false,
      customClass: {
        confirmButton: "btn btn-primary",
      },
    });
  }

  /**
   * Show an error message.
   * @param text The message to display
   * @param title Optional title (defaults to "Error!")
   */
  public static error(text: string, title: string = "Error!"): Promise<any> {
    return Swal.fire({
      text: text,
      icon: "error",
      title: title,
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      heightAuto: false,
      customClass: {
        confirmButton: "btn btn-danger",
      },
    });
  }
}

export default AlertService;
