<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column w-250px w-lg-325px"
    data-kt-menu="true"
  >
    <!--begin::Heading-->
    <div
      class="d-flex flex-column flex-center bgi-no-repeat rounded-top px-9 py-10"
      :style="{
        backgroundImage: `url(${getAssetPath(
          '/media/misc/menu-header-bg.jpg',
        )})`,
      }"
    >
      <!--begin::Title-->
      <h3 class="text-white fw-semibold mb-3">Quick Links</h3>
      <!--end::Title-->

      <!--begin::Status-->
      <span class="badge bg-success py-2 px-3">25 pending tasks</span>
      <!--end::Status-->
    </div>
    <!--end::Heading-->

    <!--begin:Nav-->
    <div class="row g-0">
      <!--begin:Item-->
      <div class="col-6">
        <router-link
          to="/dashboard"
          class="d-flex flex-column flex-center h-100 p-6 bg-hover-light border-end border-bottom"
        >
          <KTIcon icon-name="element-11" icon-class="fs-3x text-success mb-2" />
          <span class="fs-5 fw-semibold text-gray-800 mb-0">Dashboard</span>
          <span class="fs-7 text-gray-500">Overview</span>
        </router-link>
      </div>
      <!--end:Item-->

      <!--begin:Item-->
      <div class="col-6">
        <router-link
          to="/apps/admins/admins-listing"
          class="d-flex flex-column flex-center h-100 p-6 bg-hover-light border-bottom"
        >
          <KTIcon
            icon-name="security-user"
            icon-class="fs-3x text-success mb-2"
          />
          <span class="fs-5 fw-semibold text-gray-800 mb-0">Admins</span>
          <span class="fs-7 text-gray-500">Management</span>
        </router-link>
      </div>
      <!--end:Item-->

      <!--begin:Item-->
      <div class="col-6">
        <router-link
          to="/apps/roles/roles-listing"
          class="d-flex flex-column flex-center h-100 p-6 bg-hover-light border-end"
        >
          <KTIcon icon-name="element-7" icon-class="fs-3x text-success mb-2" />
          <span class="fs-5 fw-semibold text-gray-800 mb-0">Roles</span>
          <span class="fs-7 text-gray-500">Access Control</span>
        </router-link>
      </div>
      <!--end:Item-->

      <!--begin:Item-->
      <div class="col-6">
        <router-link
          to="/companies/companies-listing"
          class="d-flex flex-column flex-center h-100 p-6 bg-hover-light"
        >
          <KTIcon
            icon-name="profile-circle"
            icon-class="fs-3x text-success mb-2"
          />
          <span class="fs-5 fw-semibold text-gray-800 mb-0">Companies</span>
          <span class="fs-7 text-gray-500">Vendors</span>
        </router-link>
      </div>
      <!--end:Item-->
    </div>
    <!--end:Nav-->

    <!--begin::View more-->
    <div class="py-2 text-center border-top">
      <a href="#" class="btn btn-color-gray-600 btn-active-color-primary">
        View All
        <KTIcon icon-name="arrow-right" icon-class="fs-5" />
      </a>
    </div>
    <!--end::View more-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";

export default defineComponent({
  name: "kt-quick-links-menu",
  components: {},
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
