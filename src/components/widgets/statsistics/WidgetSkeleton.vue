<template>
  <div :class="widgetClasses" class="card skeleton-widget">
    <div class="card-body">
      <div class="skeleton-icon mb-2"></div>
      <div class="skeleton-text title mb-2 mt-5"></div>
      <div class="skeleton-text description"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "widget-skeleton",
  props: {
    widgetClasses: String,
  },
});
</script>

<style scoped lang="scss">
.skeleton-widget {
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5 !important;
  border-radius: 12px;
  height: 100%;

  .skeleton-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }

  .skeleton-text {
    height: 12px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;

    &.title {
      width: 60%;
      height: 24px;
    }

    &.description {
      width: 40%;
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

[data-bs-theme="dark"] {
  .skeleton-widget {
    background-color: #1b1b29 !important;

    .skeleton-icon,
    .skeleton-text {
      background: linear-gradient(90deg, #2b2b40 25%, #323248 50%, #2b2b40 75%);
    }
  }
}
</style>
