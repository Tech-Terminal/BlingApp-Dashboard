<template>
  <form id="kt_admin_form" class="form" @submit.prevent="submit">
    <!-- Image -->
    <div class="fv-row mb-7 text-center">
      <label class="d-block fw-semibold fs-6 my-5">{{
        translate("Avatar")
      }}</label>
      <ImageUpload v-model="formData.image" @uploading="isUploading = $event" />
    </div>

    <!-- Name & Email -->
    <div class="row">
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
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('name')">
          {{ apiValidation.getError("name") }}
        </div>
      </div>
      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label
          class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
        >
          <span class="required">{{ translate("Email") }}</span>
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

    <!-- Phone & Role -->
    <div class="row">
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
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('phone')">
          {{ apiValidation.getError("phone") }}
        </div>
      </div>
      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label
          class="d-flex align-items-center fs-6 fw-semibold form-label mb-2"
        >
          <span class="required">{{ translate("Role") }}</span>
        </label>
        <SearchableSelect
          v-model="formData.roleId"
          :service="RoleService"
          label="name"
          :placeholder="translate('Select Role')"
          :initialOption="initialRole"
          :class="{ 'is-invalid': apiValidation.hasError('roleId') }"
        />
        <div
          class="invalid-feedback"
          v-if="apiValidation.hasError('roleId')"
          style="display: block"
        >
          {{ apiValidation.getError("roleId") }}
        </div>
      </div>
    </div>

    <div class="text-center pt-15">
      <button type="button" class="btn btn-light me-3" @click="$emit('cancel')">
        {{ translate("Discard") }}
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :data-kt-indicator="loading || isUploading ? 'on' : 'off'"
        :disabled="loading || isUploading"
      >
        <span class="indicator-label">{{ translate("Submit") }}</span>
        <span class="indicator-progress"
          >{{ translate("Please wait...") }}
          <span
            class="spinner-border spinner-border-sm align-middle ms-2"
          ></span
        ></span>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  PropType,
  computed,
  onMounted,
} from "vue";
import ImageUpload from "@/components/ImageUpload.vue";
import SearchableSelect from "@/components/inputs/SearchableSelect.vue";
import RoleService from "@/core/services/RoleService";
import { translate } from "@/core/helpers/i18n-utils";

export default defineComponent({
  name: "AdminForm",
  components: {
    ImageUpload,
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
    initialRole: {
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

    const isUploading = ref(false);

    const submit = () => {
      const payload: any = {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        roleId: Number(formData.value.roleId),
        isActive: Boolean(formData.value.isActive),
      };

      if (formData.value.image) {
        payload.image = formData.value.image;
      }

      if (formData.value.password) {
        payload.password = formData.value.password;
        payload.password_confirmation = formData.value.password_confirmation;
      }

      emit("submit", payload);
    };

    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    return {
      formData,
      submit,
      isUploading,
      RoleService,
      showPassword,
      showConfirmPassword,
      translate,
    };
  },
});
</script>
