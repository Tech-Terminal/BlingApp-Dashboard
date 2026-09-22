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
            @input="searchGovernorates()"
            class="form-control form-control-solid w-100 w-md-250px ps-15"
            :placeholder="translate('Search Governorates')"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-primary"
            @click="openCreateModal()"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ translate("Add Governorate") }}
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

      <div v-else-if="!loading && (!governorates || governorates.length === 0)">
        <EmptyState
          :title="translate('No Governorates Found')"
          :description="
            translate('Try adjusting your search or add a new governorate.')
          "
          icon="geolocation"
        />
      </div>

      <div v-else class="table-responsive">
        <table
          class="table align-middle table-row-dashed fs-6 gy-5"
          id="kt_governorates_table"
        >
          <thead>
            <tr
              class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0"
            >
              <th class="min-w-50px">#</th>
              <th class="min-w-150px">{{ translate("English Name") }}</th>
              <th class="min-w-150px">{{ translate("Arabic Name") }}</th>
              <th class="min-w-100px">{{ translate("Areas Count") }}</th>
              <th class="text-end min-w-125px">{{ translate("Actions") }}</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="gov in governorates" :key="gov.id">
              <td>{{ gov.id }}</td>
              <td class="text-gray-800 fw-bold">{{ gov.nameEn }}</td>
              <td class="text-gray-800 fw-bold">{{ gov.nameAr }}</td>
              <td>
                <router-link
                  :to="{
                    name: 'areas-listing',
                    query: { governorateId: gov.id },
                  }"
                  class="badge badge-light-primary fw-bold text-hover-primary"
                >
                  <KTIcon icon-name="geolocation" icon-class="fs-6 me-1" />
                  {{ gov.areasCount ?? 0 }} {{ translate("Areas") }}
                </router-link>
              </td>
              <td class="text-end">
                <div class="d-flex justify-content-end flex-shrink-0">
                  <router-link
                    :to="{
                      name: 'areas-listing',
                      query: { governorateId: gov.id },
                    }"
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                    :title="translate('View Areas')"
                  >
                    <KTIcon icon-name="eye" icon-class="fs-3" />
                  </router-link>

                  <button
                    type="button"
                    class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                    @click="openEditModal(gov)"
                    :title="translate('Edit')"
                  >
                    <KTIcon icon-name="pencil" icon-class="fs-3" />
                  </button>

                  <button
                    type="button"
                    class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                    @click="deleteGovernorate(gov)"
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
            fetchGovernorates(page);
          }
        "
      />
    </div>

    <!-- Modal Form -->
    <div
      class="modal fade"
      id="kt_modal_governorate"
      ref="governorateModalRef"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered mw-650px">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="fw-bold">
              {{
                isEditing
                  ? translate("Edit Governorate")
                  : translate("Add Governorate")
              }}
            </h2>
            <div
              class="btn btn-icon btn-sm btn-active-icon-primary"
              data-bs-dismiss="modal"
              @click="closeModal()"
            >
              <KTIcon icon-name="cross" icon-class="fs-1" />
            </div>
          </div>

          <form @submit.prevent="saveGovernorate()">
            <div class="modal-body py-10 px-lg-17">
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
  name: "GovernorateList",
  components: {
    KTIcon,
    KTPagination,
    EmptyState,
  },
  setup() {
    const governorates = ref<any[]>([]);
    const pagination = ref<any>({ currentPage: 1, totalPages: 1 });
    const loading = ref(false);
    const saving = ref(false);
    const search = ref("");
    const isEditing = ref(false);
    const editingId = ref<number | null>(null);
    const governorateModalRef = ref<null | HTMLElement>(null);
    let modalInstance: Modal | null = null;

    const form = ref({
      nameEn: "",
      nameAr: "",
    });

    const fetchGovernorates = (page = 1) => {
      loading.value = true;
      GovernorateService.getAll({
        page,
        search: search.value,
      })
        .then(({ data, meta }) => {
          governorates.value = data || [];
          pagination.value = meta || { currentPage: 1, totalPages: 1 };
        })
        .finally(() => {
          loading.value = false;
        });
    };

    let timer: any;
    const searchGovernorates = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetchGovernorates(1);
      }, 400);
    };

    const openCreateModal = () => {
      isEditing.value = false;
      editingId.value = null;
      form.value = { nameEn: "", nameAr: "" };
      if (!modalInstance && governorateModalRef.value) {
        modalInstance = new Modal(governorateModalRef.value);
      }
      modalInstance?.show();
    };

    const openEditModal = (gov: any) => {
      isEditing.value = true;
      editingId.value = gov.id;
      form.value = {
        nameEn: gov.nameEn,
        nameAr: gov.nameAr,
      };
      if (!modalInstance && governorateModalRef.value) {
        modalInstance = new Modal(governorateModalRef.value);
      }
      modalInstance?.show();
    };

    const closeModal = () => {
      modalInstance?.hide();
    };

    const saveGovernorate = () => {
      saving.value = true;
      const action =
        isEditing.value && editingId.value
          ? GovernorateService.update(`${editingId.value}`, form.value)
          : GovernorateService.create(form.value);

      action
        .then(() => {
          closeModal();
          showSuccessAlert(
            isEditing.value
              ? translate("Governorate updated successfully!")
              : translate("Governorate created successfully!"),
          );
          fetchGovernorates(pagination.value.currentPage);
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

    const deleteGovernorate = (gov: any) => {
      showConfirmationAlert(
        translate(
          "Are you sure you want to delete this governorate? All associated areas will be deleted as well.",
        ),
      ).then((result) => {
        if (result.isConfirmed) {
          GovernorateService.delete(gov.id)
            .then(() => {
              showSuccessAlert(translate("Governorate deleted successfully!"));
              fetchGovernorates(pagination.value.currentPage);
            })
            .catch(({ response }) => {
              const error =
                response?.data?.message ||
                translate("Error deleting governorate");
              showErrorAlert(error);
            });
        }
      });
    };

    onMounted(() => {
      if (governorateModalRef.value) {
        modalInstance = new Modal(governorateModalRef.value);
      }
      fetchGovernorates();
    });

    return {
      governorates,
      pagination,
      loading,
      saving,
      search,
      form,
      isEditing,
      governorateModalRef,
      translate,
      fetchGovernorates,
      searchGovernorates,
      openCreateModal,
      openEditModal,
      closeModal,
      saveGovernorate,
      deleteGovernorate,
    };
  },
});
</script>
