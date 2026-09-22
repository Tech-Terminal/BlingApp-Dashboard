<template>
  <div class="card card-xl-stretch mb-5 mb-xl-8">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <div class="card-toolbar w-100 flex-wrap justify-content-between">
        <!-- Filters Row -->
        <div class="d-flex align-items-center gap-2 mb-3">
          <!-- Search -->
          <div class="d-flex flex-column gap-1">
            <label class="form-label fs-7 fw-semibold text-gray-700 mb-0"
              >بحث</label
            >
            <input
              type="text"
              class="form-control form-control-sm form-control-solid w-150px"
              placeholder="البحث بالاسم أو رقم الهاتف"
            />
          </div>
          <!-- From Date -->
          <div class="d-flex flex-column gap-1">
            <label class="form-label fs-7 fw-semibold text-gray-700 mb-0"
              >من</label
            >
            <input
              type="date"
              class="form-control form-control-sm form-control-solid w-125px"
            />
          </div>
          <!-- To Date -->
          <div class="d-flex flex-column gap-1">
            <label class="form-label fs-7 fw-semibold text-gray-700 mb-0"
              >إلى</label
            >
            <input
              type="date"
              class="form-control form-control-sm form-control-solid w-125px"
            />
          </div>
          <!-- Status -->
          <div class="d-flex flex-column gap-1">
            <label class="form-label fs-7 fw-semibold text-gray-700 mb-0"
              >الحالة</label
            >
            <select
              class="form-select form-select-sm form-select-solid w-125px"
            >
              <option value="">تصفية حسب الحالة</option>
            </select>
          </div>
          <!-- Shift -->
          <div class="d-flex flex-column gap-1">
            <label class="form-label fs-7 fw-semibold text-gray-700 mb-0"
              >الفترة</label
            >
            <select
              class="form-select form-select-sm form-select-solid w-100px"
            >
              <option value="">الكل</option>
            </select>
          </div>
        </div>

        <!-- Export Button -->
        <div class="d-flex align-items-end mb-3">
          <button
            class="btn btn-sm btn-success d-flex align-items-center gap-2"
          >
            <span>تصدير</span>
            <i class="ki-duotone ki-file-down fs-3"
              ><span class="path1"></span><span class="path2"></span
            ></i>
          </button>
        </div>
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-3">
      <!--begin::Table container-->
      <div class="table-responsive">
        <!--begin::Table-->
        <table
          class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4"
        >
          <!--begin::Table head-->
          <thead>
            <tr class="fw-bold fs-7 text-gray-800 border-bottom-0">
              <th class="ps-0 min-w-50px">#</th>
              <th class="min-w-150px">العميل</th>
              <th class="min-w-100px">التاريخ ▼</th>
              <th class="min-w-125px">الوقت</th>
              <th class="min-w-100px">حالة الدفع</th>
              <th class="min-w-100px">الحالة</th>
              <th class="min-w-100px">العاملات</th>
              <th class="min-w-125px">التكلفة</th>
              <th class="min-w-125px">بواسطة</th>
              <th class="min-w-125px">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <!--end::Table head-->
          <!--begin::Table body-->
          <tbody>
            <tr v-for="order in mockOrders" :key="order.id">
              <td>
                <span class="text-primary fw-bold text-hover-primary fs-6">{{
                  order.id
                }}</span>
              </td>
              <td>
                <div class="d-flex flex-column w-100">
                  <span class="text-dark fw-bold fs-7">{{
                    order.client.name
                  }}</span>
                  <span class="text-muted fw-semibold fs-8">{{
                    order.client.phone
                  }}</span>
                </div>
              </td>
              <td>
                <span class="text-dark fw-bold fs-7">{{ order.date }}</span>
              </td>
              <td>
                <div class="d-flex flex-column w-100">
                  <span class="text-dark fw-bold fs-7">{{ order.shift }}</span>
                  <span class="text-muted fw-semibold fs-8">{{
                    order.time
                  }}</span>
                </div>
              </td>
              <td>
                <span class="text-dark fw-bold fs-7">{{
                  order.paymentStatus
                }}</span>
              </td>
              <td>
                <span
                  class="badge badge-light-success fs-8 fw-bold px-3 py-1"
                  >{{ order.status }}</span
                >
              </td>
              <td>
                <span class="text-dark fw-bold fs-7">{{ order.maid }}</span>
              </td>
              <td>
                <div class="d-flex flex-column w-100">
                  <span class="text-dark fw-bold fs-7">{{ order.cost }}</span>
                  <span class="text-primary fw-semibold fs-8">{{
                    order.visits
                  }}</span>
                </div>
              </td>
              <td>
                <a href="#" class="text-primary fw-bold fs-7">{{
                  order.createdBy
                }}</a>
              </td>
              <td>
                <div class="d-flex flex-column w-100">
                  <span class="text-dark fw-bold fs-7">{{
                    order.createdAt.date
                  }}</span>
                  <span class="text-dark fw-bold fs-7">{{
                    order.createdAt.time
                  }}</span>
                </div>
              </td>
            </tr>
          </tbody>
          <!--end::Table body-->
        </table>
        <!--end::Table-->
      </div>
      <!--end::Table container-->
    </div>
    <!--begin::Body-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "recent-orders-table",
  setup() {
    const mockOrders = ref([
      {
        id: "12594",
        client: { name: "Shadhan Al-Shammimri", phone: "+9651234567" },
        date: "2026-10-29",
        shift: "الفترة الصباحية",
        time: "08:00:00 - 14:00:00",
        paymentStatus: "مكتمل",
        status: "مؤكد",
        maid: "Krie",
        cost: "17.25 د.ك",
        visits: "8 مرات شهرياً",
        createdBy: "Wafaa jassim",
        createdAt: { date: "2026-09-01", time: "10:44:45" },
      },
      {
        id: "12593",
        client: { name: "Shadhan Al-Shammimri", phone: "+9651234567" },
        date: "2026-10-25",
        shift: "الفترة الصباحية",
        time: "08:00:00 - 14:00:00",
        paymentStatus: "مكتمل",
        status: "مؤكد",
        maid: "Kris",
        cost: "17.25 د.ك",
        visits: "8 مرات شهرياً",
        createdBy: "Wafaa jassim",
        createdAt: { date: "2026-09-01", time: "10:44:45" },
      },
      {
        id: "12592",
        client: { name: "Maryam Al-Rughaib", phone: "+9659876543" },
        date: "2026-10-14",
        shift: "الفترة المسائية",
        time: "16:00:00 - 21:00:00",
        paymentStatus: "مكتمل",
        status: "مؤكد",
        maid: "Lyn",
        cost: "18 د.ك",
        visits: "1 مرات شهرياً",
        createdBy: "Wafaa jassim",
        createdAt: { date: "2026-08-26", time: "13:21:06" },
      },
      {
        id: "12551",
        client: { name: "Aisha Al-Shahitawi", phone: "+9659999999" },
        date: "2026-10-04",
        shift: "الفترة الصباحية",
        time: "08:00:00 - 14:00:00",
        paymentStatus: "مكتمل",
        status: "مؤكد",
        maid: "Rochelle",
        cost: "18 د.ك",
        visits: "1 مرات شهرياً",
        createdBy: "Hind Ahmed",
        createdAt: { date: "2026-08-30", time: "14:48:33" },
      },
    ]);

    return {
      mockOrders,
    };
  },
});
</script>
