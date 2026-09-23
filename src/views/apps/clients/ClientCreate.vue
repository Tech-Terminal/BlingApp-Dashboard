<template>
  <FormCard
    :title="translate('Add New Client')"
    :hasStatus="true"
    v-model:status="form.isActive"
  >
    <div class="card-body">
      <ClientForm
        v-model="form"
        :loading="loading"
        :apiValidation="validation"
        @submit="createClient"
        @cancel="discard"
      />
    </div>
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import ClientForm from "./ClientForm.vue";
import ClientService from "@/core/services/ClientService";
import FormCard from "@/components/utilities/FormCard.vue";
import { useApiValidation } from "@/core/composables/useApiValidation";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "ClientCreate",
  components: {
    ClientForm,
    FormCard,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const form = ref({
      name: "",
      email: "",
      phone: "",
      isActive: true,
    });

    const validation = useApiValidation();

    const createClient = (payload: any) => {
      loading.value = true;
      ClientService.create(payload)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Client created successfully!"));
          router.push({ name: "clients-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value || translate("Error creating client"),
            );
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const discard = () => {
      router.push({ name: "clients-listing" });
    };

    return {
      form,
      loading,
      validation,
      createClient,
      discard,
      translate,
    };
  },
});
</script>
