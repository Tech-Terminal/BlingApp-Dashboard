<template>
  <FormCard
    :title="translate('Edit Address')"
    :hasStatus="true"
    v-model:status="form.isDefault"
    :activeText="translate('Set as default address')"
    :inactiveText="translate('Set as default address')"
  >
    <div class="card-body">
      <div v-if="loadingData" class="d-flex justify-content-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ translate("Loading...") }}</span>
        </div>
      </div>
      <AddressForm
        v-else
        v-model="form"
        :loading="loading"
        :is-edit="true"
        :initial-client="initialClient"
        :initial-governorate="initialGovernorate"
        :initial-area="initialArea"
        :apiValidation="validation"
        @submit="updateAddress"
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
import FormCard from "@/components/utilities/FormCard.vue";
import { useApiValidation } from "@/core/composables/useApiValidation";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "AddressEdit",
  components: {
    AddressForm,
    FormCard,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const addressId = route.params.id as string;

    const loading = ref(false);
    const loadingData = ref(true);

    const form = ref({
      clientId: null,
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
    const initialGovernorate = ref<any>(null);
    const initialArea = ref<any>(null);

    const validation = useApiValidation();

    onMounted(() => {
      AddressService.get(addressId)
        .then((address: any) => {
          if (address) {
            form.value = {
              clientId: address.clientId,
              label: address.label || "",
              governorateId: address.governorateId,
              areaId: address.areaId,
              street: address.street || "",
              block: address.block || "",
              houseNumber: address.houseNumber || "",
              additionalDetails: address.additionalDetails || "",
              lat: address.lat ? Number(address.lat) : 29.3759,
              long: address.long ? Number(address.long) : 47.9774,
              isDefault: Boolean(address.isDefault),
            };

            if (address.client) {
              initialClient.value = address.client;
            }
            if (address.governorate) {
              initialGovernorate.value = address.governorate;
            }
            if (address.area) {
              initialArea.value = address.area;
            }
          }
        })
        .catch((error) => {
          showErrorAlert(
            error?.response?.data?.message || translate("Error fetching address details"),
          );
          router.push({ name: "addresses-listing" });
        })
        .finally(() => {
          loadingData.value = false;
        });
    });

    const updateAddress = (payload: any) => {
      loading.value = true;
      AddressService.update(addressId, payload)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Address updated successfully!"));
          router.push({ name: "addresses-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value || translate("Error updating address"),
            );
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const discard = () => {
      router.push({ name: "addresses-listing" });
    };

    return {
      form,
      loading,
      loadingData,
      initialClient,
      initialGovernorate,
      initialArea,
      validation,
      updateAddress,
      discard,
      translate,
    };
  },
});
</script>
