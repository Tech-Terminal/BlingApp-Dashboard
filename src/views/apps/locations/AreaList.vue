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
            class="form-control form-control-solid w-100 w-md-250px ps-15"
            :placeholder="translate('Search Areas')"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <div class="d-flex justify-content-end align-items-center gap-3">
          <!-- Filter by Governorate -->
          <div class="w-200px">
            <select
              class="form-select form-select-solid"
              v-model="selectedGovernorateId"
              @change="fetchAreas(1)"
            >
              <option :value="null">{{ translate("All Governorates") }}</option>
              <option
                v-for="gov in governoratesList"
                :key="gov.id"
                :value="gov.id"
              >
                {{ gov.nameEn }} ({{ gov.nameAr }})
              </option>
            </select>
          </div>

          <button
            type="button"
            class="btn btn-primary"
            @click="openCreateModal()"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ translate("Add Area") }}
          </button>
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
            translate(
              'Try adjusting your search or select another governorate.',
            )
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
              <th class="min-w-50px">#</th>
              <th class="min-w-150px">{{ translate("English Name") }}</th>
              <th class="min-w-150px">{{ translate("Arabic Name") }}</th>
              <th class="min-w-150px">{{ translate("Governorate") }}</th>
              <th class="text-end min-w-100px">{{ translate("Actions") }}</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="area in areas" :key="area.id">
              <td>{{ area.id }}</td>
              <td class="text-gray-800 fw-bold">{{ area.nameEn }}</td>
              <td class="text-gray-800 fw-bold">{{ area.nameAr }}</td>
              <td>
                <span class="badge badge-light-info fw-bold">
                  {{
                    area.governorate?.nameEn || area.governorate?.nameAr || "-"
                  }}
                </span>
              </td>
              <td class="text-end">
                <div class="d-flex justify-content-end flex-shrink-0">
                  <button
                    type="button"
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                    @click="openEditModal(area)"
                    :title="translate('Edit')"
                  >
                    <KTIcon icon-name="pencil" icon-class="fs-3" />
                  </button>

                  <button
                    type="button"
                    class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                    @click="deleteArea(area)"
                    :title="translate('Delete')"
                  >
                    <KTIcon icon-name="trash" icon-class="fs-3" />
                  </button>
                </div>
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

    <!-- Modal Form -->
    <div
      class="modal fade"
      id="kt_modal_area"
      ref="areaModalRef"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered mw-650px">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="fw-bold">
              {{ isEditing ? translate("Edit Area") : translate("Add Area") }}
            </h2>
            <div
              class="btn btn-icon btn-sm btn-active-icon-primary"
              data-bs-dismiss="modal"
              @click="closeModal()"
            >
              <KTIcon icon-name="cross" icon-class="fs-1" />
            </div>
          </div>

          <form @submit.prevent="saveArea()">
            <div class="modal-body py-10 px-lg-17">
              <!-- Governorate Select -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">
                  {{ translate("Governorate") }}
                </label>
                <select
                  class="form-select form-select-solid"
                  v-model="form.governorateId"
                  required
                >
                  <option :value="null" disabled>
                    {{ translate("Select Governorate") }}
                  </option>
                  <option
                    v-for="gov in governoratesList"
                    :key="gov.id"
                    :value="gov.id"
                  >
                    {{ gov.nameEn }} ({{ gov.nameAr }})
                  </option>
                </select>
              </div>

              <!-- Name EN -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">
                  {{ translate("English Name") }}
                </label>
                <input
                  type="text"
                  class="form-control form-control-solid"
                  v-model="form.nameEn"
                  required
                  :placeholder="translate('Enter English Name')"
                />
              </div>

              <!-- Name AR -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">
                  {{ translate("Arabic Name") }}
                </label>
                <input
                  type="text"
                  class="form-control form-control-solid"
                  v-model="form.nameAr"
                  required
                  :placeholder="translate('Enter Arabic Name')"
                />
              </div>
            </div>

            <div class="modal-footer flex-center">
              <button
                type="reset"
                class="btn btn-light me-3"
                data-bs-dismiss="modal"
                @click="closeModal()"
              >
                {{ translate("Cancel") }}
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span class="indicator-label" v-if="!saving">
                  {{ translate("Save") }}
                </span>
                <span class="indicator-progress d-block" v-else>
                  {{ translate("Please wait...") }}
                  <span
                    class="spinner-border spinner-border-sm align-middle ms-2"
                  ></span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import AreaService from "@/core/services/AreaService";
