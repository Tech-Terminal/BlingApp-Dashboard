<template>
  <div
    class="image-input image-input-outline"
    data-kt-image-input="true"
    :style="{
      'background-image': `url(${defaultImage || getAssetPath('media/avatars/blank.png')})`,
    }"
  >
    <div
      class="image-input-wrapper w-125px h-125px"
      :style="{
        'background-image': `url(${previewUrl || modelValue || defaultImage || getAssetPath('media/avatars/blank.png')})`,
      }"
    ></div>

    <label
      class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
      data-kt-image-input-action="change"
      data-bs-toggle="tooltip"
      :title="$translate('Change avatar')"
      :class="{ disabled: isUploading || disabled }"
    >
      <i v-if="!isUploading" class="bi bi-pencil-fill fs-7"></i>
      <span
        v-else
        class="spinner-border spinner-border-sm align-middle ms-2"
      ></span>
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        @change="onFileChange"
        :disabled="isUploading || disabled"
      />
      <input type="hidden" name="avatar_remove" />
    </label>

    <span
      v-if="modelValue || previewUrl"
      class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
      data-kt-image-input-action="cancel"
      data-bs-toggle="tooltip"
      :title="$translate('Cancel avatar')"
      @click="removeImage"
    >
      <i class="bi bi-x fs-2"></i>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { getAssetPath } from "@/core/helpers/assets";
import { useStorage } from "@/composables/useStorage";
import { showErrorAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "ImageUpload",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    defaultImage: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "uploading"],
  setup(props, { emit }) {
    const previewUrl = ref<string | null>(null);
    const { uploadFile, isUploading } = useStorage();

    watch(isUploading, (val) => {
      emit("uploading", val);
    });

    const onFileChange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      // Show local preview immediately
      previewUrl.value = URL.createObjectURL(file);

      try {
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
          emit("update:modelValue", uploadedUrl);
        }
      } catch (error) {
        showErrorAlert("Failed to upload image.");
        previewUrl.value = null; // Revert preview on failure
      }
    };

    const removeImage = () => {
      previewUrl.value = null;
      emit("update:modelValue", "");
    };

    return {
      getAssetPath,
      previewUrl,
      onFileChange,
      removeImage,
      isUploading,
    };
  },
});
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.7;
}
</style>
