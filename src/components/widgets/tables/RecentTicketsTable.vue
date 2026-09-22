<template>
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Recent Tickets</span>
        <span class="text-muted mt-1 fw-semibold fs-7"
          >Latest tickets across projects</span
        >
      </h3>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-3">
      <div class="table-responsive">
        <table
          class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4"
        >
          <thead>
            <tr class="fw-bold text-muted">
              <th class="min-w-100px">ID</th>
              <th class="min-w-150px">Title</th>
              <th class="min-w-125px">Project</th>
              <th v-if="!isCompany" class="min-w-125px">Company</th>
              <th class="min-w-100px">Priority</th>
              <th class="min-w-100px">Status</th>
              <th class="min-w-120px">Date</th>
              <th class="text-end min-w-70px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tickets.length === 0">
              <td colspan="7" class="text-center text-muted py-10">
                No tickets found
              </td>
            </tr>
            <tr v-for="ticket in tickets" :key="ticket.id">
              <td>
                <router-link
                  :to="{ name: 'ticket-show', params: { id: ticket.id } }"
                  class="text-gray-900 fw-bold text-hover-primary"
                  >#{{ ticket.id }}</router-link
                >
              </td>
              <td>
                <span class="text-gray-900 fw-bold">{{ ticket.title }}</span>
              </td>
              <td>
                <span class="text-gray-900">{{
                  ticket.project?.name || "N/A"
                }}</span>
              </td>
              <td v-if="!isCompany">
                <span class="text-gray-900">{{
                  ticket.company?.name || "N/A"
                }}</span>
              </td>
              <td>
                <span
                  class="badge"
                  :class="`badge-light-${getPriorityColor(ticket.priority)}`"
                >
                  {{ getPriorityName(ticket.priority) }}
                </span>
              </td>
              <td>
                <span
                  class="badge"
                  :class="`badge-light-${getStatusColor(ticket.status)}`"
                >
                  {{ getStatusName(ticket.status) }}
                </span>
              </td>
              <td>
                <span class="text-muted">{{
                  formatDate(ticket.created_at)
                }}</span>
              </td>
              <td class="text-end">
                <router-link
                  :to="{ name: 'ticket-show', params: { id: ticket.id } }"
                  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                >
                  <i class="bi bi-eye fs-3"></i>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--end::Body-->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import {
  ticketStatusOptions,
  ticketPriorityOptions,
} from "@/core/helpers/constants";

export default defineComponent({
  name: "recent-tickets-table",
  props: {
    widgetClasses: String,
    tickets: {
      type: Array as () => Array<any>,
      default: () => [],
    },
  },
  setup() {
    const authStore = useAuthStore();
    const isCompany = computed(() => authStore.isCompany);

    const getStatusName = (id: number) => {
      return ticketStatusOptions.find((o) => o.id == id)?.name || "Unknown";
    };

    const getStatusColor = (id: number) => {
      return ticketStatusOptions.find((o) => o.id == id)?.color || "secondary";
    };

    const getPriorityName = (id: number) => {
      return ticketPriorityOptions.find((o) => o.id == id)?.name || "Unknown";
    };

    const getPriorityColor = (id: number) => {
      return (
        ticketPriorityOptions.find((o) => o.id == id)?.color || "secondary"
      );
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return {
      formatDate,
      isCompany,
      getStatusName,
      getStatusColor,
      getPriorityName,
      getPriorityColor,
    };
  },
});
</script>
