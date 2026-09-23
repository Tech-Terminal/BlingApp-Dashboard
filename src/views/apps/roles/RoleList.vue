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
            @input="searchRoles()"
            class="form-control form-control-solid w-100 w-md-250px ps-15"
            :placeholder="translate('Search Roles')"
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
          <!--begin::Add customer-->
          <router-link :to="{ name: 'role-create' }" class="btn btn-primary">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ translate("Add Role") }}
          </router-link>
          <!--end::Add customer-->
        </div>
        <!--end::Toolbar-->
      </div>
      <!--end::Card toolbar-->
    </div>

    <div class="card-body pt-5">
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center py-5 min-h-300px"
      >
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div class="col-12 py-10" v-else-if="!roles || roles.length === 0">
        <EmptyState
          :title="translate('No Roles Found')"
          :description="
            translate('Try adjusting your search or add a new role.')
          "
          icon="magnifier"
        />
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-5 g-xl-9" v-else>
        <div class="col-md-4" v-for="role in roles" :key="role.id">
          <!--begin::Card-->
          <div class="card card-flush h-md-100">
            <!--begin::Card header-->
            <div class="card-header">
              <!--begin::Card title-->
              <div class="card-title">
                <h2>{{ role.name }}</h2>
              </div>
              <!--end::Card title-->
              <div class="card-toolbar" v-if="!role.isSuperAdmin">
                <span class="cursor-pointer" @click="deleteRole(role)">
                  <i class="fas fa-trash fs-4 text-danger"></i>
                </span>
              </div>
            </div>
            <!--end::Card header-->

            <!--begin::Card body-->
            <div class="card-body pt-1">
              <!--begin::Permissions-->
              <div class="d-flex flex-column text-gray-600">
                <div
                  class="d-flex align-items-center py-2"
                  v-for="(permission, index) in getPermissionsList(role).slice(
                    0,
                    5,
                  )"
                  :key="index"
                >
                  <span class="bullet bg-primary me-3"></span>
                  {{ translate($formatName(permission.split(" ")[0])) }} -
                  {{ translate($formatName(permission.split(" ")[1])) }}
                </div>
                <div
                  v-if="getPermissionsList(role).length > 5"
                  class="d-flex align-items-center py-2"
                >
                  <span class="bullet bg-primary me-3"></span>
                  <em
                    >{{ translate("and") }}
                    {{ getPermissionsList(role).length - 5 }}
                    {{ translate("more") }}...</em
                  >
                </div>
              </div>
              <!--end::Permissions-->
            </div>
            <!--end::Card body-->

            <!--begin::Card footer-->
            <div class="card-footer flex-wrap pt-0">
              <router-link
                :to="{ name: 'role-details', params: { id: role.id } }"
                class="btn btn-light btn-active-primary my-1 me-2"
              >
                {{ translate("View") }}
              </router-link>

              <router-link
                v-if="!role.isSuperAdmin"
                :to="{ name: 'role-edit', params: { id: role.id } }"
                class="btn btn-light btn-active-light-primary my-1"
              >
                {{ translate("Edit") }}
              </router-link>
            </div>
            <!--end::Card footer-->
          </div>
          <!--end::Card-->
        </div>
      </div>

      <div
        class="d-flex justify-content-between align-items-center mt-5"
        v-if="meta.totalPages"
      >
        <KTPagination
          :current-page="meta.currentPage"
          :total-pages="meta.totalPages"
          @page-change="
            (page: number) => {
              meta.currentPage = page;
              fetchRoles(page);
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onActivated } from "vue";
import RoleService from "@/core/services/RoleService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { translate } from "@/core/helpers/i18n-utils";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmationAlert,
} from "@/core/helpers/alert-utils";
import EmptyState from "@/components/utilities/EmptyState.vue";

import KTPagination from "@/components/kt-datatable/KTPagination.vue";

export default defineComponent({
  name: "RoleList",
  components: { KTIcon, EmptyState, KTPagination },
  setup() {
    const roles = ref([]);
    const meta = ref({
      currentPage: 1,
      totalPages: 1,
    });
    const loading = ref(false);
    const search = ref("");

    const fetchRoles = (page = 1) => {
      loading.value = true;
      RoleService.getAll({ page, limit: 10, search: search.value })
        .then(({ data, meta: responseMeta }) => {
          roles.value = data || [];
          meta.value = responseMeta || { currentPage: 1, totalPages: 1 };
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const deleteRole = (role: any) => {
      // Check if role has assigned admins
      if (role.admins_count > 0) {
        showErrorAlert(
          translate("Cannot delete role because it is assigned to users."),
          translate("Ok, got it!"),
        );
        return;
      }

      showConfirmationAlert(
        translate("Are you sure you want to delete this role?"),
      ).then((result) => {
        if (result.isConfirmed) {
          RoleService.delete(role.id)
            .then(() => {
              showSuccessAlert(translate("Role deleted successfully!"));
              fetchRoles();
            })
            .catch(({ response }) => {
              const error =
                response.data.message || translate("Error deleting role");
              showErrorAlert(error);
            });
        }
      });
    };

    let timer: any;
    const searchRoles = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetchRoles();
      }, 500);
    };

    const getPermissionsList = (role: any) => {
      if (!role.permissions) return [];
      if (Array.isArray(role.permissions)) {
        return role.permissions;
      }
      if (typeof role.permissions === "object") {
        const list: string[] = [];
        Object.keys(role.permissions).forEach((module: string) => {
          const actions = role.permissions[module];
          if (Array.isArray(actions)) {
            actions.forEach((action: string) => {
              list.push(`${action} ${module}`);
            });
          }
        });
        return list;
      }
      return [];
    };

    onMounted(() => {
      fetchRoles();
    });

    // Re-fetch when navigating back to this page (e.g. after editing a role)
    onActivated(() => {
      fetchRoles();
    });

    return {
      roles,
      meta,
      loading,
      search,
      translate,
      fetchRoles,
      deleteRole,
      searchRoles,
      getPermissionsList,
    };
  },
});
</script>
