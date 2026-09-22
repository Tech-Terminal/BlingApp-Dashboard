<template>
  <!--begin::User-->
  <div
    class="aside-user d-flex align-items-sm-center justify-content-center py-5"
  >
    <div
      v-if="isLoading || !user.name"
      class="d-flex align-items-center w-100 placeholder-glow"
    >
      <!-- Skeleton Symbol -->
      <div class="symbol symbol-50px">
        <div
          class="placeholder w-50px h-50px rounded-3 bg-white opacity-25"
        ></div>
      </div>

      <!-- Skeleton Info -->
      <div class="aside-user-info flex-row-fluid ms-5">
        <span
          class="placeholder col-11 mb-2 d-block h-15px bg-white opacity-25"
        ></span>
        <span
          class="placeholder col-7 d-block h-10px bg-white opacity-25"
        ></span>
      </div>
    </div>

    <template v-else>
      <!--begin::Symbol-->
      <div class="symbol symbol-50px">
        <img
          :src="user.image || getAssetPath('media/avatars/blank.png')"
          @error="
            ($event.target as HTMLImageElement).src = getAssetPath(
              'media/avatars/blank.png',
            )
          "
          alt="Avatar"
        />
      </div>
      <!--end::Symbol-->

      <!--begin::Wrapper-->
      <div class="aside-user-info flex-row-fluid flex-wrap ms-5">
        <!--begin::Section-->
        <div class="d-flex">
          <!--begin::Info-->
          <div class="flex-grow-1 me-2">
            <!--begin::Username-->
            <span class="text-white fs-6 fw-semibold">
              {{ user.name }}
            </span>
            <!--end::Username-->

            <!--begin::Description-->
            <span class="text-white opacity-75 fw-semibold d-block fs-8 mb-1">
              {{ user.role?.name }}
            </span>
            <!--end::Description-->
          </div>
          <!--end::Info-->

          <!--begin::User menu-->
          <div class="me-n2">
            <!--begin::Action-->
            <a
              href="#"
              class="btn btn-icon btn-sm btn-active-color-primary mt-n2"
              data-kt-menu-trigger="click"
              data-kt-menu-attach="parent"
              data-kt-menu-placement="right-start"
              data-kt-menu-overflow="true"
            >
              <KTIcon icon-name="setting-2" icon-class="text-white fs-1" />
            </a>

            <UserMenu />
            <!--end::Action-->
          </div>
          <!--end::User menu-->
        </div>
        <!--end::Section-->
      </div>
      <!--end::Wrapper-->
    </template>
  </div>
  <!--end::User-->

  <!--begin::Separator-->
  <div class="separator opacity-10"></div>
  <!--end::Separator-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, watch, nextTick } from "vue";
import UserMenu from "@/layouts/default-layout/components/menus/UserAccountMenu.vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { MenuComponent } from "@/assets/ts/components";

export default defineComponent({
  name: "kt--aside-toolbar",
  components: {
    UserMenu,
  },
  setup() {
    const authStore = useAuthStore();
    const { user, isLoading } = storeToRefs(authStore);

    watch(isLoading, (val) => {
      if (!val) {
        nextTick(() => {
          MenuComponent.reinitialization();
        });
      }
    });

    return {
      getAssetPath,
      user,
      isLoading,
    };
  },
});
</script>
