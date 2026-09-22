<template>
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Sales by Category</span>
        <span class="text-muted mt-1 fw-semibold fs-7"
          >Top performing categories</span
        >
      </h3>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body">
      <apexchart
        v-if="hasData"
        ref="chartRef"
        type="donut"
        :options="chart"
        :series="series"
        :height="height"
      ></apexchart>
      <div v-else class="text-center text-muted py-10">
        No category sales data available
      </div>
    </div>
    <!--end::Body-->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import { useThemeStore } from "@/stores/theme";
import type { ApexOptions } from "apexcharts";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import { formatNumber } from "@/core/helpers/formatters";
import type VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "category-sales-chart",
  props: {
    widgetClasses: String,
    height: {
      type: Number,
      default: 350,
    },
    salesData: {
      type: Array as () => Array<{ name: string; total_sales: number }>,
      default: () => [],
    },
  },
  setup(props) {
    const chartRef = ref<typeof VueApexCharts | null>(null);
    const chart = ref<ApexOptions>({});
    const store = useThemeStore();

    const series = computed(() => {
      return props.salesData.map((item) =>
        parseFloat(item.total_sales.toString()),
      );
    });

    const categories = computed(() => {
      return props.salesData.map((item) => item.name);
    });

    const hasData = computed(() => {
      return props.salesData.length > 0;
    });

    const themeMode = computed(() => {
      return store.mode;
    });

    const chartOptions = (): ApexOptions => {
      const labelColor = getCSSVariableValue("--bs-gray-500");
      const primaryColor = getCSSVariableValue("--bs-primary");
      const successColor = getCSSVariableValue("--bs-success");
      const warningColor = getCSSVariableValue("--bs-warning");
      const dangerColor = getCSSVariableValue("--bs-danger");
      const infoColor = getCSSVariableValue("--bs-info");

      return {
        chart: {
          fontFamily: "inherit",
          type: "donut",
        },
        labels: categories.value,
        colors: [
          primaryColor,
          successColor,
          warningColor,
          dangerColor,
          infoColor,
        ],
        legend: {
          show: true,
          position: "bottom",
          labels: {
            colors: labelColor,
          },
        },
        dataLabels: {
          enabled: true,
        },
        plotOptions: {
          pie: {
            donut: {
              size: "65%",
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total Sales",
                  formatter: function (w) {
                    const total = w.globals.seriesTotals.reduce(
                      (a: number, b: number) => a + b,
                      0,
                    );
                    return formatNumber(total.toFixed(2)) + " EGP";
                  },
                },
              },
            },
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return formatNumber(val.toFixed(2)) + " EGP";
            },
          },
        },
      };
    };

    onBeforeMount(() => {
      Object.assign(chart.value, chartOptions());
    });

    const refreshChart = () => {
      if (!chartRef.value) {
        return;
      }
      chartRef.value.updateOptions(chartOptions());
    };

    watch(themeMode, () => {
      refreshChart();
    });

    watch(
      () => props.salesData,
      () => {
        refreshChart();
      },
      { deep: true },
    );

    return {
      chart,
      series,
      chartRef,
      hasData,
    };
  },
});
</script>
