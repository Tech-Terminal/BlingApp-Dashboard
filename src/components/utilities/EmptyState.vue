<template>
  <div
    class="card-body d-flex flex-column justify-content-center text-center pt-15 pb-15"
  >
    <div class="mb-5">
      <KTIcon :icon-name="icon" icon-class="fs-5x text-muted" />
    </div>
    <div class="fs-1 fw-bold text-gray-800 mb-2">{{ title }}</div>
    <div class="fs-4 fw-semibold text-muted mb-7">{{ description }}</div>
    <slot name="actions"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

export default defineComponent({
  name: "EmptyState",
  components: {
    KTIcon,
  },
  props: {
    title: {
      type: String,
      default: "No records found",
    },
    description: {
      type: String,
      default: "Looks like there are no records matching your search.",
    },
    icon: {
      type: String,
      default: "magnifier",
    },
  },
});
</script>
