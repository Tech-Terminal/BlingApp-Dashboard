<template>
  <FormCard
    :title="translate('Edit Pick Up Point')"
    :hasStatus="true"
    v-model:status="form.isActive"
  >
    <div class="card-body">
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
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PickupPointForm from "./PickupPointForm.vue";
import FormCard from "@/components/utilities/FormCard.vue";
import PickupPointService from "@/core/services/PickupPointService";
import type { UpdatePickupPointPayload } from "@/core/types";
import { useApiValidation } from "@/core/composables/useApiValidation";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "PickupPointEdit",
  components: {
    PickupPointForm,
    FormCard,
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
      isActive: true,
      maidIds: [],
      areaIds: [],
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
              isActive: data.isActive ?? true,
              maidIds: (data.maids || []).map((m: any) => m.id),
              areaIds: (data.areas || []).map((a: any) => a.id),
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
