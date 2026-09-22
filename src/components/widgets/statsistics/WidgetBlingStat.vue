<template>
  <div
    class="card card-xl-stretch mb-xl-8"
    style="
      border: 1px solid #eff2f5;
      box-shadow: 0px 0px 20px 0px rgba(76, 87, 125, 0.02);
    "
  >
    <div class="card-body p-6">
      <div :class="`text-${color}`" class="fw-bold fs-5 mb-2">
        {{ title }}
      </div>
      <div class="text-dark fw-bold fs-2hx">
        {{ value }}
      </div>
      <div
        v-if="bottomBorderColor"
        :style="`width: 25px; height: 3px; background-color: ${bottomBorderColor}; margin-top: 15px;`"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "widget-bling-stat",
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    color: {
      type: String,
      default: "primary", // primary, success, info, warning, danger
    },
    bottomBorderColor: {
      type: String,
      default: "", // Hex color for the small line at the bottom
    },
  },
});
</script>
