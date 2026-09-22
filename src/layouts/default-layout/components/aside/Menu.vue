<template>
  <!--begin::Menu wrapper-->
  <div
    id="kt_aside_menu_wrapper"
    ref="scrollElRef"
    class="hover-scroll-overlay-y px-2 my-5 my-lg-5"
    data-kt-scroll="true"
    data-kt-scroll-height="auto"
    data-kt-scroll-dependencies="{default: '#kt_aside_toolbar, #kt_aside_footer', lg: '#kt_header, #kt_aside_toolbar, #kt_aside_footer'}"
    data-kt-scroll-wrappers="#kt_aside_menu"
    data-kt-scroll-offset="5px"
  >
    <!--begin::Menu-->
    <div
      id="#kt_aside_menu"
      class="menu menu-column menu-title-white menu-state-title-white menu-state-icon-white menu-state-bullet-white menu-arrow-white"
      data-kt-menu="true"
    >
      <div v-if="isLoading" class="placeholder-glow px-5">
        <template v-for="i in 8" :key="i">
          <!-- Mock Section Header every 4 items -->
          <div v-if="i === 1 || i === 5" class="menu-item pt-8 pb-2">
            <span
              class="placeholder col-5 bg-white opacity-25 rounded h-10px"
            ></span>
          </div>

          <div class="menu-item py-1">
            <div class="menu-link px-3">
              <span class="menu-icon">
                <div
                  class="placeholder w-25px h-25px rounded bg-white opacity-25"
                ></div>
              </span>
              <span class="menu-title">
                <span
                  class="placeholder col-9 rounded bg-white opacity-25 h-15px"
                ></span>
              </span>
            </div>
          </div>
        </template>
      </div>

      <template v-else>
        <template v-for="(item, i) in MainMenuConfig" :key="i">
          <div
            v-if="item.heading && shouldShowMainItem(item)"
            class="menu-item"
          >
            <div class="menu-content pt-8 pb-2">
              <span
                class="menu-section text-white text-uppercase fs-8 ls-1 opacity-75"
              >
                {{ translate(item.heading) }}
              </span>
            </div>
          </div>
          <template v-for="(menuItem, j) in item.pages" :key="j">
            <template
              v-if="
                menuItem.heading &&
                hasPermission(menuItem.permission) &&
                (!menuItem.requireCompany || isCompany) &&
                !(isCompany && menuItem.hideForCompany)
              "
            >
              <div class="menu-item">
                <router-link
                  v-if="menuItem.route"
                  class="menu-link"
                  active-class="active"
                  :to="menuItem.route"
                >
                  <span
                    v-if="menuItem.keenthemesIcon || menuItem.bootstrapIcon"
                    class="menu-icon"
                  >
                    <i
                      v-if="asideMenuIcons === 'bootstrap'"
                      :class="menuItem.bootstrapIcon"
                      class="bi fs-3"
                    ></i>
                    <KTIcon
                      v-else-if="asideMenuIcons === 'keenthemes'"
                      :icon-name="menuItem.keenthemesIcon"
                      icon-class="fs-2"
                    />
                  </span>
                  <span class="menu-title">{{
                    translate(menuItem.heading)
                  }}</span>
                </router-link>
              </div>
            </template>
            <div
              v-if="
                menuItem.sectionTitle &&
                menuItem.route &&
                hasPermission(menuItem.permission) &&
                (!menuItem.requireCompany || isCompany) &&
                !(isCompany && menuItem.hideForCompany)
              "
              :class="{ show: hasActiveChildren(menuItem.route) }"
              class="menu-item menu-accordion"
              data-kt-menu-sub="accordion"
              data-kt-menu-trigger="click"
            >
              <span class="menu-link">
                <span
                  v-if="menuItem.keenthemesIcon || menuItem.bootstrapIcon"
                  class="menu-icon"
                >
                  <i
                    v-if="asideMenuIcons === 'bootstrap'"
                    :class="menuItem.bootstrapIcon"
                    class="bi fs-3"
                  ></i>
                  <KTIcon
                    v-else-if="asideMenuIcons === 'keenthemes'"
                    :icon-name="menuItem.keenthemesIcon"
                    icon-class="fs-2"
                  />
                </span>
                <span class="menu-title">{{
                  translate(menuItem.sectionTitle, menuItem)
                }}</span>
                <span class="menu-arrow"></span>
              </span>
              <div
                v-if="menuItem.route"
                :class="{ show: hasActiveChildren(menuItem.route) }"
                class="menu-sub menu-sub-accordion"
              >
                <template v-for="(item2, k) in menuItem.sub" :key="k">
                  <div
                    v-if="
                      item2.heading &&
                      (!item2.action || can(item2.action, menuItem.permission))
                    "
                    class="menu-item"
                  >
                    <router-link
                      v-if="item2.route"
                      class="menu-link"
                      active-class="active"
                      :to="item2.route"
                    >
                      <span class="menu-bullet">
                        <span class="bullet bullet-dot"></span>
                      </span>
                      <span class="menu-title">{{
                        translate(item2.heading)
                      }}</span>
                    </router-link>
                  </div>
                  <div
                    v-if="item2.sectionTitle && item2.route"
                    :class="{ show: hasActiveChildren(item2.route) }"
                    class="menu-item menu-accordion"
                    data-kt-menu-sub="accordion"
                    data-kt-menu-trigger="click"
                  >
                    <span class="menu-link">
                      <span class="menu-bullet">
                        <span class="bullet bullet-dot"></span>
                      </span>
                      <span class="menu-title">{{
                        translate(item2.sectionTitle)
                      }}</span>
                      <span class="menu-arrow"></span>
                    </span>
                    <div
                      :class="{ show: hasActiveChildren(item2.route) }"
                      class="menu-sub menu-sub-accordion"
                    >
                      <template v-for="(item3, k) in item2.sub" :key="k">
                        <div v-if="item3.heading" class="menu-item">
                          <router-link
                            v-if="item3.route"
                            class="menu-link"
                            active-class="active"
                            :to="item3.route"
                          >
                            <span class="menu-bullet">
                              <span class="bullet bullet-dot"></span>
                            </span>
                            <span class="menu-title">{{
                              translate(item3.heading)
                            }}</span>
                          </router-link>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </template>
      </template>
    </div>
    <!--end::Menu-->
  </div>
  <!--end::Menu wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { version } from "@/core/helpers/system";
