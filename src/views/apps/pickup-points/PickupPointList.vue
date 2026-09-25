<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!-- Search Input -->
      <div class="card-title">
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            type="text"
            v-model="search"
            @input="searchPickupPoints()"
            class="form-control form-control-solid w-100 w-md-250px ps-15"
            :placeholder="translate('Search Pick Up Points')"
          />
        </div>
      </div>

      <!-- Toolbar & Actions -->
      <div class="card-toolbar">
        <div class="d-flex justify-content-end gap-3" data-kt-pickup-point-table-toolbar="base">
          <!-- Status Filter -->
          <FilterMenu
            :filters="filters"
            @apply="applyFilter"
            @reset="resetFilter"
          >
            <div class="mb-5">
              <label class="form-label fs-6 fw-semibold">
                {{ translate("Status") }}:
              </label>
              <SearchableSelect
                v-model="filters.isActive"
                :list="statusOptions"
                label="name"
                :placeholder="translate('Select Status')"
              />
            </div>
          </FilterMenu>

          <!-- Add Button -->
          <router-link
            v-if="can('create', 'pickup_point')"
            :to="{ name: 'pickup-point-create' }"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ translate("Add Pick Up Point") }}
          </router-link>
        </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <!-- Loading Spinner -->
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center py-5 min-h-300px"
      >
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ translate("Loading...") }}</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && (!pickupPoints || pickupPoints.length === 0)">
        <EmptyState
          :title="translate('No Pick Up Points Found')"
          :description="
            translate('Try adjusting your search to find pickup points.')
          "
          icon="geolocation"
        />
      </div>

      <!-- Data Table -->
      <div v-else class="table-responsive">
        <table
          class="table align-middle table-row-dashed fs-6 gy-5"
          id="kt_pickup_points_table"
        >
          <thead>
            <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
              <th class="min-w-50px">ID</th>
              <th class="min-w-220px">{{ translate("Pick Up Point") }}</th>
              <th class="min-w-180px">{{ translate("Covered Areas") }}</th>
              <th class="min-w-180px">{{ translate("Assigned Maids") }}</th>
              <th class="min-w-100px">{{ translate("Status") }}</th>
              <th class="min-w-120px">{{ translate("Created Date") }}</th>
              <th class="text-end min-w-70px">{{ translate("Actions") }}</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="point in pickupPoints" :key="point.id">
              <!-- ID -->
              <td>
                <span class="text-gray-800 fw-bold fs-7">#{{ point.id }}</span>
              </td>

              <!-- Point / Location Label -->
              <td>
                <div class="d-flex align-items-center">
                  <div
                    class="symbol symbol-40px symbol-light-primary me-3 flex-shrink-0 d-flex align-items-center justify-content-center rounded"
                    style="width: 40px; height: 40px; background-color: #f1faff;"
                  >
                    <i class="bi bi-geo-alt-fill text-primary fs-3"></i>
                  </div>
                  <div class="d-flex flex-column">
                    <router-link
                      :to="{ name: 'pickup-point-details', params: { id: point.id } }"
                      class="text-gray-800 text-hover-primary mb-1 fw-bold fs-6"
                    >
                      {{ point.label }}
                    </router-link>
                    <span class="text-muted fs-7">
                      <span v-if="point.streetName">{{ point.streetName }}</span>
                      <span v-if="point.streetName && point.buildingNumber">, </span>
                      <span v-if="point.buildingNumber">{{ translate("Bldg") }} {{ point.buildingNumber }}</span>
                      <span v-if="!point.streetName && !point.buildingNumber" class="text-gray-400">
                        {{ translate("No address details") }}
                      </span>
                    </span>
                  </div>
                </div>
              </td>


              <!-- Covered Areas -->
              <td>
                <div v-if="point.areas && point.areas.length > 0" class="d-flex flex-column gap-1">
                  <div class="d-flex align-items-center gap-1">
                    <span class="badge badge-light-primary fw-bold fs-7">
                      <i class="bi bi-pin-map-fill text-primary me-1"></i>
                      {{ point.areas.length }} {{ point.areas.length === 1 ? translate("Covered Area") : translate("Covered Areas") }}
                    </span>
                  </div>
                  <div class="d-flex flex-wrap gap-1">
                    <span
                      v-for="area in point.areas.slice(0, 2)"
                      :key="area.id"
                      class="badge badge-light text-gray-700 fs-9 py-0 px-2"
                    >
                      {{ isArabic ? area.nameAr : area.nameEn }}
                    </span>
                    <span
                      v-if="point.areas.length > 2"
                      class="badge badge-light text-muted fs-9 py-0 px-1"
                    >
                      +{{ point.areas.length - 2 }}
                    </span>
                  </div>
                </div>
                <span v-else class="badge badge-light text-muted fs-8">
                  {{ translate("No areas covered yet.") }}
                </span>
              </td>

              <!-- Assigned Maids -->
              <td>
                <div v-if="point.maids && point.maids.length > 0" class="d-flex align-items-center gap-2">
                  <span class="badge badge-light-primary fw-bold fs-7">
                    {{ point.maids.length }} {{ point.maids.length === 1 ? translate("Maid") : translate("Maids") }}
                  </span>
                  <!-- Avatars Stack -->
                  <div class="symbol-group symbol-hover">
                    <div
                      v-for="(maid, idx) in point.maids.slice(0, 3)"
                      :key="maid.id"
                      class="symbol symbol-circle symbol-25px"
                      :title="maid.name"
                    >
                      <img v-if="maid.image" :src="maid.image" :alt="maid.name" />
                      <span v-else class="symbol-label bg-light-primary text-primary fs-8 fw-bold">
                        {{ maid.name ? maid.name.charAt(0).toUpperCase() : "M" }}
                      </span>
                    </div>
                    <span
                      v-if="point.maids.length > 3"
                      class="symbol symbol-circle symbol-25px"
                    >
                      <span class="symbol-label bg-light text-gray-700 fs-9 fw-bold">
                        +{{ point.maids.length - 3 }}
                      </span>
                    </span>
                  </div>
                </div>
                <span v-else class="badge badge-light text-muted fs-8">
                  {{ translate("No maids assigned") }}
                </span>
              </td>

              <!-- Status -->
              <td>
                <div class="badge badge-light-success fw-bold" v-if="point.isActive">
                  {{ translate("Active") }}
                </div>
                <div class="badge badge-light-danger fw-bold" v-else>
                  {{ translate("Inactive") }}
                </div>
              </td>

              <!-- Created Date -->
              <td>
                <span class="text-gray-600 fs-7">
                  {{ point.createdAt ? new Date(point.createdAt).toLocaleDateString() : "N/A" }}
                </span>
              </td>

              <!-- Actions -->
              <td class="text-end">
                <a
                  href="#"
                  class="btn btn-sm btn-light btn-active-light-primary btn-icon btn-color-gray-500"
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                >
                  <i class="bi bi-three-dots fs-4"></i>
                </a>
                <div
                  class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-150px py-4"
                  data-kt-menu="true"
                >
                  <!-- View Details -->
                  <div class="menu-item px-3">
                    <router-link
                      :to="{ name: 'pickup-point-details', params: { id: point.id } }"
                      class="menu-link px-3 d-flex justify-content-between align-items-center"
                    >
                      <span>{{ translate("View") }}</span>
                      <KTIcon icon-name="eye" icon-class="fs-3 text-primary" />
                    </router-link>
                  </div>

                  <!-- Edit -->
                  <div class="menu-item px-3" v-if="can('update', 'pickup_point')">
                    <router-link
                      :to="{ name: 'pickup-point-edit', params: { id: point.id } }"
                      class="menu-link px-3 d-flex justify-content-between align-items-center"
                    >
                      <span>{{ translate("Edit") }}</span>
                      <KTIcon icon-name="pencil" icon-class="fs-3 text-primary" />
                    </router-link>
                  </div>

                  <!-- Toggle Active Status -->
                  <div class="menu-item px-3" v-if="can('update', 'pickup_point')">
                    <a
                      @click="toggleStatus(point)"
                      class="menu-link px-3 d-flex justify-content-between align-items-center"
                    >
                      <span>{{ point.isActive ? translate("Deactivate") : translate("Activate") }}</span>
                      <i
                        class="bi fs-5"
                        :class="point.isActive ? 'bi-toggle-on text-success' : 'bi-toggle-off text-muted'"
                      ></i>
                    </a>
                  </div>

                  <!-- Delete -->
                  <div class="menu-item px-3" v-if="can('delete', 'pickup_point')">
                    <a
                      @click="deletePickupPoint(point)"
                      class="menu-link px-3 d-flex justify-content-between align-items-center text-danger"
                    >
                      <span>{{ translate("Delete") }}</span>
                      <KTIcon icon-name="trash" icon-class="fs-3 text-danger" />
                    </a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <KTPagination
        v-if="pagination.totalPages"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        @page-change="
          (page: number) => {
            pagination.currentPage = page;
            fetchPickupPoints(page);
          }
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  nextTick,
  onUpdated,
  computed,
} from "vue";
import PickupPointService from "@/core/services/PickupPointService";
import type { PickupPointData } from "@/core/types";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import KTPagination from "@/components/kt-datatable/KTPagination.vue";
import SearchableSelect from "@/components/inputs/SearchableSelect.vue";
import FilterMenu from "@/components/filter/FilterMenu.vue";
import EmptyState from "@/components/utilities/EmptyState.vue";
import { translate } from "@/core/helpers/i18n-utils";
import i18n from "@/core/plugins/i18n";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmationAlert,
} from "@/core/helpers/alert-utils";
import { MenuComponent } from "@/assets/ts/components";
import { usePermissions } from "@/composables/usePermissions";

