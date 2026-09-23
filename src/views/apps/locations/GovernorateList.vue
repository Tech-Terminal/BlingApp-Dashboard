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
            class="form-control w-100 w-md-250px ps-15"
            :placeholder="translate('Search Governorates')"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <div class="d-flex justify-content-end">
          <router-link
            :to="{ name: 'governorate-create' }"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ translate("Add Governorate") }}
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
              <th class="min-w-50px">ID</th>
              <th class="min-w-150px">{{ translate("English Name") }}</th>
              <th class="min-w-150px">{{ translate("Arabic Name") }}</th>
              <th class="min-w-100px">{{ translate("Areas Count") }}</th>
              <th class="text-end min-w-125px">{{ translate("Actions") }}</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="gov in governorates" :key="gov.id">
              <td>{{ gov.id }}</td>
              <td class="text-gray-800 fw-bold">{{ gov.nameEn || gov.name_en }}</td>
              <td class="text-gray-800 fw-bold">{{ gov.nameAr || gov.name_ar }}</td>
              <td>
                <router-link
                  :to="{
                    name: 'areas-listing',
                    query: { governorateId: gov.id },
                  }"
                  class="badge badge-light-primary fw-bold text-hover-primary"
                >
                  <KTIcon icon-name="geolocation" icon-class="fs-6 me-1" />
                  {{ gov.areasCount ?? (gov.areas ? gov.areas.length : 0) }} {{ translate("Areas") }}
                </router-link>
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
                  class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-150px py-4"
                  data-kt-menu="true"
                >

                  <!--begin::Menu item-->
                  <div class="menu-item px-3">
                    <router-link
                      :to="{
                        name: 'governorate-edit',
                        params: { id: gov.id },
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
                      @click="deleteGovernorate(gov)"
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
            fetchGovernorates(page);
          }
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated, nextTick } from "vue";
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
import { MenuComponent } from "@/assets/ts/components";

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
    const search = ref("");

    const fetchGovernorates = (page = 1) => {
      loading.value = true;
      GovernorateService.getAll({
        page,
        search: search.value,
      })
        .then((res: any) => {
          governorates.value = res?.data || [];
          pagination.value = res?.meta || { currentPage: 1, totalPages: 1 };
        })
        .catch(() => {
          governorates.value = [];
        })
        .finally(() => {
          loading.value = false;
          nextTick(() => {
            MenuComponent.reinitialization();
          });
        });
    };

    let timer: any;
    const searchGovernorates = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetchGovernorates(1);
      }, 400);
    };

    const deleteGovernorate = (gov: any) => {
      if (gov.areasCount && gov.areasCount > 0) {
        showErrorAlert(
          translate(
            "Cannot delete governorate because it has associated areas.",
          ),
        );
        return;
      }

      showConfirmationAlert(
        translate("Are you sure you want to delete this governorate?"),
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
      fetchGovernorates();
    });

    onUpdated(() => {
      MenuComponent.reinitialization();
    });

    return {
      governorates,
      pagination,
      loading,
      search,
      translate,
      fetchGovernorates,
      searchGovernorates,
      deleteGovernorate,
    };
  },
});
</script>
