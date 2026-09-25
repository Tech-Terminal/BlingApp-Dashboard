<template>
  <FormCard
    :title="translate('Add New Pick Up Point')"
    :hasStatus="true"
    v-model:status="form.isActive"
  >
    <div class="card-body">
      <PickupPointForm
        v-model="form"
        :loading="loading"
        :isEdit="false"
        :apiValidation="validation"
        @submit="createPickupPoint"
        @cancel="discard"
      />
    </div>
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import PickupPointForm from "./PickupPointForm.vue";
import FormCard from "@/components/utilities/FormCard.vue";
import PickupPointService from "@/core/services/PickupPointService";
import type { CreatePickupPointPayload } from "@/core/types";
import { useApiValidation } from "@/core/composables/useApiValidation";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "PickupPointCreate",
  components: {
    PickupPointForm,
    FormCard,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const form = ref<CreatePickupPointPayload>({
      label: "",
      streetName: "",
      buildingNumber: "",
      isActive: true,
      maidIds: [],
      areaIds: [],
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
