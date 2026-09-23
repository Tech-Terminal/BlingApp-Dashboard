<template>
  <!--begin::Footer-->
  <div class="footer py-4 d-flex flex-lg-column" id="kt_footer">
    <!--begin::Container-->
    <div
      class="d-flex flex-column flex-md-row align-items-center justify-content-between"
      :class="{
        'container-fluid': footerWidthFluid,
        'container-xxl': !footerWidthFluid,
      }"
    >
      <!--begin::Copyright-->
      <div class="text-gray-900 order-2 order-md-1">
        <span class="text-muted fw-semibold me-1">{{ year }}&copy;</span>
        <a href="#" class="text-gray-800 text-hover-primary">Bling</a>
      </div>
      <!--end::Copyright-->

      <!--begin::Menu-->
      <ul
        class="menu menu-gray-600 menu-hover-primary fw-semibold order-1 mt-2"
      >
        <li class="menu-item" v-if="isCompany">
          <router-link to="/company-legal" class="menu-link px-2"
            >Legal Agreements</router-link
          >
        </li>
      </ul>
      <!--end::Menu-->
    </div>
    <!--end::Container-->
  </div>
  <!--end::Footer-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { footerWidthFluid } from "@/layouts/default-layout/config/helper";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "KTFooter",
  setup() {
    const authStore = useAuthStore();
    const { isCompany } = storeToRefs(authStore);

    return {
      footerWidthFluid,
      year: new Date().getFullYear(),
      isCompany,
    };
  },
});
</script>
