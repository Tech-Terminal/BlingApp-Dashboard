<template>
  <FormCard
    :title="translate('Edit Admin')"
    :hasStatus="true"
    v-model:status="form.isActive"
  >
    <div class="card-body">
      <div v-if="loadingData" class="d-flex justify-content-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <AdminForm
        v-else
        v-model="form"
        :loading="loading"
        :is-edit="true"
        :apiValidation="validation"
        :initial-role="initialRole"
        @submit="updateAdmin"
        @cancel="discard"
      />
    </div>
  </FormCard>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import AdminForm from "./AdminForm.vue";
import AdminService from "@/core/services/AdminService";
import { useRouter, useRoute } from "vue-router";
import { translate } from "@/core/helpers/i18n-utils";
import { showSuccessAlert, showErrorAlert } from "@/core/helpers/alert-utils";
import FormCard from "@/components/utilities/FormCard.vue";
import { useApiValidation } from "@/core/composables/useApiValidation";

export default defineComponent({
  name: "AdminEdit",
  components: { AdminForm, FormCard },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);
    const loadingData = ref(true);
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
    const initialRole = ref(null);

    const validation = useApiValidation();
    const adminId = route.params.id as string;

    onMounted(() => {
      AdminService.get(adminId)
        .then((admin) => {
          if (admin) {
            form.value = {
              ...admin,
              roleId: admin.role ? admin.role.id : admin.roleId || "",
              image: admin.image, // URL
              isActive: admin.isActive, // Automatic thanks to backend cast
              password: "",
              password_confirmation: "",
            };
            if (admin.role) {
              initialRole.value = admin.role;
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching admin details:", error);
          showErrorAlert(translate("Error fetching admin data"));
          router.push({ name: "admins-listing" });
        })
        .finally(() => {
          loadingData.value = false;
        });
    });

    const updateAdmin = (formData: FormData) => {
      loading.value = true;
      AdminService.update(adminId, formData)
        .then(() => {
          validation.clearErrors();
          showSuccessAlert(translate("Admin updated successfully!"));
          router.push({ name: "admins-listing" });
        })
        .catch((error) => {
          validation.setErrors(error);
          if (error.response?.status !== 422) {
            showErrorAlert(
              validation.message.value || translate("Error updating admin"),
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
      initialRole,
      loading,
      loadingData,
      validation,
      updateAdmin,
      discard,
      translate,
    };
  },
});
</script>
