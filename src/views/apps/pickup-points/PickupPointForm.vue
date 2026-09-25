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
            {{ translate("Configure pickup point identity and details") }}
          </span>
        </h3>
      </div>
      <div class="card-body pt-0">
        <!-- Label -->
        <div class="row">
          <div class="col-12 d-flex flex-column mb-7 fv-row">
            <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
              <span class="required">{{ translate("Label") }}</span>
            </label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': apiValidation.hasError('label') }"
              v-model="formData.label"
              :placeholder="translate('Enter label')"
              required
            />
            <div class="invalid-feedback" v-if="apiValidation.hasError('label')">
              {{ apiValidation.getError("label") }}
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
              class="form-control"
              :class="{ 'is-invalid': apiValidation.hasError('streetName') }"
              v-model="formData.streetName"
              :placeholder="translate('Enter street name')"
            />
            <div class="invalid-feedback" v-if="apiValidation.hasError('streetName')">
              {{ apiValidation.getError("streetName") }}
            </div>
          </div>

          <div class="col-md-6 d-flex flex-column mb-7 fv-row">
            <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
              <span>{{ translate("Building Number") }}</span>
            </label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': apiValidation.hasError('buildingNumber') }"
              v-model="formData.buildingNumber"
              :placeholder="translate('Enter building number')"
            />
            <div class="invalid-feedback" v-if="apiValidation.hasError('buildingNumber')">
              {{ apiValidation.getError("buildingNumber") }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 2: Service Coverage (Governorates & Areas) -->
    <div class="card mb-6">
      <div class="card-header border-0 pt-6">
        <h3 class="card-title align-items-start flex-column">
          <div class="d-flex align-items-center gap-2">
            <span class="card-label fw-bold fs-4">
              <i class="bi bi-pin-map-fill text-primary me-2"></i>
              {{ translate("Service Areas") }}
            </span>
            <span class="badge badge-light-primary fw-bold fs-7">
              {{ (formData.areaIds || []).length }} {{ translate("Covered Areas") }}
            </span>
          </div>
          <span class="text-muted fs-7">
            {{ translate("Select the areas that this pickup point services.") }}
          </span>
        </h3>
        <div class="card-toolbar d-flex gap-2">
          <button
            v-if="selectedGovId"
            type="button"
            class="btn btn-sm btn-light-primary fw-bold"
            @click="selectAllInCurrentGov"
          >
            <i class="bi bi-check2-all me-1"></i>
            {{ translate("Select All in Governorate") }}
          </button>
          <button
            v-if="(formData.areaIds || []).length > 0"
            type="button"
            class="btn btn-sm btn-light-danger fw-bold"
            @click="clearAllAreas"
          >
            <i class="bi bi-x me-1"></i>
            {{ translate("Clear All") }}
          </button>
        </div>
      </div>
      <div class="card-body pt-0">
        <!-- Filter Controls: Governorate SearchableSelect + Area Search Input -->
        <div class="row g-3 align-items-center mb-5">
          <!-- Governorate SearchableSelect -->
          <div class="col-md-5">
            <div class="d-flex align-items-center">
              <label class="fs-7 fw-semibold form-label me-2 mb-0 text-nowrap">
                <i class="bi bi-funnel text-primary me-1"></i>
                {{ translate("Governorate") }}:
              </label>
              <div class="flex-grow-1">
                <SearchableSelect
                  v-model="selectedGovId"
                  :service="GovernorateService"
                  :label="locationLabel"
                  :placeholder="translate('All Governorates')"
                  :showAllOption="true"
                  :perPage="50"
                  @update:modelValue="onGovernorateChange"
                />
              </div>
            </div>
          </div>

          <!-- Area Search Input -->
          <div class="col-md-7">
            <div class="position-relative">
              <span class="position-absolute top-50 translate-middle-y ms-4">
                <i class="bi bi-search text-gray-500 fs-7"></i>
              </span>
              <input
                type="text"
                v-model="areaSearchQuery"
                @input="onSearchInput"
                class="form-control ps-12"
                style="height: 43.78px;"
                :placeholder="translate('Search covered areas...')"
              />
            </div>
          </div>
        </div>

        <!-- Selected Areas Chips -->
        <div
          v-if="(formData.areaIds || []).length > 0"
          class="mb-5 p-4 rounded bg-light-primary border border-primary border-dashed"
        >
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fs-7 fw-bold text-primary">
              <i class="bi bi-check-circle-fill me-1"></i>
              {{ translate("Selected Areas") }} ({{ (formData.areaIds || []).length }}):
            </span>
          </div>
          <div class="d-flex flex-wrap gap-2" style="max-height: 120px; overflow-y: auto;">
            <span
              v-for="area in selectedAreasList"
              :key="area.id"
              class="badge badge-white border border-gray-300 py-2 px-3 d-inline-flex align-items-center gap-2"
            >
              <span class="text-gray-800 fw-bold fs-8">
                {{ isArabic ? area.nameAr : area.nameEn }}
              </span>
              <span
                v-if="area.governorate"
                class="badge badge-light-secondary text-muted fs-9 py-0 px-1"
              >
                {{ isArabic ? area.governorate.nameAr : area.governorate.nameEn }}
              </span>
              <a
                href="javascript:void(0)"
                class="text-muted text-hover-danger ms-1"
                @click.stop="toggleArea(area.id)"
                :title="translate('Remove')"
              >
                <i class="bi bi-x-circle-fill fs-8"></i>
              </a>
            </span>
          </div>
        </div>

        <!-- Areas Grid Selection -->
        <div v-if="loadingAreas" class="d-flex justify-content-center py-8">
          <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
          <span class="ms-2 text-muted fs-7">{{ translate("Loading...") }}</span>
        </div>

        <div v-else-if="areas.length === 0" class="text-center py-6 text-muted fs-7">
          <i class="bi bi-pin-map fs-2 text-gray-400 d-block mb-2"></i>
          {{ translate("No areas found.") }}
        </div>

        <div v-else class="row g-2" style="max-height: 360px; overflow-y: auto;">
          <div
            v-for="area in areas"
            :key="area.id"
            class="col-sm-6 col-md-4 col-lg-3"
          >
            <div
              class="card h-100 border cursor-pointer p-3 transition-all d-flex flex-row align-items-center justify-content-between"
              :class="isAreaSelected(area.id) ? 'border-primary bg-light-primary' : 'border-gray-200 bg-white hover-border-primary'"
              @click="toggleArea(area.id)"
              style="transition: all 0.15s ease;"
            >
              <div class="min-w-0 pe-2">
                <div class="text-gray-800 fw-bold fs-7 text-truncate">
                  {{ isArabic ? area.nameAr : area.nameEn }}
                </div>
                <div class="text-muted fs-8 text-truncate">
                  {{ getGovName(area) }}
                </div>
              </div>
              <div>
                <span
                  v-if="isAreaSelected(area.id)"
                  class="badge badge-primary badge-circle w-22px h-22px d-flex align-items-center justify-content-center"
                >
                  <i class="bi bi-check fs-7 text-white"></i>
                </span>
                <span
                  v-else
                  class="badge badge-light badge-circle w-22px h-22px d-flex align-items-center justify-content-center border"
                >
                  <i class="bi bi-plus fs-7 text-gray-400"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 4: Assigned Maids -->
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
            class="form-control ps-12 form-control-sm"
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
              class="badge badge-white border border-gray-300 py-2 px-3 d-inline-flex align-items-center gap-2"
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

        <div v-else class="row g-3" style="max-height: 300px; overflow-y: auto;">
          <div
            v-for="maid in filteredMaids"
            :key="maid.id"
            class="col-md-6 col-lg-4"
          >
            <div
              class="card h-100 border cursor-pointer transition-all"
              :class="isMaidSelected(maid.id) ? 'border-primary bg-light-primary' : 'border-gray-200 bg-white hover-border-primary'"
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
    <div class="text-center pt-15">
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
  reactive,
  watch,
  onMounted,
} from "vue";
import { translate } from "@/core/helpers/i18n-utils";
import i18n from "@/core/plugins/i18n";
import MaidService from "@/core/services/MaidService";
import AreaService from "@/core/services/AreaService";
import GovernorateService from "@/core/services/GovernorateService";
import SearchableSelect from "@/components/inputs/SearchableSelect.vue";
import type { MaidData, AreaData, GovernorateData } from "@/core/types";

