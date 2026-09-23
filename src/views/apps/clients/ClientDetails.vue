<template>
  <div
    v-if="loading"
    class="d-flex justify-content-center align-items-center py-10 min-h-300px"
  >
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">{{ translate("Loading...") }}</span>
    </div>
  </div>

  <div v-else-if="client">
    <!-- Back Header -->
    <div
      class="d-flex flex-wrap align-items-center justify-content-between gap-4 mb-7"
    >
      <div class="d-flex align-items-center">
        <router-link
          :to="{ name: 'clients-listing' }"
          class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px me-3"
        >
          <i class="bi bi-arrow-left fs-2 rtl-flip"></i>
        </router-link>
        <div class="d-flex align-items-center gap-4">
          <div class="symbol symbol-50px symbol-circle">
            <img :src="client.image" v-if="client.image" :alt="client.name" />
            <span
              v-else
              class="symbol-label bg-light-primary text-primary fs-3 fw-bold"
            >
              {{ client.name?.charAt(0).toUpperCase() || "C" }}
            </span>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2">
              <h1 class="text-gray-900 fw-bold m-0 fs-2">
                {{ client.name }}
              </h1>
              <span class="badge badge-light-secondary fs-8 fw-bold">
                #{{ client.id }}
              </span>
            </div>
            <span
              :class="`badge badge-light-${client.isActive ? 'success' : 'danger'} mt-1`"
            >
              {{ client.isActive ? translate("Active") : translate("Inactive") }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex align-items-center gap-2">
        <router-link
          :to="{ name: 'client-edit', params: { id: client.id } }"
          class="btn btn-sm btn-light-primary"
        >
          <KTIcon icon-name="pencil" icon-class="fs-3 me-1" />
          {{ translate("Edit Client") }}
        </router-link>

        <button
          type="button"
          class="btn btn-sm"
          :class="client.isActive ? 'btn-light-warning' : 'btn-light-success'"
          @click="toggleClientStatus()"
        >
          <KTIcon
            :icon-name="client.isActive ? 'cross-circle' : 'check-circle'"
            icon-class="fs-3 me-1"
          />
          {{
            client.isActive
              ? translate("Deactivate Client")
              : translate("Activate Client")
          }}
        </button>

        <button
          type="button"
          class="btn btn-sm btn-light-danger"
          @click="deleteClient()"
        >
          <KTIcon icon-name="trash" icon-class="fs-3 me-1" />
          {{ translate("Delete Client") }}
        </button>
      </div>
    </div>

    <!-- Client Info Card -->
    <div class="card mb-6">
      <div class="card-body py-5 px-7">
        <div class="row g-4">
          <!-- Client Name -->
          <div class="col-sm-6 col-lg-3 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-primary text-primary d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-person fs-3 text-primary"></i>
            </div>
            <div>
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Client Name") }}
              </div>
              <div class="text-gray-800 fw-bold fs-6">
                {{ client.name || "N/A" }}
              </div>
            </div>
          </div>

          <!-- Email -->
          <div class="col-sm-6 col-lg-3 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-primary text-primary d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-envelope fs-3 text-primary"></i>
            </div>
            <div class="min-w-0">
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Email Address") }}
              </div>
              <div class="text-gray-800 fw-bold fs-6 text-break">
                {{ client.email || translate("Not Provided") }}
              </div>
            </div>
          </div>

          <!-- Phone -->
          <div class="col-sm-6 col-lg-3 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-primary text-primary d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-telephone fs-3 text-primary"></i>
            </div>
            <div>
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Phone Number") }}
              </div>
              <div class="text-gray-800 fw-bold fs-6 font-monospace">
                {{ client.phone || "N/A" }}
              </div>
            </div>
          </div>

          <!-- Registration Date -->
          <div class="col-sm-6 col-lg-3 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-primary text-primary d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-calendar3 fs-3 text-primary"></i>
            </div>
            <div>
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Registration Date") }}
              </div>
              <div class="text-gray-800 fw-bold fs-6">
                {{ formatDate(client.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <ul
      class="nav nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-5 fw-semibold mb-6"
    >
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'addresses' }"
          @click.prevent="activeTab = 'addresses'"
          href="#"
        >
          <i class="bi bi-geo-alt me-2"></i>
          {{ translate("Addresses") }}
          <span class="badge badge-light-primary ms-2">{{
            addresses.length
          }}</span>
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'orders' }"
          @click.prevent="activeTab = 'orders'"
          href="#"
        >
          <i class="bi bi-bag-check me-2"></i>
          {{ translate("Orders") }}
          <span class="badge badge-light-info ms-2">0</span>
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'payments' }"
          @click.prevent="activeTab = 'payments'"
          href="#"
        >
          <i class="bi bi-credit-card me-2"></i>
          {{ translate("Payments") }}
          <span class="badge badge-light-success ms-2">0</span>
        </a>
      </li>
    </ul>

    <!-- Tab Content: Addresses -->
    <div v-show="activeTab === 'addresses'">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
              <KTIcon
                icon-name="magnifier"
                icon-class="fs-1 position-absolute ms-6"
              />
              <input
                type="text"
                v-model="addressSearch"
                class="form-control w-100 w-md-250px ps-15"
                :placeholder="translate('Search Addresses')"
              />
            </div>
          </div>
          <div class="card-toolbar d-flex align-items-center gap-3">
            <span class="badge badge-light-primary fs-7 fw-bold">
              {{ filteredAddresses.length }} {{ translate("Addresses") }}
            </span>
            <router-link
              :to="{ name: 'address-create', query: { clientId: client.id } }"
              class="btn btn-sm btn-primary"
            >
              <KTIcon icon-name="plus" icon-class="fs-3 me-1" />
              {{ translate("Add Address") }}
            </router-link>
          </div>
        </div>

        <div class="card-body pt-0">
          <div v-if="filteredAddresses.length === 0">
            <EmptyState
              :title="translate('No Addresses Found')"
              :description="
                translate('This client has not saved any addresses yet.')
              "
              icon="map"
            />
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle table-row-dashed fs-6 gy-5">
              <thead>
                <tr
                  class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0"
                >
                  <th class="min-w-50px">#</th>
                  <th class="min-w-125px">{{ translate("Label") }}</th>
                  <th class="min-w-150px">{{ translate("Location") }}</th>
                  <th class="min-w-200px">
                    {{ translate("Address Details") }}
                  </th>
                  <th class="min-w-120px">{{ translate("Map / Pin") }}</th>
                  <th class="min-w-120px">
                    {{ translate("Added") }}
                  </th>
                  <th class="min-w-120px text-end">
                    {{ translate("Actions") }}
                  </th>
                </tr>
              </thead>
              <tbody class="fw-semibold text-gray-600">
                <tr v-for="(addr, idx) in filteredAddresses" :key="addr.id">
                  <td>{{ idx + 1 }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <span class="text-gray-800 fw-bold me-2">{{
                        addr.label || translate("N/A")
                      }}</span>
                      <span
                        v-if="addr.isDefault"
                        class="badge badge-light-primary fw-bold fs-8"
                      >
                        {{ translate("Default") }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="text-gray-800 fw-bold">
                        {{
                          addr.governorate?.nameAr ||
                          addr.governorate?.nameEn ||
                          translate("Governorate")
                        }}
                      </span>
                      <span class="text-muted fs-7">
                        {{
                          addr.area?.nameAr ||
                          addr.area?.nameEn ||
                          translate("Area")
                        }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="text-gray-800">
                        <span class="fw-bold">{{ translate("Street") }}:</span>
                        {{ addr.street }},
                        <span class="fw-bold">{{ translate("Block") }}:</span>
                        {{ addr.block }}
                      </span>
                      <span class="text-gray-800">
                        <span class="fw-bold"
                          >{{ translate("Building/House") }}:</span
                        >
                        {{ addr.houseNumber }}
                      </span>
                      <span
                        v-if="addr.additionalDetails"
                        class="text-muted fs-7 mt-1"
                      >
                        <span class="fw-bold">{{ translate("Notes") }}:</span>
                        {{ addr.additionalDetails }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <a
                      v-if="addr.lat && addr.long"
                      :href="getMapUrl(addr.lat, addr.long)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-sm btn-light-primary fw-bold"
                      :title="translate('Open in Google Maps')"
                    >
                      <KTIcon icon-name="geolocation" icon-class="fs-5 me-1" />
                      {{ translate("View Map") }}
                    </a>
                    <span v-else class="text-muted fs-7">{{
                      translate("No Pin")
                    }}</span>
                  </td>
                  <td>
                    {{ formatDate(addr.createdAt) }}
                  </td>
                  <td class="text-end">
                    <div class="d-flex justify-content-end align-items-center gap-2">
                      <router-link
                        :to="{ name: 'address-details', params: { id: addr.id } }"
                        class="btn btn-icon btn-sm btn-light-primary"
                        :title="translate('View Details')"
                      >
                        <KTIcon icon-name="eye" icon-class="fs-4" />
                      </router-link>
                      <router-link
                        :to="{ name: 'address-edit', params: { id: addr.id } }"
                        class="btn btn-icon btn-sm btn-light-info"
                        :title="translate('Edit Address')"
                      >
                        <KTIcon icon-name="pencil" icon-class="fs-4" />
                      </router-link>
                      <button
                        type="button"
                        class="btn btn-icon btn-sm btn-light-danger"
                        @click="deleteAddress(addr)"
                        :title="translate('Delete Address')"
                      >
                        <KTIcon icon-name="trash" icon-class="fs-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content: Orders (Placeholder) -->
    <div v-show="activeTab === 'orders'">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
              <KTIcon
                icon-name="magnifier"
                icon-class="fs-1 position-absolute ms-6"
              />
              <input
                type="text"
                disabled
                class="form-control w-100 w-md-250px ps-15"
                :placeholder="translate('Search Orders')"
              />
            </div>
          </div>
          <div class="card-toolbar">
            <span class="badge badge-light-info fs-7 fw-bold">
              0 {{ translate("Orders") }}
            </span>
          </div>
        </div>

        <div class="card-body pt-0">
          <EmptyState
            :title="translate('No Orders Found')"
            :description="
              translate('This client has not placed any orders yet.')
            "
            icon="basket"
          />
        </div>
      </div>
    </div>

    <!-- Tab Content: Payments (Placeholder) -->
    <div v-show="activeTab === 'payments'">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
              <KTIcon
                icon-name="magnifier"
                icon-class="fs-1 position-absolute ms-6"
              />
              <input
                type="text"
                disabled
                class="form-control w-100 w-md-250px ps-15"
                :placeholder="translate('Search Payments')"
              />
            </div>
          </div>
          <div class="card-toolbar">
            <span class="badge badge-light-success fs-7 fw-bold">
              0 {{ translate("Payments") }}
            </span>
          </div>
        </div>

        <div class="card-body pt-0">
          <EmptyState
            :title="translate('No Payments Found')"
            :description="
              translate('No payment transactions recorded for this client yet.')
            "
            icon="credit-cart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ClientService, {
  type ClientData,
  type AddressData,
} from "@/core/services/ClientService";
import AddressService from "@/core/services/AddressService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import EmptyState from "@/components/utilities/EmptyState.vue";
import { translate } from "@/core/helpers/i18n-utils";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmationAlert,
} from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "ClientDetails",
  components: {
    KTIcon,
    EmptyState,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const clientId = route.params.id as string;
    const client = ref<ClientData | null>(null);
    const addresses = ref<AddressData[]>([]);
    const loading = ref(true);
    const activeTab = ref<"addresses" | "orders" | "payments">("addresses");
    const addressSearch = ref("");

    const filteredAddresses = computed(() => {
      const q = addressSearch.value.trim().toLowerCase();
      if (!q) return addresses.value;
      return addresses.value.filter((addr) => {
        const label = (addr.label || "").toLowerCase();
        const street = (addr.street || "").toLowerCase();
        const block = (addr.block || "").toLowerCase();
        const govEn = (addr.governorate?.nameEn || "").toLowerCase();
        const govAr = (addr.governorate?.nameAr || "").toLowerCase();
        const areaEn = (addr.area?.nameEn || "").toLowerCase();
        const areaAr = (addr.area?.nameAr || "").toLowerCase();
        return (
          label.includes(q) ||
          street.includes(q) ||
          block.includes(q) ||
          govEn.includes(q) ||
          govAr.includes(q) ||
          areaEn.includes(q) ||
          areaAr.includes(q)
        );
      });
    });

    const fetchClientDetails = () => {
      loading.value = true;
      ClientService.get(clientId)
        .then((data: any) => {
          client.value = data;
          addresses.value = data.addresses || [];
        })
        .catch((error) => {
          showErrorAlert(
            error?.response?.data?.message ||
              translate("Failed to load client details"),
          );
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const toggleClientStatus = () => {
      if (!client.value) return;
      const newStatus = !client.value.isActive;
      const clientName = client.value.name || "";

      showConfirmationAlert({
        title: newStatus
          ? translate("Activate Client?")
          : translate("Deactivate Client?"),
        text: newStatus
          ? `${translate("Are you sure you want to activate")} "${clientName}"? ${translate("The client will regain access to their account.")}`
          : `${translate("Are you sure you want to deactivate")} "${clientName}"? ${translate("The client will be blocked and active sessions invalidated.")}`,
        icon: newStatus ? "success" : "warning",
        confirmButtonText: newStatus
          ? translate("Yes, activate")
          : translate("Yes, deactivate"),
        confirmButtonClass: newStatus ? "btn-success" : "btn-warning",
      }).then((result) => {
        if (result.isConfirmed && client.value) {
          ClientService.update(client.value.id, { isActive: newStatus })
            .then(() => {
              if (client.value) {
                client.value.isActive = newStatus;
              }
              showSuccessAlert(
                translate("Client status updated successfully."),
              );
            })
            .catch((error) => {
              showErrorAlert(
                error?.response?.data?.message ||
                  translate("Failed to update status"),
              );
            });
        }
      });
    };

    const deleteClient = () => {
      if (!client.value) return;
      const clientName = client.value.name || "";

      showConfirmationAlert({
        title: translate("Delete Client?"),
        text: `${translate("Are you sure you want to delete")} "${clientName}"? ${translate("This client will be moved to trash and soft deleted.")}`,
        icon: "error",
        confirmButtonText: translate("Yes, delete"),
        confirmButtonClass: "btn-danger",
      }).then((result) => {
        if (result.isConfirmed && client.value) {
          ClientService.delete(client.value.id)
            .then(() => {
              showSuccessAlert(translate("Client deleted successfully."));
              router.push({ name: "clients-listing" });
            })
            .catch((error) => {
              showErrorAlert(
                error?.response?.data?.message ||
                  translate("Failed to delete client"),
              );
            });
        }
      });
    };

    const getMapUrl = (lat?: string, long?: string) => {
      if (!lat || !long) return "#";
      return `https://www.google.com/maps?q=${lat},${long}`;
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

    const deleteAddress = (addr: AddressData) => {
      const label = addr.label || "";
      showConfirmationAlert({
        title: translate("Delete Address?"),
        text: `${translate("Are you sure you want to delete")} "${label}"?`,
        icon: "error",
        confirmButtonText: translate("Yes, delete"),
        confirmButtonClass: "btn-danger",
      }).then((result) => {
        if (result.isConfirmed) {
          AddressService.delete(addr.id)
            .then(() => {
              showSuccessAlert(translate("Address deleted successfully."));
              fetchClientDetails();
            })
            .catch((error) => {
              showErrorAlert(
                error?.response?.data?.message || translate("Failed to delete address"),
              );
            });
        }
      });
    };

    onMounted(() => {
      fetchClientDetails();
    });

    return {
      client,
      addresses,
      filteredAddresses,
      loading,
      activeTab,
      addressSearch,
      toggleClientStatus,
      deleteClient,
      deleteAddress,
      getMapUrl,
      formatDate,
      translate,
    };
  },
});
</script>
