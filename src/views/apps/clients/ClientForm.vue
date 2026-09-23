<template>
  <form id="kt_client_form" class="form" @submit.prevent="submit">
    <!-- Name, Phone & Email in a single row (3 columns) -->
    <div class="row">
      <!-- Name -->
      <div class="col-md-4 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("Name") }}</span>
        </label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('name') }"
          v-model="formData.name"
          :placeholder="translate('Enter client name')"
          required
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('name')">
          {{ apiValidation.getError("name") }}
        </div>
      </div>

      <!-- Phone -->
      <div class="col-md-4 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("Phone") }}</span>
        </label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('phone') }"
          v-model="formData.phone"
          :placeholder="translate('Enter client phone')"
          required
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('phone')">
          {{ apiValidation.getError("phone") }}
        </div>
      </div>

      <!-- Email -->
      <div class="col-md-4 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span>{{ translate("Email") }}</span>
        </label>
        <input
          type="email"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('email') }"
          v-model="formData.email"
          :placeholder="translate('Enter client email')"
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('email')">
          {{ apiValidation.getError("email") }}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="text-center pt-10">
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
import { translate } from "@/core/helpers/i18n-utils";

export default defineComponent({
  name: "ClientForm",
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

      emit("submit", payload);
    };

    return {
      formData,
      submit,
      translate,
    };
  },
});
</script>
