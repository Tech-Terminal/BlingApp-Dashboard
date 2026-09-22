<template>
  <div class="card card-xl-stretch mb-xl-8">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1"
          >الطلبات المكتملة / الملغاة</span
        >
      </h3>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body">
      <apexchart
        type="bar"
        :options="chartOptions"
        :series="series"
        :height="300"
      ></apexchart>
    </div>
    <!--end::Body-->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import type { ApexOptions } from "apexcharts";
import { getCSSVariableValue } from "@/assets/ts/_utils";

export default defineComponent({
  name: "orders-status-chart",
  setup() {
    const series = ref([
      {
        name: "الطلبات المكتملة",
        data: [20, 150, 15, 5, 2, 18],
      },
      {
        name: "الطلبات الملغاة",
        data: [5, 110, 90, 8, 1, 2],
      },
    ]);

    const chartOptions = computed<ApexOptions>(() => {
      const labelColor = getCSSVariableValue("--bs-gray-500");
      const borderColor = getCSSVariableValue("--bs-gray-200");

      return {
        chart: {
          fontFamily: "inherit",
          type: "bar",
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "50%",
            borderRadius: 4,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
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
          opacity: 1,
        },
        colors: ["#f472b6", "#3b82f6"], // Pink and Blue matching screenshot
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
