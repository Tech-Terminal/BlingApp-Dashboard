<template>
  <!--begin::Authentication Layout -->
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <!--begin::Body-->
    <div
      class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1"
    >
      <!--begin::Form-->
      <div class="d-flex flex-center flex-column flex-lg-row-fluid">
        <!--begin::Wrapper-->
        <div class="w-lg-500px p-10">
          <router-view></router-view>
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Form-->

      <!--begin::Footer-->
    </div>
    <!--end::Body-->

    <!--begin::Aside-->
    <div
      class="d-flex flex-lg-row-fluid w-lg-50 order-1 order-lg-2"
      style="
        background: linear-gradient(
          135deg,
          var(--bs-primary) 0%,
          var(--bs-primary-active) 100%
        );
      "
    >
      <!--begin::Content-->
      <div
        class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100"
      >
        <!--begin::Logo-->
        <router-link to="/">
          <img
            alt="Logo"
            :src="getAssetPath(logo)"
            class="w-200px w-lg-300px object-fit-contain logo"
          />
        </router-link>
        <!--end::Logo-->
      </div>
      <!--end::Content-->
    </div>
    <!--end::Aside-->
  </div>
  <!--end::Authentication Layout -->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, computed } from "vue";
import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/body";
import { useThemeStore } from "@/stores/theme";

export default defineComponent({
  name: "auth-layout",
  components: {},
  setup() {
    const store = useBodyStore();
    const themeStore = useThemeStore();

    const logo = computed(() => {
      // The auth aside background is always dark, so always use the white logo
      return "media/white_logo.svg";
    });

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);

      store.addBodyClassname("app-blank");
      store.addBodyClassname("bg-body");
    });

    return {
      getAssetPath,
      logo,
    };
  },
});
</script>
