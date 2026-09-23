<template>
  <FormCard
    :title="translate('Add New Address')"
    :hasStatus="true"
    v-model:status="form.isDefault"
    :activeText="translate('Set as default address')"
    :inactiveText="translate('Set as default address')"
  >
    <div class="card-body">
      <AddressForm
        v-model="form"
        :loading="loading"
        :initial-client="initialClient"
        :apiValidation="validation"
        @submit="createAddress"
        @cancel="discard"
      />
    </div>
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AddressForm from "./AddressForm.vue";
import AddressService from "@/core/services/AddressService";
import ClientService from "@/core/services/ClientService";
import FormCard from "@/components/utilities/FormCard.vue";
import { useApiValidation } from "@/core/composables/useApiValidation";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "AddressCreate",
  components: {
    AddressForm,
    FormCard,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);

    const form = ref({
      clientId: route.query.clientId ? Number(route.query.clientId) : null,
      label: "",
      governorateId: null,
      areaId: null,
      street: "",
      block: "",
      houseNumber: "",
      additionalDetails: "",
      lat: 29.3759,
      long: 47.9774,
      isDefault: false,
    });

    const initialClient = ref<any>(null);
    const validation = useApiValidation();

    onMounted(() => {
      const clientIdQuery = route.query.clientId;
      if (clientIdQuery) {
        ClientService.get(String(clientIdQuery))
          .then((client) => {
            if (client) {
              initialClient.value = client;
            }
          })
          .catch((err) => {
            console.error("Error prefetching client:", err);
          });
      }
    });

    const createAddress = (payload: any) => {
      loading.value = true;
      AddressService.create(payload)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Address created successfully!"));
          if (route.query.clientId) {
            router.push({
              name: "client-details",
              params: { id: String(route.query.clientId) },
            });
          } else {
            router.push({ name: "addresses-listing" });
          }
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value || translate("Error creating address"),
            );
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const discard = () => {
      if (route.query.clientId) {
        router.push({
          name: "client-details",
          params: { id: String(route.query.clientId) },
        });
      } else {
        router.push({ name: "addresses-listing" });
      }
    };

    return {
      form,
      loading,
      initialClient,
      validation,
      createAddress,
      discard,
      translate,
    };
  },
});
</script>
