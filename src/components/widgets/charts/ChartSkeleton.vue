<template>
  <div class="card skeleton-chart" :class="widgetClasses">
    <div class="card-header border-0 pt-5">
      <div class="skeleton-text title mb-1"></div>
      <div class="skeleton-text subtitle"></div>
    </div>
    <div class="card-body d-flex align-items-center justify-content-center">
      <div
        class="skeleton-circle"
        :style="{ height: height + 'px', width: height + 'px' }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "chart-skeleton",
  props: {
    widgetClasses: String,
    height: Number,
  },
});
</script>

<style scoped lang="scss">
.skeleton-chart {
  overflow: hidden;
  position: relative;
  background-color: #fff !important;
  border-radius: 12px;

  .skeleton-text {
    height: 12px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;

    &.title {
      width: 150px;
      height: 24px;
    }

    &.subtitle {
      width: 100px;
    }
  }

  .skeleton-circle {
    border-radius: 50%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    max-width: 100%;
    opacity: 0.6;
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
  .skeleton-chart {
    background-color: #1e1e2d !important;

    .skeleton-text,
    .skeleton-circle {
      background: linear-gradient(90deg, #2b2b40 25%, #323248 50%, #2b2b40 75%);
    }
  }
}
</style>
