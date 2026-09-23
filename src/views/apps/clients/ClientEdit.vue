<template>
  <FormCard
    :title="translate('Edit Client')"
    :hasStatus="true"
    v-model:status="form.isActive"
  >
    <div class="card-body">
      <div v-if="loadingData" class="d-flex justify-content-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ translate("Loading...") }}</span>
        </div>
      </div>
      <ClientForm
        v-else
        v-model="form"
        :loading="loading"
        :is-edit="true"
        :apiValidation="validation"
        @submit="updateClient"
        @cancel="discard"
      />
    </div>
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ClientForm from "./ClientForm.vue";
import ClientService from "@/core/services/ClientService";
import FormCard from "@/components/utilities/FormCard.vue";
import { useApiValidation } from "@/core/composables/useApiValidation";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "ClientEdit",
  components: {
    ClientForm,
    FormCard,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const clientId = route.params.id as string;

    const loading = ref(false);
    const loadingData = ref(true);
    const form = ref({
      name: "",
      email: "",
      phone: "",
      isActive: true,
    });

    const validation = useApiValidation();

    onMounted(() => {
      ClientService.get(clientId)
        .then((client) => {
          if (client) {
            form.value = {
              name: client.name || "",
              email: client.email || "",
              phone: client.phone || "",
              isActive: client.isActive ?? true,
            };
          }
        })
        .catch((error) => {
          showErrorAlert(
            error?.response?.data?.message || translate("Error fetching client data"),
          );
          router.push({ name: "clients-listing" });
        })
        .finally(() => {
          loadingData.value = false;
        });
    });

    const updateClient = (payload: any) => {
      loading.value = true;
      ClientService.update(clientId, payload)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Client updated successfully!"));
          router.push({ name: "clients-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value || translate("Error updating client"),
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
      loadingData,
      validation,
      updateClient,
      discard,
      translate,
    };
  },
});
</script>
