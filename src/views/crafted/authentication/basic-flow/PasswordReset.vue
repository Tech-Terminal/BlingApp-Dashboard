<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--Step 1: Forgot Password (Email)-->
    <VForm
      v-if="currentStep === 1"
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      @submit="onSubmitEmail"
      id="kt_login_password_reset_form"
      :validation-schema="emailSchema"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3">
          {{ $translate("Forgot Password ?") }}
        </h1>
        <div class="text-gray-500 fw-semibold fs-4">
          {{ $translate("Enter your email to reset your password.") }}
        </div>
      </div>
      <!--end::Heading-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6">{{
          $translate("Email")
        }}</label>
        <Field
          class="form-control form-control-solid"
          type="email"
          placeholder=""
          name="email"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block text-danger">
            <ErrorMessage name="email" class="text-danger" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="submit"
          ref="submitButton"
          class="btn btn-lg btn-primary fw-bold me-4"
        >
          <span class="indicator-label"> {{ $translate("Submit") }} </span>
          <span class="indicator-progress">
            {{ $translate("Please wait...") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>

        <router-link
          to="/sign-in"
          class="btn btn-lg btn-light-primary fw-bold"
          >{{ $translate("Cancel") }}</router-link
        >
      </div>
      <!--end::Actions-->
    </VForm>

    <!--Step 2: Verify Code (OTP)-->
    <div v-if="currentStep === 2" class="form w-100">
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3">
          {{ $translate("Verify Your Email") }}
        </h1>
        <div class="text-gray-500 fw-semibold fs-4">
          {{ $translate("Enter the 6-digit code sent to") }} <br />
          <b class="text-gray-900">{{ email }}</b>
        </div>
      </div>

      <div class="fv-row mb-10">
        <label
          class="form-label fw-bold text-gray-900 fs-6 d-block text-center"
          >{{ $translate("Verification Code") }}</label
        >
        <div
          class="d-flex justify-content-center gap-3"
          dir="ltr"
          style="direction: ltr"
        >
          <input
            v-for="(_, i) in otpDigits"
            :key="i"
            :ref="(el) => setOtpRef(el, i)"
            v-model="otpDigits[i]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="form-control form-control-solid text-center fw-bold fs-2 otp-box"
            autocomplete="off"
            @input="onOtpInput(i)"
            @keydown="onOtpKeydown($event, i)"
            @paste="onOtpPaste($event)"
          />
        </div>
        <div v-if="otpError" class="text-danger text-center mt-2 fw-semibold">
          {{ otpError }}
        </div>
      </div>

      <div class="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="button"
          ref="submitButton"
          class="btn btn-lg btn-primary fw-bold me-4"
          @click="onVerifyOtp"
        >
          <span class="indicator-label"> {{ $translate("Verify") }} </span>
          <span class="indicator-progress">
            {{ $translate("Please wait...") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>

        <button
          type="button"
          @click="onResendCode"
          class="btn btn-lg btn-light-primary fw-bold"
        >
          {{ $translate("Resend Code") }}
        </button>
      </div>

      <div class="text-center mt-10">
        <a
          href="#"
          @click.prevent="currentStep = 1"
          class="link-primary fw-bold"
          >{{ $translate("Back to Email") }}</a
        >
      </div>
    </div>

    <!--Step 3: Reset Password-->
    <VForm
      v-if="currentStep === 3"
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      @submit="onResetPassword"
      :validation-schema="resetSchema"
    >
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3">
          {{ $translate("Setup New Password") }}
        </h1>
        <div class="text-gray-500 fw-semibold fs-4">
          {{
            $translate(
              "Enhance your account security by picking a strong password.",
            )
          }}
        </div>
      </div>

      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6">{{
          $translate("New Password")
        }}</label>
        <div class="position-relative">
          <Field
            class="form-control form-control-solid"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            autocomplete="off"
          />
          <span
            class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
            @click="showPassword = !showPassword"
          >
            <i
              class="bi"
              :class="showPassword ? 'bi-eye' : 'bi-eye-slash-fill'"
            ></i>
          </span>
        </div>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block text-danger">
            <ErrorMessage name="password" class="text-danger" />
          </div>
        </div>
      </div>

      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-gray-900 fs-6">{{
          $translate("Confirm Password")
        }}</label>
        <div class="position-relative">
          <Field
            class="form-control form-control-solid"
            :type="showConfirmPassword ? 'text' : 'password'"
            name="password_confirmation"
            autocomplete="off"
          />
          <span
            class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <i
              class="bi"
              :class="showConfirmPassword ? 'bi-eye' : 'bi-eye-slash-fill'"
            ></i>
          </span>
        </div>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block text-danger">
            <ErrorMessage name="password_confirmation" class="text-danger" />
          </div>
        </div>
      </div>

      <div class="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="submit"
          ref="submitButton"
          class="btn btn-lg btn-primary fw-bold me-4"
        >
          <span class="indicator-label">
            {{ $translate("Reset Password") }}
          </span>
          <span class="indicator-progress">
            {{ $translate("Please wait...") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </VForm>
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { defineComponent, ref, reactive, nextTick } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore } from "@/stores/auth";
import * as Yup from "yup";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";
import { useRouter } from "vue-router";
import i18n from "@/core/plugins/i18n";

export default defineComponent({
  name: "password-reset",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();
    const router = useRouter();

    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    const currentStep = ref(1);
    const email = ref("");
    const code = ref("");
    const submitButton = ref<HTMLButtonElement | null>(null);
    const otpError = ref("");

    // 6 individual digit boxes
    const otpDigits = reactive<string[]>(["", "", "", "", "", ""]);
    const otpRefs = ref<(HTMLInputElement | null)[]>([
      null,
      null,
      null,
      null,
      null,
      null,
    ]);

    const setOtpRef = (el: any, i: number) => {
      otpRefs.value[i] = el as HTMLInputElement | null;
    };

    const onOtpInput = (i: number) => {
      // Keep only the last digit and strip non-numerics
      const val = otpDigits[i].replace(/\D/g, "").slice(-1);
      otpDigits[i] = val;
      if (val && i < 5) {
        nextTick(() => otpRefs.value[i + 1]?.focus());
      }
    };

    const onOtpKeydown = (e: KeyboardEvent, i: number) => {
      if (e.key === "Backspace") {
        if (otpDigits[i]) {
          otpDigits[i] = "";
        } else if (i > 0) {
          nextTick(() => otpRefs.value[i - 1]?.focus());
        }
      } else if (e.key === "ArrowLeft" && i > 0) {
        otpRefs.value[i - 1]?.focus();
      } else if (e.key === "ArrowRight" && i < 5) {
        otpRefs.value[i + 1]?.focus();
      }
    };

    const onOtpPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const pasted =
        e.clipboardData?.getData("text").replace(/\D/g, "").slice(0, 6) ?? "";
      pasted.split("").forEach((char, idx) => {
        if (idx < 6) otpDigits[idx] = char;
      });
      const focusIdx = Math.min(pasted.length, 5);
      nextTick(() => otpRefs.value[focusIdx]?.focus());
    };

    // Validation Schemas
    const emailSchema = Yup.object().shape({
      email: Yup.string()
        .email(i18n.global.t("Email must be a valid email"))
        .required(i18n.global.t("Email is a required field"))
        .label("Email"),
    });

    const resetSchema = Yup.object().shape({
      password: Yup.string()
        .required(i18n.global.t("Password is a required field"))
        .min(8, i18n.global.t("Password must be at least 8 characters long"))
        .label("Password"),
      password_confirmation: Yup.string()
        .required(i18n.global.t("Password Confirmation is a required field"))
        .oneOf([Yup.ref("password")], i18n.global.t("Passwords must match"))
        .label("Password Confirmation"),
    });

    const onSubmitEmail = async (values: any) => {
      if (!submitButton.value) return;

      submitButton.value.disabled = true;
      submitButton.value.setAttribute("data-kt-indicator", "on");

      try {
        await store.forgotPassword(values.email);
        email.value = values.email;
        currentStep.value = 2;
        showSuccessAlert(
          i18n.global.t("Reset code sent to your email."),
          i18n.global.t("Great!"),
        );
        nextTick(() => otpRefs.value[0]?.focus());
      } catch (error: any) {
        const errors = store.errors as any;
        const message =
          errors.message || Object.values(errors)[0] || "Something went wrong";
        showErrorAlert(message as string, "Try again!");
      } finally {
        submitButton.value?.removeAttribute("data-kt-indicator");
        submitButton.value!.disabled = false;
      }
    };

    const onVerifyOtp = async () => {
      const assembled = otpDigits.join("");
      if (assembled.length < 6) {
        otpError.value = i18n.global.t("Please enter all 6 digits.");
        return;
      }
      otpError.value = "";

      if (!submitButton.value) return;
      submitButton.value.disabled = true;
      submitButton.value.setAttribute("data-kt-indicator", "on");

      try {
        await store.verifyOtp(email.value, assembled);
        code.value = assembled;
        currentStep.value = 3;
        showSuccessAlert(
          i18n.global.t("Code verified successfully."),
          i18n.global.t("Proceed!"),
        );
      } catch (error: any) {
        const errors = store.errors as any;
        const message =
          errors.message ||
          (Object.values(errors).length > 0
            ? Object.values(errors)[0]
            : i18n.global.t("Invalid code"));
        showErrorAlert(message as string, i18n.global.t("Try again!"));
      } finally {
        submitButton.value?.removeAttribute("data-kt-indicator");
        submitButton.value!.disabled = false;
      }
    };

    const onResetPassword = async (values: any) => {
      if (!submitButton.value) return;

      submitButton.value.disabled = true;
      submitButton.value.setAttribute("data-kt-indicator", "on");

      try {
        await store.resetPassword({
          email: email.value,
          otp: code.value,
          newPassword: values.password,
        });
        showSuccessAlert(
          i18n.global.t("Password reset successfully. You can now login."),
          i18n.global.t("Success!"),
        );
        router.push({ name: "sign-in" });
      } catch (error: any) {
        const errors = store.errors as any;
        let message = i18n.global.t("Failed to reset password");
        if (errors.message) {
          message = Array.isArray(errors.message)
            ? errors.message[0]
            : errors.message;
        } else if (Object.values(errors).length > 0) {
          message = Object.values(errors)[0] as string;
        }
        showErrorAlert(message, i18n.global.t("Try again!"));
      } finally {
        submitButton.value?.removeAttribute("data-kt-indicator");
        submitButton.value!.disabled = false;
      }
    };

    const onResendCode = async () => {
      try {
        await store.resendOtp(email.value);
        showSuccessAlert(
          i18n.global.t("Reset code resent to your email."),
          i18n.global.t("Sent!"),
        );
      } catch (error: any) {
        const errors = store.errors as any;
        const message =
          errors.message || i18n.global.t("Failed to resend code");
        showErrorAlert(message as string, i18n.global.t("Wait a bit"));
      }
    };

    return {
      currentStep,
      email,
      otpDigits,
      otpError,
      setOtpRef,
      onOtpInput,
      onOtpKeydown,
      onOtpPaste,
      onSubmitEmail,
      onVerifyOtp,
      onResetPassword,
      onResendCode,
      emailSchema,
      resetSchema,
      submitButton,
      showPassword,
      showConfirmPassword,
    };
  },
});
</script>

<style scoped>
.otp-box {
  width: 52px;
  height: 60px;
  padding: 0;
  font-size: 1.5rem !important;
  border-radius: 8px;
}
</style>
