<template>
  <FormCard :title="translate('Edit Governorate')">
    <div v-if="loadingData" class="d-flex justify-content-center py-10">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ translate("Loading...") }}</span>
      </div>
    </div>
    <GovernorateForm
      v-else
      v-model="form"
      :loading="loading"
      :is-edit="true"
      :apiValidation="validation"
      @submit="updateGovernorate"
      @cancel="discard"
    />
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import GovernorateForm from "./GovernorateForm.vue";
import GovernorateService from "@/core/services/GovernorateService";
import FormCard from "@/components/utilities/FormCard.vue";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";
import { useApiValidation } from "@/core/composables/useApiValidation";

export default defineComponent({
  name: "GovernorateEdit",
  components: { GovernorateForm, FormCard },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);
    const loadingData = ref(true);
    const form = ref({
      nameEn: "",
      nameAr: "",
    });

    const validation = useApiValidation();
    const governorateId = route.params.id as string;

    onMounted(() => {
      GovernorateService.get(governorateId)
        .then((gov) => {
          if (gov) {
            form.value = {
              nameEn: gov.nameEn || gov.name_en || "",
              nameAr: gov.nameAr || gov.name_ar || "",
            };
          }
        })
        .catch((error) => {
          console.error("Error fetching governorate:", error);
          showErrorAlert(translate("Error fetching governorate data"));
          router.push({ name: "governorates-listing" });
        })
        .finally(() => {
          loadingData.value = false;
        });
    });

    const updateGovernorate = (payload: any) => {
      loading.value = true;
      GovernorateService.update(governorateId, payload)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Governorate updated successfully!"));
          router.push({ name: "governorates-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value ||
                translate("Error updating governorate"),
            );
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const discard = () => {
      router.push({ name: "governorates-listing" });
    };

    return {
      form,
      loading,
      loadingData,
      validation,
      updateGovernorate,
      discard,
      translate,
    };
  },
});
</script>
