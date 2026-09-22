<template>
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Sales Trend</span>
        <span class="text-muted mt-1 fw-semibold fs-7"
          >Last 7 days performance</span
        >
      </h3>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body">
      <apexchart
        v-if="hasData"
        ref="chartRef"
        type="area"
        :options="chart"
        :series="series"
        :height="height"
      ></apexchart>
      <div v-else class="text-center text-muted py-10">
        No sales data available
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
  name: "sales-trend-chart",
  props: {
    widgetClasses: String,
    height: {
      type: Number,
      default: 350,
    },
    dailySales: {
      type: Array as () => Array<{ date: string; total: number }>,
      default: () => [],
    },
  },
  setup(props) {
    const chartRef = ref<typeof VueApexCharts | null>(null);
    const chart = ref<ApexOptions>({});
    const store = useThemeStore();

    const series = computed(() => {
      return [
        {
          name: "Sales",
          data: props.dailySales.map((item) => item.total),
        },
      ];
    });

    const categories = computed(() => {
      return props.dailySales.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      });
    });

    const hasData = computed(() => {
      return props.dailySales.length > 0;
    });

    const themeMode = computed(() => {
      return store.mode;
    });

    const chartOptions = (): ApexOptions => {
      const labelColor = getCSSVariableValue("--bs-gray-500");
      const borderColor = getCSSVariableValue("--bs-gray-200");
      const primaryColor = getCSSVariableValue("--bs-primary");

      return {
        chart: {
          fontFamily: "inherit",
          type: "area",
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        xaxis: {
          categories: categories.value,
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              colors: labelColor,
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: labelColor,
              fontSize: "12px",
            },
            formatter: function (val) {
              return formatNumber(val.toFixed(0)) + " EGP";
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return formatNumber(val.toFixed(2)) + " EGP";
            },
          },
        },
        colors: [primaryColor],
        grid: {
          borderColor: borderColor,
          strokeDashArray: 4,
          yaxis: {
            lines: {
              show: true,
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
      () => props.dailySales,
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
