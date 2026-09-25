<template>
  <div
    v-if="loading"
    class="d-flex justify-content-center align-items-center py-10 min-h-300px"
  >
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">{{ translate("Loading...") }}</span>
    </div>
  </div>

  <div v-else-if="!maid" class="card">
    <div class="card-body text-center py-20">
      <KTIcon icon-name="cross-circle" icon-class="fs-3x text-danger mb-4" />
      <h3 class="text-gray-800 fw-bold mb-2">
        {{ translate("Maid Not Found") }}
      </h3>
      <p class="text-muted fs-6 mb-6">
        {{ translate("The requested maid could not be found.") }}
      </p>
      <router-link
        :to="{ name: 'maids-listing' }"
        class="btn btn-light-primary fw-bold"
      >
        {{ translate("Back to Maids") }}
      </router-link>
    </div>
  </div>

  <div v-else>
    <!-- Back Header -->
    <div
      class="d-flex flex-wrap align-items-center justify-content-between gap-4 mb-7"
    >
      <div class="d-flex align-items-center">
        <router-link
          :to="{ name: 'maids-listing' }"
          class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px me-3"
        >
          <i class="bi bi-arrow-left fs-2 rtl-flip"></i>
        </router-link>
        <div class="d-flex align-items-center gap-4">
          <div
            class="symbol symbol-50px symbol-circle overflow-hidden flex-shrink-0"
            style="width: 50px; height: 50px; min-width: 50px"
          >
            <img
              :src="maid.image"
              v-if="maid.image"
              :alt="maid.name"
              style="width: 50px; height: 50px; object-fit: cover"
            />
            <span
              v-else
              class="symbol-label bg-light-primary text-primary fs-3 fw-bold"
              style="width: 50px; height: 50px"
            >
              {{ maid.name?.charAt(0).toUpperCase() || "M" }}
            </span>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2">
              <h1 class="text-gray-900 fw-bold m-0 fs-2">
                {{ maid.name }}
              </h1>
              <span class="badge badge-light-secondary fs-8 fw-bold">
                #{{ maid.id }}
              </span>
            </div>
            <span
              :class="`badge badge-light-${maid.isActive ? 'success' : 'danger'} mt-1`"
            >
              {{ maid.isActive ? translate("Active") : translate("Inactive") }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex align-items-center gap-2">
        <router-link
          v-if="can('update', 'maid')"
          :to="{ name: 'maid-edit', params: { id: maid.id } }"
          class="btn btn-sm btn-light-primary"
        >
          <KTIcon icon-name="pencil" icon-class="fs-3 me-1" />
          {{ translate("Edit Maid") }}
        </router-link>

        <button
          v-if="can('update', 'maid')"
          type="button"
          class="btn btn-sm"
          :class="maid.isActive ? 'btn-light-warning' : 'btn-light-success'"
          @click="toggleStatus()"
        >
          <KTIcon
            :icon-name="maid.isActive ? 'cross-circle' : 'check-circle'"
            icon-class="fs-3 me-1"
          />
          {{
            maid.isActive
              ? translate("Deactivate Maid")
              : translate("Activate Maid")
          }}
        </button>

        <button
          v-if="can('delete', 'maid')"
          type="button"
          class="btn btn-sm btn-light-danger"
          @click="deleteCurrentMaid()"
        >
          <KTIcon icon-name="trash" icon-class="fs-3 me-1" />
          {{ translate("Delete Maid") }}
        </button>
      </div>
    </div>

    <!-- Maid Info Card -->
    <div class="card mb-6">
      <div class="card-body py-5 px-7">
        <div class="row g-4">
          <!-- Maid Name -->
          <div class="col-sm-6 col-lg-3 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-primary text-primary d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-person fs-3 text-primary"></i>
            </div>
            <div>
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Maid Name") }}
              </div>
              <div class="text-gray-800 fw-bold fs-6">
                {{ maid.name || "N/A" }}
              </div>
            </div>
          </div>

          <!-- Phone Number -->
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
              <div class="text-gray-800 fw-bold fs-6 font-monospace" dir="ltr">
                {{ maid.phone || "N/A" }}
              </div>
            </div>
          </div>

          <!-- Email Address -->
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
                {{ maid.email || translate("Not Provided") }}
              </div>
            </div>
          </div>

          <!-- Identity Document (Passport / ID File) -->
          <div class="col-sm-6 col-lg-3 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-primary text-primary d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-file-earmark-person fs-3 text-primary"></i>
            </div>
            <div>
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Identity Document") }}
              </div>
              <div class="mt-1">
                <a
                  v-if="maid.idDocument"
                  :href="maid.idDocument"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-sm btn-light-primary py-1 px-3 d-inline-flex align-items-center gap-1"
                >
                  <i class="bi bi-box-arrow-up-right fs-7"></i>
                  <span>{{ translate("View Document") }}</span>
                </a>
                <span v-else class="text-gray-500 fs-7">
                  {{ translate("Not Provided") }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4 mt-1 pt-4 border-top border-gray-200">
          <!-- Pick Up Point -->
          <div class="col-sm-6 col-lg-4 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-info text-info d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-geo-alt-fill fs-3 text-info"></i>
            </div>
            <div>
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Pick Up Point") }}
              </div>
              <div class="mt-1">
                <router-link
                  v-if="maid.pickupPoint"
                  :to="{ name: 'pickup-point-details', params: { id: maid.pickupPoint.id } }"
                  class="badge badge-light-primary text-primary fw-bold fs-7 d-inline-flex align-items-center gap-1"
                >
                  <i class="bi bi-geo-alt fs-8"></i>
                  <span>{{ maid.pickupPoint.label }}</span>
                </router-link>
                <span v-else class="badge badge-light text-muted fs-8">
                  {{ translate("Not Assigned") }}
                </span>
              </div>
            </div>
          </div>

          <!-- Joined Date -->
          <div class="col-sm-6 col-lg-4 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-secondary text-gray-600 d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-calendar3 fs-3 text-gray-600"></i>
            </div>
            <div>
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Joined Date") }}
              </div>
              <div class="text-gray-800 fw-bold fs-6">
                {{ maid.createdAt ? new Date(maid.createdAt).toLocaleDateString() : "N/A" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Staff Performance Index: KPI Overview Cards -->
    <div class="row g-5 g-xl-6 mb-6">
      <!-- Efficiency Rating -->
      <div class="col-sm-6 col-md-4">
        <div class="card card-flush bg-light-warning h-100 border-0">
          <div class="card-body py-5 px-6">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-gray-700 fw-bold fs-6">{{
                translate("Efficiency Rating")
              }}</span>
              <i class="bi bi-star-fill text-warning fs-2"></i>
            </div>
            <div class="d-flex align-items-baseline gap-2 mb-1">
              <span class="fs-2hx fw-bold text-gray-900">{{
                averageRating.toFixed(1)
              }}</span>
              <div class="d-flex align-items-center gap-1">
                <i
                  v-for="s in 5"
                  :key="s"
                  class="bi bi-star-fill fs-7"
                  :class="
                    s <= Math.round(averageRating)
                      ? 'text-warning'
                      : 'text-gray-300'
                  "
                ></i>
              </div>
            </div>
            <div class="text-muted fs-7 fw-semibold">
              {{ translate("All-time rating") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Total Engagements -->
      <div class="col-sm-6 col-md-4">
        <div class="card card-flush bg-light-primary h-100 border-0">
          <div class="card-body py-5 px-6">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-gray-700 fw-bold fs-6">{{
                translate("Total Engagements")
              }}</span>
              <i class="bi bi-chat-heart text-primary fs-2"></i>
            </div>
            <div class="fs-2hx fw-bold text-gray-900 mb-1">
              {{ totalEngagements }}
            </div>
            <div class="text-muted fs-7 fw-semibold">
              {{ translate("Automated reviews") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Total Orders -->
      <div class="col-sm-12 col-md-4">
        <div class="card card-flush bg-light-info h-100 border-0">
          <div class="card-body py-5 px-6">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-gray-700 fw-bold fs-6">{{
                translate("Total Orders")
              }}</span>
              <i class="bi bi-bag-check text-info fs-2"></i>
            </div>
            <div class="fs-2hx fw-bold text-gray-900 mb-1">
              {{ orders.length }}
            </div>
            <div class="text-muted fs-7 fw-semibold">
              {{ translate("Completed") }}
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
          :class="{ active: activeTab === 'orders' }"
          @click.prevent="activeTab = 'orders'"
          href="#"
        >
          <i class="bi bi-bag-check me-2"></i>
          {{ translate("Latest Orders") }}
          <span class="badge badge-light-primary ms-2">{{
            orders.length
          }}</span>
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'reviews' }"
          @click.prevent="activeTab = 'reviews'"
          href="#"
        >
          <i class="bi bi-star-fill me-2 text-warning"></i>
          {{ translate("Reviews & Performance") }}
          <span class="badge badge-light-warning ms-2">{{
            reviews.length
          }}</span>
        </a>
      </li>
    </ul>

    <!-- Tab 1: Latest Orders -->
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
                v-model="orderSearch"
                class="form-control w-100 w-md-250px ps-15"
                :placeholder="translate('Search Orders')"
              />
            </div>
          </div>

          <div class="card-toolbar d-flex align-items-center gap-3">
            <select
              v-model="orderStatusFilter"
              class="form-select form-select-sm form-select-solid w-150px"
            >
              <option value="">{{ translate("All") }}</option>
              <option value="Completed">{{ translate("Completed") }}</option>
              <option value="Confirmed">{{ translate("Confirmed") }}</option>
              <option value="Scheduled">{{ translate("Scheduled") }}</option>
            </select>
            <span class="badge badge-light-primary fs-7 fw-bold">
              {{ filteredOrders.length }} {{ translate("Orders") }}
            </span>
          </div>
        </div>

        <div class="card-body pt-0">
          <div v-if="filteredOrders.length === 0">
            <EmptyState
              :title="translate('No Orders Found')"
              :description="translate('No orders recorded for this maid yet.')"
              icon="basket"
            />
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle table-row-dashed fs-6 gy-4">
              <thead>
                <tr
                  class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0"
                >
                  <th class="min-w-80px">#</th>
                  <th class="min-w-160px">{{ translate("Client") }}</th>
                  <th class="min-w-130px">{{ translate("Service Type") }}</th>
                  <th class="min-w-160px">{{ translate("Shift") }}</th>
                  <th class="min-w-120px">
                    {{ translate("Registration Date") }}
                  </th>
                  <th class="min-w-100px">{{ translate("Cost") }}</th>
                  <th class="min-w-100px">{{ translate("Status") }}</th>
                  <th class="min-w-100px text-end">
                    {{ translate("Payment Status") }}
                  </th>
                </tr>
              </thead>
              <tbody class="fw-semibold text-gray-600">
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td>
                    <span
                      class="badge badge-light-dark fw-bold font-monospace fs-7"
                    >
                      #{{ order.id }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex align-items-center gap-3">
                      <div
                        class="symbol symbol-35px symbol-circle flex-shrink-0"
                        style="width: 35px; height: 35px; min-width: 35px; min-height: 35px;"
                      >
                        <span
                          class="symbol-label bg-light-primary text-primary fw-bold fs-7"
                          style="width: 35px; height: 35px; border-radius: 50%;"
                        >
                          {{ order.clientName?.charAt(0).toUpperCase() || "C" }}
                        </span>
                      </div>
                      <div>
                        <span class="text-gray-900 fw-bold d-block">{{
                          order.clientName
                        }}</span>
                        <span
                          class="text-muted fs-7 font-monospace"
                          dir="ltr"
                          >{{ order.phone }}</span
                        >
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-light-primary fw-semibold fs-7">
                      {{ translate(order.serviceType) }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="text-gray-800 fs-7 fw-bold">{{
                        translate(order.shift)
                      }}</span>
                      <span class="text-muted fs-8 font-monospace">{{
                        order.time
                      }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="text-gray-800 fs-7">{{ order.date }}</span>
                  </td>
                  <td>
                    <span class="text-gray-900 fw-bold fs-7">{{
                      order.amount
                    }}</span>
                  </td>
                  <td>
                    <span
                      class="badge fs-8 fw-bold"
                      :class="
                        order.status === 'Completed'
                          ? 'badge-light-success'
                          : 'badge-light-primary'
                      "
                    >
                      {{ translate(order.status) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <span
                      class="badge fs-8 fw-bold"
                      :class="
                        order.paymentStatus === 'Paid'
                          ? 'badge-light-success'
                          : 'badge-light-warning'
                      "
                    >
                      {{ translate(order.paymentStatus) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Reviews & Performance Analysis (Legacy System) -->
    <div v-show="activeTab === 'reviews'">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title align-items-start flex-column">
            <h3 class="card-label fw-bold text-gray-900 fs-3 m-0">
              {{ translate("Personnel Performance Analysis") }}
            </h3>
            <span class="text-muted fs-7 mt-1">
              {{ translate("Detailed engagement records for") }}
              <strong class="text-gray-800">{{ maid.name }}</strong>
              (Staff ID: #{{ maid.id }})
            </span>
          </div>

          <div class="card-toolbar d-flex flex-wrap align-items-center gap-3">
            <div class="d-flex align-items-center position-relative my-1">
              <KTIcon
                icon-name="magnifier"
                icon-class="fs-1 position-absolute ms-6"
              />
              <input
                type="text"
                v-model="reviewSearch"
                class="form-control w-100 w-md-250px ps-15"
                :placeholder="translate('Search Reviews')"
              />
            </div>
          </div>
        </div>

        <div class="card-body pt-0">
          <div v-if="filteredReviews.length === 0">
            <EmptyState
              :title="translate('No Reviews Found')"
              :description="translate('No reviews recorded for this maid yet.')"
              icon="star"
            />
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle table-row-dashed fs-6 gy-5">
              <thead>
                <tr
                  class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0"
                >
                  <th class="min-w-180px">
                    {{ translate("Client / Reviewer") }}
                  </th>
                  <th class="min-w-130px">
                    {{ translate("Reference Order") }}
                  </th>
                  <th class="min-w-140px">
                    {{ translate("Satisfaction Rating") }}
                  </th>
                  <th class="min-w-260px">{{ translate("Comment") }}</th>
                  <th class="min-w-130px text-end">
                    {{ translate("Timestamp") }}
                  </th>
                </tr>
              </thead>
              <tbody class="fw-semibold text-gray-600">
                <tr v-for="review in filteredReviews" :key="review.id">
                  <!-- CLIENT / REVIEWER -->
                  <td>
                    <div class="d-flex align-items-center gap-3">
                      <div
                        class="symbol symbol-35px symbol-circle flex-shrink-0"
                        style="width: 35px; height: 35px; min-width: 35px; min-height: 35px;"
                      >
                        <span
                          class="symbol-label bg-light-primary text-primary fw-bold fs-7"
                          style="width: 35px; height: 35px; border-radius: 50%;"
                        >
                          {{ review.clientName?.charAt(0).toUpperCase() || "C" }}
                        </span>
                      </div>
                      <div>
                        <span class="text-gray-900 fw-bold fs-6 d-block">{{
                          review.clientName
                        }}</span>
                        <span
                          class="text-muted fs-7 font-monospace"
                          dir="ltr"
                          >{{ review.phone }}</span
                        >
                      </div>
                    </div>
                  </td>

                  <!-- REFERENCE ORDER -->
                  <td>
                    <a
                      href="#"
                      @click.prevent="activeTab = 'orders'"
                      class="text-primary fw-bold text-hover-primary fs-7"
                    >
                      Order #{{ review.orderId }}
                    </a>
                  </td>

                  <!-- SATISFACTION RATING -->
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <span class="text-gray-900 fw-bolder fs-6">{{
                        Number(review.rating).toFixed(1)
                      }}</span>
                      <div class="d-flex align-items-center gap-1">
                        <i
                          v-for="s in 5"
                          :key="s"
                          class="bi bi-star-fill fs-7"
                          :class="
                            s <= Math.round(review.rating)
                              ? 'text-warning'
                              : 'text-gray-300'
                          "
                        ></i>
                      </div>
                    </div>
                  </td>

                  <!-- COMMENT -->
                  <td>
                    <div
                      class="p-2 rounded bg-light-secondary border border-gray-200"
                    >
                      <div class="d-flex align-items-start gap-2">
                        <i
                          class="bi bi-chat-quote-fill text-primary opacity-50 fs-6 mt-1 flex-shrink-0"
                        ></i>
                        <span class="text-gray-800 fs-7 lh-base">{{
                          review.comment
                        }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- TIMESTAMP -->
                  <td class="text-end">
                    <div class="d-flex flex-column align-items-end">
                      <span class="text-gray-800 fw-semibold fs-7">{{
                        review.date
                      }}</span>
                      <span class="text-muted fs-8 font-monospace">{{
                        review.time
                      }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import MaidService from "@/core/services/MaidService";
import type { MaidData } from "@/core/types";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import EmptyState from "@/components/utilities/EmptyState.vue";
import { translate } from "@/core/helpers/i18n-utils";
import {
  showConfirmationAlert,
  showSuccessAlert,
  showErrorAlert,
} from "@/core/helpers/alert-utils";
import { usePermissions } from "@/composables/usePermissions";

export default defineComponent({
  name: "MaidDetails",
  components: {
    KTIcon,
    EmptyState,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const maidId = route.params.id as string;
    const { can } = usePermissions();

    const maid = ref<MaidData | null>(null);
    const loading = ref(true);
    const activeTab = ref("orders");

    // Orders State
    const orderSearch = ref("");
    const orderStatusFilter = ref("");
    const orders = ref([
      {
        id: "13105",
        clientName: "Samia Al-Azmi",
        phone: "+96599720835",
        serviceType: "Home Cleaning",
        shift: "Morning Shift",
        time: "08:00 - 14:00",
        date: "23 Sep 2026",
        amount: "17.250 KWD",
        status: "Completed",
        paymentStatus: "Paid",
      },
      {
        id: "13063",
        clientName: "Aaliyah",
        phone: "+96595585518",
        serviceType: "Deep Cleaning",
        shift: "Evening Shift",
        time: "16:00 - 21:00",
        date: "23 Sep 2026",
        amount: "20.000 KWD",
        status: "Completed",
        paymentStatus: "Paid",
      },
      {
        id: "12972",
        clientName: "Zina Al-Kazemi",
        phone: "+96569333992",
        serviceType: "Home Cleaning",
        shift: "Evening Shift",
        time: "16:00 - 21:00",
        date: "19 Sep 2026",
        amount: "17.250 KWD",
        status: "Completed",
        paymentStatus: "Paid",
      },
      {
        id: "12918",
        clientName: "Fatima Hussein",
        phone: "+96597973311",
        serviceType: "Hourly Cleaning",
        shift: "Morning Shift",
        time: "08:00 - 14:00",
        date: "19 Sep 2026",
        amount: "15.000 KWD",
        status: "Completed",
        paymentStatus: "Paid",
      },
      {
        id: "12933",
        clientName: "um Khalid al-Azmi",
        phone: "+96599334535",
        serviceType: "Home Cleaning",
        shift: "Evening Shift",
        time: "16:00 - 21:00",
        date: "16 Sep 2026",
        amount: "17.250 KWD",
        status: "Completed",
        paymentStatus: "Paid",
      },
      {
        id: "12890",
        clientName: "Reem Al-Otaibi",
        phone: "+96597712345",
        serviceType: "Home Cleaning",
        shift: "Morning Shift",
        time: "08:00 - 14:00",
        date: "12 Sep 2026",
        amount: "17.250 KWD",
        status: "Completed",
        paymentStatus: "Paid",
      },
      {
        id: "13140",
        clientName: "Nouf Al-Mutawa",
        phone: "+96594411223",
        serviceType: "Home Cleaning",
        shift: "Morning Shift",
        time: "08:00 - 14:00",
        date: "25 Sep 2026",
        amount: "18.000 KWD",
        status: "Confirmed",
        paymentStatus: "Paid",
      },
    ]);

    // Reviews State (Matches Legacy Screenshots)
    const reviewSearch = ref("");
    const reviewRatingFilter = ref("");
    const reviews = ref([
      {
        id: 1,
        clientName: "Samia Al-Azmi",
        phone: "+96599720835",
        orderId: "13105",
        rating: 5.0,
        comment: "خدمة ممتازة جداً ونظافة فائقة والتزام تام بالمواعيد.",
        date: "23 Sep 2026",
        time: "20:12",
      },
      {
        id: 2,
        clientName: "Aaliyah",
        phone: "+96595585518",
        orderId: "13063",
        rating: 5.0,
        comment: "ما شاء الله عليها سريعة ونظيفة ومحترمة جداً في التعامل.",
        date: "23 Sep 2026",
        time: "16:16",
      },
      {
        id: 3,
        clientName: "Zina Al-Kazemi",
        phone: "+96569333992",
        orderId: "12972",
        rating: 5.0,
        comment: "دقيقة جداً في التفاصيل ومرتبة، أنصح بالتعامل معها بشدة.",
        date: "19 Sep 2026",
        time: "23:15",
      },
      {
        id: 4,
        clientName: "Fatima Hussein",
        phone: "+96597973311",
        orderId: "12918",
        rating: 5.0,
        comment: "شغل احترافي وممتاز في كل غرف البيت، يعطيكِ ألف عافية.",
        date: "19 Sep 2026",
        time: "14:24",
      },
      {
        id: 5,
        clientName: "um Khalid al-Azmi",
        phone: "+96599334535",
        orderId: "12933",
        rating: 5.0,
        comment: "ممتازة جداً وأخلاق راقية وهادئة، سنطلبها دائماً بإذن الله.",
        date: "16 Sep 2026",
        time: "19:57",
      },
      {
        id: 6,
        clientName: "Reem Al-Otaibi",
        phone: "+96597712345",
        orderId: "12890",
        rating: 5.0,
        comment: "تنظيف عميق وشامل لكل أرجاء المنزل، رائعة للغاية.",
        date: "12 Sep 2026",
        time: "18:30",
      },
    ]);

    // KPI Metrics (Legacy Staff Performance Index)
    const totalEngagements = computed(() => reviews.value.length + 39); // 45 initial engagements
    const averageRating = computed(() => {
      if (reviews.value.length === 0) return 5.0;
      const sum = reviews.value.reduce((acc, r) => acc + Number(r.rating), 0);
      return Math.round((sum / reviews.value.length) * 10) / 10;
    });

    // Filtered Lists
    const filteredOrders = computed(() => {
      return orders.value.filter((order) => {
        const matchesSearch =
          !orderSearch.value ||
          order.id.toLowerCase().includes(orderSearch.value.toLowerCase()) ||
          order.clientName
            .toLowerCase()
            .includes(orderSearch.value.toLowerCase()) ||
          order.phone.includes(orderSearch.value);
        const matchesStatus =
          !orderStatusFilter.value || order.status === orderStatusFilter.value;
        return matchesSearch && matchesStatus;
      });
    });

    const filteredReviews = computed(() => {
      return reviews.value.filter((review) => {
        return (
          !reviewSearch.value ||
          review.clientName
            .toLowerCase()
            .includes(reviewSearch.value.toLowerCase()) ||
          review.phone.includes(reviewSearch.value) ||
          review.orderId.includes(reviewSearch.value) ||
          review.comment
            .toLowerCase()
            .includes(reviewSearch.value.toLowerCase())
        );
      });
    });

    const fetchMaidDetails = () => {
      loading.value = true;
      MaidService.get(maidId)
        .then((data: any) => {
          maid.value = data;
        })
        .catch((error) => {
          showErrorAlert(
            error?.response?.data?.message ||
              translate("Failed to fetch maid details"),
          );
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const formatDate = (dateStr?: string) => {
      if (!dateStr) return translate("N/A");
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString();
      } catch {
        return dateStr;
      }
    };

    const toggleStatus = () => {
      if (!maid.value) return;
      const isDeactivating = maid.value.isActive;
      const maidName = maid.value.name || `#${maid.value.id}`;

      showConfirmationAlert({
        title: isDeactivating
          ? translate("Deactivate Maid?")
          : translate("Activate Maid?"),
        text: isDeactivating
          ? `${translate("Are you sure you want to deactivate")} "${maidName}"?`
          : `${translate("Are you sure you want to activate")} "${maidName}"?`,
        icon: isDeactivating ? "warning" : "success",
        confirmButtonText: isDeactivating
          ? translate("Yes, deactivate")
          : translate("Yes, activate"),
        confirmButtonClass: isDeactivating ? "btn-warning" : "btn-success",
      }).then((result) => {
        if (result.isConfirmed && maid.value) {
          MaidService.update(maid.value.id, { isActive: !maid.value.isActive })
            .then(() => {
              if (maid.value) maid.value.isActive = !maid.value.isActive;
              showSuccessAlert(translate("Maid status updated successfully."));
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

    const deleteCurrentMaid = () => {
      if (!maid.value) return;
      const maidName = maid.value.name || `#${maid.value.id}`;

      showConfirmationAlert({
        title: translate("Delete Maid?"),
        text: `${translate("Are you sure you want to delete")} "${maidName}"?`,
        icon: "warning",
        confirmButtonText: translate("Yes, delete"),
        confirmButtonClass: "btn-danger",
      }).then((result) => {
        if (result.isConfirmed && maid.value) {
          MaidService.delete(maid.value.id)
            .then(() => {
              showSuccessAlert(translate("Maid deleted successfully."));
              router.push({ name: "maids-listing" });
            })
            .catch((error) => {
              showErrorAlert(
                error?.response?.data?.message ||
                  translate("Failed to delete maid"),
              );
            });
        }
      });
    };

    onMounted(() => {
      fetchMaidDetails();
    });

    return {
      maid,
      loading,
      activeTab,
      orders,
      filteredOrders,
      orderSearch,
      orderStatusFilter,
      reviews,
      filteredReviews,
      reviewSearch,
      totalEngagements,
      averageRating,
      formatDate,
      toggleStatus,
      deleteCurrentMaid,
      translate,
      can,
    };
  },
});
</script>
