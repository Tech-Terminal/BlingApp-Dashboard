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
            @input="searchMaids()"
            class="form-control form-control-solid w-100 w-md-250px ps-15"
            :placeholder="translate('Search Maids')"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        >
          <FilterMenu
            :filters="filters"
            @apply="applyFilter"
            @reset="resetFilter"
          >
            <!--begin::Input group-->
            <div class="mb-10">
              <label class="form-label fs-6 fw-semibold"
                >{{ translate("Status") }}:</label
              >
              <SearchableSelect
                v-model="filters.isActive"
                :list="statusOptions"
                label="name"
                :placeholder="translate('Select Status')"
              />
            </div>
            <!--end::Input group-->
          </FilterMenu>

          <!--begin::Add maid-->
          <router-link
            v-if="can('create', 'maid')"
            :to="{ name: 'maid-create' }"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ translate("Add Maid") }}
          </router-link>
          <!--end::Add maid-->
        </div>
        <!--end::Toolbar-->
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

      <div v-else-if="!loading && (!maids || maids.length === 0)">
        <EmptyState
          :title="translate('No Maids Found')"
          :description="
            translate('Try adjusting your search or add a new maid.')
          "
          icon="magnifier"
        />
      </div>

      <div v-else class="table-responsive">
        <table
          class="table align-middle table-row-dashed fs-6 gy-5"
          id="kt_maids_table"
        >
          <thead>
            <tr
              class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0"
            >
              <th class="min-w-50px">ID</th>
              <th class="min-w-250px">{{ translate("Details") }}</th>
              <th class="min-w-125px">{{ translate("Phone") }}</th>
              <th class="min-w-125px">{{ translate("Document") }}</th>
              <th class="min-w-100px">{{ translate("Status") }}</th>
              <th class="min-w-125px">{{ translate("Joined Date") }}</th>
              <th class="text-end min-w-70px">{{ translate("Actions") }}</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="maid in maids" :key="maid.id">
              <td>{{ maid.id }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <!--begin:: Avatar -->
                  <div
                    class="symbol symbol-circle symbol-50px overflow-hidden me-3 flex-shrink-0"
                    style="width: 50px; height: 50px; min-width: 50px"
                  >
                    <img
                      :src="maid.image"
                      :alt="maid.name"
                      style="width: 50px; height: 50px; object-fit: cover"
                      v-if="maid.image"
                    />
                    <span
                      v-else
                      class="symbol-label bg-light-primary text-primary fs-3 fw-bold"
                      style="width: 50px; height: 50px"
                    >
                      {{ maid.name ? maid.name.charAt(0).toUpperCase() : "M" }}
                    </span>
                  </div>
                  <!--end::Avatar-->
                  <!--begin::Maid details-->
                  <div class="d-flex flex-column">
                    <router-link
                      :to="{ name: 'maid-details', params: { id: maid.id } }"
                      class="text-gray-800 text-hover-primary mb-1 fw-bold"
                    >
                      {{ maid.name }}
                    </router-link>
                    <span class="text-muted fs-7">{{
                      maid.email || translate("No Email")
                    }}</span>
                  </div>
                  <!--begin::Maid details-->
                </div>
              </td>
              <td>
                <span class="text-gray-800 fw-bold font-monospace" dir="ltr">{{
                  maid.phone
                }}</span>
              </td>
              <td>
                <a
                  v-if="maid.idDocument"
                  :href="maid.idDocument"
                  target="_blank"
                  class="badge badge-light-primary text-hover-primary fw-semibold py-2 px-3 d-inline-flex align-items-center gap-1"
                >
                  <i class="bi bi-file-earmark-text fs-6"></i>
                  <span>{{ translate("View") }}</span>
                </a>
                <span v-else class="text-muted fs-7">{{
                  translate("N/A")
                }}</span>
              </td>
              <td>
                <div
                  class="badge badge-light-success fw-bold"
                  v-if="maid.isActive"
                >
                  {{ translate("Active") }}
                </div>
                <div class="badge badge-light-danger fw-bold" v-else>
                  {{ translate("Inactive") }}
                </div>
              </td>
              <td>
                {{
                  maid.createdAt
                    ? new Date(maid.createdAt).toLocaleDateString()
                    : "N/A"
                }}
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
                      :to="{ name: 'maid-details', params: { id: maid.id } }"
                      class="menu-link px-3 d-flex justify-content-between align-items-center"
                    >
                      <span>{{ translate("View") }}</span>
                      <KTIcon icon-name="eye" icon-class="fs-3 text-primary" />
                    </router-link>
                  </div>
                  <!--end::Menu item-->
                  <!--begin::Menu item-->
                  <div class="menu-item px-3" v-if="can('update', 'maid')">
                    <router-link
                      :to="{ name: 'maid-edit', params: { id: maid.id } }"
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
                  <div class="menu-item px-3" v-if="can('delete', 'maid')">
                    <a
                      @click="deleteMaid(maid)"
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
        v-if="pagination.totalPages"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        @page-change="
          (page: number) => {
            pagination.currentPage = page;
            fetchMaids(page);
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
import MaidService from "@/core/services/MaidService";
import type { MaidData } from "@/core/types";
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
import { usePermissions } from "@/composables/usePermissions";

export default defineComponent({
  name: "MaidList",
  components: {
    KTIcon,
    KTPagination,
    SearchableSelect,
    FilterMenu,
    EmptyState,
  },
  setup() {
    const maids = ref<MaidData[]>([]);
    const pagination = ref<any>({});
    const loading = ref(false);
    const search = ref("");
    const { can } = usePermissions();

    const statusOptions = computed(() => [
      { id: null, name: translate("All") },
      { id: true, name: translate("Active") },
      { id: false, name: translate("Inactive") },
    ]);

    const filters = ref<any>({
      isActive: null,
    });

    const fetchMaids = (page = 1) => {
      loading.value = true;
      MaidService.getAll({
        page: page,
        search: search.value,
        filters: filters.value,
      })
        .then(({ data, meta }: any) => {
          maids.value = data || [];
          pagination.value = meta || { currentPage: 1, totalPages: 1 };
          nextTick(() => {
            MenuComponent.reinitialization();
          });
        })
        .catch((error) => {
          showErrorAlert(
            error?.response?.data?.message ||
              translate("Failed to fetch maids"),
          );
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const applyFilter = () => {
      fetchMaids(1);
    };

    const resetFilter = () => {
      filters.value = {
        isActive: null,
      };
      fetchMaids(1);
    };

    const deleteMaid = (maid: any) => {
      showConfirmationAlert(
        translate("Are you sure you want to delete this maid?"),
      ).then((result) => {
        if (result.isConfirmed) {
          MaidService.delete(maid.id)
            .then(() => {
              showSuccessAlert(translate("Maid deleted successfully."));
              fetchMaids(pagination.value.currentPage || 1);
            })
            .catch(({ response }) => {
              const error =
                response?.data?.message || translate("Failed to delete maid");
              showErrorAlert(error);
            });
        }
      });
    };

    let timer: any;
    const searchMaids = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetchMaids();
      }, 500);
    };

    onMounted(() => {
      fetchMaids();
    });

    onUpdated(() => {
      MenuComponent.reinitialization();
    });

    return {
      maids,
      pagination,
      loading,
      search,
      translate,
      fetchMaids,
      deleteMaid,
      searchMaids,
      filters,
      statusOptions,
      applyFilter,
      resetFilter,
      can,
    };
  },
});
</script>
