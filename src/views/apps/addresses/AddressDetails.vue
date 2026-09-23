<template>
  <div
    v-if="loading"
    class="d-flex justify-content-center align-items-center py-10 min-h-300px"
  >
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">{{ translate("Loading...") }}</span>
    </div>
  </div>

  <div v-else-if="address">
    <!-- Back Header -->
    <div
      class="d-flex flex-wrap align-items-center justify-content-between gap-4 mb-7"
    >
      <div class="d-flex align-items-center">
        <router-link
          :to="{ name: 'addresses-listing' }"
          class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px me-3"
          :title="translate('Back to Addresses')"
        >
          <i class="bi bi-arrow-left fs-2 rtl-flip"></i>
        </router-link>
        <div class="d-flex align-items-center gap-4">
          <div class="symbol symbol-50px symbol-circle bg-light-primary text-primary d-flex align-items-center justify-content-center">
            <KTIcon icon-name="geolocation" icon-class="fs-2 text-primary" />
          </div>
          <div>
            <div class="d-flex align-items-center gap-2">
              <h1 class="text-gray-900 fw-bold m-0 fs-2">
                {{ address.label || translate("Address") }}
              </h1>
              <span class="badge badge-light-secondary fs-8 fw-bold">
                #{{ address.id }}
              </span>
            </div>
            <div class="d-flex align-items-center gap-2 mt-1">
              <span
                v-if="address.isDefault"
                class="badge badge-light-primary fw-bold fs-8"
              >
                {{ translate("Default Address") }}
              </span>
              <span class="text-muted fs-7">
                {{ (isArabic ? address.governorate?.nameAr : address.governorate?.nameEn) || address.governorate?.nameAr || address.governorate?.nameEn || "" }}
                -
                {{ (isArabic ? address.area?.nameAr : address.area?.nameEn) || address.area?.nameAr || address.area?.nameEn || "" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex align-items-center gap-2">
        <router-link
          :to="{ name: 'address-edit', params: { id: address.id } }"
          class="btn btn-sm btn-light-info fw-bold"
        >
          <KTIcon icon-name="pencil" icon-class="fs-4 me-1" />
          {{ translate("Edit Address") }}
        </router-link>

        <a
          v-if="address.lat && address.long"
          :href="`https://www.google.com/maps?q=${address.lat},${address.long}`"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-sm btn-light-primary fw-bold"
        >
          <KTIcon icon-name="geolocation" icon-class="fs-4 me-1" />
          {{ translate("Open in Google Maps") }}
        </a>

        <button
          type="button"
          class="btn btn-sm btn-light-danger"
          @click="deleteCurrentAddress()"
        >
          <KTIcon icon-name="trash" icon-class="fs-3 me-1" />
          {{ translate("Delete Address") }}
        </button>
      </div>
    </div>

    <!-- Quick Info Cards -->
    <div class="card mb-6">
      <div class="card-body py-5 px-7">
        <div class="row g-4">
          <!-- Client -->
          <div class="col-sm-6 col-lg-3 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-primary text-primary d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-person fs-3 text-primary"></i>
            </div>
            <div>
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Client") }}
              </div>
              <router-link
                v-if="address.client"
                :to="{ name: 'client-details', params: { id: address.clientId } }"
                class="text-gray-800 text-hover-primary fw-bold fs-6"
              >
                {{ address.client.name }}
              </router-link>
              <div v-else class="text-gray-800 fw-bold fs-6">
                #{{ address.clientId }}
              </div>
            </div>
          </div>

          <!-- Phone -->
          <div class="col-sm-6 col-lg-3 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-info text-info d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-telephone fs-3 text-info"></i>
            </div>
            <div>
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Phone Number") }}
              </div>
              <div class="text-gray-800 fw-bold fs-6 font-monospace" dir="ltr">
                {{ address.client?.phone || translate("N/A") }}
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="col-sm-6 col-lg-3 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-success text-success d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-geo-alt fs-3 text-success"></i>
            </div>
            <div>
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Location") }}
              </div>
              <div class="text-gray-800 fw-bold fs-6">
                {{ (isArabic ? address.area?.nameAr : address.area?.nameEn) || address.area?.nameAr || address.area?.nameEn || translate("Area") }}
              </div>
            </div>
          </div>

          <!-- Date Added -->
          <div class="col-sm-6 col-lg-3 d-flex align-items-center gap-3">
            <div
              class="symbol symbol-40px symbol-circle bg-light-warning text-warning d-flex align-items-center justify-content-center"
            >
              <i class="bi bi-calendar fs-3 text-warning"></i>
            </div>
            <div>
              <div class="text-muted fs-8 fw-semibold text-uppercase">
                {{ translate("Added") }}
              </div>
              <div class="text-gray-800 fw-bold fs-6">
                {{ formatDate(address.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="row g-6">
      <!-- Address Details -->
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title fw-bold text-gray-800">
              <KTIcon icon-name="home" icon-class="fs-2 me-2 text-primary" />
              {{ translate("Address Details") }}
            </h3>
          </div>
          <div class="card-body py-5">
            <div class="table-responsive">
              <table class="table align-middle gs-0 gy-4">
                <tbody>
                  <tr>
                    <td class="text-muted fw-semibold w-150px">
                      {{ translate("Label") }}
                    </td>
                    <td class="text-gray-800 fw-bold">
                      <span class="badge badge-light-dark fw-bold fs-7">
                        {{ address.label }}
                      </span>
                      <span
                        v-if="address.isDefault"
                        class="badge badge-light-primary fw-bold fs-8 ms-2"
                      >
                        {{ translate("Default") }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-muted fw-semibold">
                      {{ translate("Governorate") }}
                    </td>
                    <td class="text-gray-800 fw-bold">
                      {{ (isArabic ? address.governorate?.nameAr : address.governorate?.nameEn) || address.governorate?.nameAr || address.governorate?.nameEn || translate("N/A") }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-muted fw-semibold">
                      {{ translate("Area") }}
                    </td>
                    <td class="text-gray-800 fw-bold">
                      {{ (isArabic ? address.area?.nameAr : address.area?.nameEn) || address.area?.nameAr || address.area?.nameEn || translate("N/A") }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-muted fw-semibold">
                      {{ translate("Street") }}
                    </td>
                    <td class="text-gray-800 fw-bold">
                      {{ address.street || translate("N/A") }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-muted fw-semibold">
                      {{ translate("Block") }}
                    </td>
                    <td class="text-gray-800 fw-bold">
                      {{ address.block || translate("N/A") }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-muted fw-semibold">
                      {{ translate("Building/House") }}
                    </td>
                    <td class="text-gray-800 fw-bold">
                      {{ address.houseNumber || translate("N/A") }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-muted fw-semibold align-top">
                      {{ translate("Additional Details") }}
                    </td>
                    <td class="text-gray-800 fw-semibold">
                      {{ address.additionalDetails || translate("No additional details provided.") }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Linked Client Box -->
            <div
              v-if="address.client"
              class="border border-dashed border-gray-300 rounded p-4 mt-5 bg-light-subtle d-flex align-items-center justify-content-between flex-wrap gap-3"
            >
              <div class="d-flex align-items-center gap-3">
                <div class="symbol symbol-45px symbol-circle overflow-hidden">
                  <img
                    :src="address.client.image"
                    :alt="address.client.name"
                    class="w-100"
                    v-if="address.client.image"
                  />
                  <span
                    v-else
                    class="symbol-label bg-light-primary text-primary fs-5 fw-bold"
                  >
                    {{ address.client.name ? address.client.name.charAt(0).toUpperCase() : "C" }}
                  </span>
                </div>
                <div>
                  <div class="d-flex align-items-center gap-2">
                    <div class="text-gray-900 fw-bold fs-6">
                      {{ address.client.name }}
                    </div>
                    <span
                      v-if="address.client.deletedAt"
                      class="badge badge-light-danger fw-bold fs-9"
                    >
                      {{ translate("Deleted") }}
                    </span>
                  </div>
                  <div class="text-muted fs-7 font-monospace" dir="ltr">
                    {{ address.client.phone }}
                  </div>
                </div>
              </div>

              <router-link
                :to="{ name: 'client-details', params: { id: address.clientId } }"
                class="btn btn-sm btn-primary fw-bold"
              >
                <KTIcon icon-name="profile-user" icon-class="fs-4 me-1" />
                {{ translate("View Client Profile") }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Map & Coordinates -->
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-header">
            <h3 class="card-title fw-bold text-gray-800">
              <KTIcon icon-name="map" icon-class="fs-2 me-2 text-primary" />
              {{ translate("Map & Coordinates") }}
            </h3>
            <div class="card-toolbar" v-if="address.lat && address.long">
              <a
                :href="`https://www.google.com/maps?q=${address.lat},${address.long}`"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-sm btn-light-primary fw-bold"
              >
                <KTIcon icon-name="exit-right-corner" icon-class="fs-4 me-1" />
                {{ translate("Open in Google Maps") }}
              </a>
            </div>
          </div>
          <div class="card-body py-5">
            <div v-if="address.lat && address.long" class="d-flex flex-column h-100">
              <!-- Coordinates badges -->
              <div class="d-flex align-items-center gap-3 mb-4 flex-wrap">
                <div class="badge badge-light-primary fs-7 p-3 fw-bold">
                  {{ translate("Latitude") }}: <span class="font-monospace ms-1">{{ address.lat }}</span>
                </div>
                <div class="badge badge-light-primary fs-7 p-3 fw-bold">
                  {{ translate("Longitude") }}: <span class="font-monospace ms-1">{{ address.long }}</span>
                </div>
              </div>

              <!-- Map Embed Frame -->
              <div class="rounded overflow-hidden border border-gray-200 flex-grow-1 min-h-350px position-relative">
                <iframe
                  width="100%"
                  height="100%"
                  style="border:0; min-height: 350px;"
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                  :src="`https://maps.google.com/maps?q=${address.lat},${address.long}&hl=${isArabic ? 'ar' : 'en'}&z=15&output=embed`"
                ></iframe>
              </div>
            </div>

            <div v-else class="py-10">
              <EmptyState
                :title="translate('No GPS Coordinates')"
                :description="translate('This address does not have GPS coordinates attached.')"
                icon="geolocation"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="py-10">
    <EmptyState
      :title="translate('Address Not Found')"
      :description="translate('The requested address could not be found.')"
      icon="geolocation"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AddressService, { type AddressData } from "@/core/services/AddressService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import EmptyState from "@/components/utilities/EmptyState.vue";
import { translate } from "@/core/helpers/i18n-utils";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmationAlert,
} from "@/core/helpers/alert-utils";
import i18n from "@/core/plugins/i18n";

export default defineComponent({
  name: "AddressDetails",
  components: {
    KTIcon,
    EmptyState,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const addressId = route.params.id as string;
    const address = ref<AddressData | null>(null);
    const loading = ref(true);

    const isArabic = computed(
      () =>
        (i18n.global.locale as any)?.value === "ar" ||
        i18n.global.locale === "ar",
    );

    const fetchAddress = () => {
      loading.value = true;
      AddressService.get(addressId)
        .then((data: any) => {
          address.value = data;
        })
        .catch((error) => {
          showErrorAlert(
            error?.response?.data?.message || translate("Failed to fetch address details"),
          );
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const deleteCurrentAddress = () => {
      if (!address.value) return;
      const label = address.value.label || "";
      showConfirmationAlert({
        title: translate("Delete Address?"),
        text: `${translate("Are you sure you want to delete")} "${label}"? ${translate("This address will be deleted.")}`,
        icon: "error",
        confirmButtonText: translate("Yes, delete"),
        confirmButtonClass: "btn-danger",
      }).then((result) => {
        if (result.isConfirmed && address.value) {
          AddressService.delete(address.value.id)
            .then(() => {
              showSuccessAlert(translate("Address deleted successfully."));
              router.push({ name: "addresses-listing" });
            })
            .catch((error) => {
              showErrorAlert(
                error?.response?.data?.message || translate("Failed to delete address"),
              );
            });
        }
      });
    };

    const formatDate = (dateString?: string) => {
      if (!dateString) return translate("N/A");
      try {
        return new Date(dateString).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch {
        return dateString;
      }
    };

    onMounted(() => {
      fetchAddress();
    });

    return {
      address,
      loading,
      isArabic,
      deleteCurrentAddress,
      formatDate,
      translate,
    };
  },
});
</script>
