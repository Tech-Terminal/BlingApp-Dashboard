<template>
  <div class="fv-row mb-7 text-center">
    <!-- <label class="d-block fw-semibold fs-6 my-5">Image</label> -->
    <div class="image-input image-input-outline" data-kt-image-input="true">
      <div
        class="image-input-wrapper w-125px h-125px shadow-sm"
        :style="`background-image: url(${currentPreview})`"
      ></div>
      <label
        class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow-sm"
        data-kt-image-input-action="change"
        data-bs-toggle="tooltip"
        title="Change avatar"
      >
        <i class="bi bi-pencil-fill fs-7"></i>
        <input
          type="file"
          name="avatar"
          accept=".png, .jpg, .jpeg"
          @change="handleFileUpload"
        />
        <input type="hidden" name="avatar_remove" />
      </label>

      <!-- Cancel button -->
      <span
        class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
        data-kt-image-input-action="cancel"
        data-bs-toggle="tooltip"
        title="Cancel avatar"
        @click="removeImage"
        v-if="currentPreview && currentPreview !== defaultImage"
      >
        <i class="bi bi-x fs-2"></i>
      </span>

      <!-- Remove button -->
      <!-- <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="remove" data-bs-toggle="tooltip" title="Remove avatar" @click="removeImage" v-if="currentPreview && currentPreview !== defaultImage">
          <i class="bi bi-x fs-2"></i>
      </span> -->
    </div>
    <!-- <div class="form-text">Allowed file types: png, jpg, jpeg.</div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "ImageInput",
  props: {
    preview: {
      type: String,
      default: null,
    },
    defaultImage: {
      type: String,
      default: "/media/svg/files/blank-image.svg",
    },
  },
  emits: ["file-change", "remove"],
  setup(props, { emit }) {
    const currentPreview = ref(props.defaultImage);

    // Watch for external changes to preview prop
    watch(
      () => props.preview,
      (newVal) => {
        if (newVal) {
          currentPreview.value = newVal;
        } else {
          currentPreview.value = props.defaultImage;
        }
      },
      { immediate: true },
    );

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        currentPreview.value = URL.createObjectURL(file);
        emit("file-change", file);
      }
    };

    const removeImage = () => {
      currentPreview.value = props.defaultImage;
      emit("remove");
      // Also need to clear the input value if possible, but v-if might handle it or just ignoring the input on parent based on 'remove' event
    };

    return {
      currentPreview,
      handleFileUpload,
      removeImage,
    };
  },
});
</script>
