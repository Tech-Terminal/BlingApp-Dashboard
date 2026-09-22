<template>
  <div
    v-if="resolvedTotalPages > 1"
    class="d-flex align-items-center justify-content-between flex-wrap pt-10 w-100"
  >
    <div class="fs-6 fw-semibold text-gray-700">
      {{ translate("Showing page") }} {{ resolvedCurrentPage }}
      {{ translate("of") }}
      {{ resolvedTotalPages }}
    </div>
    <ul class="pagination m-0">
      <!-- First -->
      <li class="page-item" :class="{ disabled: resolvedCurrentPage <= 1 }">
        <a
          href="#"
          class="page-link"
          @click.prevent="onPageChange(1)"
          data-bs-toggle="tooltip"
          :title="translate('First Page')"
        >
          <span aria-hidden="true" class="fs-4">&laquo;</span>
        </a>
      </li>

      <!-- Previous -->
      <li
        class="page-item previous"
        :class="{ disabled: resolvedCurrentPage <= 1 }"
      >
        <a
          href="#"
          class="page-link"
          @click.prevent="onPageChange(resolvedCurrentPage - 1)"
        >
          <i class="previous"></i>
        </a>
      </li>

      <!-- Links -->
      <li
        v-for="link in computedLinks"
        :key="link.label"
        class="page-item"
        :class="{ active: link.active }"
      >
        <a href="#" class="page-link" @click.prevent="onPageChange(link.page)">
          {{ link.label }}
        </a>
      </li>

      <!-- Next -->
      <li
        class="page-item next"
        :class="{ disabled: resolvedCurrentPage >= resolvedTotalPages }"
      >
        <a
          href="#"
          class="page-link"
          @click.prevent="onPageChange(resolvedCurrentPage + 1)"
        >
          <i class="next"></i>
        </a>
      </li>

      <!-- Last -->
      <li
        class="page-item"
        :class="{ disabled: resolvedCurrentPage >= resolvedTotalPages }"
      >
        <a
          href="#"
          class="page-link"
          @click.prevent="onPageChange(resolvedTotalPages)"
          data-bs-toggle="tooltip"
          :title="translate('Last Page')"
        >
          <span aria-hidden="true" class="fs-4">&raquo;</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { translate } from "@/core/helpers/i18n-utils";

export default defineComponent({
  name: "KTPagination",
  props: {
    pagination: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    totalPages: {
      type: Number,
      required: false,
      default: 1,
    },
    currentPage: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  emits: ["page-change"],
  setup(props, { emit }) {
    const resolvedTotalPages = computed(() => {
      if (props.totalPages && props.totalPages > 1) return props.totalPages;
      if (props.pagination && props.pagination.last_page)
        return props.pagination.last_page;
      return 1;
    });

    const resolvedCurrentPage = computed(() => {
      if (props.currentPage && props.currentPage > 0) return props.currentPage;
      if (props.pagination && props.pagination.current_page)
        return props.pagination.current_page;
      return 1;
    });

    const computedLinks = computed(() => {
      const links: any[] = [];
      const total = resolvedTotalPages.value;
      const current = resolvedCurrentPage.value;

      // Simple logic to show surrounding pages
      let start = Math.max(1, current - 2);
      const end = Math.min(total, start + 4);
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }

      for (let i = start; i <= end; i++) {
        links.push({
          label: i.toString(),
          page: i,
          active: i === current,
        });
      }

      return links;
    });

    const onPageChange = (page: number) => {
      if (page < 1 || page > resolvedTotalPages.value) return;
      if (page === resolvedCurrentPage.value) return;

      emit("page-change", page);
    };

    return {
      onPageChange,
      resolvedTotalPages,
      resolvedCurrentPage,
      computedLinks,
      translate,
    };
  },
});
</script>
