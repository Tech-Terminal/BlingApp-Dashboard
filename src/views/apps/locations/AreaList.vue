<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            type="text"
            v-model="search"
            @input="searchAreas()"
            class="form-control w-100 w-md-250px ps-15"
            :placeholder="translate('Search Areas')"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <div
          class="d-flex justify-content-end align-items-center gap-3"
          data-kt-customer-table-toolbar="base"
        >
          <FilterMenu
            :filters="filters"
            @apply="applyFilter"
            @reset="resetFilter"
          >
            <!--begin::Input group-->
            <div class="mb-10">
              <label class="form-label fs-6 fw-semibold">
                {{ translate("Governorate") }}:
              </label>
              <SearchableSelect
                v-model="filters.governorateId"
                :service="GovernorateService"
                :label="governorateLabel"
                :placeholder="translate('Select Governorate')"
              />
            </div>
            <!--end::Input group-->
          </FilterMenu>

          <router-link
            :to="{ name: 'area-create' }"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ translate("Add Area") }}
          </router-link>
        </div>
      </div>
      <!--end::Card toolbar-->
    </div>

    <div class="card-body pt-0">
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center py-5 min-h-300px"
      >
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ translate("Loading...") }}</span>
        </div>
      </div>

      <div v-else-if="!loading && (!areas || areas.length === 0)">
        <EmptyState
          :title="translate('No Areas Found')"
          :description="
            translate('Try adjusting your search or add a new area.')
          "
          icon="geolocation"
        />
      </div>

      <div v-else class="table-responsive">
        <table
          class="table align-middle table-row-dashed fs-6 gy-5"
          id="kt_areas_table"
        >
          <thead>
            <tr
              class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0"
            >
              <th class="min-w-50px">ID</th>
              <th class="min-w-150px">{{ translate("English Name") }}</th>
              <th class="min-w-150px">{{ translate("Arabic Name") }}</th>
              <th class="min-w-150px">{{ translate("Governorate") }}</th>
              <th class="text-end min-w-125px">{{ translate("Actions") }}</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="area in areas" :key="area.id">
              <td>{{ area.id }}</td>
              <td class="text-gray-800 fw-bold">
                {{ area.nameEn || area.name_en }}
              </td>
              <td class="text-gray-800 fw-bold">
                {{ area.nameAr || area.name_ar }}
              </td>
              <td>
                <span class="badge badge-light-info fw-bold fs-7">
                  {{
                    isArabic
                      ? area.governorate?.nameAr ||
                        area.governorate?.name_ar ||
                        area.governorate?.nameEn
                      : area.governorate?.nameEn ||
                        area.governorate?.name_en ||
                        area.governorate?.nameAr
                  }}
                </span>
              </td>
              <td class="text-end">
                <a
                  href="#"
                  class="btn btn-sm btn-light btn-active-light-primary btn-icon btn-color-gray-500"
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                >
                  <i class="bi bi-three-dots fs-4"></i>
                </a>
                <!--begin::Menu-->
                <div
                  class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
                  data-kt-menu="true"
                >
                  <!--begin::Menu item-->
                  <div class="menu-item px-3">
                    <router-link
                      :to="{
                        name: 'area-edit',
                        params: { id: area.id },
                      }"
                      class="menu-link px-3 d-flex justify-content-between align-items-center"
                    >
                      <span>{{ translate("Edit") }}</span>
                      <KTIcon
                        icon-name="pencil"
                        icon-class="fs-3 text-primary"
                      />
                    </router-link>
                  </div>
                  <!--end::Menu item-->
                  <!--begin::Menu item-->
                  <div class="menu-item px-3">
                    <a
                      @click="deleteArea(area)"
                      class="menu-link px-3 d-flex justify-content-between align-items-center text-danger"
                    >
                      <span>{{ translate("Delete") }}</span>
                      <KTIcon icon-name="trash" icon-class="fs-3 text-danger" />
                    </a>
                  </div>
                  <!--end::Menu item-->
                </div>
                <!--end::Menu-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <KTPagination
        v-if="pagination.totalPages && pagination.totalPages > 1"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        @page-change="
          (page: number) => {
            pagination.currentPage = page;
            fetchAreas(page);
          }
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated, nextTick, computed, watch } from "vue";
import { useRoute } from "vue-router";
import AreaService from "@/core/services/AreaService";
import GovernorateService from "@/core/services/GovernorateService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import KTPagination from "@/components/kt-datatable/KTPagination.vue";
import SearchableSelect from "@/components/inputs/SearchableSelect.vue";
import FilterMenu from "@/components/filter/FilterMenu.vue";
import EmptyState from "@/components/utilities/EmptyState.vue";
import { translate } from "@/core/helpers/i18n-utils";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmationAlert,
} from "@/core/helpers/alert-utils";
import { MenuComponent } from "@/assets/ts/components";
import i18n from "@/core/plugins/i18n";

export default defineComponent({
  name: "AreaList",
  components: {
    KTIcon,
    KTPagination,
    EmptyState,
    SearchableSelect,
    FilterMenu,
  },
  setup() {
    const route = useRoute();
    const areas = ref<any[]>([]);
    const pagination = ref<any>({ currentPage: 1, totalPages: 1 });
    const loading = ref(false);
    const search = ref("");
    const filters = ref<any>({
      governorateId: route.query.governorateId
        ? Number(route.query.governorateId)
        : null,
    });

    const isArabic = computed(
      () =>
        (i18n.global.locale as any)?.value === "ar" ||
        i18n.global.locale === "ar",
    );

    const governorateLabel = computed(() =>
      isArabic.value ? "nameAr" : "nameEn",
    );

    const fetchAreas = (page = 1) => {
      loading.value = true;
      const params: any = {
        page,
        search: search.value,
      };
      if (filters.value.governorateId) {
        params.governorateId = filters.value.governorateId;
      }

      AreaService.getAll(params)
        .then((res: any) => {
          areas.value = res?.data || [];
          pagination.value = res?.meta || { currentPage: 1, totalPages: 1 };
        })
        .catch(() => {
          areas.value = [];
        })
        .finally(() => {
          loading.value = false;
          nextTick(() => {
            MenuComponent.reinitialization();
          });
        });
    };

    const applyFilter = () => {
      fetchAreas(1);
    };

    const resetFilter = () => {
      filters.value.governorateId = null;
      fetchAreas(1);
    };

    watch(
      () => route.query.governorateId,
      (newVal) => {
        filters.value.governorateId = newVal ? Number(newVal) : null;
        fetchAreas(1);
      },
    );

    let timer: any;
    const searchAreas = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetchAreas(1);
      }, 400);
    };

    const deleteArea = (area: any) => {
      showConfirmationAlert(
        translate("Are you sure you want to delete this area?"),
      ).then((result) => {
        if (result.isConfirmed) {
          AreaService.delete(area.id)
            .then(() => {
              showSuccessAlert(translate("Area deleted successfully!"));
              fetchAreas(pagination.value.currentPage);
            })
            .catch(({ response }) => {
              const error =
                response?.data?.message || translate("Error deleting area");
              showErrorAlert(error);
            });
        }
      });
    };

    onMounted(() => {
      fetchAreas();
    });

    onUpdated(() => {
      MenuComponent.reinitialization();
    });

    return {
      areas,
      pagination,
      loading,
      search,
      filters,
      GovernorateService,
      governorateLabel,
      applyFilter,
      resetFilter,
      isArabic,
      translate,
      fetchAreas,
      searchAreas,
      deleteArea,
    };
  },
});
</script>
