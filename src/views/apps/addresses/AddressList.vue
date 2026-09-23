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
            @input="onSearchInput()"
            class="form-control w-100 w-md-300px ps-15"
            :placeholder="translate('Search Addresses (label, street, block...)')"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <router-link
          :to="{ name: 'address-create' }"
          class="btn btn-primary"
        >
          <KTIcon icon-name="plus" icon-class="fs-2" />
          {{ translate("Add Address") }}
        </router-link>
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

      <div v-else-if="!loading && (!addresses || addresses.length === 0)">
        <EmptyState
          :title="translate('No Addresses Found')"
          :description="
            translate('Try adjusting your search to find client addresses.')
          "
          icon="geolocation"
        />
      </div>

      <div v-else class="table-responsive">
        <table
          class="table align-middle table-row-dashed fs-6 gy-5"
          id="kt_addresses_table"
        >
          <thead>
            <tr
              class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0"
            >
              <th class="min-w-50px">ID</th>
              <th class="min-w-180px">{{ translate("Client") }}</th>
              <th class="min-w-120px">{{ translate("Label") }}</th>
              <th class="min-w-150px">{{ translate("Location") }}</th>
              <th class="min-w-220px">{{ translate("Address Details") }}</th>
              <th class="min-w-160px text-center">{{ translate("Map / Pin") }}</th>
              <th class="min-w-100px">{{ translate("Added") }}</th>
              <th class="text-end min-w-100px">{{ translate("Actions") }}</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="address in addresses" :key="address.id">
              <td>
                <router-link
                  :to="{ name: 'address-details', params: { id: address.id } }"
                  class="text-gray-800 text-hover-primary fw-bold"
                >
                  #{{ address.id }}
                </router-link>
              </td>
              <td>
                <div class="d-flex align-items-center" v-if="address.client">
                  <!--begin::Avatar-->
                  <div
                    class="symbol symbol-circle symbol-40px overflow-hidden me-3"
                  >
                    <img
                      :src="address.client.image"
                      :alt="address.client.name"
                      class="w-100"
                      v-if="address.client.image"
                    />
                    <span
                      v-else
                      class="symbol-label bg-light-primary text-primary fs-6 fw-bold"
                    >
                      {{ address.client.name ? address.client.name.charAt(0).toUpperCase() : "C" }}
                    </span>
                  </div>
                  <!--end::Avatar-->
                  <!--begin::Details-->
                  <div class="d-flex flex-column">
                    <div class="d-flex align-items-center gap-2">
                      <router-link
                        :to="{ name: 'client-details', params: { id: address.clientId } }"
                        class="text-gray-800 text-hover-primary fw-bold mb-1"
                      >
                        {{ address.client.name }}
                      </router-link>
                      <span
                        v-if="address.client.deletedAt"
                        class="badge badge-light-danger fw-bold fs-9"
                      >
                        {{ translate("Deleted") }}
                      </span>
                    </div>
                    <span class="text-muted fs-7 font-monospace" dir="ltr">{{ address.client.phone }}</span>
                  </div>
                  <!--end::Details-->
                </div>
                <span v-else class="text-muted">#{{ address.clientId }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center flex-wrap gap-1">
                  <router-link
                    :to="{ name: 'address-details', params: { id: address.id } }"
                    class="badge badge-light-dark fw-bold text-hover-primary"
                  >
                    {{ address.label }}
                  </router-link>
                  <span
                    v-if="address.isDefault"
                    class="badge badge-light-primary fw-bold fs-8"
                  >
                    {{ translate("Default") }}
                  </span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800 fw-bold">
                    {{ (isArabic ? address.governorate?.nameAr : address.governorate?.nameEn) || address.governorate?.nameAr || address.governorate?.nameEn || translate("Governorate") }}
                  </span>
                  <span class="text-muted fs-7">
                    {{ (isArabic ? address.area?.nameAr : address.area?.nameEn) || address.area?.nameAr || address.area?.nameEn || translate("Area") }}
                  </span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column">
                  <span class="text-gray-800">
                    <span class="fw-bold">{{ translate("Street") }}:</span> {{ address.street }},
                    <span class="fw-bold">{{ translate("Block") }}:</span> {{ address.block }},
                    <span class="fw-bold">{{ translate("Building") }}:</span> {{ address.houseNumber }}
                  </span>
                  <span
                    v-if="address.additionalDetails"
                    class="text-muted fs-7 text-truncate mw-250px"
                    :title="address.additionalDetails"
                  >
                    {{ address.additionalDetails }}
                  </span>
                </div>
              </td>
              <td class="text-center">
                <a
                  v-if="address.lat && address.long"
                  :href="`https://www.google.com/maps?q=${address.lat},${address.long}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-sm btn-light-primary fw-bold text-nowrap d-inline-flex align-items-center gap-1"
                >
                  <KTIcon icon-name="geolocation" icon-class="fs-4" />
                  <span>{{ translate("Open in Google Maps") }}</span>
                </a>
                <span v-else class="badge badge-light-secondary fs-8">
                  {{ translate("No Pin") }}
                </span>
              </td>
              <td>
                <span class="text-gray-600 fs-7">{{ formatDate(address.createdAt) }}</span>
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
                  class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-175px py-4"
                  data-kt-menu="true"
                >
                  <!--begin::Menu item: View Address Details-->
                  <div class="menu-item px-3">
                    <router-link
                      :to="{ name: 'address-details', params: { id: address.id } }"
                      class="menu-link px-3 d-flex justify-content-between align-items-center"
                    >
                      <span>{{ translate("Address Details") }}</span>
                      <KTIcon
                        icon-name="eye"
                        icon-class="fs-3 text-primary"
                      />
                    </router-link>
                  </div>
                  <!--end::Menu item-->
                  <!--begin::Menu item: Edit Address-->
                  <div class="menu-item px-3">
                    <router-link
                      :to="{ name: 'address-edit', params: { id: address.id } }"
                      class="menu-link px-3 d-flex justify-content-between align-items-center"
                    >
                      <span>{{ translate("Edit Address") }}</span>
                      <KTIcon
                        icon-name="pencil"
                        icon-class="fs-3 text-info"
                      />
                    </router-link>
                  </div>
                  <!--end::Menu item-->
                  <!--begin::Menu item: View Client-->
                  <div class="menu-item px-3">
                    <router-link
                      :to="{ name: 'client-details', params: { id: address.clientId } }"
                      class="menu-link px-3 d-flex justify-content-between align-items-center"
                    >
                      <span>{{ translate("View Client") }}</span>
                      <KTIcon
                        icon-name="profile-user"
                        icon-class="fs-3 text-info"
                      />
                    </router-link>
                  </div>
                  <!--end::Menu item-->
                  <!--begin::Menu item: Delete-->
                  <div class="menu-item px-3">
                    <a
                      @click="deleteAddress(address)"
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
            fetchAddresses(page);
          }
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated, nextTick, computed } from "vue";
import AddressService, { type AddressData } from "@/core/services/AddressService";
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
import i18n from "@/core/plugins/i18n";

