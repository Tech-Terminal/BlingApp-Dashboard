<template>
  <form id="kt_maid_form" class="form" @submit.prevent="submit">
    <!-- Image / Avatar -->
    <div class="fv-row mb-7 text-center">
      <label class="d-block fw-semibold fs-6 my-5">{{
        translate("Avatar")
      }}</label>
      <ImageUpload v-model="formData.image" @uploading="isUploading = $event" />
    </div>

    <!-- Row 1: Name & Email -->
    <div class="row">
      <!-- Name -->
      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label
          class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
        >
          <span class="required">{{ translate("Name") }}</span>
        </label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('name') }"
          v-model="formData.name"
          :placeholder="translate('Enter name')"
          required
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('name')">
          {{ apiValidation.getError("name") }}
        </div>
      </div>

      <!-- Email -->
      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label
          class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
        >
          <span>{{ translate("Email") }}</span>
        </label>
        <input
          type="email"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('email') }"
          v-model="formData.email"
          :placeholder="translate('Enter email')"
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('email')">
          {{ apiValidation.getError("email") }}
        </div>
      </div>
    </div>

    <!-- Row 2: Phone & Identity Document -->
    <div class="row">
      <!-- Phone -->
      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label
          class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
        >
          <span class="required">{{ translate("Phone") }}</span>
        </label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('phone') }"
          v-model="formData.phone"
          :placeholder="translate('Enter phone')"
          required
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('phone')">
          {{ apiValidation.getError("phone") }}
        </div>
      </div>

      <!-- Identity Document (Passport / ID File) -->
      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label
          class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
        >
          <span>{{ translate("Identity Document") }}</span>
        </label>
        <CustomFileUploader
          v-model="formData.idDocument"
          :hasError="apiValidation.hasError('idDocument')"
          @uploading="isUploadingDoc = $event"
        />
        <div
          class="invalid-feedback d-block"
          v-if="apiValidation.hasError('idDocument')"
        >
          {{ apiValidation.getError("idDocument") }}
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
        :data-kt-indicator="
          loading || isUploading || isUploadingDoc ? 'on' : 'off'
        "
        :disabled="loading || isUploading || isUploadingDoc"
      >
        <span class="indicator-label">{{ translate("Submit") }}</span>
        <span class="indicator-progress">
          {{ translate("Please wait...") }}
          <span
            class="spinner-border spinner-border-sm align-middle ms-2"
          ></span>
        </span>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from "vue";
import { translate } from "@/core/helpers/i18n-utils";
import ImageUpload from "@/components/ImageUpload.vue";
import CustomFileUploader from "@/components/inputs/CustomFileUploader.vue";

export default defineComponent({
  name: "MaidForm",
  components: {
    ImageUpload,
    CustomFileUploader,
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
    const isUploading = ref(false);
    const isUploadingDoc = ref(false);

    const formData = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const submit = () => {
      const payload: any = {
        name: formData.value.name?.trim(),
        phone: formData.value.phone?.trim(),
        isActive: Boolean(formData.value.isActive),
      };

      if (formData.value.email?.trim()) {
        payload.email = formData.value.email.trim();
      } else {
        payload.email = null;
      }

      if (formData.value.image) {
        payload.image = formData.value.image;
      } else {
        payload.image = null;
      }

      if (formData.value.idDocument) {
        payload.idDocument = formData.value.idDocument;
      } else {
        payload.idDocument = null;
      }

      emit("submit", payload);
    };

    return {
      formData,
      isUploading,
      isUploadingDoc,
      submit,
      translate,
    };
  },
});
</script>
