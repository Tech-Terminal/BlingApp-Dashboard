<template>
  <FormCard
    :title="translate('Edit Maid')"
    :hasStatus="true"
    v-model:status="form.isActive"
  >
    <div class="card-body">
      <div v-if="loadingData" class="d-flex justify-content-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ translate("Loading...") }}</span>
        </div>
      </div>
      <MaidForm
        v-else
        v-model="form"
        :loading="loading"
        :is-edit="true"
        :initialPickupPoint="initialPickupPoint"
        :apiValidation="validation"
        @submit="updateMaid"
        @cancel="discard"
      />
    </div>
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import MaidForm from "./MaidForm.vue";
import MaidService from "@/core/services/MaidService";
import FormCard from "@/components/utilities/FormCard.vue";
import { useApiValidation } from "@/core/composables/useApiValidation";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "MaidEdit",
  components: {
    MaidForm,
    FormCard,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const maidId = route.params.id as string;

    const loading = ref(false);
    const loadingData = ref(true);
    const initialPickupPoint = ref<any>(null);
    const form = ref({
      name: "",
      email: "",
      phone: "",
      image: "",
      idDocument: "",
      isActive: true,
      pickupPointId: null as number | null,
    });

    const validation = useApiValidation();

    onMounted(() => {
      MaidService.get(maidId)
        .then((maid) => {
          if (maid) {
            form.value = {
              name: maid.name || "",
              email: maid.email || "",
              phone: maid.phone || "",
              image: maid.image || "",
              idDocument: maid.idDocument || "",
              isActive: maid.isActive ?? true,
              pickupPointId: maid.pickupPointId || null,
            };
            if (maid.pickupPoint) {
              initialPickupPoint.value = maid.pickupPoint;
            }
          }
        })
        .catch((error) => {
          showErrorAlert(
            error?.response?.data?.message ||
              translate("Error fetching maid data"),
          );
          router.push({ name: "maids-listing" });
        })
        .finally(() => {
          loadingData.value = false;
        });
    });

    const updateMaid = (payload: any) => {
      loading.value = true;
      MaidService.update(maidId, payload)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Maid updated successfully!"));
          router.push({ name: "maids-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value || translate("Error updating maid"),
            );
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const discard = () => {
      router.push({ name: "maids-listing" });
    };

    return {
      form,
      loading,
      loadingData,
      validation,
      updateMaid,
      discard,
      translate,
    };
  },
});
</script>
