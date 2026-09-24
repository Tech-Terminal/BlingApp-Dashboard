<template>
  <div class="custom-file-uploader w-100">
    <div class="input-group" :class="{ 'is-invalid': hasError }">
      <!-- Choose File Button -->
      <button
        type="button"
        class="btn btn-light-primary d-flex align-items-center gap-2 flex-shrink-0"
        @click="triggerFileInput"
        :disabled="isUploading || disabled"
      >
        <i class="bi bi-upload fs-6"></i>
        <span>{{ translate("Choose File") }}</span>
      </button>

      <!-- Text Container (Filename or 'No file chosen') -->
      <div
        class="form-control d-flex align-items-center text-truncate cursor-pointer bg-white"
        :class="{
          'text-muted': !fileName,
          'text-gray-800 fw-semibold': fileName,
          'is-invalid': hasError,
        }"
        @click="triggerFileInput"
      >
        <!-- Uploading state -->
        <span
          v-if="isUploading"
          class="d-flex align-items-center gap-2 text-primary"
        >
          <span
            class="spinner-border spinner-border-sm text-primary"
            role="status"
          ></span>
          <span>{{ translate("Uploading file...") }}</span>
        </span>

        <!-- File selected / exists -->
        <span
          v-else-if="fileName"
          class="text-truncate d-flex align-items-center gap-2"
        >
          <i
            :class="
              isPdf
                ? 'bi bi-file-earmark-pdf-fill text-danger fs-5'
                : 'bi bi-file-earmark-image-fill text-success fs-5'
            "
          ></i>
          <span class="text-truncate">{{ fileName }}</span>
        </span>

        <!-- No file chosen -->
        <span v-else class="text-muted">
          {{ translate("No file chosen") }}
        </span>
      </div>

      <!-- Action: View Document in new tab -->
      <a
        v-if="(modelValue || previewUrl) && !isUploading"
        :href="modelValue || previewUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-icon btn-light-primary flex-shrink-0"
        :title="translate('View Document')"
      >
        <i class="bi bi-box-arrow-up-right fs-6"></i>
      </a>

      <!-- Action: Remove Document -->
      <button
        v-if="(modelValue || previewUrl) && !isUploading"
        type="button"
        class="btn btn-icon btn-light-danger flex-shrink-0"
        @click.stop="removeFile"
        :title="translate('Remove')"
        :disabled="disabled"
      >
        <i class="bi bi-trash fs-6"></i>
      </button>
    </div>

    <!-- Hidden native file input -->
    <input
      ref="fileInputRef"
      type="file"
      class="d-none"
      :accept="accept"
      :disabled="isUploading || disabled"
      @change="onFileChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { useStorage } from "@/composables/useStorage";
import { showErrorAlert } from "@/core/helpers/alert-utils";
import { translate } from "@/core/helpers/i18n-utils";

export default defineComponent({
  name: "CustomFileUploader",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    accept: {
      type: String,
      default: ".pdf, .png, .jpg, .jpeg, .webp",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hasError: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "uploading"],
  setup(props, { emit }) {
    const fileInputRef = ref<HTMLInputElement | null>(null);
    const localFileName = ref<string>("");
    const previewUrl = ref<string | null>(null);
    const { uploadFile, isUploading } = useStorage();

    watch(isUploading, (val) => {
      emit("uploading", val);
    });

    const isPdf = computed(() => {
      const target = (
        localFileName.value ||
        props.modelValue ||
        ""
      ).toLowerCase();
      return target.includes(".pdf");
    });

    const fileName = computed(() => {
      if (localFileName.value) return localFileName.value;
      if (!props.modelValue) return "";
      try {
        const parts = props.modelValue.split("/");
        const last = parts[parts.length - 1];
        return decodeURIComponent(last.split("?")[0]);
      } catch {
        return "";
      }
    });

    const triggerFileInput = () => {
      if (props.disabled || isUploading.value) return;
      fileInputRef.value?.click();
    };

    const onFileChange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      localFileName.value = file.name;
      if (file.type.startsWith("image/")) {
        previewUrl.value = URL.createObjectURL(file);
      } else {
        previewUrl.value = null;
      }

      try {
        const url = await uploadFile(file);
        if (url) {
          emit("update:modelValue", url);
        }
      } catch (error: any) {
        showErrorAlert(
          error?.message || translate("Failed to upload document."),
        );
        localFileName.value = "";
        previewUrl.value = null;
      } finally {
        if (target) target.value = "";
      }
    };

    const removeFile = () => {
      localFileName.value = "";
      previewUrl.value = null;
      emit("update:modelValue", "");
      if (fileInputRef.value) fileInputRef.value.value = "";
    };

    return {
      fileInputRef,
      localFileName,
      previewUrl,
      fileName,
      isPdf,
      isUploading,
      triggerFileInput,
      onFileChange,
      removeFile,
      translate,
    };
  },
});
</script>
