<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h2 class="d-flex align-items-center gap-2">
          <i class="bi bi-pencil-square text-primary fs-1"></i>
          <span>{{ translate("Edit Pick Up Point") }}</span>
        </h2>
      </div>
    </div>
    <div class="card-body pt-0">
      <div v-if="loadingData" class="d-flex justify-content-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ translate("Loading...") }}</span>
        </div>
      </div>
      <PickupPointForm
        v-else
        v-model="form"
        :loading="loading"
        :isEdit="true"
        :pickupPointId="pickupPointId"
        :apiValidation="validation"
        @submit="updatePickupPoint"
        @cancel="discard"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PickupPointForm from "./PickupPointForm.vue";
import PickupPointService from "@/core/services/PickupPointService";
import type { UpdatePickupPointPayload } from "@/core/types";
import { useApiValidation } from "@/core/composables/useApiValidation";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "PickupPointEdit",
  components: {
    PickupPointForm,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const pickupPointId = route.params.id as string;

    const loading = ref(false);
    const loadingData = ref(true);
    const form = ref<UpdatePickupPointPayload>({
      label: "",
      streetName: "",
      buildingNumber: "",
      lat: 29.3759,
      long: 47.9774,
      distance: 5,
      isActive: true,
      maidIds: [],
    });

    const validation = useApiValidation();

    onMounted(() => {
      PickupPointService.get(pickupPointId)
        .then((data: any) => {
          if (data) {
            form.value = {
              label: data.label || "",
              streetName: data.streetName || "",
              buildingNumber: data.buildingNumber || "",
              lat: Number(data.lat) || 29.3759,
              long: Number(data.long) || 47.9774,
              distance: Number(data.distance) || 5,
              isActive: data.isActive ?? true,
              maidIds: (data.maids || []).map((m: any) => m.id),
            };
          }
        })
        .catch((error) => {
          showErrorAlert(
            error?.response?.data?.message ||
              translate("Failed to fetch pickup point details"),
          );
          router.push({ name: "pickup-points-listing" });
        })
        .finally(() => {
          loadingData.value = false;
        });
    });

    const updatePickupPoint = () => {
      loading.value = true;
      PickupPointService.update(pickupPointId, form.value)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Pickup point updated successfully!"));
          router.push({ name: "pickup-points-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value ||
                translate("Failed to update pickup point"),
            );
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const discard = () => {
      router.push({ name: "pickup-points-listing" });
    };

    return {
      form,
      loading,
      loadingData,
      pickupPointId,
      validation,
      updatePickupPoint,
      discard,
      translate,
    };
  },
});
</script>
