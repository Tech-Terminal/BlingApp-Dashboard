<template>
  <v-select
    :options="options"
    :label="label"
    :reduce="(option) => option.id"
    :loading="loading"
    @open="onOpen"
    @search="onSearch"
    :filterable="!service"
    :placeholder="placeholder"
    v-model="internalValue"
    append-to-body
    :calculate-position="withPopper"
    :multiple="multiple"
    :disabled="disabled"
  >
    <template #option="option">
      <slot name="option" v-bind="option">
        {{ option[label] }}
      </slot>
    </template>
    <template #list-footer>
      <li v-show="hasNextPage && service" ref="load" class="loading-option">
        <div class="loader"></div>
        {{ $translate("Loading more options...") }}
      </li>
    </template>
  </v-select>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from "vue";
import { createPopper } from "@popperjs/core";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import _ from "lodash";
import { translate } from "@/core/helpers/i18n-utils";

export default defineComponent({
  name: "SearchableSelect",
  components: {
    vSelect,
  },
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: null,
    },
    service: {
      type: [Object, Function],
      default: null,
    },
    list: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    label: {
      type: String,
      default: "name_en",
    },
    perPage: {
      type: Number,
      default: 10,
    },
    placeholder: {
      type: String,
      default: "Select an option",
    },
    initialOption: {
      type: Object,
      default: null,
    },
    initialOptions: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    query: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showAllOption: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const options = ref<Array<any>>([]);

    if (props.list && props.list.length > 0) {
      options.value = props.showAllOption
        ? [{ id: null, [props.label]: translate("All") }, ...props.list]
        : props.list;
    } else {
      let initOpts: any[] = [];
      if (props.showAllOption) {
        initOpts.push({ id: null, [props.label]: translate("All") });
      }
      if (props.initialOption) {
        initOpts.push(props.initialOption);
      }
      if (props.initialOptions && props.initialOptions.length > 0) {
        initOpts = [...initOpts, ...props.initialOptions];
      }
      options.value = _.uniqBy(initOpts, "id");
    }

    const loading = ref(false);
    const hasNextPage = ref(false);
    const page = ref(1);
    const search = ref("");
    const observer = ref<IntersectionObserver | null>(null);
    const load = ref<HTMLElement | null>(null);
    const initialized = ref(false);

    const internalValue = ref(
      props.multiple && Array.isArray(props.modelValue)
        ? [...new Set(props.modelValue)]
        : props.modelValue,
    );

    const selectedObjects = ref<any[]>([]);

    watch(
      () => props.modelValue,
      (val) => {
        if (!_.isEqual(val, internalValue.value)) {
          if (props.multiple && Array.isArray(val)) {
            internalValue.value = [...new Set(val)];
          } else {
            internalValue.value = val;
          }
        }
      },
    );

    watch(internalValue, (val) => {
      if (!_.isEqual(val, props.modelValue)) {
        emit("update:modelValue", val);
      }

      // Keep track of the full selected objects so they don't disappear on re-fetch
      if (val !== null && val !== undefined) {
        if (props.multiple && Array.isArray(val)) {
          val.forEach((id) => {
            const obj = options.value.find((o) => o.id === id);
            if (obj && !selectedObjects.value.find((s) => s.id === id)) {
              selectedObjects.value.push(obj);
            }
          });
          // Remove unselected
          selectedObjects.value = selectedObjects.value.filter((s) =>
            val.includes(s.id),
          );
        } else {
          const obj = options.value.find((o) => o.id === val);
          if (obj) {
            selectedObjects.value = [obj];
          }
        }
      } else {
        selectedObjects.value = [];
      }
    });

    // Update options if list prop changes
    watch(
      () => props.list,
      (newVal) => {
        if (newVal && newVal.length > 0) {
          options.value = newVal;
        }
      },
      { immediate: true },
    );

    watch(
      () => [props.initialOption, props.initialOptions],
      ([newOpt, newOpts]: any) => {
        let newOptions = [...options.value];
        if (newOpt) {
          const exists = newOptions.find((o) => o.id === newOpt.id);
          if (!exists) {
            newOptions.push(newOpt);
          }
        }
        if (newOpts && newOpts.length > 0) {
          newOptions = [...newOptions, ...newOpts];
        }
        options.value = _.uniqBy(newOptions, "id");
      },
      { immediate: true, deep: true },
    );

    const fetchOptions = async () => {
      if (!props.service) return;
      loading.value = true;
      try {
        const svc = props.service as any;
        const queryParams = {
          page: page.value,
          limit: props.perPage,
          per_page: props.perPage,
          search: search.value,
          ...(props.query || {}),
        };
        const response = await svc.getAll(queryParams);
        // Safely extract options list whether the endpoint is paginated or returns a plain array
        const responseData = response?.data || response;
        const fetchedData = Array.isArray(responseData)
          ? responseData
          : responseData?.data || [];

        if (page.value === 1) {
          const newOptions = [...fetchedData];
          if (props.initialOption) {
            const exists = newOptions.find(
              (o) => o.id === props.initialOption.id,
            );
            if (!exists) {
              newOptions.unshift(props.initialOption);
            }
          }
          if (props.showAllOption) {
            const exists = newOptions.find((o) => o.id === null);
            if (!exists) {
              newOptions.unshift({ id: null, [props.label]: translate("All") });
            }
          }

          // Always ensure currently selected objects are kept in the options list!
          selectedObjects.value.forEach((selObj) => {
            if (!newOptions.find((o) => o.id === selObj.id)) {
              newOptions.unshift(selObj);
            }
          });

          options.value = _.uniqBy(newOptions, "id");
        } else {
          options.value = _.uniqBy([...options.value, ...fetchedData], "id");
        }

        // Check if there are more pages
        const meta =
          response?.meta ||
          responseData?.meta ||
          (response?.data && response?.data?.meta);
        if (meta) {
          const cp =
            meta.currentPage !== undefined
              ? meta.currentPage
              : meta.current_page;
          const lp =
            meta.totalPages !== undefined ? meta.totalPages : meta.last_page;
          if (typeof cp === "number" && typeof lp === "number") {
            hasNextPage.value = cp < lp;
          } else {
            hasNextPage.value = false;
          }
        } else {
          hasNextPage.value = false;
        }
      } catch (error) {
        console.error(error);
        hasNextPage.value = false;
      } finally {
        loading.value = false;

        // Re-attach observer after DOM updates
        setTimeout(() => {
          if (observer.value) observer.value.disconnect();
          if (load.value && hasNextPage.value) {
            observer.value = new IntersectionObserver(async ([entry]) => {
              if (entry.isIntersecting && hasNextPage.value && !loading.value) {
                page.value++;
                await fetchOptions();
              }
            });
            observer.value.observe(load.value);
          }
        }, 100);
      }
    };

    const onOpen = () => {
      if (!props.service) return; // Static list doesn't need fetch on open (already loaded or props)
      if (!initialized.value) {
        page.value = 1;
        fetchOptions();
        initialized.value = true;
      } else {
        // Just re-attach if already initialized and opening again
        setTimeout(() => {
          if (observer.value) observer.value.disconnect();
          if (load.value && hasNextPage.value) {
            observer.value = new IntersectionObserver(async ([entry]) => {
              if (entry.isIntersecting && hasNextPage.value && !loading.value) {
                page.value++;
                await fetchOptions();
              }
            });
            observer.value.observe(load.value);
          }
        }, 100);
      }
    };

    const onSearch = (
      query: string,
      loadingFunc: (toggle: boolean) => void,
    ) => {
      if (!props.service) return; // Static list handled by v-select
      loadingFunc(true);
      search.value = query;
      page.value = 1;
      debouncedSearch(loadingFunc);
    };

    const debouncedSearch = _.debounce(async (loadingFunc) => {
      await fetchOptions();
      loadingFunc(false);
    }, 500);

    const withPopper = (dropdownList, component, { width }) => {
      dropdownList.style.width = width;
      const popper = createPopper(
        component.nextElement || component.$el,
        dropdownList,
        {
          placement: "bottom-start",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 4],
              },
            },
            {
              name: "toggleClass",
              enabled: true,
              phase: "write",
              fn({ state }) {
                component.$el.classList.toggle(
                  "drop-up",
                  state.placement === "top-start",
                );
              },
            },
          ],
        },
      );

      return () => popper.destroy();
    };

    return {
      options,
      loading,
      hasNextPage,
      load,
      onOpen,
      onSearch,
      internalValue,
      withPopper,
    };
  },
});
</script>

