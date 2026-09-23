<template>
  <FormCard :title="translate('Edit Area')">
    <div v-if="loadingData" class="d-flex justify-content-center py-10">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ translate("Loading...") }}</span>
      </div>
    </div>
    <AreaForm
      v-else
      v-model="form"
      :loading="loading"
      :is-edit="true"
      :initial-governorate="initialGovernorate"
      :apiValidation="validation"
      @submit="updateArea"
      @cancel="discard"
    />
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AreaForm from "./AreaForm.vue";
import AreaService from "@/core/services/AreaService";
import FormCard from "@/components/utilities/FormCard.vue";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";
import { useApiValidation } from "@/core/composables/useApiValidation";

export default defineComponent({
  name: "AreaEdit",
  components: { AreaForm, FormCard },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);
    const loadingData = ref(true);
    const initialGovernorate = ref<any>(null);

    const form = ref({
      governorateId: null as number | null,
      nameEn: "",
      nameAr: "",
    });

    const validation = useApiValidation();
    const areaId = route.params.id as string;

    onMounted(() => {
      AreaService.get(areaId)
        .then((area) => {
          if (area) {
            form.value = {
              governorateId: area.governorate?.id || area.governorateId || null,
              nameEn: area.nameEn || area.name_en || "",
              nameAr: area.nameAr || area.name_ar || "",
            };
            if (area.governorate) {
              initialGovernorate.value = area.governorate;
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching area details:", error);
          showErrorAlert(translate("Error fetching area data"));
          router.push({ name: "areas-listing" });
        })
        .finally(() => {
          loadingData.value = false;
        });
    });

    const updateArea = (payload: any) => {
      loading.value = true;
      AreaService.update(areaId, payload)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Area updated successfully!"));
          router.push({ name: "areas-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value || translate("Error updating area"),
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
      loadingData,
      validation,
      updateArea,
      discard,
      translate,
    };
  },
});
</script>
