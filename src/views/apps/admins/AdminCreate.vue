<template>
  <FormCard
    :title="translate('Add New Admin')"
    :hasStatus="true"
    v-model:status="form.isActive"
  >
    <div class="card-body">
      <AdminForm
        v-model="form"
        :loading="loading"
        :apiValidation="validation"
        @submit="createAdmin"
        @cancel="discard"
      />
    </div>
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AdminForm from "./AdminForm.vue";
import AdminService from "@/core/services/AdminService";
import { useRouter } from "vue-router";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";
import FormCard from "@/components/utilities/FormCard.vue";
import { useApiValidation } from "@/core/composables/useApiValidation";

export default defineComponent({
  name: "AdminCreate",
  components: { AdminForm, FormCard },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const form = ref({
      name: "",
      email: "",
      phone: "",
      roleId: "",
      isActive: true,
      password: "",
      password_confirmation: "",
      image: null,
    });

    const validation = useApiValidation();

    const createAdmin = (formData: FormData) => {
      loading.value = true;
      AdminService.create(formData)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Admin created successfully!"));
          router.push({ name: "admins-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value || translate("Error creating admin"),
            );
          }
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const discard = () => {
      router.push({ name: "admins-listing" });
    };

    return {
      form,
      loading,
      validation,
      createAdmin,
      discard,
      translate,
    };
  },
});
</script>
