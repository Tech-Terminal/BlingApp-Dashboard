<template>
  <!--begin::Action group-->
  <div class="d-flex align-items-stretch overflow-auto pt-3 pt-lg-0">
    <!--begin::Action wrapper-->

    <!--begin::Theme mode-->
    <div class="d-flex align-items-center">
      <!--begin::Menu toggle-->
      <a
        href="#"
        class="btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary"
        data-kt-menu-trigger="{default:'click', lg: 'hover'}"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
      >
        <KTIcon icon-name="night-day" icon-class="theme-light-show fs-2" />
        <KTIcon icon-name="moon" icon-class="theme-dark-show fs-2" />
      </a>
      <!--begin::Menu toggle-->
      <KTThemeModeSwitcher></KTThemeModeSwitcher>
    </div>
    <!--end::Theme mode-->
  </div>
  <!--end::Action group-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted } from "vue";
import noUiSlider, { type target } from "nouislider";
import KTThemeModeSwitcher from "@/layouts/default-layout/components/theme-mode/ThemeModeSwitcher.vue";

export default defineComponent({
  name: "layout-topbar",
  components: {
    KTThemeModeSwitcher,
  },
  setup() {
    const initSlider = (): void => {
      const slider: target = document.querySelector(
        "#kt_toolbar_slider",
      ) as target;
      const rangeSliderValueElement: Element | null = document.querySelector(
        "#kt_toolbar_slider_value",
      );

      if (!slider) {
        return;
      }

      slider.innerHTML = "";

      noUiSlider.create(slider, {
        start: [5],
        connect: [true, false],
        step: 1,
        range: {
          min: [1],
          max: [10],
        },
      });

      slider.noUiSlider?.on("update", function (values: any, handle: any) {
        if (!rangeSliderValueElement) {
          return;
        }

        rangeSliderValueElement.innerHTML = parseInt(values[handle]).toFixed(1);
      });
    };

    onMounted(() => {
      initSlider();
    });

    return {
      getAssetPath,
    };
  },
});
</script>
