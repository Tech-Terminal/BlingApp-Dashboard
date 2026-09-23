<template>
  <!--begin::Filter-->
  <button
    type="button"
    class="btn btn-light-primary me-3 position-relative"
    data-kt-menu-trigger="click"
    data-kt-menu-placement="bottom-end"
  >
    <span
      v-if="hasActiveFilters"
      class="filter-active-indicator"
    ></span>
    <KTIcon icon-name="filter" icon-class="fs-2" />
    {{ $translate("Filter") }}
  </button>
  <!--begin::Menu 1-->
  <div
    class="menu menu-sub menu-sub-dropdown w-300px w-md-325px"
    data-kt-menu="true"
  >
    <!--begin::Header-->
    <div class="px-7 py-5">
      <div class="fs-5 text-dark fw-bold">
        {{ $translate("Filter Options") }}
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Menu separator-->
    <div class="separator border-gray-200"></div>
    <!--end::Menu separator-->

    <!--begin::Form-->
    <div class="px-7 py-5">
      <slot></slot>

      <!--begin::Actions-->
      <div class="d-flex justify-content-end">
        <button
          type="reset"
          class="btn btn-light btn-active-light-primary fw-semibold me-2 px-6"
          data-kt-menu-dismiss="true"
          @click="$emit('reset')"
        >
          {{ $translate("Reset") }}
        </button>
        <button
          type="submit"
          class="btn btn-primary fw-semibold px-6"
          data-kt-menu-dismiss="true"
          @click="$emit('apply')"
        >
          {{ $translate("Apply") }}
        </button>
      </div>
      <!--end::Actions-->
    </div>
    <!--end::Form-->
  </div>
  <!--end::Menu 1-->
  <!--end::Filter-->
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

export default defineComponent({
  name: "FilterMenu",
  components: {
    KTIcon,
  },
  props: {
    filters: {
      type: Object,
      default: () => ({}),
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["reset", "apply"],
  setup(props) {
    const hasActiveFilters = computed(() => {
      if (props.active) return true;
      return Object.values(props.filters || {}).some(
        (v) =>
          v !== null &&
          v !== undefined &&
          v !== "" &&
          (!Array.isArray(v) || v.length > 0),
      );
    });

    return {
      hasActiveFilters,
    };
  },
});
</script>
