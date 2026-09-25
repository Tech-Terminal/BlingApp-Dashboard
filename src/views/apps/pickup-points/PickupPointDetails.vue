<template>
  <div>
    <!-- Loading State -->
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center py-20"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ translate("Loading...") }}</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!pickupPoint" class="card">
      <div class="card-body text-center py-15">
        <i class="bi bi-exclamation-triangle-fill fs-2x text-warning mb-3 d-block"></i>
        <h4 class="text-gray-800">{{ translate("Pick Up Point Not Found") }}</h4>
        <router-link :to="{ name: 'pickup-points-listing' }" class="btn btn-primary mt-4">
          {{ translate("Back to Listing") }}
        </router-link>
      </div>
    </div>

    <div v-else>
      <!-- Header Banner / Overview Card -->
      <div class="card mb-6">
        <div class="card-body pt-9 pb-0">
          <div class="d-flex flex-wrap flex-sm-nowrap mb-6">
            <!-- Icon Symbol -->
            <div
              class="symbol symbol-70px symbol-light-primary me-5 mb-4 flex-shrink-0 d-flex align-items-center justify-content-center rounded"
              style="width: 70px; height: 70px; background-color: #f1faff;"
            >
              <i class="bi bi-geo-alt-fill text-primary fs-2hx"></i>
            </div>

            <!-- Details & Actions -->
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start flex-wrap mb-2">
                <div class="d-flex flex-column">
                  <div class="d-flex align-items-center mb-1">
                    <h2 class="text-gray-900 fw-bold fs-2 me-3 mb-0">
                      {{ pickupPoint.label }}
                    </h2>
                    <span
                      class="badge"
                      :class="pickupPoint.isActive ? 'badge-light-success' : 'badge-light-danger'"
                    >
                      {{ pickupPoint.isActive ? translate("Active") : translate("Inactive") }}
                    </span>
                  </div>
                  <div class="d-flex flex-wrap fw-semibold fs-7 mb-4 pe-2 text-muted gap-4">
                    <span v-if="pickupPoint.streetName">
                      <i class="bi bi-signpost-2 me-1"></i>
                      {{ pickupPoint.streetName }}
                    </span>
                    <span v-if="pickupPoint.buildingNumber">
                      <i class="bi bi-building me-1"></i>
                      {{ translate("Building") }} {{ pickupPoint.buildingNumber }}
                    </span>
                    <span v-if="pickupPoint.createdAt">
                      <i class="bi bi-calendar3 me-1"></i>
                      {{ translate("Created") }}: {{ new Date(pickupPoint.createdAt).toLocaleDateString() }}
                    </span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex gap-2">
                  <router-link
                    v-if="can('update', 'pickup_point')"
                    :to="{ name: 'pickup-point-edit', params: { id: pickupPoint.id } }"
                    class="btn btn-sm btn-primary"
                  >
                    <i class="bi bi-pencil-square me-1"></i>
                    {{ translate("Edit Point") }}
                  </router-link>
                  <router-link
                    :to="{ name: 'pickup-points-listing' }"
                    class="btn btn-sm btn-light"
                  >
                    <i class="bi bi-arrow-left me-1"></i>
                    {{ translate("Back") }}
                  </router-link>
                </div>
              </div>

              <!-- Quick KPI Stats Bar -->
              <div class="d-flex flex-wrap flex-stack">
                <div class="d-flex flex-column flex-grow-1 pe-8">
                  <div class="d-flex flex-wrap gap-4">
                    <!-- Coverage Radius -->
                    <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mb-3">
                      <div class="d-flex align-items-center">
                        <i class="bi bi-broadcast text-info fs-3 me-2"></i>
                        <div class="fs-4 fw-bold">{{ pickupPoint.distance || 5 }} KM</div>
                      </div>
                      <div class="fw-semibold fs-7 text-gray-500">{{ translate("Coverage Radius") }}</div>
                    </div>

                    <!-- Assigned Maids Count -->
                    <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mb-3">
                      <div class="d-flex align-items-center">
                        <i class="bi bi-people-fill text-success fs-3 me-2"></i>
                        <div class="fs-4 fw-bold">{{ (pickupPoint.maids || []).length }}</div>
                      </div>
                      <div class="fw-semibold fs-7 text-gray-500">{{ translate("Assigned Maids") }}</div>
                    </div>

                    <!-- Coordinates -->
                    <div class="border border-gray-300 border-dashed rounded min-w-175px py-3 px-4 mb-3" v-if="pickupPoint.lat && pickupPoint.long">
                      <div class="d-flex align-items-center">
                        <i class="bi bi-crosshair text-primary fs-3 me-2"></i>
                        <div class="fs-7 fw-bold font-monospace">
                          {{ Number(pickupPoint.lat).toFixed(4) }}, {{ Number(pickupPoint.long).toFixed(4) }}
                        </div>
                      </div>
                      <div class="fw-semibold fs-7 text-gray-500">
                        <a
                          :href="`https://www.google.com/maps?q=${pickupPoint.lat},${pickupPoint.long}`"
                          target="_blank"
                          class="text-primary text-hover-underline d-inline-flex align-items-center"
                        >
                          <span>{{ translate("Open in Maps") }}</span>
                          <i class="bi bi-box-arrow-up-right fs-9 ms-1"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout: Map & Assigned Maids -->
      <div class="row g-6">
        <!-- Interactive Coverage Map -->
        <div class="col-xl-6">
          <div class="card card-flush h-100">
            <div class="card-header pt-6">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold fs-4 text-gray-800">
                  <i class="bi bi-map-fill text-primary me-2"></i>
                  {{ translate("Coverage Area & Radius") }}
                </span>
                <span class="text-muted fs-7">
                  {{ translate("Visual zone representing the pickup center and service range") }}
                </span>
              </h3>
            </div>
            <div class="card-body pt-0">
              <div
                ref="mapContainer"
                class="rounded border border-gray-300 shadow-sm position-relative overflow-hidden"
                style="height: 400px; width: 100%;"
              >
                <div
                  v-if="mapLoading"
                  class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-index-2"
                >
                  <div class="spinner-border text-primary" role="status"></div>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-3 text-muted fs-7">
                <span>
                  <i class="bi bi-circle-fill text-primary fs-9 me-1"></i>
                  {{ translate("Radius:") }} {{ pickupPoint.distance || 5 }} KM ({{ ((pickupPoint.distance || 5) * 1000).toLocaleString() }} {{ translate("meters") }})
                </span>
                <span class="badge badge-light-primary font-monospace" v-if="pickupPoint.lat && pickupPoint.long">
                  {{ pickupPoint.lat }}, {{ pickupPoint.long }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Assigned Maids List -->
        <div class="col-xl-6">
          <div class="card card-flush h-100">
            <div class="card-header pt-6">
              <div class="card-title">
                <h3 class="card-label fw-bold fs-4 text-gray-800 mb-0">
                  <i class="bi bi-person-hearts text-danger me-2"></i>
                  {{ translate("Attached Maids") }}
                  <span class="badge badge-light-primary ms-2 fs-7">
                    {{ (pickupPoint.maids || []).length }}
                  </span>
                </h3>
              </div>
              <div class="card-toolbar" v-if="can('update', 'pickup_point')">
                <router-link
                  :to="{ name: 'pickup-point-edit', params: { id: pickupPoint.id } }"
                  class="btn btn-sm btn-light-primary fw-bold"
                >
                  <i class="bi bi-person-plus me-1"></i>
                  {{ translate("Manage Maids") }}
                </router-link>
              </div>
            </div>

            <div class="card-body pt-0">
              <div v-if="!pickupPoint.maids || pickupPoint.maids.length === 0" class="text-center py-10">
                <div
                  class="symbol symbol-60px symbol-circle bg-light-primary mx-auto mb-4 d-flex align-items-center justify-content-center"
                  style="width: 60px; height: 60px;"
                >
                  <i class="bi bi-people text-primary fs-2x"></i>
                </div>
                <h5 class="text-gray-800 fw-bold">{{ translate("No Maids Assigned") }}</h5>
                <p class="text-muted fs-7 mb-4">
                  {{ translate("No maids assigned to this pickup point yet.") }}
                </p>
                <router-link
                  v-if="can('update', 'pickup_point')"
                  :to="{ name: 'pickup-point-edit', params: { id: pickupPoint.id } }"
                  class="btn btn-sm btn-primary"
                >
                  {{ translate("Assign Maids") }}
                </router-link>
              </div>

              <div v-else class="table-responsive" style="max-height: 420px; overflow-y: auto;">
                <table class="table align-middle table-row-dashed fs-7 gy-4">
                  <thead>
                    <tr class="text-start text-gray-400 fw-bold fs-8 text-uppercase">
                      <th>{{ translate("Maid") }}</th>
                      <th>{{ translate("Phone") }}</th>
                      <th>{{ translate("Status") }}</th>
                      <th class="text-end">{{ translate("Actions") }}</th>
                    </tr>
                  </thead>
                  <tbody class="fw-semibold text-gray-600">
                    <tr v-for="maid in pickupPoint.maids" :key="maid.id">
                      <td>
                        <div class="d-flex align-items-center">
                          <div
                            class="symbol symbol-circle symbol-35px overflow-hidden me-3 flex-shrink-0"
                            style="width: 35px; height: 35px;"
                          >
                            <img v-if="maid.image" :src="maid.image" :alt="maid.name" style="width: 35px; height: 35px; object-fit: cover;" />
                            <span v-else class="symbol-label bg-light-primary text-primary fs-6 fw-bold">
                              {{ maid.name ? maid.name.charAt(0).toUpperCase() : "M" }}
                            </span>
                          </div>
                          <div>
                            <router-link
                              :to="{ name: 'maid-details', params: { id: maid.id } }"
                              class="text-gray-800 text-hover-primary fw-bold fs-7 d-block"
                            >
                              {{ maid.name }}
                            </router-link>
                            <span class="text-muted fs-8">{{ maid.email || translate("No Email") }}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="text-gray-800 font-monospace" dir="ltr">{{ maid.phone }}</span>
                      </td>
                      <td>
                        <span
                          class="badge fs-9 py-1 px-2"
                          :class="maid.isActive ? 'badge-light-success' : 'badge-light-danger'"
                        >
                          {{ maid.isActive ? translate("Active") : translate("Inactive") }}
                        </span>
                      </td>
                      <td class="text-end">
                        <router-link
                          :to="{ name: 'maid-details', params: { id: maid.id } }"
                          class="btn btn-icon btn-light btn-sm text-hover-primary"
                          :title="translate('View Maid Profile')"
                        >
                          <i class="bi bi-arrow-right fs-6"></i>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import PickupPointService from "@/core/services/PickupPointService";
import type { PickupPointData } from "@/core/types";
import { translate } from "@/core/helpers/i18n-utils";
import i18n from "@/core/plugins/i18n";
import { loadGoogleMaps } from "@/core/helpers/google-maps-loader";
import { usePermissions } from "@/composables/usePermissions";

export default defineComponent({
  name: "PickupPointDetails",
  setup() {
    const route = useRoute();
    const pickupPointId = route.params.id as string;
    const pickupPoint = ref<PickupPointData | null>(null);
    const loading = ref(true);
    const mapLoading = ref(true);
    const mapContainer = ref<HTMLElement | null>(null);
    const { can } = usePermissions();

    const isArabic = computed(
      () =>
        (i18n.global.locale as any)?.value === "ar" ||
        i18n.global.locale === "ar",
    );

    const initMap = async () => {
      if (!pickupPoint.value || !mapContainer.value) return;

      try {
        mapLoading.value = true;
        const currentLang = isArabic.value ? "ar" : "en";
        const googleMaps = await loadGoogleMaps(currentLang);

        const lat = Number(pickupPoint.value.lat) || 29.3759;
        const lng = Number(pickupPoint.value.long) || 47.9774;
        const center = new googleMaps.LatLng(lat, lng);

        const map = new googleMaps.Map(mapContainer.value, {
          center,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });

        // Center Marker
        new googleMaps.Marker({
          position: center,
          map,
          title: pickupPoint.value.label,
        });

        // Radius Coverage Circle
        const radiusMeters = (Number(pickupPoint.value.distance) || 5) * 1000;
        new googleMaps.Circle({
          strokeColor: "#009ef7",
          strokeOpacity: 0.85,
          strokeWeight: 2,
          fillColor: "#009ef7",
          fillOpacity: 0.18,
          map,
          center,
          radius: radiusMeters,
        });
      } catch (err) {
        console.error("Error initializing details map:", err);
      } finally {
        mapLoading.value = false;
      }
    };

    onMounted(() => {
      PickupPointService.get(pickupPointId)
        .then((data: any) => {
          pickupPoint.value = data;
          nextTick(() => {
            initMap();
          });
        })
        .catch((err) => {
          console.error("Error fetching pickup point:", err);
        })
        .finally(() => {
          loading.value = false;
        });
    });

    return {
      pickupPoint,
      loading,
      mapLoading,
      mapContainer,
      translate,
      can,
    };
  },
});
</script>
