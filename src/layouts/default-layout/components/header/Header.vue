<template>
  <div id="kt_header" class="header align-items-stretch">
    <div class="header-brand">
      <!--begin::Logo-->
      <router-link
        to="/dashboard"
        class="d-flex align-items-center justify-content-center w-100"
      >
        <img
          alt="Logo"
          :src="getAssetPath('media/white_logo.svg')"
          class="h-45px logo object-fit-contain"
        />
      </router-link>
      <!--end::Logo-->

      <!--begin::Aside toggle-->
      <div
        class="d-flex align-items-center d-lg-none ms-n3 me-1"
        title="Show aside menu"
      >
        <div
          class="btn btn-icon btn-active-color-primary w-30px h-30px"
          id="kt_aside_mobile_toggle"
        >
          <KTIcon icon-name="abstract-14" icon-class="fs-1" />
        </div>
      </div>
      <!--end::Aside toggle-->
    </div>

    <div
      class="toolbar d-flex align-items-stretch"
      :class="{
        'container-fluid': headerWidthFluid,
        'container-xxl': !headerWidthFluid,
      }"
    >
      <div
        class="container-fluid py-6 py-lg-0 d-flex flex-column flex-lg-row align-items-lg-stretch justify-content-lg-between px-0"
        id="kt_toolbar_container"
      >
        <PageTitle></PageTitle>
        <KTTopbar />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import KTTopbar from "@/layouts/default-layout/components/header/Topbar.vue";
import PageTitle from "@/layouts/default-layout/components/page-title/PageTitle.vue";

import {
  asideDisplay,
  asideMinimized,
  headerLeft,
  headerWidthFluid,
} from "@/layouts/default-layout/config/helper";

export default defineComponent({
  name: "KTHeader",
  components: {
    KTTopbar,
    PageTitle,
  },
  setup() {
    return {
      headerWidthFluid,
      headerLeft,
      asideDisplay,
      asideMinimized,
      getAssetPath,
    };
  },
});
</script>
