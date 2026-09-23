<template>
  <FormCard :title="translate('Add New Governorate')">
    <GovernorateForm
      v-model="form"
      :loading="loading"
      :apiValidation="validation"
      @submit="createGovernorate"
      @cancel="discard"
    />
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import GovernorateForm from "./GovernorateForm.vue";
import GovernorateService from "@/core/services/GovernorateService";
import FormCard from "@/components/utilities/FormCard.vue";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";
import { useApiValidation } from "@/core/composables/useApiValidation";

export default defineComponent({
  name: "GovernorateCreate",
  components: { GovernorateForm, FormCard },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const form = ref({
      nameEn: "",
      nameAr: "",
    });

    const validation = useApiValidation();

    const createGovernorate = (payload: any) => {
      loading.value = true;
      GovernorateService.create(payload)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Governorate created successfully!"));
          router.push({ name: "governorates-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value ||
                translate("Error creating governorate"),
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
      validation,
      createGovernorate,
      discard,
      translate,
    };
  },
});
</script>