export default defineComponent({
  name: "PickupPointForm",
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

    const locationLabel = computed(() => (isArabic.value ? "nameAr" : "nameEn"));

    // Governorates and Areas state
    const areas = ref<AreaData[]>([]);
    const loadingAreas = ref(false);
    const selectedGovId = ref<number | null>(null);
    const areaSearchQuery = ref("");
    const knownAreasMap = reactive(new Map<number, AreaData>());

    watch(
      () => formData.value.areas,
      (val: any) => {
        if (Array.isArray(val)) {
          val.forEach((a: any) => {
            if (a && a.id) knownAreasMap.set(a.id, a);
          });
        }
      },
      { immediate: true },
    );

    const fetchAreas = async () => {
      try {
        loadingAreas.value = true;
        const params: any = {
          page: 1,
          limit: 250,
        };
        const rawGov = selectedGovId.value;
        const govId =
          typeof rawGov === "object" && rawGov !== null
            ? (rawGov as any).id
            : rawGov;
        if (govId) {
          params.governorateId = Number(govId);
        }
        const q = areaSearchQuery.value ? areaSearchQuery.value.trim() : "";
        if (q) {
          params.search = q;
        }

        const res: any = await AreaService.getAll(params);
        const fetchedList: AreaData[] = res?.data || [];
        areas.value = fetchedList;

        for (const a of fetchedList) {
          knownAreasMap.set(a.id, a);
        }
      } catch (err) {
        console.error("Error loading areas:", err);
      } finally {
        loadingAreas.value = false;
      }
    };

    const onGovernorateChange = (val: any) => {
      selectedGovId.value = val;
      fetchAreas();
    };

    watch(selectedGovId, () => {
      fetchAreas();
    });

    let searchTimeout: any = null;
    const onSearchInput = () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchAreas();
      }, 300);
    };

    const getGovName = (area: AreaData) => {
      if (area.governorate) {
        return isArabic.value ? area.governorate.nameAr : area.governorate.nameEn;
      }
      return "";
    };

    const isAreaSelected = (areaId: number) => {
      return (formData.value.areaIds || []).includes(areaId);
    };

    const toggleArea = (areaId: number) => {
      const current = [...(formData.value.areaIds || [])];
      const idx = current.indexOf(areaId);
      if (idx > -1) {
        current.splice(idx, 1);
      } else {
        current.push(areaId);
      }
      formData.value.areaIds = current;
    };

    const clearAllAreas = () => {
      formData.value.areaIds = [];
    };

    const selectAllInCurrentGov = () => {
      const currentAreaIds = areas.value.map((a) => a.id);
      const set = new Set([...(formData.value.areaIds || []), ...currentAreaIds]);
      formData.value.areaIds = Array.from(set);
    };

    const selectedAreasList = computed(() => {
      const ids = formData.value.areaIds || [];
      return ids.map((id) => {
        const found = knownAreasMap.get(id) || areas.value.find((a) => a.id === id);
        return (
          found || {
            id,
            nameEn: `Area #${id}`,
            nameAr: `منطقة #${id}`,
            governorate: null,
          }
        );
      });
    });

    // Maids state
    const availableMaids = ref<MaidData[]>([]);
    const loadingMaids = ref(false);
    const maidSearchQuery = ref("");

    const fetchAvailableMaids = async () => {
      try {
        loadingMaids.value = true;
        const res: any = await MaidService.getAll({
          page: 1,
          limit: 100,
        });
        const allMaids = res?.data || [];
        availableMaids.value = allMaids.filter((m: any) => {
          if (!m.isActive) return false;
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

    const submit = () => {
      emit("submit");
    };

    onMounted(() => {
      fetchAreas();
      fetchAvailableMaids();
    });

    return {
      formData,
      isArabic,
      locationLabel,
      GovernorateService,
      selectedGovId,
      areaSearchQuery,
      areas,
      selectedAreasList,
      loadingAreas,
      getGovName,
      isAreaSelected,
      toggleArea,
      clearAllAreas,
      selectAllInCurrentGov,
      onGovernorateChange,
      onSearchInput,
      availableMaids,
      loadingMaids,
      maidSearchQuery,
      filteredMaids,
      selectedMaidsList,
      isMaidSelected,
      toggleMaid,
      clearAllMaids,
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
.hover-border-primary:hover {
  border-color: var(--bs-primary) !important;
}
:deep(.v-select .vs__dropdown-toggle) {
  min-height: 43.78px;
  height: 43.78px;
  display: flex;
  align-items: center;
}
</style>
