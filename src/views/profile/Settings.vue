<template>
  <!--begin::Navbar-->
  <div class="card mb-5 mb-xl-10">
    <div class="card-body pt-9 pb-0">
      <!--begin::Details-->
      <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
        <!--begin::Info-->
        <div class="flex-grow-1">
          <!--begin::Title-->
          <div
            class="d-flex justify-content-between align-items-start flex-wrap mb-2"
          >
            <!--begin::User-->
            <div class="d-flex flex-column">
              <!--begin::Name-->
              <div class="d-flex align-items-center mb-2">
                <h2 class="text-gray-900 fs-2 fw-bolder me-1">
                  {{ user.name }}
                </h2>
              </div>
              <!--end::Name-->
              <!--begin::Info-->
              <div class="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                <span class="d-flex align-items-center text-gray-400 me-5 mb-2">
                  <KTIcon icon-name="profile-circle" icon-class="fs-4 me-1" />
                  {{ user.role?.name }}
                </span>
              </div>
              <!--end::Info-->
            </div>
            <!--end::User-->
          </div>
          <!--end::Title-->
        </div>
        <!--end::Info-->
      </div>
      <!--end::Details-->

      <!--begin::Navs-->
      <div class="d-flex overflow-auto h-55px">
        <ul
          class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold flex-nowrap"
        >
          <!--begin::Nav item-->
          <li class="nav-item">
            <a
              class="nav-link text-active-primary me-6"
              :class="{ active: activeTab === 'profile' }"
              href="#"
              @click.prevent="setActiveTab('profile')"
            >
              {{ $translate("Change profile data") }}
            </a>
          </li>
          <!--end::Nav item-->
          <!--begin::Nav item-->
          <li class="nav-item">
            <a
              class="nav-link text-active-primary me-6"
              :class="{ active: activeTab === 'email' }"
              href="#"
              @click.prevent="setActiveTab('email')"
            >
              {{ $translate("Email Management") }}
            </a>
          </li>
          <!--end::Nav item-->
          <!--begin::Nav item-->
          <li class="nav-item">
            <a
              class="nav-link text-active-primary me-6"
              :class="{ active: activeTab === 'password' }"
              href="#"
              @click.prevent="setActiveTab('password')"
            >
              {{ $translate("Change password") }}
            </a>
          </li>
          <!--end::Nav item-->
        </ul>
      </div>
      <!--begin::Navs-->
    </div>
  </div>
  <!--end::Navbar-->

  <!--begin::Basic info-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Content-->
    <div class="collapse show">
      <!--begin::Profile Form-->
      <form
        v-if="activeTab === 'profile'"
        @submit.prevent="updateProfile"
        class="form"
      >
        <!--begin::Card body-->
        <div class="card-body p-9">
          <!--begin::Input group-->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label fw-semibold fs-6">{{
              $translate("Avatar")
            }}</label>
            <div class="col-lg-8">
              <ImageUpload
                v-model="profileData.image"
                @uploading="isUploading = $event"
              />
              <div class="form-text">
                {{ $translate("Allowed file types: png, jpg, jpeg.") }}
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">{{
              $translate("Name")
            }}</label>
            <div class="col-lg-8">
              <div class="row">
                <div class="col-lg-12 fv-row">
                  <input
                    type="text"
                    name="name"
                    class="form-control form-control-lg mb-3 mb-lg-0"
                    :class="{
                      'is-invalid': profileValidation.hasError('name'),
                    }"
                    :placeholder="$translate('Full name')"
                    v-model="profileData.name"
                  />
                  <div
                    class="invalid-feedback"
                    v-if="profileValidation.hasError('name')"
                  >
                    {{ profileValidation.getError("name") }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">{{
              $translate("Phone")
            }}</label>
            <div class="col-lg-8">
              <div class="row">
                <div class="col-lg-12 fv-row">
                  <input
                    type="text"
                    name="phone"
                    class="form-control form-control-lg mb-3 mb-lg-0"
                    :class="{
                      'is-invalid': profileValidation.hasError('phone'),
                    }"
                    :placeholder="$translate('Phone number')"
                    v-model="profileData.phone"
                  />
                  <div
                    class="invalid-feedback"
                    v-if="profileValidation.hasError('phone')"
                  >
                    {{ profileValidation.getError("phone") }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">{{
              $translate("Email")
            }}</label>
            <div class="col-lg-8 fv-row">
              <input
                type="text"
                name="email"
                class="form-control form-control-lg"
                :placeholder="$translate('Email address')"
                v-model="profileData.email"
                disabled
              />
            </div>
          </div>
          <!--end::Input group-->
        </div>
        <!--end::Card body-->

        <!--begin::Actions-->
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button
            type="submit"
            id="kt_account_profile_details_submit"
            ref="submitButton1"
            class="btn btn-primary"
          >
            <span class="indicator-label"> {{ $translate("Save") }} </span>
            <span class="indicator-progress">
              {{ $translate("Please wait...") }}
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
        <!--end::Actions-->
      </form>
      <!--end::Profile Form-->

      <!--begin::Email Form-->
      <form
        v-if="activeTab === 'email'"
        @submit.prevent="
          emailStep === 1 ? requestEmailChange() : verifyEmailChange()
        "
        class="form"
      >
        <div class="card-body p-9">
          <!-- Step 1: Request Email Change -->
          <template v-if="emailStep === 1">
            <div class="row mb-6">
              <label
                class="col-lg-4 col-form-label required fw-semobold fs-6"
                >{{ $translate("New Email") }}</label
              >
              <div class="col-lg-8 fv-row">
                <input
                  type="email"
                  dir="rtl"
                  class="form-control form-control-lg"
                  :class="{
                    'is-invalid': emailValidation.hasError('newEmail'),
                  }"
                  :placeholder="$translate('New email address')"
                  v-model="emailData.newEmail"
                />
                <div
                  class="invalid-feedback"
                  v-if="emailValidation.hasError('newEmail')"
                >
                  {{ emailValidation.getError("newEmail") }}
                </div>
              </div>
            </div>
          </template>

          <!-- Step 2: Verify OTP -->
          <template v-if="emailStep === 2">
            <div class="row mb-6">
              <label
                class="col-lg-4 col-form-label required fw-semobold fs-6"
                >{{ $translate("Verification Code") }}</label
              >
              <div class="col-lg-8 fv-row">
                <input
                  type="text"
                  dir="rtl"
                  class="form-control form-control-lg"
                  :class="{ 'is-invalid': emailValidation.hasError('otp') }"
                  :placeholder="$translate('Enter OTP')"
                  v-model="emailData.otp"
                />
                <div
                  class="invalid-feedback"
                  v-if="emailValidation.hasError('otp')"
                >
                  {{ emailValidation.getError("otp") }}
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button
            v-if="emailStep === 2"
            type="button"
            class="btn btn-light btn-active-light-primary me-2"
            @click="emailStep = 1"
          >
            {{ $translate("Cancel") }}
          </button>
          <button type="submit" ref="submitButtonEmail" class="btn btn-primary">
            <span class="indicator-label">
              {{
                emailStep === 1
                  ? $translate("Request Change")
                  : $translate("Verify & Save")
              }}
            </span>
            <span class="indicator-progress">
              {{ $translate("Please wait...") }}
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
      </form>
      <!--end::Email Form-->

      <!--begin::Password Form-->
      <form
        v-if="activeTab === 'password'"
        @submit.prevent="updatePassword"
        class="form"
      >
        <!--begin::Card body-->
        <div class="card-body p-9">
          <!--begin::Input group-->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">{{
              $translate("Current Password")
            }}</label>
            <div class="col-lg-8">
              <div class="fv-row mb-0">
                <div class="position-relative">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    name="oldPassword"
                    class="form-control form-control-lg"
                    :class="{
                      'is-invalid': passwordValidation.hasError('oldPassword'),
                    }"
                    :placeholder="$translate('Current Password')"
                    v-model="passwordData.oldPassword"
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
                <div
                  class="invalid-feedback"
                  v-if="passwordValidation.hasError('oldPassword')"
                  style="display: block"
                >
                  {{ passwordValidation.getError("oldPassword") }}
                </div>
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">{{
              $translate("New Password")
            }}</label>
            <div class="col-lg-8">
              <div class="fv-row mb-0">
                <div class="position-relative">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    name="newPassword"
                    class="form-control form-control-lg"
                    :class="{
                      'is-invalid': passwordValidation.hasError('newPassword'),
                    }"
                    :placeholder="$translate('New Password')"
                    v-model="passwordData.newPassword"
                  />
                  <span
                    class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <i
                      class="bi"
                      :class="
                        showConfirmPassword ? 'bi-eye' : 'bi-eye-slash-fill'
                      "
                    ></i>
                  </span>
                </div>
                <div
                  class="invalid-feedback"
                  v-if="passwordValidation.hasError('newPassword')"
                  style="display: block"
                >
                  {{ passwordValidation.getError("newPassword") }}
                </div>
              </div>
            </div>
          </div>
          <!--end::Input group-->

          <!--begin::Input group-->
          <div class="row mb-6">
            <label class="col-lg-4 col-form-label required fw-semobold fs-6">{{
              $translate("Confirm New Password")
            }}</label>
            <div class="col-lg-8">
              <div class="fv-row mb-0">
                <div class="position-relative">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    name="newPassword_confirmation"
                    class="form-control form-control-lg"
                    :class="{
                      'is-invalid': passwordValidation.hasError(
                        'newPassword_confirmation',
                      ),
                    }"
                    :placeholder="$translate('Confirm New Password')"
                    v-model="passwordData.newPassword_confirmation"
                  />
                </div>
                <div
                  class="invalid-feedback"
                  v-if="passwordValidation.hasError('newPassword_confirmation')"
                  style="display: block"
                >
                  {{ passwordValidation.getError("newPassword_confirmation") }}
                </div>
              </div>
            </div>
          </div>
          <!--end::Input group-->
        </div>
        <!--end::Card body-->

        <!--begin::Actions-->
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button
            type="submit"
            id="kt_account_password_submit"
            ref="submitButton2"
            class="btn btn-primary"
          >
            <span class="indicator-label"> {{ $translate("Save") }} </span>
            <span class="indicator-progress">
              {{ $translate("Please wait...") }}
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
        <!--end::Actions-->
      </form>
      <!--end::Password Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Basic info-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watchEffect } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import ApiService from "@/core/services/ApiService";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";
