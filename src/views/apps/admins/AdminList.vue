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
            @input="searchAdmins()"
            class="form-control form-control-solid w-100 w-md-250px ps-15"
            :placeholder="translate('Search Admins')"
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
          <FilterMenu @apply="applyFilter" @reset="resetFilter">
            <!--begin::Input group-->
            <div class="mb-10">
              <label class="form-label fs-6 fw-semibold"
                >{{ translate("Role") }}:</label
              >
              <SearchableSelect
                v-model="filters.roleId"
                :service="RoleService"
                label="nameAr"
                :placeholder="translate('Select Role')"
              />
            </div>
            <!--end::Input group-->

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

          <!--begin::Add admin-->
          <router-link :to="{ name: 'admin-create' }" class="btn btn-primary">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ translate("Add Admin") }}
          </router-link>
          <!--end::Add admin-->
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

      <div v-else-if="!loading && (!admins || admins.length === 0)">
        <EmptyState
          :title="translate('No Admins Found')"
          :description="
            translate('Try adjusting your search or add a new admin.')
          "
          icon="magnifier"
        />
      </div>

      <div v-else class="table-responsive">
        <table
          class="table align-middle table-row-dashed fs-6 gy-5"
          id="kt_admins_table"
        >
          <thead>
            <tr
              class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0"
            >
              <th class="min-w-50px">ID</th>
              <th class="min-w-250px">{{ translate("Details") }}</th>
              <th class="min-w-125px">{{ translate("Role") }}</th>
              <th class="min-w-100px">{{ translate("Status") }}</th>
              <th class="min-w-125px">{{ translate("Joined Date") }}</th>
              <th class="text-end min-w-70px">{{ translate("Actions") }}</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="admin in admins" :key="admin.id">
              <td>{{ admin.id }}</td>
              <td class="d-flex align-items-center">
                <!--begin:: Avatar -->
                <div
                  class="symbol symbol-circle symbol-50px overflow-hidden me-3"
                >
                  <img
                    :src="admin.image"
                    :alt="admin.name"
                    class="w-100"
                    v-if="admin.image"
                  />
                  <span
                    v-else
                    class="symbol-label bg-light-primary text-primary fs-3 fw-bold"
                  >
                    {{ admin.name ? admin.name.charAt(0).toUpperCase() : "A" }}
                  </span>
                </div>
                <!--end::Avatar-->
                <!--begin::User details-->
                <div class="d-flex flex-column">
                  <span class="text-gray-800 text-hover-primary mb-1">{{
                    admin.name
                  }}</span>
                  <span>{{ admin.email }}</span>
                  <span>{{ admin.phone }}</span>
                </div>
                <!--begin::User details-->
              </td>
              <td>
                <span v-if="admin.role" class="badge badge-light-primary">{{
                  admin.role.name
                }}</span>
                <span v-else class="badge badge-light-warning">{{
                  translate("No Role")
                }}</span>
              </td>
              <td>
                <div
                  class="badge badge-light-success fw-bold"
                  v-if="admin.isActive"
                >
                  {{ translate("Active") }}
                </div>
                <div class="badge badge-light-danger fw-bold" v-else>
                  {{ translate("Inactive") }}
                </div>
              </td>
              <td>
                {{
                  admin.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString()
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
                      :to="{ name: 'admin-edit', params: { id: admin.id } }"
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
                      @click="deleteAdmin(admin)"
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
            fetchAdmins(page);
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
import AdminService from "@/core/services/AdminService";
import RoleService from "@/core/services/RoleService";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
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

export default defineComponent({
  name: "AdminList",
  components: {
    KTIcon,
    KTPagination,
    SearchableSelect,
    FilterMenu,
    EmptyState,
  },
  setup() {
    const admins = ref([]);
    const pagination = ref<any>({});
    const loading = ref(false);
    const search = ref("");

    const statusOptions = computed(() => [
      { id: null, name: translate("All") },
      { id: true, name: translate("Active") },
      { id: false, name: translate("Inactive") },
    ]);

    const authStore = useAuthStore();
    const { isCompany, user } = storeToRefs(authStore);

    const filters = ref<any>({
      roleId: null,
      isActive: null,
    });

    const fetchAdmins = (page = 1) => {
      loading.value = true;
      AdminService.getAll({
        page: page,
        search: search.value,
        filters: filters.value,
      })
        .then(({ data, meta }) => {
          admins.value = data || [];
          pagination.value = meta || { currentPage: 1, totalPages: 1 };
          // Re-init menu
          nextTick(() => {
            MenuComponent.reinitialization();
          });
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const applyFilter = () => {
      fetchAdmins(1);
    };

    const resetFilter = () => {
      filters.value = {
        roleId: null,
        isActive: null,
      };
      fetchAdmins(1);
    };

    const deleteAdmin = (admin: any) => {
      showConfirmationAlert(
        translate("Are you sure you want to delete this admin?"),
      ).then((result) => {
        if (result.isConfirmed) {
          AdminService.delete(admin.id)
            .then(() => {
              showSuccessAlert(translate("Admin deleted successfully!"));
              fetchAdmins(pagination.value.current_page);
            })
            .catch(({ response }) => {
              const error =
                response.data.message || translate("Error deleting admin");
              showErrorAlert(error);
            });
        }
      });
    };

    let timer: any;
    const searchAdmins = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetchAdmins();
      }, 500);
    };

    onMounted(() => {
      fetchAdmins();
    });

    onUpdated(() => {
      MenuComponent.reinitialization();
    });

    return {
      admins,
      pagination,
      loading,
      search,
      translate,
      fetchAdmins,
      deleteAdmin,
      searchAdmins,
      filters,
      statusOptions,
      RoleService,
      applyFilter,
      resetFilter,
    };
  },
});
</script>
