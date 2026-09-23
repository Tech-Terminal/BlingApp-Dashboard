<template>
  <FormCard :title="translate('Add New Area')">
    <AreaForm
      v-model="form"
      :loading="loading"
      :initial-governorate="initialGovernorate"
      :apiValidation="validation"
      @submit="createArea"
      @cancel="discard"
    />
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import AreaForm from "./AreaForm.vue";
import AreaService from "@/core/services/AreaService";
import FormCard from "@/components/utilities/FormCard.vue";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";
import { useApiValidation } from "@/core/composables/useApiValidation";

export default defineComponent({
  name: "AreaCreate",
  components: { AreaForm, FormCard },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const initialGovernorate = ref<any>(null);

    const form = ref({
      governorateId: null as number | null,
      nameEn: "",
      nameAr: "",
    });

    const validation = useApiValidation();

    const createArea = (payload: any) => {
      loading.value = true;
      AreaService.create(payload)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Area created successfully!"));
          router.push({ name: "areas-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value || translate("Error creating area"),
            );
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const discard = () => {
      router.push({ name: "areas-listing" });
    };

    return {
      form,
      initialGovernorate,
      loading,
      validation,
      createArea,
      discard,
      translate,
    };
  },
});
</script>
