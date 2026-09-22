<template>
  <div class="card skeleton-table" :class="widgetClasses">
    <div class="card-header border-0 pt-5">
      <div class="skeleton-text title mb-1"></div>
      <div class="skeleton-text subtitle"></div>
    </div>
    <div class="card-body py-3">
      <div class="table-responsive">
        <table class="table align-middle gs-0 gy-4">
          <tbody>
            <tr v-for="i in 5" :key="i">
              <td v-for="j in 5" :key="j">
                <div class="skeleton-text cell"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "table-skeleton",
  props: {
    widgetClasses: String,
  },
});
</script>

<style scoped lang="scss">
.skeleton-table {
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
      width: 200px;
      height: 24px;
    }

    &.subtitle {
      width: 150px;
    }

    &.header {
      width: 60px;
    }

    &.cell {
      width: 100%;
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
  .skeleton-table {
    background-color: #1e1e2d !important;

    .skeleton-text {
      background: linear-gradient(90deg, #2b2b40 25%, #323248 50%, #2b2b40 75%);
    }
  }
}
</style>
