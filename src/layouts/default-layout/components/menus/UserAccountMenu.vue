<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <div class="symbol symbol-50px me-5">
          <img
            alt="Logo"
            :src="user.image || getAssetPath('media/avatars/blank.png')"
            @error="
              ($event.target as HTMLImageElement).src = getAssetPath(
                'media/avatars/blank.png',
              )
            "
          />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold d-flex align-items-center fs-5">
            {{ user.name }}
          </div>
          <a href="#" class="fw-semibold text-muted text-hover-primary fs-7">{{
            user.email
          }}</a>
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div
      class="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="center, top"
    >
      <router-link to="/pages/profile/overview" class="menu-link px-5">
        <span class="menu-title position-relative">
          {{ $translate("Language") }}
          <span
            class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0"
          >
            {{ currentLangugeLocale.name }}
            <img
              class="w-15px h-15px rounded-1 ms-2"
              :src="currentLangugeLocale.flag"
              alt="metronic"
            />
          </span>
        </span>
      </router-link>

      <!--begin::Menu sub-->
      <div class="menu-sub menu-sub-dropdown w-175px py-4">
        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a
            @click="setLang('en')"
            href="#"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === 'en' }"
          >
            <span class="symbol symbol-20px me-4">
              <img class="rounded-1" :src="countries.en.flag" alt="metronic" />
            </span>
            English
          </a>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a
            @click="setLang('ar')"
            href="#"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === 'ar' }"
          >
            <span class="symbol symbol-20px me-4">
              <img class="rounded-1" :src="countries.ar.flag" alt="metronic" />
            </span>
            العربية
          </a>
        </div>
        <!--end::Menu item-->
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5 my-1">
      <router-link to="/profile" class="menu-link px-5">
        {{ $translate("Account Settings") }}
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5">
        {{ $translate("Sign Out") }}
      </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { MenuComponent } from "@/assets/ts/components";

export default defineComponent({
  name: "kt-user-menu",
  components: {},
  setup() {
    const router = useRouter();
    const i18n = useI18n();
    const store = useAuthStore();

    // Set initial language from localStorage or default to 'ar'
    const savedLang = localStorage.getItem("lang") || "ar";
    i18n.locale.value = savedLang;

    // Set initial direction
    document.documentElement.setAttribute("lang", savedLang);
    if (savedLang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("direction", "rtl");
      document.documentElement.style.direction = "rtl";
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("direction", "ltr");
      document.documentElement.style.direction = "ltr";
    }

    const countries = {
      en: {
        flag: getAssetPath("media/flags/united-states.svg"),
        name: "English",
      },
      ar: {
        flag: getAssetPath("media/flags/saudi-arabia.svg"),
        name: "Arabic",
      },
    };

    const signOut = () => {
      MenuComponent.hideDropdowns(undefined);
      store.logout();
      router.push({ name: "sign-in" });
    };

    const setLang = (lang: string) => {
      localStorage.setItem("lang", lang);
      i18n.locale.value = lang;

      document.documentElement.setAttribute("lang", lang);
      if (lang === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
        document.documentElement.setAttribute("direction", "rtl");
        document.documentElement.style.direction = "rtl";
      } else {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.setAttribute("direction", "ltr");
        document.documentElement.style.direction = "ltr";
      }
    };

    const currentLanguage = computed(() => {
      return i18n.locale.value;
    });

    const currentLangugeLocale = computed(() => {
      return countries[i18n.locale.value as keyof typeof countries];
    });

    const user = computed(() => store.user);

    return {
      signOut,
      setLang,
      currentLanguage,
      currentLangugeLocale,
      countries,
      getAssetPath,
      user,
    };
  },
});
</script>
