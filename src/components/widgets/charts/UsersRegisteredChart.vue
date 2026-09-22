<template>
  <div class="card card-xl-stretch mb-xl-8">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1"
          >إحصائية العملاء المسجلين لآخر ستة أشهر</span
        >
      </h3>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body">
      <apexchart
        type="area"
        :options="chartOptions"
        :series="series"
        :height="300"
      ></apexchart>
    </div>
    <!--end::Body-->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from "vue";
import type { ApexOptions } from "apexcharts";
import { getCSSVariableValue } from "@/assets/ts/_utils";

export default defineComponent({
  name: "users-registered-chart",
  setup() {
    const series = ref([
      {
        name: "إجمالي المشاهدات",
        data: [200, 700, 500, 1500, 300, 350],
      },
    ]);

    const chartOptions = computed<ApexOptions>(() => {
      const primaryColor = getCSSVariableValue("--bs-primary");
      const labelColor = getCSSVariableValue("--bs-gray-500");
      const borderColor = getCSSVariableValue("--bs-gray-200");

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
          categories: [
            "سبتمبر 2026",
            "أغسطس 2026",
            "يوليو 2026",
            "يونيو 2026",
            "مايو 2026",
            "أبريل 2026",
          ],
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
        colors: ["#3b82f6"], // Blue matching screenshot
        grid: {
          borderColor: borderColor,
          strokeDashArray: 4,
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "center",
        },
      };
    });

    return {
      series,
      chartOptions,
    };
  },
});
</script>