import { getAssetPath } from "@/core/helpers/assets";
import i18n from "@/core/plugins/i18n";
import { useRouter } from "vue-router";
import { useApiValidation } from "@/core/composables/useApiValidation";
import ImageUpload from "@/components/ImageUpload.vue";

export default defineComponent({
  name: "account-settings",
  components: {
    ImageUpload,
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const { user } = storeToRefs(authStore);
    const activeTab = ref("profile");
    const submitButton1 = ref<HTMLButtonElement | null>(null);
    const submitButton2 = ref<HTMLButtonElement | null>(null);

    const profileData = ref({
      name: "",
      phone: "",
      email: "",
      image: null as any,
    });

    const passwordData = ref({
      oldPassword: "",
      newPassword: "",
      newPassword_confirmation: "",
    });

    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    const profileValidation = useApiValidation();
    const emailValidation = useApiValidation();
    const passwordValidation = useApiValidation();

    onMounted(() => {
      if (user.value) {
        profileData.value.name = user.value.name;
        profileData.value.phone = (user.value as any).phone || "";
        profileData.value.email = user.value.email;
        profileData.value.image = (user.value as any).image;
      }
    });

    const isUploading = ref(false);

    const setActiveTab = (tab: string) => {
      activeTab.value = tab;
    };

    const updateProfile = async () => {
      profileValidation.clearErrors();
      if (submitButton1.value) {
        submitButton1.value.setAttribute("data-kt-indicator", "on");
        submitButton1.value.disabled = true;
      }

      const payload: any = {
        name: profileData.value.name,
      };
      if (profileData.value.phone) {
        payload.phone = profileData.value.phone;
      }
      if (profileData.value.image) {
        payload.image = profileData.value.image;
      }

      try {
        const { data } = await ApiService.vueInstance.axios.patch(
          "admins/me",
          payload,
        );
        profileValidation.clearErrors();
        authStore.setAuth({ ...user.value, ...data });
        showSuccessAlert(
          i18n.global.t("Your Profile has been updated successfully"),
        );
      } catch (error: any) {
        profileValidation.setErrors(error);
        if (error.response?.status !== 422) {
          const response = error.response;
          console.error(response);
          const message = Array.isArray(response?.data?.message)
            ? response.data.message[0]
            : response?.data?.message;
          showErrorAlert(
            message
              ? i18n.global.t(message)
              : i18n.global.t("Error updating profile"),
          );
        }
      } finally {
        if (submitButton1.value) {
          submitButton1.value.removeAttribute("data-kt-indicator");
          submitButton1.value.disabled = false;
        }
      }
    };

    const updatePassword = () => {
      passwordValidation.clearErrors();
      if (
        passwordData.value.newPassword !==
        passwordData.value.newPassword_confirmation
      ) {
        passwordValidation.errors.value = {
          newPassword_confirmation: [i18n.global.t("Passwords must match")],
        };
        return;
      }

      if (submitButton2.value) {
        submitButton2.value.setAttribute("data-kt-indicator", "on");
        submitButton2.value.disabled = true;
      }

      ApiService.vueInstance.axios
        .patch("admins/me/password", {
          oldPassword: passwordData.value.oldPassword,
          newPassword: passwordData.value.newPassword,
        })
        .then(() => {
          passwordValidation.clearErrors();
          showSuccessAlert(
            i18n.global.t("Your Password has been updated successfully"),
          );
          passwordData.value.oldPassword = "";
          passwordData.value.newPassword = "";
          passwordData.value.newPassword_confirmation = "";
        })
        .catch((error) => {
          passwordValidation.setErrors(error);
          if (error.response?.status !== 422) {
            const response = error.response;
            console.error(response);
            const message = Array.isArray(response?.data?.message)
              ? response.data.message[0]
              : response?.data?.message;
            showErrorAlert(
              message
                ? i18n.global.t(message)
                : i18n.global.t("Error updating password"),
            );
          }
        })
        .finally(() => {
          if (submitButton2.value) {
            submitButton2.value.removeAttribute("data-kt-indicator");
            submitButton2.value.disabled = false;
          }
        });
    };

    const emailStep = ref(1);
    const emailData = ref({
      newEmail: "",
      otp: "",
    });
    const submitButtonEmail = ref<HTMLButtonElement | null>(null);

    const requestEmailChange = () => {
      emailValidation.clearErrors();
      if (submitButtonEmail.value) {
        submitButtonEmail.value.setAttribute("data-kt-indicator", "on");
        submitButtonEmail.value.disabled = true;
      }

      ApiService.vueInstance.axios
        .post("admins/me/email/request", { newEmail: emailData.value.newEmail })
        .then(() => {
          emailValidation.clearErrors();
          showSuccessAlert(
            i18n.global.t("OTP sent successfully to the new email address."),
          );
          emailStep.value = 2;
        })
        .catch((error) => {
          emailValidation.setErrors(error);
          if (error.response?.status !== 422) {
            const response = error.response;
            const message = Array.isArray(response?.data?.message)
              ? response.data.message[0]
              : response?.data?.message;
            showErrorAlert(
              message
                ? i18n.global.t(message)
                : i18n.global.t("Failed to request email change"),
            );
          }
        })
        .finally(() => {
          if (submitButtonEmail.value) {
            submitButtonEmail.value.removeAttribute("data-kt-indicator");
            submitButtonEmail.value.disabled = false;
          }
        });
    };

    const verifyEmailChange = () => {
      emailValidation.clearErrors();
      if (submitButtonEmail.value) {
        submitButtonEmail.value.setAttribute("data-kt-indicator", "on");
        submitButtonEmail.value.disabled = true;
      }

      ApiService.vueInstance.axios
        .patch("admins/me/email/verify", { otp: emailData.value.otp })
        .then(() => {
          emailValidation.clearErrors();
          showSuccessAlert(
            i18n.global.t("Email updated successfully. Please sign in again."),
          );
          authStore.logout();
          router.push({ name: "sign-in" });
        })
        .catch((error) => {
          emailValidation.setErrors(error);
          if (error.response?.status !== 422) {
            const response = error.response;
            const message = Array.isArray(response?.data?.message)
              ? response.data.message[0]
              : response?.data?.message;
            showErrorAlert(
              message
                ? i18n.global.t(message)
                : i18n.global.t("Invalid or expired OTP."),
            );
          }
        })
        .finally(() => {
          if (submitButtonEmail.value) {
            submitButtonEmail.value.removeAttribute("data-kt-indicator");
            submitButtonEmail.value.disabled = false;
          }
        });
    };

    return {
      user,
      activeTab,
      setActiveTab,
      profileData,
      passwordData,
      updateProfile,
      updatePassword,
      submitButton1,
      submitButton2,
      getAssetPath,
      showPassword,
      showConfirmPassword,
      isUploading,
      emailStep,
      emailData,
      submitButtonEmail,
      requestEmailChange,
      verifyEmailChange,
      profileValidation,
      emailValidation,
      passwordValidation,
    };
  },
});
</script>