import { asideMenuIcons } from "@/layouts/default-layout/config/helper";
import MainMenuConfig from "@/layouts/default-layout/config/MainMenuConfig";
import { usePermissions } from "@/composables/usePermissions";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import type { MenuItem } from "@/layouts/default-layout/config/types";

export default defineComponent({
  name: "kt-menu",
  components: {},
  setup() {
    const { t, te } = useI18n();
    const route = useRoute();
    const scrollElRef = ref<null | HTMLElement>(null);
    const { hasPermission, can } = usePermissions();
    const authStore = useAuthStore();
    const { isCompany, isLoading } = storeToRefs(authStore);

    onMounted(() => {
      if (scrollElRef.value) {
        scrollElRef.value.scrollTop = 0;
      }
    });

    const translate = (text: string | undefined, item: any = null) => {
      if (!text) {
        return "";
      }

      // Dynamic rename for Company Branches
      if (isCompany.value && text === "Company Branches") {
        return "Branches";
      }

      if (te(text)) {
        return t(text);
      } else {
        return text;
      }
    };

    const hasActiveChildren = (match: string) => {
      return route.path.indexOf(match) !== -1;
    };

    const shouldShowMainItem = (item: MenuItem) => {
      if (!item.pages) return true;
      return item.pages.some(
        (page) =>
          hasPermission(page.permission) &&
          (!page.requireCompany || isCompany.value) &&
          !(isCompany.value && page.hideForCompany),
      );
    };

    return {
      hasActiveChildren,
      MainMenuConfig,
      asideMenuIcons,
      version,
      translate,
      scrollElRef,
      getAssetPath,
      hasPermission,
      can,
      shouldShowMainItem,
      isCompany,
      isLoading,
    };
  },
});
</script>
