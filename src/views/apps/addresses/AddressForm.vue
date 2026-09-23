<template>
  <form id="kt_address_form" class="form" @submit.prevent="submit">
    <!-- Client & Label -->
    <div class="row">
      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("Client") }}</span>
        </label>
        <SearchableSelect
          v-model="formData.clientId"
          :service="ClientService"
          label="name"
          :placeholder="translate('Select Client')"
          :initialOption="initialClient"
          :class="{ 'is-invalid': apiValidation.hasError('clientId') }"
        />
        <div
          class="invalid-feedback"
          v-if="apiValidation.hasError('clientId')"
          style="display: block"
        >
          {{ apiValidation.getError("clientId") }}
        </div>
      </div>

      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("Address Label") }}</span>
        </label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('label') }"
          v-model="formData.label"
          :placeholder="translate('e.g. Home, Office, Beach House')"
          required
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('label')">
          {{ apiValidation.getError("label") }}
        </div>
      </div>
    </div>

    <!-- Governorate & Area -->
    <div class="row">
      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("Governorate") }}</span>
        </label>
        <SearchableSelect
          v-model="formData.governorateId"
          :service="GovernorateService"
          :label="locationLabel"
          :placeholder="translate('Select Governorate')"
          :initialOption="initialGovernorate"
          @update:modelValue="onGovernorateChange"
          :class="{ 'is-invalid': apiValidation.hasError('governorateId') }"
        />
        <div
          class="invalid-feedback"
          v-if="apiValidation.hasError('governorateId')"
          style="display: block"
        >
          {{ apiValidation.getError("governorateId") }}
        </div>
      </div>

      <div class="col-md-6 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("Area") }}</span>
        </label>
        <SearchableSelect
          v-model="formData.areaId"
          :service="AreaService"
          :label="locationLabel"
          :placeholder="translate('Select Area')"
          :initialOption="initialArea"
          :query="areaQuery"
          :key="`area-select-${formData.governorateId || 'none'}`"
          :class="{ 'is-invalid': apiValidation.hasError('areaId') }"
        />
        <div
          class="invalid-feedback"
          v-if="apiValidation.hasError('areaId')"
          style="display: block"
        >
          {{ apiValidation.getError("areaId") }}
        </div>
      </div>
    </div>

    <!-- Street, Block, House/Building -->
    <div class="row">
      <div class="col-md-4 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("Street") }}</span>
        </label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('street') }"
          v-model="formData.street"
          :placeholder="translate('Enter street')"
          required
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('street')">
          {{ apiValidation.getError("street") }}
        </div>
      </div>

      <div class="col-md-4 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("Block") }}</span>
        </label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('block') }"
          v-model="formData.block"
          :placeholder="translate('Enter block')"
          required
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('block')">
          {{ apiValidation.getError("block") }}
        </div>
      </div>

      <div class="col-md-4 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span class="required">{{ translate("Building / House") }}</span>
        </label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': apiValidation.hasError('houseNumber') }"
          v-model="formData.houseNumber"
          :placeholder="translate('Enter building / house number')"
          required
        />
        <div class="invalid-feedback" v-if="apiValidation.hasError('houseNumber')">
          {{ apiValidation.getError("houseNumber") }}
        </div>
      </div>
    </div>

    <!-- Additional Details -->
    <div class="row">
      <div class="col-12 d-flex flex-column mb-7 fv-row">
        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
          <span>{{ translate("Additional Details / Notes") }}</span>
        </label>
        <textarea
          class="form-control"
          rows="2"
          :class="{ 'is-invalid': apiValidation.hasError('additionalDetails') }"
          v-model="formData.additionalDetails"
          :placeholder="translate('Apartment number, floor, landmarks, etc.')"
        ></textarea>
        <div class="invalid-feedback" v-if="apiValidation.hasError('additionalDetails')">
          {{ apiValidation.getError("additionalDetails") }}
        </div>
      </div>
    </div>

    <!-- Hidden Coordinates inputs -->
    <input type="hidden" v-model.number="formData.lat" />
    <input type="hidden" v-model.number="formData.long" />

    <!-- Interactive Google Map Picker -->
    <div class="row mb-7">
      <div class="col-12">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <label class="fs-6 fw-semibold form-label mb-0 d-flex align-items-center gap-2">
            <span>
              <i class="bi bi-geo-alt-fill text-primary me-1"></i>
              {{ translate("Pick Location on Map") }}
            </span>
            <span v-if="formData.lat && formData.long" class="badge badge-light-primary fs-8 font-monospace">
              {{ formData.lat }}, {{ formData.long }}
            </span>
          </label>
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
        <div class="text-muted fs-7 mb-3">
          {{ translate("Click on the map or drag the marker to choose coordinates") }}
        </div>

        <!-- Google Places Search Bar -->
        <div class="position-relative mb-3">
          <span class="position-absolute top-50 translate-middle-y ms-4">
            <i class="bi bi-search text-gray-500 fs-5"></i>
          </span>
          <input
            ref="searchBoxInput"
            type="text"
            class="form-control form-control-solid ps-12"
            :placeholder="translate('Search location or area...')"
          />
        </div>

        <!-- Google Map Container -->
        <div
          ref="mapContainer"
          class="rounded border border-gray-300 shadow-sm position-relative overflow-hidden"
          style="height: 400px; width: 100%;"
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

        <div
          class="text-danger fs-7 mt-2"
          v-if="apiValidation.hasError('lat') || apiValidation.hasError('long')"
        >
          {{ apiValidation.getError("lat") || apiValidation.getError("long") }}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="text-center pt-10">
      <button type="button" class="btn btn-light me-3" @click="$emit('cancel')">
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
  onBeforeUnmount,
  watch,
} from "vue";
import SearchableSelect from "@/components/inputs/SearchableSelect.vue";
import ClientService from "@/core/services/ClientService";
import GovernorateService from "@/core/services/GovernorateService";
import AreaService from "@/core/services/AreaService";
import { translate } from "@/core/helpers/i18n-utils";
import i18n from "@/core/plugins/i18n";
import { loadGoogleMaps } from "@/core/helpers/google-maps-loader";

