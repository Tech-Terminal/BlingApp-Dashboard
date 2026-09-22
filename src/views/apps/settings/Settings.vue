<template>
  <div class="card mb-5 mb-xl-10">
    <div class="card-header border-0">
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">{{ translate("System Settings") }}</h3>
      </div>
    </div>

    <div class="card-body pt-0">
      <!--begin::Navs-->
      <ul
        class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold"
      >
        <!--begin::Nav item-->
        <li class="nav-item mt-2">
          <a
            class="nav-link text-active-primary ms-0 me-10 py-5 active"
            data-bs-toggle="tab"
            href="#kt_settings_social"
          >
            {{ translate("Social Links") }}
          </a>
        </li>
        <!--end::Nav item-->
        <!--begin::Nav item-->
        <li class="nav-item mt-2">
          <a
            class="nav-link text-active-primary ms-0 me-10 py-5"
            data-bs-toggle="tab"
            href="#kt_settings_contact"
          >
            {{ translate("Contact Details") }}
          </a>
        </li>
        <!--end::Nav item-->
      </ul>
      <!--begin::Navs-->

      <form class="form" @submit.prevent="saveSettings">
        <div v-if="loading" class="text-center py-20">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ translate("Loading...") }}</span>
          </div>
        </div>

        <div v-else class="tab-content pt-10">
          <!--begin::Tab panel (Social Links)-->
          <div
            class="tab-pane fade show active"
            id="kt_settings_social"
            role="tabpanel"
          >
            <div class="row">
              <!--begin::Col-->
              <div class="col-md-6 d-flex flex-column mb-7 fv-row">
                <label
                  class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
                >
                  <span>{{ translate("Facebook URL") }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': validation.hasError('facebook_url') }"
                  :placeholder="translate('Enter Facebook URL')"
                  v-model="settings.facebook_url"
                />
                <div
                  class="invalid-feedback"
                  v-if="validation.hasError('facebook_url')"
                >
                  {{ validation.getError("facebook_url") }}
                </div>
              </div>
              <!--end::Col-->
              <!--begin::Col-->
              <div class="col-md-6 d-flex flex-column mb-7 fv-row">
                <label
                  class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
                >
                  <span>{{ translate("Twitter URL") }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': validation.hasError('twitter_url') }"
                  :placeholder="translate('Enter Twitter URL')"
                  v-model="settings.twitter_url"
                />
                <div
                  class="invalid-feedback"
                  v-if="validation.hasError('twitter_url')"
                >
                  {{ validation.getError("twitter_url") }}
                </div>
              </div>
              <!--end::Col-->
            </div>

            <div class="row">
              <!--begin::Col-->
              <div class="col-md-6 d-flex flex-column mb-7 fv-row">
                <label
                  class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
                >
                  <span>{{ translate("Instagram URL") }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid': validation.hasError('instagram_url'),
                  }"
                  :placeholder="translate('Enter Instagram URL')"
                  v-model="settings.instagram_url"
                />
                <div
                  class="invalid-feedback"
                  v-if="validation.hasError('instagram_url')"
                >
                  {{ validation.getError("instagram_url") }}
                </div>
              </div>
              <!--end::Col-->
              <!--begin::Col-->
              <div class="col-md-6 d-flex flex-column mb-7 fv-row">
                <label
                  class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
                >
                  <span>{{ translate("LinkedIn URL") }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': validation.hasError('linkedin_url') }"
                  :placeholder="translate('Enter LinkedIn URL')"
                  v-model="settings.linkedin_url"
                />
                <div
                  class="invalid-feedback"
                  v-if="validation.hasError('linkedin_url')"
                >
                  {{ validation.getError("linkedin_url") }}
                </div>
              </div>
              <!--end::Col-->
            </div>

            <div class="row">
              <!--begin::Col-->
              <div class="col-md-6 d-flex flex-column mb-7 fv-row">
                <label
                  class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
                >
                  <span>{{ translate("YouTube URL") }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': validation.hasError('youtube_url') }"
                  :placeholder="translate('Enter YouTube URL')"
                  v-model="settings.youtube_url"
                />
                <div
                  class="invalid-feedback"
                  v-if="validation.hasError('youtube_url')"
                >
                  {{ validation.getError("youtube_url") }}
                </div>
              </div>
              <!--end::Col-->
              <!--begin::Col-->
              <div class="col-md-6 d-flex flex-column mb-7 fv-row">
                <label
                  class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
                >
                  <span>{{ translate("Telegram URL") }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': validation.hasError('telegram_url') }"
                  :placeholder="translate('Enter Telegram URL')"
                  v-model="settings.telegram_url"
                />
                <div
                  class="invalid-feedback"
                  v-if="validation.hasError('telegram_url')"
                >
                  {{ validation.getError("telegram_url") }}
                </div>
              </div>
              <!--end::Col-->
            </div>

            <div class="row">
              <!--begin::Col-->
              <div class="col-md-6 d-flex flex-column mb-7 fv-row">
                <label
                  class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
                >
                  <span>{{ translate("TikTok URL") }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': validation.hasError('tiktok_url') }"
                  :placeholder="translate('Enter TikTok URL')"
                  v-model="settings.tiktok_url"
                />
                <div
                  class="invalid-feedback"
                  v-if="validation.hasError('tiktok_url')"
                >
                  {{ validation.getError("tiktok_url") }}
                </div>
              </div>
              <!--end::Col-->
            </div>
          </div>
          <!--end::Tab panel-->

          <!--begin::Tab panel (Contact Details)-->
          <div class="tab-pane fade" id="kt_settings_contact" role="tabpanel">
            <div class="row">
              <!--begin::Col-->
              <div class="col-md-6 d-flex flex-column mb-7 fv-row">
                <label
                  class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
                >
                  <span>{{ translate("Contact Email") }}</span>
                </label>
                <input
                  type="email"
                  class="form-control"
                  :class="{
                    'is-invalid': validation.hasError('contact_email'),
                  }"
                  :placeholder="translate('Enter Contact Email')"
                  v-model="settings.contact_email"
                />
                <div
                  class="invalid-feedback"
                  v-if="validation.hasError('contact_email')"
                >
                  {{ validation.getError("contact_email") }}
                </div>
              </div>
              <!--end::Col-->
              <!--begin::Col-->
              <div class="col-md-6 d-flex flex-column mb-7 fv-row">
                <label
                  class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
                >
                  <span>{{ translate("Contact Phone") }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{
                    'is-invalid': validation.hasError('contact_phone'),
                  }"
                  :placeholder="translate('Enter Contact Phone')"
                  v-model="settings.contact_phone"
                />
                <div
                  class="invalid-feedback"
                  v-if="validation.hasError('contact_phone')"
                >
                  {{ validation.getError("contact_phone") }}
                </div>
              </div>
              <!--end::Col-->
            </div>

            <div class="row">
              <!--begin::Col-->
              <div class="col-md-12 d-flex flex-column mb-7 fv-row">
                <label
                  class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
                >
                  <span>{{ translate("Address") }}</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': validation.hasError('address') }"
                  :placeholder="translate('Enter Address')"
                  v-model="settings.address"
                />
                <div
                  class="invalid-feedback"
                  v-if="validation.hasError('address')"
                >
                  {{ validation.getError("address") }}
                </div>
              </div>
              <!--end::Col-->
            </div>
          </div>
          <!--end::Tab panel-->
        </div>

        <div class="card-footer d-flex justify-content-end py-6 px-9 border-0">
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="!saving">{{ translate("Save Changes") }}</span>
            <span v-else>
              {{ translate("Please wait...") }}
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import SettingService from "@/core/services/SettingService";
import { translate } from "@/core/helpers/i18n-utils";
import { showErrorAlert, showSuccessAlert } from "@/core/helpers/alert-utils";
import { useApiValidation } from "@/core/composables/useApiValidation";

export default defineComponent({
  name: "system-settings",
  setup() {
    const loading = ref(true);
    const saving = ref(false);
    const validation = useApiValidation();
    const settings = ref<any>({
      facebook_url: "",
      twitter_url: "",
      instagram_url: "",
      linkedin_url: "",
      youtube_url: "",
      telegram_url: "",
      tiktok_url: "",
      contact_email: "",
      contact_phone: "",
      address: "",
    });

    const fetchSettings = () => {
      loading.value = true;
      SettingService.getAll()
        .then((response) => {
          const rawSettingsArray = response.data.data || response.data || [];

          // Convert array of {key, value} to an object mapping
          const rawSettingsObj = {};
          rawSettingsArray.forEach((item) => {
            rawSettingsObj[item.key] = item.value;
          });

          Object.keys(settings.value).forEach((key) => {
            if (rawSettingsObj[key] !== undefined) {
              settings.value[key] = rawSettingsObj[key];
            }
          });
        })
        .catch(() => {
          showErrorAlert(translate("Failed to load settings."));
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const saveSettings = () => {
      saving.value = true;
      validation.clearErrors();

      // Convert settings object back to array format expected by backend
      const settingsArray = Object.keys(settings.value).map((key) => ({
        key: key,
        value: settings.value[key],
      }));

      SettingService.update({ settings: settingsArray })
        .then(() => {
          showSuccessAlert(translate("Settings updated successfully!"));
        })
        .catch((error: any) => {
          validation.setErrors(error);

          // Map backend nested array errors (e.g., "settings.7.value") back to setting keys (e.g., "contact_email")
          const mappedErrors: Record<string, string[]> = {};
          const keysOrder = Object.keys(settings.value);

          Object.entries(validation.errors.value).forEach(
            ([errKey, messages]) => {
              const match = errKey.match(/^settings\.(\d+)\.value$/);
              if (match) {
                const index = parseInt(match[1]);
                const settingsKey = keysOrder[index];
                if (settingsKey) {
                  mappedErrors[settingsKey] = messages;
                }
              } else {
                mappedErrors[errKey] = messages;
              }
            },
          );
          validation.errors.value = mappedErrors;

          if (error.response?.status !== 422) {
            showErrorAlert(translate("Failed to update settings."));
          }
        })
        .finally(() => {
          saving.value = false;
        });
    };

    onMounted(() => {
      fetchSettings();
    });

    return {
      settings,
      loading,
      saving,
      saveSettings,
      translate,
      validation,
    };
  },
});
</script>