export default defineComponent({
  name: "PickupPointList",
  components: {
    KTIcon,
    KTPagination,
    SearchableSelect,
    FilterMenu,
    EmptyState,
  },
  setup() {
    const pickupPoints = ref<PickupPointData[]>([]);
    const pagination = ref<any>({});
    const loading = ref(false);
    const search = ref("");
    const { can } = usePermissions();

    const isArabic = computed(
      () =>
        (i18n.global.locale as any)?.value === "ar" ||
        i18n.global.locale === "ar",
    );

    const statusOptions = computed(() => [
      { id: null, name: translate("All") },
      { id: true, name: translate("Active") },
      { id: false, name: translate("Inactive") },
    ]);

    const filters = ref<any>({
      isActive: null,
    });

    const fetchPickupPoints = (page = 1) => {
      loading.value = true;
      PickupPointService.getAll({
        page: page,
        search: search.value,
        filters: filters.value,
      })
        .then(({ data, meta }: any) => {
          pickupPoints.value = data || [];
          pagination.value = meta || { currentPage: 1, totalPages: 1 };
          nextTick(() => {
            MenuComponent.reinitialization();
          });
        })
        .catch((error) => {
          showErrorAlert(
            error?.response?.data?.message ||
              translate("Failed to fetch pickup points"),
          );
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const applyFilter = () => {
      fetchPickupPoints(1);
    };

    const resetFilter = () => {
      filters.value = {
        isActive: null,
      };
      fetchPickupPoints(1);
    };

    const toggleStatus = (point: PickupPointData) => {
      const newStatus = !point.isActive;
      const prompt = newStatus
        ? translate("Activate Pick Up Point?")
        : translate("Deactivate Pick Up Point?");

      showConfirmationAlert(prompt).then((result) => {
        if (result.isConfirmed) {
          PickupPointService.update(point.id, { isActive: newStatus })
            .then(() => {
              showSuccessAlert(
                translate("Pickup point status updated successfully."),
              );
              fetchPickupPoints(pagination.value.currentPage || 1);
            })
            .catch((err) => {
              showErrorAlert(
                err?.response?.data?.message ||
                  translate("Failed to update status"),
              );
            });
        }
      });
    };

    const deletePickupPoint = (point: PickupPointData) => {
      showConfirmationAlert(
        translate("Are you sure you want to delete this pickup point?"),
      ).then((result) => {
        if (result.isConfirmed) {
          PickupPointService.delete(point.id)
            .then(() => {
              showSuccessAlert(
                translate("Pickup point deleted successfully."),
              );
              fetchPickupPoints(pagination.value.currentPage || 1);
            })
            .catch(({ response }) => {
              const error =
                response?.data?.message ||
                translate("Failed to delete pickup point");
              showErrorAlert(error);
            });
        }
      });
    };

    let timer: any;
    const searchPickupPoints = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetchPickupPoints();
      }, 500);
    };

    onMounted(() => {
      fetchPickupPoints();
    });

    onUpdated(() => {
      MenuComponent.reinitialization();
    });

    return {
      pickupPoints,
      pagination,
      loading,
      search,
      translate,
      fetchPickupPoints,
      deletePickupPoint,
      toggleStatus,
      searchPickupPoints,
      filters,
      statusOptions,
      applyFilter,
      resetFilter,
      can,
      isArabic,
    };
  },
});
</script>

<style scoped>
.w-fit {
  width: fit-content;
}
</style>
