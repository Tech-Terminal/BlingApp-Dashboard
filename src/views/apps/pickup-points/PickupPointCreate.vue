<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <h2 class="d-flex align-items-center gap-2">
          <i class="bi bi-geo-alt-fill text-primary fs-1"></i>
          <span>{{ translate("Add New Pick Up Point") }}</span>
        </h2>
      </div>
    </div>
    <div class="card-body pt-0">
      <PickupPointForm
        v-model="form"
        :loading="loading"
        :isEdit="false"
        :apiValidation="validation"
        @submit="createPickupPoint"
        @cancel="discard"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import PickupPointForm from "./PickupPointForm.vue";
import PickupPointService from "@/core/services/PickupPointService";
import type { CreatePickupPointPayload } from "@/core/types";
import { useApiValidation } from "@/core/composables/useApiValidation";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "PickupPointCreate",
  components: {
    PickupPointForm,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const form = ref<CreatePickupPointPayload>({
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

    const createPickupPoint = () => {
      loading.value = true;
      PickupPointService.create(form.value)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Pickup point created successfully!"));
          router.push({ name: "pickup-points-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value ||
                translate("Failed to create pickup point"),
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
      validation,
      createPickupPoint,
      discard,
      translate,
    };
  },
});
</script>