<style>
.loading-option {
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 15px 16px;
  border-top: 1px solid #f5f8fa;
  gap: 12px;
  color: grey;
}

.loader {
  text-align: center;
  color: #bbbbbb;
  padding: 10px;
}
/* Match placeholder color to standard form-control */
.v-select .vs__search::placeholder {
  color: #a1a5b7; /* Metronic placeholder text color */
  opacity: 1;
}

.v-select .vs__dropdown-toggle {
  padding: 9px 1rem;
  border: 1px solid var(--bs-gray-300);
  background-color: #fff;
  border-radius: 0.475rem;
  min-height: 43.78px;
}

.vs__dropdown-option:last-child {
  border-bottom: none;
}

.vs__dropdown-menu {
  padding: 0 !important;
  padding-inline-start: 0 !important;
  margin-top: 2px;
  box-shadow: 0px 0px 50px 0px rgba(82, 63, 105, 0.15); /* Metronic shadow */
  border: 0;
  border-radius: 0.475rem;
  z-index: 9999 !important;
}

.v-select .vs__search,
.v-select .vs__selected {
  margin: 0;
  padding: 0;
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  color: #5e6278; /* Metronic text color */
}

/* Custom Arrow Style matches Metronic form-select */
.v-select .vs__actions {
  padding: 0;
  padding-right: 5px;
}
.v-select .vs__open-indicator {
  fill: #7e8299; /* Metronic gray-600 */
  transform: scale(0.8);
}

.vs__dropdown-option {
  padding: 15px 20px;
  border-bottom: none;
}

/* Use border-top on following siblings to create dividers inside the list */
.vs__dropdown-option + .vs__dropdown-option {
  border-top: 1px solid #f5f8fa; /* Very light gray */
}

.vs__dropdown-option:last-child {
  border-bottom: none;
}

.vs__dropdown-option--highlight {
  background: #f1faff;
  color: #009ef7;
}

/* Styling for Multiple Select Tags */
.vs--multiple .vs__selected {
  background-color: #f5f8fa;
  border: 1px solid #e4e6ef;
  border-radius: 0.475rem;
  padding: 5px 10px;
  margin: 4px 5px 4px 0;
  color: #5e6278;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.vs__dropdown-option--selected {
  background-color: #f1faff;
  color: #009ef7;
  cursor: default;
  pointer-events: none;
}

.vs--multiple .vs__deselect {
  margin-left: 8px;
  fill: #a1a5b7;
}

.v-select.is-invalid .vs__dropdown-toggle {
  border-color: #f1416c !important; /* Metronic danger color */
}
</style>
