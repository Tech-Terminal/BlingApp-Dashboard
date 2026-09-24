<template>
  <FormCard
    :title="translate('Add New Maid')"
    :hasStatus="true"
    v-model:status="form.isActive"
  >
    <div class="card-body">
      <MaidForm
        v-model="form"
        :loading="loading"
        :apiValidation="validation"
        @submit="createMaid"
        @cancel="discard"
      />
    </div>
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import MaidForm from "./MaidForm.vue";
import MaidService from "@/core/services/MaidService";
import FormCard from "@/components/utilities/FormCard.vue";
import { useApiValidation } from "@/core/composables/useApiValidation";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "MaidCreate",
  components: {
    MaidForm,
    FormCard,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const form = ref({
      name: "",
      email: "",
      phone: "",
      image: "",
      idDocument: "",
      isActive: true,
    });

    const validation = useApiValidation();

    const createMaid = (payload: any) => {
      loading.value = true;
      MaidService.create(payload)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Maid created successfully!"));
          router.push({ name: "maids-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value || translate("Error creating maid"),
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
      validation,
      createMaid,
      discard,
      translate,
    };
  },
});
</script>
