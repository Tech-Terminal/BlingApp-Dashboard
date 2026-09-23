<template>
  <form id="kt_area_form" class="form" @submit.prevent="submit">
    <!-- Governorate -->
    <div class="row">
      <div class="col-12 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("Governorate") }}</span>
        </label>
        <SearchableSelect
          v-model="formData.governorateId"
          :service="GovernorateService"
          :label="governorateLabel"
          :placeholder="translate('Select Governorate')"
          :initialOption="initialGovernorate"
          :class="{ 'is-invalid': apiValidation.hasError('governorateId') }"
        />
        <div
          class="invalid-feedback"
          v-if="apiValidation.hasError('governorateId')"
          style="display: block"
        >
          {{ apiValidation.getError("governorateId") }}
        </div>
      </div>
    </div>

    <!-- Names -->
    <div class="row">
      <!-- English Name -->
      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("English Name") }}</span>
        </label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('nameEn') }"
          v-model="formData.nameEn"
          :placeholder="translate('Enter English Name')"
          required
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('nameEn')">
          {{ apiValidation.getError("nameEn") }}
        </div>
      </div>

      <!-- Arabic Name -->
      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("Arabic Name") }}</span>
        </label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('nameAr') }"
          v-model="formData.nameAr"
          :placeholder="translate('Enter Arabic Name')"
          required
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('nameAr')">
          {{ apiValidation.getError("nameAr") }}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="text-center pt-15">
      <button type="button" class="btn btn-light me-3" @click="$emit('cancel')">
        {{ translate("Discard") }}
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :data-kt-indicator="loading ? 'on' : 'off'"
        :disabled="loading"
      >
        <span class="indicator-label">{{ translate("Submit") }}</span>
        <span class="indicator-progress">
          {{ translate("Please wait...") }}
          <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
        </span>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import SearchableSelect from "@/components/inputs/SearchableSelect.vue";
import GovernorateService from "@/core/services/GovernorateService";
import { translate } from "@/core/helpers/i18n-utils";
import i18n from "@/core/plugins/i18n";

export default defineComponent({
  name: "AreaForm",
  components: {
    SearchableSelect,
  },
  props: {
    modelValue: {
      type: Object as PropType<any>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    initialGovernorate: {
      type: Object,
      default: null,
    },
    apiValidation: {
      type: Object as PropType<{
        hasError: (f: string) => boolean;
        getError: (f: string) => string;
      }>,
      default: () => ({ hasError: () => false, getError: () => "" }),
    },
  },
  emits: ["update:modelValue", "submit", "cancel"],
  setup(props, { emit }) {
    const formData = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const isArabic = computed(
      () =>
        (i18n.global.locale as any)?.value === "ar" ||
        i18n.global.locale === "ar",
    );

    const governorateLabel = computed(() =>
      isArabic.value ? "nameAr" : "nameEn",
    );

    const submit = () => {
      const payload = {
        governorateId: Number(formData.value.governorateId),
        nameEn: formData.value.nameEn?.trim(),
        nameAr: formData.value.nameAr?.trim(),
      };
      emit("submit", payload);
    };

    return {
      formData,
      submit,
      GovernorateService,
      governorateLabel,
      translate,
    };
  },
});
</script>