export default defineComponent({
  name: "AddressList",
  components: {
    KTIcon,
    KTPagination,
    EmptyState,
  },
  setup() {
    const addresses = ref<AddressData[]>([]);
    const pagination = ref<any>({ currentPage: 1, totalPages: 1 });
    const loading = ref(false);
    const search = ref("");
    let searchTimeout: any = null;

    const isArabic = computed(
      () =>
        (i18n.global.locale as any)?.value === "ar" ||
        i18n.global.locale === "ar",
    );

    const fetchAddresses = (page = 1) => {
      loading.value = true;
      const params: any = {
        page,
        limit: 10,
      };

      if (search.value.trim()) {
        params.search = search.value.trim();
      }

      AddressService.getAll(params)
        .then(({ data, meta }) => {
          addresses.value = data || [];
          pagination.value = meta || { currentPage: 1, totalPages: 1 };
        })
        .catch((error) => {
          showErrorAlert(
            error?.response?.data?.message || translate("Failed to fetch addresses"),
          );
        })
        .finally(() => {
          loading.value = false;
          nextTick(() => {
            MenuComponent.reinitialization();
          });
        });
    };

    const onSearchInput = () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchAddresses(1);
      }, 400);
    };

    const deleteAddress = (address: AddressData) => {
      const label = address.label || "";
      showConfirmationAlert({
        title: translate("Delete Address?"),
        text: `${translate("Are you sure you want to delete")} "${label}"? ${translate("This address will be deleted.")}`,
        icon: "error",
        confirmButtonText: translate("Yes, delete"),
        confirmButtonClass: "btn-danger",
      }).then((result) => {
        if (result.isConfirmed) {
          AddressService.delete(address.id)
            .then(() => {
              showSuccessAlert(translate("Address deleted successfully."));
              fetchAddresses(pagination.value.currentPage);
            })
            .catch((error) => {
              showErrorAlert(
                error?.response?.data?.message || translate("Failed to delete address"),
              );
            });
        }
      });
    };

    const formatDate = (dateString?: string) => {
      if (!dateString) return translate("N/A");
      try {
        return new Date(dateString).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch {
        return dateString;
      }
    };

    onMounted(() => {
      fetchAddresses();
    });

    onUpdated(() => {
      MenuComponent.reinitialization();
    });

    return {
      addresses,
      pagination,
      loading,
      search,
      isArabic,
      fetchAddresses,
      onSearchInput,
      deleteAddress,
      formatDate,
      translate,
    };
  },
});
</script>
