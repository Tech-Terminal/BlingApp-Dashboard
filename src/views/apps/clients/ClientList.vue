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
            class="form-control w-100 w-md-250px ps-15"
            :placeholder="translate('Search Clients')"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <router-link
          :to="{ name: 'client-create' }"
          class="btn btn-primary"
        >
          <KTIcon icon-name="plus" icon-class="fs-2" />
          {{ translate("Add Client") }}
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

      <div v-else-if="!loading && (!clients || clients.length === 0)">
        <EmptyState
          :title="translate('No Clients Found')"
          :description="
            translate('Try adjusting your search or filters to find clients.')
          "
          icon="profile-user"
        />
      </div>

      <div v-else class="table-responsive">
        <table
          class="table align-middle table-row-dashed fs-6 gy-5"
          id="kt_clients_table"
        >
          <thead>
            <tr
              class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0"
            >
              <th class="min-w-50px">#</th>
              <th class="min-w-200px">{{ translate("Client") }}</th>
              <th class="min-w-120px">{{ translate("Phone") }}</th>
              <th class="min-w-100px">{{ translate("Status") }}</th>
              <th class="min-w-120px">{{ translate("Registered") }}</th>
              <th class="text-end min-w-120px">{{ translate("Actions") }}</th>
            </tr>
          </thead>
          <tbody class="fw-semibold text-gray-600">
            <tr v-for="client in clients" :key="client.id">
              <td>{{ client.id }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <!--begin::Avatar-->
                  <div
                    class="symbol symbol-circle symbol-45px overflow-hidden me-3"
                  >
                    <img
                      :src="client.image"
                      :alt="client.name"
                      class="w-100"
                      v-if="client.image"
                    />
                    <span
                      v-else
                      class="symbol-label bg-light-primary text-primary fs-5 fw-bold"
                    >
                      {{ client.name ? client.name.charAt(0).toUpperCase() : "C" }}
                    </span>
                  </div>
                  <!--end::Avatar-->
                  <!--begin::Details-->
                  <div class="d-flex flex-column">
                    <router-link
                      :to="{ name: 'client-details', params: { id: client.id } }"
                      class="text-gray-800 text-hover-primary fw-bold mb-1"
                    >
                      {{ client.name }}
                    </router-link>
                    <span class="text-muted fs-7">{{ client.email || translate("No Email") }}</span>
                  </div>
                  <!--end::Details-->
                </div>
              </td>
              <td>
                <span class="text-gray-800 fw-bold font-monospace">{{ client.phone }}</span>
              </td>
              <td>
                <span
                  class="badge fw-bold"
                  :class="client.isActive ? 'badge-light-success' : 'badge-light-danger'"
                >
                  {{ client.isActive ? translate("Active") : translate("Inactive") }}
                </span>
              </td>

              <td>
                {{ formatDate(client.createdAt) }}
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
                      :to="{ name: 'client-details', params: { id: client.id } }"
                      class="menu-link px-3 d-flex justify-content-between align-items-center"
                    >
                      <span>{{ translate("View Details") }}</span>
                      <KTIcon
                        icon-name="eye"
                        icon-class="fs-3 text-primary"
                      />
                    </router-link>
                  </div>
                  <!--end::Menu item-->
                  <!--begin::Menu item-->
                  <div class="menu-item px-3">
                    <router-link
                      :to="{ name: 'client-edit', params: { id: client.id } }"
                      class="menu-link px-3 d-flex justify-content-between align-items-center"
                    >
                      <span>{{ translate("Edit Client") }}</span>
                      <KTIcon
                        icon-name="pencil"
                        icon-class="fs-3 text-info"
                      />
                    </router-link>
                  </div>
                  <!--end::Menu item-->
                  <!--begin::Menu item-->
                  <div class="menu-item px-3">
                    <a
                      @click="toggleClientStatus(client)"
                      class="menu-link px-3 d-flex justify-content-between align-items-center"
                      :class="client.isActive ? 'text-warning' : 'text-success'"
                    >
                      <span>{{ client.isActive ? translate("Deactivate") : translate("Activate") }}</span>
                      <KTIcon
                        :icon-name="client.isActive ? 'cross-circle' : 'check-circle'"
                        :icon-class="client.isActive ? 'fs-3 text-warning' : 'fs-3 text-success'"
                      />
                    </a>
                  </div>
                  <!--end::Menu item-->
                  <!--begin::Menu item-->
                  <div class="menu-item px-3">
                    <a
                      @click="deleteClient(client)"
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
            fetchClients(page);
          }
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated, nextTick } from "vue";
import ClientService, { type ClientData } from "@/core/services/ClientService";
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
  name: "ClientList",
  components: {
    KTIcon,
    KTPagination,
    EmptyState,
  },
  setup() {
    const clients = ref<ClientData[]>([]);
    const pagination = ref<any>({ currentPage: 1, totalPages: 1 });
    const loading = ref(false);
    const search = ref("");
    let searchTimeout: any = null;

    const fetchClients = (page = 1) => {
      loading.value = true;
      const params: any = {
        page,
        limit: 10,
      };

      if (search.value.trim()) {
        params.search = search.value.trim();
      }

      ClientService.getAll(params)
        .then(({ data, meta }) => {
          clients.value = data || [];
          pagination.value = meta || { currentPage: 1, totalPages: 1 };
        })
        .catch((error) => {
          showErrorAlert(
            error?.response?.data?.message || translate("Failed to fetch clients"),
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
        fetchClients(1);
      }, 400);
    };

    const toggleClientStatus = (client: ClientData) => {
      const newStatus = !client.isActive;
      const clientName = client.name || "";

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
        if (result.isConfirmed) {
          ClientService.update(client.id, { isActive: newStatus })
            .then(() => {
              client.isActive = newStatus;
              showSuccessAlert(
                translate("Client status updated successfully."),
              );
            })
            .catch((error) => {
              showErrorAlert(
                error?.response?.data?.message || translate("Failed to update status"),
              );
            });
        }
      });
    };

    const deleteClient = (client: ClientData) => {
      const clientName = client.name || "";
      showConfirmationAlert({
        title: translate("Delete Client?"),
        text: `${translate("Are you sure you want to delete")} "${clientName}"? ${translate("This client will be moved to trash and soft deleted.")}`,
        icon: "error",
        confirmButtonText: translate("Yes, delete"),
        confirmButtonClass: "btn-danger",
      }).then((result) => {
        if (result.isConfirmed) {
          ClientService.delete(client.id)
            .then(() => {
              showSuccessAlert(translate("Client deleted successfully."));
              fetchClients(pagination.value.currentPage);
            })
            .catch((error) => {
              showErrorAlert(
                error?.response?.data?.message || translate("Failed to delete client"),
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
      fetchClients();
    });

    onUpdated(() => {
      MenuComponent.reinitialization();
    });

    return {
      clients,
      pagination,
      loading,
      search,
      fetchClients,
      onSearchInput,
      toggleClientStatus,
      deleteClient,
      formatDate,
      translate,
    };
  },
});
</script>
