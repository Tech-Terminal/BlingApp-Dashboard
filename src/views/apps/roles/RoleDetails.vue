<template>
  <div v-if="role">
    <!-- Back Header -->
    <div class="d-flex align-items-center mb-7">
      <router-link
        :to="{ name: 'roles-listing' }"
        class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px me-3"
      >
        <i class="bi bi-arrow-left fs-2 rtl-flip"></i>
      </router-link>
      <h1 class="text-gray-900 fw-bold m-0 fs-2">
        {{ translate("Role Details") }}
      </h1>
    </div>

    <div class="d-flex flex-column flex-lg-row">
      <!--begin::Sidebar-->
      <div
        class="flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-350px mb-10"
      >
        <!--begin::Card-->
        <div class="card card-flush py-4">
          <!--begin::Card body-->
          <div class="card-body pt-0">
            <h3 class="fw-bold text-gray-900 mb-1 text-capitalize">
              {{ role.name }}
            </h3>
            <span class="text-muted fs-7"
              >{{ translate("Number of permissions") }}:
              {{ flatPermissions.length }}</span
            >

            <div class="separator separator-dashed my-5"></div>

            <!--begin::Permissions-->
            <div
              class="d-flex flex-column text-gray-800 scroll-y pe-3"
              style="max-height: 480px; overflow-y: auto"
            >
              <div
                v-for="permission in flatPermissions"
                :key="permission"
                class="py-2 text-capitalize fs-6 fw-semibold"
              >
                - {{ translatePermission(permission) }}
              </div>
              <div
                v-if="flatPermissions.length === 0"
                class="text-muted text-center py-5"
              >
                {{ translate("No permissions assigned") }}
              </div>
            </div>
            <!--end::Permissions-->
          </div>
          <!--end::Card body-->
        </div>
        <!--end::Card-->
      </div>
      <!--end::Sidebar-->

      <!--begin::Content-->
      <div class="flex-lg-row-fluid ms-lg-10">
        <!--begin::Card-->
        <div class="card card-flush mb-6 mb-xl-9 py-4">
          <!--begin::Card body-->
          <div class="card-body pt-0">
            <h3 class="fw-bold text-gray-900 mb-1">
              {{ translate("User Assigned") }} ({{ filteredAdmins.length }})
            </h3>
            <div class="text-muted fs-7 mb-6">
              {{ translate("View and manage user assigned to this role.") }}
            </div>

            <!--begin::Search-->
            <div class="position-relative my-1 mb-8">
              <i
                class="bi bi-search position-absolute ms-5 translate-middle-y top-50 text-gray-500 fs-5"
              ></i>
              <input
                type="text"
                v-model="searchQuery"
                class="form-control form-control-solid w-100 w-md-350px ps-13"
                :placeholder="translate('Search users')"
              />
            </div>
            <!--end::Search-->

            <div class="table-responsive">
              <table class="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                  <tr
                    class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0"
                  >
                    <th class="min-w-50px">{{ translate("ID") }}</th>
                    <th class="min-w-200px">{{ translate("User") }}</th>
                    <th class="min-w-150px">{{ translate("Assign Date") }}</th>
                  </tr>
                </thead>
                <tbody class="fw-semibold text-gray-600">
                  <tr v-for="admin in filteredAdmins" :key="admin.id">
                    <td>{{ admin.id }}</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <!--begin:: Avatar -->
                        <div
                          class="symbol symbol-circle symbol-45px overflow-hidden me-3"
                        >
                          <img
                            v-if="admin.image"
                            :src="admin.image"
                            :alt="admin.name"
                            class="w-100"
                          />
                          <div
                            v-else
                            class="symbol-label bg-light-dark text-gray-800 fw-bold fs-6"
                          >
                            {{ getInitials(admin.name) }}
                          </div>
                        </div>
                        <!--end::Avatar-->
                        <!--begin::User details-->
                        <div class="d-flex flex-column">
                          <span
                            class="text-gray-900 fw-bold text-hover-primary mb-1"
                            >{{ admin.name }}</span
                          >
                          <span class="text-muted fs-7">{{ admin.email }}</span>
                        </div>
                        <!--begin::User details-->
                      </div>
                    </td>
                    <td>{{ admin.created_at || "-" }}</td>
                  </tr>
                  <tr v-if="filteredAdmins.length === 0">
                    <td colspan="3" class="text-center text-muted py-10">
                      {{ translate("No users found") }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!--end::Card body-->
        </div>
        <!--end::Card-->
      </div>
      <!--end::Content-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, onUpdated } from "vue";
import { useRoute } from "vue-router";
import RoleService from "@/core/services/RoleService";
import AdminService from "@/core/services/AdminService";
import { translate } from "@/core/helpers/i18n-utils";
import { formatName } from "@/core/helpers/string-utils";
import { MenuComponent } from "@/assets/ts/components";

export default defineComponent({
  name: "RoleDetails",
  setup() {
    const route = useRoute();
    const role = ref<any>(null);
    const roleAdmins = ref<any[]>([]);
    const allPermissions = ref({});
    const roleId = route.params.id;
    const searchQuery = ref("");

    const fetchRole = () => {
      RoleService.get(roleId as string).then((roleData) => {
        role.value = roleData || {};
      });
    };

    const fetchRoleAdmins = () => {
      AdminService.getAll({ page: 1, limit: 100, filters: { roleId } }).then(
        (res: any) => {
          roleAdmins.value = res.data || [];
        },
      );
    };

    const fetchPermissions = () => {
      RoleService.getPermissions().then((permsData) => {
        allPermissions.value = permsData || {};
      });
    };

    const getInitials = (name: string) => {
      if (!name) return "";
      const parts = name.split(" ");
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    const flatPermissions = computed(() => {
      if (!role.value || !role.value.permissions) return [];
      const perms = role.value.permissions;
      if (Array.isArray(perms)) {
        return perms;
      } else if (typeof perms === "object") {
        const flat: string[] = [];
        Object.entries(perms).forEach(([module, actions]) => {
          if (Array.isArray(actions)) {
            actions.forEach((action) => {
              flat.push(`${action}_${module}`);
            });
          }
        });
        return flat;
      }
      return [];
    });

    const translatePermission = (perm: string) => {
      if (!perm) return "";
      if (perm.includes(" ")) {
        const parts = perm.split(" ");
        const action = translate(formatName(parts[0]));
        const module = translate(formatName(parts[1]));
        return `${action} - ${module}`;
      }
      const parts = perm.split("_");
      if (parts.length > 1) {
        const module = parts[parts.length - 1];
        const action = parts.slice(0, parts.length - 1).join("_");
        return `${translate(formatName(action))} - ${translate(formatName(module))}`;
      }
      return translate(formatName(perm));
    };

    const filteredAdmins = computed(() => {
      if (!roleAdmins.value) return [];
      const query = searchQuery.value.toLowerCase().trim();
      if (!query) return roleAdmins.value;
      return roleAdmins.value.filter((admin: any) => {
        return (
          admin.name?.toLowerCase().includes(query) ||
          admin.email?.toLowerCase().includes(query) ||
          admin.id?.toString().includes(query)
        );
      });
    });

    onMounted(() => {
      fetchRole();
      fetchPermissions();
      fetchRoleAdmins();
    });

    onUpdated(() => {
      MenuComponent.reinitialization();
    });

    return {
      role,
      translate,
      flatPermissions,
      allPermissions,
      searchQuery,
      filteredAdmins,
      fetchRole,
      getInitials,
      translatePermission,
    };
  },
});
</script>
