<template>
  <div class="card mb-5 mb-xl-10">
    <!-- Header -->
    <div class="card-header border-0 cursor-pointer">
      <div class="card-title m-0 d-flex align-items-center">
        <router-link
          :to="{ name: 'roles-listing' }"
          class="btn btn-clean btn-icon btn-active-color-primary me-3"
        >
          <i
            class="fas fa-arrow-right fs-4 rtl-flip"
            style="transform: scaleX(-1)"
          ></i>
        </router-link>
        <h3 class="fw-bold m-0" v-if="roleId">
          {{ translate("Edit Role") }}
        </h3>
        <h3 class="fw-bold m-0" v-else>
          {{ translate("Add a Role") }}
        </h3>
      </div>
    </div>

    <!-- Main Content Form -->
    <form @submit.prevent="submit" class="form">
      <div class="card-body border-top p-9">
        <!-- Role Name Card -->
        <div class="card card-dashed p-6 mb-8 bg-light-primary border-primary">
          <div class="fv-row col-md-6">
            <label class="required fs-6 fw-semibold mb-2">
              {{ translate("Role Name") }}
            </label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': validation.hasError('name') }"
              v-model="formData.name"
              :placeholder="translate('Role Name')"
            />
            <div class="invalid-feedback" v-if="validation.hasError('name')">
              {{ validation.getError("name") }}
            </div>
          </div>
        </div>

        <!-- Permissions Card -->
        <div class="card card-dashed p-6 mb-8 border-gray-300">
          <div
            class="d-flex flex-wrap align-items-center justify-content-between mb-5"
          >
            <div>
              <h4 class="fw-bold mb-1">{{ translate("Role Permissions") }}</h4>
            </div>

            <!-- Global Select All -->
            <label class="form-check form-switch form-check-sm">
              <input
                class="form-check-input w-35px h-20px"
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
              <span class="form-check-label fw-semibold text-gray-800">
                {{ translate("Select all") }}
              </span>
            </label>
          </div>

          <!-- Spinner for permissions fetch -->
          <div
            v-if="loadingPermissions"
            class="d-flex justify-content-center py-10"
          >
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ translate("Loading...") }}</span>
            </div>
          </div>

          <!-- Two Column Grid for Modules -->
          <div class="row row-cols-1 row-cols-md-2 g-6" v-else>
            <div
              class="col"
              v-for="(actions, module) in permissions"
              :key="module"
            >
              <div class="card border border-gray-300 h-100 shadow-sm">
                <!-- Module Header -->
                <div
                  class="card-header min-h-60px px-6 bg-light d-flex align-items-center justify-content-between"
                >
                  <h5 class="fw-bold text-gray-800 m-0">
                    {{ translate($formatName(module)) }}
                  </h5>

                  <!-- Select All in Module -->
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input h-20px w-20px"
                      type="checkbox"
                      :checked="isModuleAllSelected(module, actions)"
                      @change="
                        (e) =>
                          toggleSelectModule(module, actions, e.target.checked)
                      "
                    />
                  </label>
                </div>

                <!-- Module Body (Action list) -->
                <div class="card-body px-6 py-4">
                  <div
                    class="d-flex align-items-center justify-content-between py-3 border-bottom border-gray-100 last-no-border"
                    v-for="action in actions"
                    :key="action"
                  >
                    <label
                      :for="`perm_${module}_${action}`"
                      class="text-gray-700 fw-semibold cursor-pointer mb-0"
                    >
                      {{ translate($formatName(action)) }}
                    </label>
                    <label
                      class="form-check form-check-custom form-check-solid"
                    >
                      <input
                        :id="`perm_${module}_${action}`"
                        class="form-check-input h-20px w-20px"
                        type="checkbox"
                        v-model="formData.permissions"
                        :value="`${action}_${module}`"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="card-footer d-flex justify-content-end py-6 px-9">
        <router-link
          :to="{ name: 'roles-listing' }"
          class="btn btn-light btn-active-light-primary me-2"
        >
          {{ translate("Discard") }}
        </router-link>
        <button
          type="submit"
          class="btn btn-primary"
          :data-kt-indicator="loading ? 'on' : 'off'"
          :disabled="loading || loadingPermissions"
        >
          <span class="indicator-label">{{ translate("Submit") }}</span>
          <span class="indicator-progress">
            {{ translate("Please wait...") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import RoleService from "@/core/services/RoleService";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";
import { useApiValidation } from "@/core/composables/useApiValidation";

export default defineComponent({
  name: "RoleFormPage",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const loadingPermissions = ref(false);
    const permissions = ref<Record<string, string[]>>({});
    const validation = useApiValidation();

    const roleId = route.params.id ? Number(route.params.id) : null;

    const formData = ref({
      name: "",
      permissions: [] as string[],
    });

    const calculateAllPermissions = () => {
      const all: string[] = [];
      for (const module in permissions.value) {
        permissions.value[module].forEach((perm: string) => {
          all.push(`${perm}_${module}`);
        });
      }
      return all;
    };

    const isAllSelected = computed(() => {
      const all = calculateAllPermissions();
      if (all.length === 0) return false;
      return all.every((p) => formData.value.permissions.includes(p));
    });

    const toggleSelectAll = (e: any) => {
      if (e.target.checked) {
        formData.value.permissions = calculateAllPermissions();
      } else {
        formData.value.permissions = [];
      }
    };

    const isModuleAllSelected = (module: string, actions: string[]) => {
      if (!actions || actions.length === 0) return false;
      return actions.every((action) =>
        formData.value.permissions.includes(`${action}_${module}`),
      );
    };

    const toggleSelectModule = (
      module: string,
      actions: string[],
      checked: boolean,
    ) => {
      const modulePerms = actions.map((action) => `${action}_${module}`);
      if (checked) {
        // Add all permissions from this module ensuring uniqueness
        formData.value.permissions = [
          ...new Set([...formData.value.permissions, ...modulePerms]),
        ];
      } else {
        // Remove all permissions belonging to this module
        formData.value.permissions = formData.value.permissions.filter(
          (p) => !modulePerms.includes(p),
        );
      }
    };

    const fetchPermissions = async () => {
      loadingPermissions.value = true;
      try {
        const permsData = await RoleService.getPermissions();
        permissions.value = permsData || {};
      } catch (err) {
        console.error("Failed to load permissions:", err);
        showErrorAlert(translate("Error fetching permissions"));
      } finally {
        loadingPermissions.value = false;
      }
    };

    const fetchRoleData = async () => {
      if (!roleId) return;
      loading.value = true;
      try {
        const role = await RoleService.get(roleId);
        if (role) {
          if (role.isSuperAdmin) {
            showErrorAlert(translate("Super Admin role cannot be modified."));
            router.push({ name: "roles-listing" });
            return;
          }
          formData.value.name = role.name;
          formData.value.permissions = [];

          if (Array.isArray(role.permissions)) {
            formData.value.permissions = role.permissions;
          } else if (role.permissions && typeof role.permissions === "object") {
            // Flatten grouped permissions from backend and filter invalid ones
            Object.keys(role.permissions).forEach((key) => {
              const perms = role.permissions[key];
              const validActions = permissions.value[key] || [];
              if (Array.isArray(perms)) {
                perms.forEach((p) => {
                  if (validActions.includes(p)) {
                    formData.value.permissions.push(`${p}_${key}`);
                  }
                });
              }
            });
          }
        }
      } catch (err) {
        console.error("Failed to load role details:", err);
        showErrorAlert(translate("Error fetching role data"));
        router.push({ name: "roles-listing" });
      } finally {
        loading.value = false;
      }
    };

    const submit = () => {
      validation.clearErrors();

      if (formData.value.permissions.length === 0) {
        showErrorAlert(translate("Please select at least one permission."));
        return;
      }

      loading.value = true;

      // Format permissions back to grouped backend structure: { module: ['action1', 'action2'] }
      const groupedPermissions: Record<string, string[]> = {};
      formData.value.permissions.forEach((permString) => {
        for (const module in permissions.value) {
          if (permString.endsWith(`_${module}`)) {
            const action = permString.substring(
              0,
              permString.length - module.length - 1,
            );
            if (!groupedPermissions[module]) {
              groupedPermissions[module] = [];
            }
            groupedPermissions[module].push(action);
            break;
          }
        }
      });

      const payload = {
        name: formData.value.name,
        permissions: groupedPermissions,
      };

      const serviceCall = roleId
        ? RoleService.update(roleId, payload)
        : RoleService.create(payload);

      serviceCall
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Role submitted successfully!")).then(
            () => {
              router.push({ name: "roles-listing" });
            },
          );
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            const err =
              error.response?.data?.message || translate("An error occurred");
            showErrorAlert(err as string);
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    onMounted(async () => {
      await fetchPermissions();
      if (roleId) {
        await fetchRoleData();
      }
    });

    return {
      roleId,
      formData,
      permissions,
      loading,
      loadingPermissions,
      validation,
      isAllSelected,
      toggleSelectAll,
      isModuleAllSelected,
      toggleSelectModule,
      submit,
      translate,
    };
  },
});
</script>

<style scoped>
.last-no-border:last-child {
  border-bottom: 0 !important;
}
.rtl-flip {
  transform: scaleX(-1);
}
</style>
