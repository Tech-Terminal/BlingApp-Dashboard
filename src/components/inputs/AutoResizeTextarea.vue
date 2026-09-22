<template>
  <textarea
    ref="textareaRef"
    :value="modelValue"
    @input="onInput"
    class="form-control resize-none"
    :rows="rows"
    :placeholder="placeholder"
    :required="required"
    style="overflow: hidden; height: auto"
  ></textarea>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, watch } from "vue";

export default defineComponent({
  name: "AutoResizeTextarea",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    rows: {
      type: Number,
      default: 1,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const textareaRef = ref<HTMLTextAreaElement | null>(null);

    const autoResize = () => {
      if (textareaRef.value) {
        textareaRef.value.style.height = "auto";
        textareaRef.value.style.height = textareaRef.value.scrollHeight + "px";
      }
    };

    const onInput = (event: Event) => {
      const target = event.target as HTMLTextAreaElement;
      emit("update:modelValue", target.value);
      autoResize();
    };

    watch(
      () => props.modelValue,
      () => {
        nextTick(() => {
          autoResize();
        });
      },
    );

    onMounted(() => {
      nextTick(() => {
        autoResize();
      });
    });

    return {
      textareaRef,
      onInput,
    };
  },
});
</script>

<style scoped>
.resize-none {
  resize: none;
}
</style>
