<template>
  <div class="gallery-input">
    <div class="row g-5">
      <!-- Existing & New Images -->
      <div
        v-for="(img, index) in modelValue"
        :key="index"
        class="col-6 col-md-3 col-lg-2"
      >
        <div
          class="image-preview-wrapper shadow-sm border rounded overflow-hidden position-relative"
        >
          <img
            :src="getPreviewUrl(img)"
            class="w-100 h-100 object-fit-cover"
            alt="Preview"
          />
          <button
            type="button"
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm position-absolute top-0 end-0 m-1"
            @click="removeImage(index)"
          >
            <i class="bi bi-x fs-2"></i>
          </button>
        </div>
      </div>

      <!-- Add Button -->
      <div v-if="modelValue.length < maxFiles" class="col-6 col-md-3 col-lg-2">
        <label
          class="add-image-box border border-dashed border-primary rounded d-flex flex-column align-items-center justify-content-center cursor-pointer hover-elevate-up bg-light-primary w-100 h-100 min-h-100px"
        >
          <i class="bi bi-plus-lg fs-2x text-primary"></i>
          <span class="fs-7 fw-bold text-primary mt-2">Add Image</span>
          <input
            type="file"
            multiple
            accept="image/*"
            class="d-none"
            @change="handleFileChange"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "GalleryInput",
  props: {
    modelValue: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    maxFiles: {
      type: Number,
      default: 10,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const getPreviewUrl = (img: any) => {
      if (typeof img === "string") return img;
      if (img instanceof File) return URL.createObjectURL(img);
      if (img && (img.url || img.mockUrl || img.dataURL)) {
        return img.url || img.mockUrl || img.dataURL;
      }
      return "";
    };

    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const newFiles = Array.from(target.files);
        const updatedImages = [...props.modelValue, ...newFiles].slice(
          0,
          props.maxFiles,
        );
        emit("update:modelValue", updatedImages);
        // Reset input to allow selecting same file again
        target.value = "";
      }
    };

    const removeImage = (index: number) => {
      const updatedImages = [...props.modelValue];
      updatedImages.splice(index, 1);
      emit("update:modelValue", updatedImages);
    };

    return {
      getPreviewUrl,
      handleFileChange,
      removeImage,
    };
  },
});
</script>

<style scoped>
.image-preview-wrapper {
  aspect-ratio: 1 / 1;
  background-color: #f8f9fa;
}

.add-image-box {
  aspect-ratio: 1 / 1;
  transition: all 0.3s ease;
}

.add-image-box:hover {
  background-color: #e1f0ff !important;
  border-style: solid !important;
}

.object-fit-cover {
  object-fit: cover;
}
</style>
