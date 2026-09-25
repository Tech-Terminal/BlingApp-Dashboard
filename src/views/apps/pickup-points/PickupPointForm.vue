<template>
  <form id="kt_pickup_point_form" class="form" @submit.prevent="submit">
    <!-- Card 1: Point Information -->
    <div class="card mb-6">
      <div class="card-header border-0 pt-6">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold fs-4 mb-1">
            <i class="bi bi-geo-alt-fill text-primary me-2"></i>
            {{ translate("Point Information") }}
          </span>
          <span class="text-muted fs-7">
            {{ translate("Configure pickup point identity and coverage") }}
          </span>
        </h3>
      </div>
      <div class="card-body pt-0">
        <!-- Label & Distance -->
        <div class="row">
          <div class="col-md-6 d-flex flex-column mb-7 fv-row">
            <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
              <span class="required">{{ translate("Label") }}</span>
            </label>
            <input
              type="text"
              class="form-control form-control-solid"
              :class="{ 'is-invalid': apiValidation.hasError('label') }"
              v-model="formData.label"
              :placeholder="translate('e.g. Sabah Al Salem, Salmiya Station')"
              required
            />
            <div class="invalid-feedback" v-if="apiValidation.hasError('label')">
              {{ apiValidation.getError("label") }}
            </div>
          </div>

          <div class="col-md-6 d-flex flex-column mb-7 fv-row">
            <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
              <span class="required">{{ translate("Distance Covered in Km") }}</span>
            </label>
            <div class="input-group input-group-solid">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                class="form-control form-control-solid"
                :class="{ 'is-invalid': apiValidation.hasError('distance') }"
                v-model.number="formData.distance"
                @input="onDistanceChange"
                required
              />
              <span class="input-group-text fw-bold">KM</span>
            </div>
            <div class="text-muted fs-8 mt-1">
              {{ translate("The coverage radius will update automatically on the map.") }}
            </div>
            <div class="invalid-feedback" v-if="apiValidation.hasError('distance')">
              {{ apiValidation.getError("distance") }}
            </div>
          </div>
        </div>

        <!-- Street & Building -->
        <div class="row">
          <div class="col-md-6 d-flex flex-column mb-7 fv-row">
            <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
              <span>{{ translate("Street Name") }}</span>
            </label>
            <input
              type="text"
              class="form-control form-control-solid"
              :class="{ 'is-invalid': apiValidation.hasError('streetName') }"
              v-model="formData.streetName"
              :placeholder="translate('e.g. Block 2, Street 226')"
            />
            <div class="invalid-feedback" v-if="apiValidation.hasError('streetName')">
              {{ apiValidation.getError("streetName") }}
            </div>
          </div>

          <div class="col-md-4 d-flex flex-column mb-7 fv-row">
            <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
              <span>{{ translate("Building No") }}</span>
            </label>
            <input
              type="text"
              class="form-control form-control-solid"
              :class="{ 'is-invalid': apiValidation.hasError('buildingNumber') }"
              v-model="formData.buildingNumber"
              :placeholder="translate('e.g. 8, Tower B')"
            />
            <div class="invalid-feedback" v-if="apiValidation.hasError('buildingNumber')">
              {{ apiValidation.getError("buildingNumber") }}
            </div>
          </div>

          <div class="col-md-2 d-flex flex-column mb-7 justify-content-center">
            <label class="fs-6 fw-semibold form-label mb-2">{{ translate("Status") }}</label>
            <div class="form-check form-switch form-check-custom form-check-solid mt-2">
              <input
                class="form-check-input h-25px w-45px"
                type="checkbox"
                id="isActiveSwitch"
                v-model="formData.isActive"
              />
              <label class="form-check-label fw-bold ms-2" for="isActiveSwitch">
                <span v-if="formData.isActive" class="badge badge-light-success fs-8">
                  {{ translate("Active") }}
                </span>
                <span v-else class="badge badge-light-danger fs-8">
                  {{ translate("Inactive") }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 2: Interactive Map & Coordinates -->
    <div class="card mb-6">
      <div class="card-header border-0 pt-6">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold fs-4 mb-1">
            <i class="bi bi-map-fill text-primary me-2"></i>
            {{ translate("Map & Coordinates") }}
          </span>
          <span class="text-muted fs-7">
            {{ translate("Pinpoint the pickup center and define service perimeter") }}
          </span>
        </h3>
        <div class="card-toolbar">
          <button
            type="button"
            class="btn btn-sm btn-light-primary fw-bold"
            @click="locateUser"
            :disabled="locating"
          >
            <span v-if="locating" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-crosshair me-1"></i>
            {{ locating ? translate("Locating...") : translate("Use Current Location") }}
          </button>
        </div>
      </div>
      <div class="card-body pt-0">
        <!-- Coordinates Inputs & Update Map Button -->
        <div class="row align-items-end mb-4 bg-light p-4 rounded border border-gray-200">
          <div class="col-md-4 mb-3 mb-md-0">
            <label class="fs-7 fw-bold text-gray-700 mb-1">{{ translate("Latitude") }}</label>
            <input
              type="number"
              step="any"
              class="form-control form-control-sm form-control-solid"
              v-model.number="formData.lat"
              :placeholder="translate('Latitude')"
            />
          </div>
          <div class="col-md-4 mb-3 mb-md-0">
            <label class="fs-7 fw-bold text-gray-700 mb-1">{{ translate("Longitude") }}</label>
            <input
              type="number"
              step="any"
              class="form-control form-control-sm form-control-solid"
              v-model.number="formData.long"
              :placeholder="translate('Longitude')"
            />
          </div>
          <div class="col-md-4">
            <button
              type="button"
              class="btn btn-sm btn-primary w-100 fw-bold"
              @click="syncMapFromInputs"
            >
              <i class="bi bi-arrow-repeat me-1"></i>
              {{ translate("Update Map") }}
            </button>
          </div>
        </div>

        <!-- Google Places Search Bar -->
        <div class="position-relative mb-4">
          <span class="position-absolute top-50 translate-middle-y ms-4">
            <i class="bi bi-search text-gray-500 fs-5"></i>
          </span>
          <input
            ref="searchBoxInput"
            type="text"
            class="form-control form-control-solid ps-12"
            :placeholder="translate('Search location or area on map...')"
          />
        </div>

        <!-- Google Map Container -->
        <div
          ref="mapContainer"
          class="rounded border border-gray-300 shadow-sm position-relative overflow-hidden"
          style="height: 420px; width: 100%;"
        >
          <div
            v-if="mapLoading"
            class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-index-2"
          >
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{ translate("Please wait...") }}</span>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3 text-muted fs-7">
          <span>
            <i class="bi bi-info-circle me-1"></i>
            {{ translate("Drag marker or click anywhere on the map to adjust coordinates.") }}
          </span>
          <span v-if="formData.lat && formData.long" class="badge badge-light-primary font-monospace">
            {{ Number(formData.lat).toFixed(6) }}, {{ Number(formData.long).toFixed(6) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Card 3: Assigned Maids (Domain Rule: Each maid attached to a single pickup point) -->
    <div class="card mb-6">
      <div class="card-header border-0 pt-6">
        <h3 class="card-title align-items-start flex-column">
          <div class="d-flex align-items-center gap-2">
            <span class="card-label fw-bold fs-4">
              <i class="bi bi-person-check-fill text-success me-2"></i>
              {{ translate("Assigned Maids") }}
            </span>
            <span class="badge badge-light-primary fw-bold fs-7">
              {{ (formData.maidIds || []).length }} {{ translate("Selected") }}
            </span>
          </div>
          <span class="text-muted fs-7">
            {{ translate("Each maid will be attached to a single pickup point. Only unassigned maids are displayed.") }}
          </span>
        </h3>
      </div>
      <div class="card-body pt-0">
        <!-- Search within available maids -->
        <div class="d-flex align-items-center position-relative mb-5">
          <span class="position-absolute top-50 translate-middle-y ms-4">
            <i class="bi bi-search text-gray-500 fs-6"></i>
          </span>
          <input
            type="text"
            v-model="maidSearchQuery"
            class="form-control form-control-solid ps-12 form-control-sm"
            :placeholder="translate('Search available maids...')"
          />
        </div>

        <!-- Selected Maids Quick Summary Chips -->
        <div v-if="(formData.maidIds || []).length > 0" class="mb-5 p-4 rounded bg-light-primary border border-primary border-dashed">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fs-7 fw-bold text-primary">
              {{ translate("Currently Assigned to this Point:") }}
            </span>
            <button
              type="button"
              class="btn btn-xs btn-link text-danger p-0"
              @click="clearAllMaids"
            >
              {{ translate("Clear All") }}
            </button>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <span
              v-for="maid in selectedMaidsList"
              :key="maid.id"
              class="badge badge-white shadow-sm border py-2 px-3 d-inline-flex align-items-center gap-2"
            >
              <div
                class="symbol symbol-circle symbol-20px overflow-hidden flex-shrink-0"
                style="width: 20px; height: 20px;"
              >
                <img v-if="maid.image" :src="maid.image" :alt="maid.name" style="width: 20px; height: 20px; object-fit: cover;" />
                <span v-else class="symbol-label bg-light-primary text-primary fs-9 fw-bold">
                  {{ maid.name ? maid.name.charAt(0).toUpperCase() : "M" }}
                </span>
              </div>
              <span class="text-gray-800 fw-bold">{{ maid.name }}</span>
              <a
                href="javascript:void(0)"
                class="text-muted text-hover-danger ms-1"
                @click.stop="toggleMaid(maid.id)"
                :title="translate('Remove')"
              >
                <i class="bi bi-x-circle-fill fs-7"></i>
              </a>
            </span>
          </div>
        </div>

        <!-- Available Maids List / Grid -->
        <div v-if="loadingMaids" class="d-flex justify-content-center py-8">
          <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
          <span class="ms-2 text-muted fs-7">{{ translate("Loading maids...") }}</span>
        </div>

        <div v-else-if="filteredMaids.length === 0" class="text-center py-6 text-muted fs-7">
          <i class="bi bi-people fs-2 text-gray-400 d-block mb-2"></i>
          {{ translate("No maids available to attach.") }}
        </div>

        <div v-else class="row g-3" style="max-height: 320px; overflow-y: auto;">
          <div
            v-for="maid in filteredMaids"
            :key="maid.id"
            class="col-md-6 col-lg-4"
          >
            <div
              class="card h-100 border cursor-pointer transition-all"
              :class="isMaidSelected(maid.id) ? 'border-primary bg-light-primary' : 'border-gray-200 bg-white'"
              @click="toggleMaid(maid.id)"
              style="transition: all 0.2s ease;"
            >
              <div class="card-body p-3 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                  <div
                    class="symbol symbol-circle symbol-40px overflow-hidden flex-shrink-0"
                    style="width: 40px; height: 40px;"
                  >
                    <img v-if="maid.image" :src="maid.image" :alt="maid.name" style="width: 40px; height: 40px; object-fit: cover;" />
                    <span v-else class="symbol-label bg-light-primary text-primary fs-5 fw-bold">
                      {{ maid.name ? maid.name.charAt(0).toUpperCase() : "M" }}
                    </span>
                  </div>
                  <div>
                    <div class="text-gray-800 fw-bold fs-7">{{ maid.name }}</div>
                    <div class="text-muted fs-8 font-monospace" dir="ltr">{{ maid.phone }}</div>
                  </div>
                </div>
                <div>
                  <span
                    v-if="isMaidSelected(maid.id)"
                    class="badge badge-primary badge-circle w-25px h-25px d-flex align-items-center justify-content-center"
                  >
                    <i class="bi bi-check fs-6 text-white"></i>
                  </span>
                  <span
                    v-else
                    class="badge badge-light badge-circle w-25px h-25px d-flex align-items-center justify-content-center border"
                  >
                    <i class="bi bi-plus fs-6 text-gray-500"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="d-flex justify-content-end gap-3 pt-5">
      <button type="button" class="btn btn-light" @click="$emit('cancel')">
        {{ translate("Discard") }}
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :data-kt-indicator="loading ? 'on' : 'off'"
        :disabled="loading"
      >
        <span class="indicator-label">{{ translate("Submit") }}</span>
        <span class="indicator-progress">
          {{ translate("Please wait...") }}
          <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
        </span>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  PropType,
  ref,
  onMounted,
} from "vue";
import { translate } from "@/core/helpers/i18n-utils";
import i18n from "@/core/plugins/i18n";
import { loadGoogleMaps } from "@/core/helpers/google-maps-loader";
import MaidService from "@/core/services/MaidService";
import type { MaidData } from "@/core/types";

export default defineComponent({
  name: "PickupPointForm",
  props: {
    modelValue: {
      type: Object as PropType<any>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    pickupPointId: {
      type: [String, Number],
      default: undefined,
    },
    apiValidation: {
      type: Object as PropType<{
        hasError: (f: string) => boolean;
        getError: (f: string) => string;
      }>,
      default: () => ({ hasError: () => false, getError: () => "" }),
    },
  },
  emits: ["update:modelValue", "submit", "cancel"],
  setup(props, { emit }) {
    const formData = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const isArabic = computed(
      () =>
        (i18n.global.locale as any)?.value === "ar" ||
        i18n.global.locale === "ar",
    );

    // Google Maps References & State
    const mapContainer = ref<HTMLElement | null>(null);
    const searchBoxInput = ref<HTMLInputElement | null>(null);
    const mapLoading = ref(true);
    const locating = ref(false);

    let googleMaps: typeof google.maps | null = null;
    let map: google.maps.Map | null = null;
    let marker: google.maps.Marker | null = null;
    let circle: google.maps.Circle | null = null;
    let autocomplete: google.maps.places.Autocomplete | null = null;

    // Maids state
    const availableMaids = ref<MaidData[]>([]);
    const loadingMaids = ref(false);
    const maidSearchQuery = ref("");

    const fetchAvailableMaids = async () => {
      try {
        loadingMaids.value = true;
        const res: any = await MaidService.getAll({
          pagination: { limit: 100 },
          filters: { isActive: true },
        });
        const allMaids = res?.data || [];
        availableMaids.value = allMaids.filter((m: any) => {
          if (!m.pickupPointId) return true;
          if (
            props.isEdit &&
            props.pickupPointId &&
            Number(m.pickupPointId) === Number(props.pickupPointId)
          ) {
            return true;
          }
          return false;
        });
      } catch (err) {
        console.error("Error fetching available maids:", err);
      } finally {
        loadingMaids.value = false;
      }
    };

    const isMaidSelected = (maidId: number) => {
      return (formData.value.maidIds || []).includes(maidId);
    };

    const toggleMaid = (maidId: number) => {
      const currentIds = [...(formData.value.maidIds || [])];
      const index = currentIds.indexOf(maidId);
      if (index > -1) {
        currentIds.splice(index, 1);
      } else {
        currentIds.push(maidId);
      }
      formData.value.maidIds = currentIds;
    };

    const clearAllMaids = () => {
      formData.value.maidIds = [];
    };

    const selectedMaidsList = computed(() => {
      const set = new Set(formData.value.maidIds || []);
      return availableMaids.value.filter((m) => set.has(m.id));
    });

    const filteredMaids = computed(() => {
      const q = maidSearchQuery.value.trim().toLowerCase();
      if (!q) return availableMaids.value;
      return availableMaids.value.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.phone && m.phone.toLowerCase().includes(q)),
      );
    });

    // Map initialization
    const initGoogleMap = async () => {
      try {
        mapLoading.value = true;
        const currentLang = isArabic.value ? "ar" : "en";
        googleMaps = await loadGoogleMaps(currentLang);

        if (!mapContainer.value) return;

        const initialLat = Number(formData.value.lat) || 29.3759;
        const initialLng = Number(formData.value.long) || 47.9774;
        const latLng = new googleMaps.LatLng(initialLat, initialLng);

        map = new googleMaps.Map(mapContainer.value, {
          center: latLng,
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          mapTypeControlOptions: {
            position: googleMaps.ControlPosition.TOP_LEFT,
          },
        });

        // Draggable Marker
        marker = new googleMaps.Marker({
          position: latLng,
          map,
          draggable: true,
          animation: googleMaps.Animation.DROP,
        });

        // Coverage Radius Circle
        const radiusMeters = (Number(formData.value.distance) || 5) * 1000;
        circle = new googleMaps.Circle({
          strokeColor: "#009ef7",
          strokeOpacity: 0.85,
          strokeWeight: 2,
          fillColor: "#009ef7",
          fillOpacity: 0.18,
          map,
          center: latLng,
          radius: radiusMeters,
        });

        // Sync coordinates when marker dragged
        marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          const lat = Number(e.latLng.lat().toFixed(7));
          const lng = Number(e.latLng.lng().toFixed(7));
          formData.value.lat = lat;
          formData.value.long = lng;
          if (circle) {
            circle.setCenter(e.latLng);
          }
        });

        // Sync coordinates on map click
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          const lat = Number(e.latLng.lat().toFixed(7));
          const lng = Number(e.latLng.lng().toFixed(7));
          formData.value.lat = lat;
          formData.value.long = lng;
          if (marker) {
            marker.setPosition(e.latLng);
          }
          if (circle) {
            circle.setCenter(e.latLng);
          }
        });

        // Setup Places Autocomplete Search Box
        if (searchBoxInput.value && googleMaps.places) {
          autocomplete = new googleMaps.places.Autocomplete(searchBoxInput.value, {
            fields: ["geometry", "name", "formatted_address"],
          });
          autocomplete.bindTo("bounds", map);

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete?.getPlace();
            if (!place || !place.geometry || !place.geometry.location) return;

            const loc = place.geometry.location;
            const lat = Number(loc.lat().toFixed(7));
            const lng = Number(loc.lng().toFixed(7));

            formData.value.lat = lat;
            formData.value.long = lng;

            if (map && marker && circle) {
              map.setCenter(loc);
              map.setZoom(14);
              marker.setPosition(loc);
              circle.setCenter(loc);
            }
          });
        }
      } catch (err) {
        console.error("Error initializing Google Maps:", err);
      } finally {
        mapLoading.value = false;
      }
    };

    // Update Circle radius when distance input changes
    const onDistanceChange = () => {
      const radiusMeters = (Number(formData.value.distance) || 5) * 1000;
      if (circle) {
        circle.setRadius(radiusMeters);
      }
    };

    // "Update Map" button action
    const syncMapFromInputs = () => {
      if (!map || !marker || !circle || !googleMaps) return;
      const lat = Number(formData.value.lat);
      const lng = Number(formData.value.long);
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        const target = new googleMaps.LatLng(lat, lng);
        marker.setPosition(target);
        circle.setCenter(target);
        onDistanceChange();
        map.panTo(target);
        map.setZoom(14);
      }
    };

    // Use current geolocation
    const locateUser = () => {
      if (!navigator.geolocation) return;
      locating.value = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          locating.value = false;
          const lat = Number(pos.coords.latitude.toFixed(7));
          const lng = Number(pos.coords.longitude.toFixed(7));
          formData.value.lat = lat;
          formData.value.long = lng;
          if (map && marker && circle && googleMaps) {
            const userPos = new googleMaps.LatLng(lat, lng);
            marker.setPosition(userPos);
            circle.setCenter(userPos);
            map.setCenter(userPos);
            map.setZoom(15);
          }
        },
        (err) => {
          locating.value = false;
          console.warn("Geolocation error:", err);
        },
        { enableHighAccuracy: true, timeout: 8000 },
      );
    };

    const submit = () => {
      emit("submit");
    };

    onMounted(() => {
      initGoogleMap();
      fetchAvailableMaids();
    });

    return {
      formData,
      mapContainer,
      searchBoxInput,
      mapLoading,
      locating,
      availableMaids,
      loadingMaids,
      maidSearchQuery,
      filteredMaids,
      selectedMaidsList,
      isMaidSelected,
      toggleMaid,
      clearAllMaids,
      onDistanceChange,
      syncMapFromInputs,
      locateUser,
      submit,
      translate,
    };
  },
});
</script>

<style scoped>
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
