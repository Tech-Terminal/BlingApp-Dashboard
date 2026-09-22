<template>
  <div class="card">
    <div
      class="card-header pt-5"
      v-if="
        title || hasStatus || $slots['header-actions'] || $slots['header-title']
      "
    >
      <h3
        class="card-title align-items-center flex-row"
        v-if="title || $slots['header-title']"
      >
        <slot name="header-title">
          <span class="card-label fw-bold fs-3 mb-1">{{ title }}</span>
        </slot>
      </h3>
      <div class="card-toolbar">
        <slot name="header-actions"></slot>
        <div class="d-flex align-items-center" v-if="hasStatus">
          <div class="form-check form-switch form-check-sm">
            <input
              class="form-check-input w-35px h-20px"
              type="checkbox"
              v-model="internalStatus"
              :true-value="1"
              :false-value="0"
              id="statusSwitch"
            />
            <label class="form-check-label fw-bold mb-1" for="statusSwitch">
              {{ internalStatus ? activeText : inactiveText }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { translate } from "@/core/helpers/i18n-utils";

export default defineComponent({
  name: "FormCard",
  props: {
    title: {
      type: String,
      default: "",
    },
    hasStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: [Number, Boolean],
      default: 1,
    },
    activeText: {
      type: String,
      default: () => translate("Active"),
    },
    inactiveText: {
      type: String,
      default: () => translate("Inactive"),
    },
  },
  emits: ["update:status"],
  setup(props, { emit }) {
    const internalStatus = computed({
      get: () => (props.status === true || props.status === 1 ? 1 : 0),
      set: (value) => emit("update:status", value),
    });

    return {
      internalStatus,
      translate,
    };
  },
});
</script>
