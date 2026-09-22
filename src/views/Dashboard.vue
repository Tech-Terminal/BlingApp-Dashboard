<template>
  <!--begin::Dashboard-->
  <div>
    <!-- Stats Row -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
      <!-- Maids Widget -->
      <div class="col-xl-4">
        <WidgetBlingStat
          :title="translate('Maids No.')"
          value="24"
          color="primary"
          bottomBorderColor="#f472b6"
        />
      </div>

      <!-- Users Widget -->
      <div class="col-xl-4">
        <WidgetBlingStat
          :title="translate('Customers No.')"
          value="5476"
          color="primary"
          bottomBorderColor="#f472b6"
        />
      </div>

      <!-- Admins Widget -->
      <div class="col-xl-4">
        <WidgetBlingStat
          :title="translate('Admins No.')"
          value="8"
          color="primary"
          bottomBorderColor="#3b82f6"
        />
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
      <!-- Users Registered Chart -->
      <div class="col-xl-6">
        <UsersRegisteredChart />
      </div>

      <!-- Orders Status Chart -->
      <div class="col-xl-6">
        <OrdersStatusChart />
      </div>
    </div>

    <!-- Table Row -->
    <div class="row g-5 g-xl-8">
      <div class="col-xl-12">
        <RecentOrdersTable />
      </div>
    </div>
  </div>
  <!--end::Dashboard-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { translate } from "@/core/helpers/i18n-utils";
import WidgetBlingStat from "@/components/widgets/statsistics/WidgetBlingStat.vue";
import UsersRegisteredChart from "@/components/widgets/charts/UsersRegisteredChart.vue";
import OrdersStatusChart from "@/components/widgets/charts/OrdersStatusChart.vue";
import RecentOrdersTable from "@/components/widgets/tables/RecentOrdersTable.vue";

export default defineComponent({
  name: "dashboard-main",
  components: {
    WidgetBlingStat,
    UsersRegisteredChart,
    OrdersStatusChart,
    RecentOrdersTable,
  },
  setup() {
    return {
      translate,
    };
  },
});
</script>