import GovernorateService from "@/core/services/GovernorateService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import KTPagination from "@/components/kt-datatable/KTPagination.vue";
import EmptyState from "@/components/utilities/EmptyState.vue";
import { translate } from "@/core/helpers/i18n-utils";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmationAlert,
} from "@/core/helpers/alert-utils";
import { Modal } from "bootstrap";

export default defineComponent({
  name: "AreaList",
  components: {
    KTIcon,
    KTPagination,
    EmptyState,
  },
  setup() {
    const route = useRoute();
    const areas = ref<any[]>([]);
    const governoratesList = ref<any[]>([]);
    const pagination = ref<any>({ currentPage: 1, totalPages: 1 });
    const loading = ref(false);
    const saving = ref(false);
    const search = ref("");
    const selectedGovernorateId = ref<number | null>(
      route.query.governorateId ? Number(route.query.governorateId) : null,
    );

    const isEditing = ref(false);
    const editingId = ref<number | null>(null);
    const areaModalRef = ref<null | HTMLElement>(null);
    let modalInstance: Modal | null = null;

    const form = ref({
      governorateId: null as number | null,
      nameEn: "",
      nameAr: "",
    });

    const loadGovernorates = () => {
      GovernorateService.getAll({ limit: 100 })
        .then(({ data }) => {
          governoratesList.value = data || [];
        })
        .catch(() => {});
    };

    const fetchAreas = (page = 1) => {
      loading.value = true;
      const params: any = {
        page,
        search: search.value,
      };
      if (selectedGovernorateId.value) {
        params.governorateId = selectedGovernorateId.value;
      }

      AreaService.getAll(params)
        .then(({ data, meta }) => {
          areas.value = data || [];
          pagination.value = meta || { currentPage: 1, totalPages: 1 };
        })
        .finally(() => {
          loading.value = false;
        });
    };

    let timer: any;
    const searchAreas = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetchAreas(1);
      }, 400);
    };

    const openCreateModal = () => {
      isEditing.value = false;
      editingId.value = null;
      form.value = {
        governorateId:
          selectedGovernorateId.value ||
          (governoratesList.value[0]?.id ?? null),
        nameEn: "",
        nameAr: "",
      };
      if (!modalInstance && areaModalRef.value) {
        modalInstance = new Modal(areaModalRef.value);
      }
      modalInstance?.show();
    };

    const openEditModal = (area: any) => {
      isEditing.value = true;
      editingId.value = area.id;
      form.value = {
        governorateId: area.governorateId,
        nameEn: area.nameEn,
        nameAr: area.nameAr,
      };
      if (!modalInstance && areaModalRef.value) {
        modalInstance = new Modal(areaModalRef.value);
      }
      modalInstance?.show();
    };

    const closeModal = () => {
      modalInstance?.hide();
    };

    const saveArea = () => {
      if (!form.value.governorateId) return;

      saving.value = true;
      const action =
        isEditing.value && editingId.value
          ? AreaService.update(`${editingId.value}`, form.value)
          : AreaService.create(form.value);

      action
        .then(() => {
          closeModal();
          showSuccessAlert(
            isEditing.value
              ? translate("Area updated successfully!")
              : translate("Area created successfully!"),
          );
          fetchAreas(pagination.value.currentPage);
        })
        .catch(({ response }) => {
          const error =
            response?.data?.message || translate("An error occurred");
          showErrorAlert(error);
        })
        .finally(() => {
          saving.value = false;
        });
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
      if (areaModalRef.value) {
        modalInstance = new Modal(areaModalRef.value);
      }
      loadGovernorates();
      fetchAreas();
    });

    return {
      areas,
      governoratesList,
      pagination,
      loading,
      saving,
      search,
      selectedGovernorateId,
      form,
      isEditing,
      areaModalRef,
      translate,
      fetchAreas,
      searchAreas,
      openCreateModal,
      openEditModal,
      closeModal,
      saveArea,
      deleteArea,
    };
  },
});
</script>