export default defineComponent({
  name: "AddressForm",
  components: {
    SearchableSelect,
  },
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
    initialClient: {
      type: Object,
      default: null,
    },
    initialGovernorate: {
      type: Object,
      default: null,
    },
    initialArea: {
      type: Object,
      default: null,
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

    const locationLabel = computed(() => (isArabic.value ? "nameAr" : "nameEn"));

    const areaQuery = computed(() => {
      if (formData.value.governorateId) {
        return { governorateId: formData.value.governorateId };
      }
      return {};
    });

    const onGovernorateChange = () => {
      if (props.initialArea && props.initialArea.governorateId === formData.value.governorateId) {
        // Keep initial
      } else {
        formData.value.areaId = null;
      }
    };

    // Google Maps Integration
    const mapContainer = ref<HTMLElement | null>(null);
    const searchBoxInput = ref<HTMLInputElement | null>(null);
    const mapLoading = ref(true);
    const locating = ref(false);

    let googleMaps: typeof google.maps | null = null;
    let map: google.maps.Map | null = null;
    let marker: google.maps.Marker | null = null;
    let autocomplete: google.maps.places.Autocomplete | null = null;

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

        marker = new googleMaps.Marker({
          position: latLng,
          map,
          draggable: true,
          animation: googleMaps.Animation.DROP,
        });

        // Sync coordinates on marker drag
        marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          formData.value.lat = Number(e.latLng.lat().toFixed(7));
          formData.value.long = Number(e.latLng.lng().toFixed(7));
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

            if (map && marker) {
              map.setCenter(loc);
              map.setZoom(15);
              marker.setPosition(loc);
            }
          });
        }
      } catch (err) {
        console.error("Error initializing Google Maps:", err);
      } finally {
        mapLoading.value = false;
      }
    };

    // Watch manual lat/long changes and sync marker position
    watch(
      () => [formData.value.lat, formData.value.long],
      ([newLat, newLng]) => {
        if (!map || !marker || !googleMaps) return;
        const lat = Number(newLat);
        const lng = Number(newLng);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          const curPos = marker.getPosition();
          if (
            !curPos ||
            Math.abs(curPos.lat() - lat) > 0.00001 ||
            Math.abs(curPos.lng() - lng) > 0.00001
          ) {
            const target = new googleMaps.LatLng(lat, lng);
            marker.setPosition(target);
            map.panTo(target);
          }
        }
      },
    );

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
          if (map && marker && googleMaps) {
            const userPos = new googleMaps.LatLng(lat, lng);
            marker.setPosition(userPos);
            map.setCenter(userPos);
            map.setZoom(16);
          }
        },
        (err) => {
          locating.value = false;
          console.warn("Geolocation error:", err);
        },
        { enableHighAccuracy: true, timeout: 8000 },
      );
    };

    onMounted(() => {
      initGoogleMap();
    });

    onBeforeUnmount(() => {
      if (marker && googleMaps) {
        googleMaps.event.clearInstanceListeners(marker);
        marker.setMap(null);
        marker = null;
      }
      if (map && googleMaps) {
        googleMaps.event.clearInstanceListeners(map);
        map = null;
      }
      if (autocomplete && googleMaps) {
        googleMaps.event.clearInstanceListeners(autocomplete);
        autocomplete = null;
      }
    });

    const submit = () => {
      const payload: any = {
        clientId: Number(formData.value.clientId),
        label: formData.value.label?.trim(),
        governorateId: Number(formData.value.governorateId),
        areaId: Number(formData.value.areaId),
        street: formData.value.street?.trim(),
        block: formData.value.block?.trim(),
        houseNumber: formData.value.houseNumber?.trim(),
        additionalDetails: formData.value.additionalDetails?.trim() || null,
        lat: Number(formData.value.lat),
        long: Number(formData.value.long),
        isDefault: Boolean(formData.value.isDefault),
      };

      emit("submit", payload);
    };

    return {
      formData,
      submit,
      ClientService,
      GovernorateService,
      AreaService,
      locationLabel,
      areaQuery,
      onGovernorateChange,
      mapContainer,
      searchBoxInput,
      mapLoading,
      locating,
      locateUser,
      translate,
    };
  },
});
</script>

<style scoped>
.pac-container {
  z-index: 10000 !important;
}
</style>
