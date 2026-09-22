<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
      :initial-values="{ email: '', password: '' }"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3">{{ $translate("Sign In") }}</h1>
        <!--end::Title-->
      </div>
      <!--begin::Heading-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $translate("Email")
        }}</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="email"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block text-danger">
            <ErrorMessage name="email" class="text-danger" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-gray-900 fs-6 mb-0">{{
            $translate("Password")
          }}</label>
          <!--end::Label-->

          <!--begin::Link-->
          <router-link to="/password-reset" class="link-primary fs-6 fw-bold">
            {{ $translate("Forgot Password ?") }}
          </router-link>
          <!--end::Link-->
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <div class="position-relative mb-3">
          <Field
            tabindex="2"
            class="form-control form-control-lg form-control-solid"
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
        <!--end::Input-->
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block text-danger">
            <ErrorMessage name="password" class="text-danger" />
            <div v-if="store.errors.password" class="text-danger mt-1">
              {{ $translate(store.errors.password[0]) }}
            </div>
            <div v-if="store.errors.general" class="text-danger mt-1">
              {{ $translate(store.errors.general[0]) }}
            </div>
            <div v-if="store.errors.message" class="text-danger mt-1">
              {{ $translate(store.errors.message) }}
            </div>
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <!--begin::Submit button-->
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label"> {{ $translate("Continue") }} </span>

          <span class="indicator-progress">
            {{ $translate("Please wait...") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!--end::Submit button-->
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import * as Yup from "yup";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";
import i18n from "@/core/plugins/i18n";

export default defineComponent({
  name: "sign-in",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();
    const router = useRouter();

    const submitButton = ref<HTMLButtonElement | null>(null);

    //Create form validation object
    const login = Yup.object().shape({
      email: Yup.string()
        .email(i18n.global.t("Email must be a valid email"))
        .required(i18n.global.t("Email is a required field"))
        .label("Email"),
      password: Yup.string()
        .min(4, i18n.global.t("Password must be at least 4 characters"))
        .required(i18n.global.t("Password is a required field"))
        .label("Password"),
    });

    //Form submit function
    const onSubmitLogin = async (values: any) => {
      values = values as User;
      // Clear existing errors
      store.logout();

      if (submitButton.value) {
        submitButton.value!.disabled = true;
        // Activate indicator
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      // Send login request
      await store.login(values);
      const error = Object.values(store.errors);

      if (error.length === 0) {
        showSuccessAlert(
          "You have successfully logged in!",
          "Ok, got it!",
        ).then(() => {
          // Go to page after successfully login
          router.push({ name: "dashboard" });
        });
      } else {
        const statusCode = store.errors.statusCode;
        // Only show Swal for internal server errors (500+) or unknown errors,
        // keep validation errors (422, 401, 404) inline.
        if (statusCode && statusCode >= 500) {
          const errorMessage =
            store.errors.message || "An unexpected error occurred.";
          showErrorAlert(errorMessage as string, "Try again!");
        }
      }

      //Deactivate indicator
      submitButton.value?.removeAttribute("data-kt-indicator");

      submitButton.value!.disabled = false;
    };

    const showPassword = ref(false);

    return {
      onSubmitLogin,
      login,
      submitButton,
      getAssetPath,
      showPassword,
      store,
    };
  },
});
</script>
