<template>
  <div
    class="modal fade"
    id="kt_modal_role_form"
    ref="roleModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-800px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header">
          <!--begin::Modal title-->
          <h2 class="fw-bold" v-if="role && role.id">
            {{ translate("Update Role") }}
          </h2>
          <h2 class="fw-bold" v-else>{{ translate("Add a Role") }}</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            class="btn btn-icon btn-sm btn-active-icon-primary"
            data-bs-dismiss="modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->

        <!--begin::Modal body-->
        <div class="modal-body scroll-y mx-5 my-7">
          <!--begin::Form-->
          <form
            @submit.prevent="submit()"
            id="kt_modal_role_form_element"
            class="form"
          >
            <!--begin::Scroll-->
            <div
              class="d-flex flex-column scroll-y me-n7 pe-7"
              id="kt_modal_role_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_role_header"
              data-kt-scroll-wrappers="#kt_modal_role_scroll"
              data-kt-scroll-offset="300px"
              style="max-height: 600px"
            >
              <!--begin::Input group-->
              <div class="row mb-6">
                <!--begin::Col-->
                <div class="col-md-12 fv-row">
                  <label class="required fs-6 fw-semobold mb-2">{{
                    translate("Name")
                  }}</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': validation.hasError('name') }"
                    v-model="formData.name"
                    :placeholder="translate('Role Name')"
                  />
                  <div
                    class="invalid-feedback"
                    v-if="validation.hasError('name')"
                  >
                    {{ validation.getError("name") }}
                  </div>
                </div>
                <!--end::Col-->
              </div>
              <!--end::Input group-->

              <!--begin::Permissions-->
              <div class="fv-row">
                <label class="fs-5 fw-bold form-label mb-2">{{
                  translate("Role Permissions")
                }}</label>

                <div class="table-responsive">
                  <table class="table align-middle table-row-dashed fs-6 gy-5">
                    <tbody class="text-gray-600 fw-semobold">
                      <tr>
                        <td class="align-middle" colspan="2">
                          <div class="d-flex align-items-center">
                            <div class="text-gray-800 me-5">
                              {{ translate("Administrator Access") }}
                              <i
                                class="fas fa-exclamation-circle ms-1 fs-7"
                                data-bs-toggle="tooltip"
                                title="Allows a full access to the system"
                              ></i>
                            </div>
                            <label
                              class="form-check form-switch form-check-sm mx-5 mb-2"
                            >
                              <input
                                class="form-check-input w-35px h-20px"
                                type="checkbox"
                                :checked="isAllSelected"
                                @change="toggleSelectAll"
                              />
                              <span class="form-check-label">{{
                                translate("Select all")
                              }}</span>
                            </label>
                          </div>
                        </td>
                      </tr>

                      <tr
                        v-for="(modulePermissions, module) in permissions"
                        :key="module"
                      >
                        <td class="text-gray-800 text-capitalize align-middle">
                          {{ translate($formatName(module.toString())) }}
                        </td>
                        <td class="align-middle">
                          <div class="d-flex flex-wrap gap-4">
                            <label
                              class="form-check form-check-sm form-check-custom form-check-solid mx-5 mb-2"
                              v-for="permission in modulePermissions"
                              :key="permission"
                            >
                              <input
                                class="form-check-input"
                                type="checkbox"
                                :value="permission + '_' + module"
                                v-model="formData.permissions"
                              />
                              <span class="form-check-label text-capitalize">
                                {{
                                  translate($formatName(permission.toString()))
                                }}
                              </span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    v-if="formData.permissions.length === 0 && submitAttempted"
                    class="text-danger fs-7"
                  >
                    {{ translate("Please select at least one permission.") }}
                  </div>
                </div>
              </div>
              <!--end::Permissions-->
            </div>
            <!--end::Scroll-->

            <!--begin::Actions-->
            <div class="text-center pt-15">
              <button
                type="reset"
                id="kt_modal_role_cancel"
                class="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                {{ translate("Discard") }}
              </button>

              <button
                type="submit"
                id="kt_modal_role_submit"
                class="btn btn-primary"
                :data-kt-indicator="loading ? 'on' : 'off'"
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
            <!--end::Actions-->
          </form>
          <!--end::Form-->
        </div>
        <!--end::Modal body-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import RoleService from "@/core/services/RoleService";
import { hideModal } from "@/core/helpers/modal";
import { translate } from "@/core/helpers/i18n-utils";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";
import { useApiValidation } from "@/core/composables/useApiValidation";

export default defineComponent({
  name: "RoleFormModal",
  components: { KTIcon },
  props: {
    role: {
      type: Object,
      default: () => ({}),
    },
    permissions: {
      type: Object, // Expecting grouped permissions from API
      default: () => ({}),
    },
  },
  emits: ["submitted"],
  setup(props, { emit }) {
    const roleModalRef = ref<HTMLElement | null>(null);
    const loading = ref(false);
    const submitAttempted = ref(false);
    const validation = useApiValidation();

    const formData = ref({
      name: "",
      permissions: [] as string[],
    });

    watch(
      () => props.role,
      (newRole) => {
        validation.clearErrors();
        if (newRole && newRole.id) {
          formData.value = {
            name: newRole.name,
            permissions: [],
          };

          if (Array.isArray(newRole.permissions)) {
            formData.value.permissions = newRole.permissions;
          } else if (
            newRole.permissions &&
            typeof newRole.permissions === "object"
          ) {
            // Flatten grouped permissions object to array of strings
            Object.keys(newRole.permissions).forEach((key) => {
              const perms = newRole.permissions[key];
              if (Array.isArray(perms)) {
                perms.forEach((p) => {
                  formData.value.permissions.push(`${p}_${key}`);
                });
              }
            });
          }
        } else {
          formData.value = {
            name: "",
            permissions: [],
          };
        }
      },
      { immediate: true },
    );

    const calculateAllPermissions = () => {
      const all: string[] = [];
      for (const module in props.permissions) {
        props.permissions[module].forEach((perm: string) => {
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

    const submit = () => {
      submitAttempted.value = true;
      validation.clearErrors();

      // Manual Validation for permissions (others handled by HTML5 required)
      if (formData.value.permissions.length === 0) {
        return;
      }

      loading.value = true;
      const isUpdate = !!props.role.id;

      // Group back permissions to { module: ['action1', 'action2'] } format
      const groupedPermissions: Record<string, string[]> = {};
      formData.value.permissions.forEach((permString) => {
        for (const module in props.permissions) {
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
        ...formData.value,
        permissions: groupedPermissions,
      };

      const serviceCall = isUpdate
        ? RoleService.update(props.role.id, payload)
        : RoleService.create(payload);

      serviceCall
        .then(() => {
          loading.value = false;
          validation.clearErrors();
          hideModal(roleModalRef.value);
          emit("submitted");
          showSuccessAlert(translate("Role submitted successfully!"));
        })
        .catch((error) => {
          loading.value = false;
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            const err = error.response?.data?.message || "An error occurred";
            showErrorAlert(err as string);
          }
        });
    };

    return {
      formData,
      submit,
      loading,
      roleModalRef,
      translate,
      isAllSelected,
      toggleSelectAll,
      submitAttempted,
      validation,
    };
  },
});
</script>
