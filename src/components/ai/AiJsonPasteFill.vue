<template>
  <div class="ai-json-paste-fill mb-8">
    <!-- 0. AI JSON Paste Action Bar -->
    <div
      class="card bg-light-primary border-primary border-dashed p-5 d-flex flex-row align-items-center justify-content-between flex-wrap gap-4"
    >
      <div class="d-flex align-items-center">
        <span
          class="badge badge-circle badge-light-primary w-40px h-40px me-4 d-flex align-items-center justify-content-center fs-3"
        >
          ✨
        </span>
        <div>
          <h4 class="fw-bold text-gray-900 mb-1">
            تعبئة تلقائية ذكية باللصق المباشر (AI JSON Paste)
          </h4>
          <span class="fs-7 text-gray-600">
            قم بلصق بيانات JSON المستخرجة من الذكاء الاصطناعي لتعبئة الحقول
            بالكامل خلال لحظات.
          </span>
        </div>
      </div>
      <div class="d-flex gap-3">
        <button
          type="button"
          class="btn btn-sm btn-light-primary fw-bold"
          @click="showPromptModal = true"
        >
          <KTIcon icon-name="magic-wand" icon-class="fs-4 me-1" />
          مولد البرومبت التفاعلي 🪄
        </button>
        <button
          type="button"
          class="btn btn-sm btn-primary fw-bold"
          @click="showJsonModal = true"
        >
          <KTIcon icon-name="document" icon-class="fs-4 me-1" />
          لصق بيانات JSON 📥
        </button>
      </div>
    </div>

    <!-- Direct JSON Paste Sub-Modal -->
    <AiJsonPasteModal v-model:show="showJsonModal" @apply="handleParsedJson" />

    <!-- Interactive AI Prompt Generator Sub-Modal -->
    <AiPromptGeneratorModal
      v-model:show="showPromptModal"
      :default-ingredient-name="formData.nameAr || formData.nameEn || ''"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import { showSuccessAlert } from "@/core/helpers/alert-utils";
import AiPromptGeneratorModal from "@/components/ai/AiPromptGeneratorModal.vue";
import AiJsonPasteModal from "@/components/ai/AiJsonPasteModal.vue";

export default defineComponent({
  name: "AiJsonPasteFill",
  components: {
    AiPromptGeneratorModal,
    AiJsonPasteModal,
  },
  props: {
    formData: {
      type: Object as PropType<any>,
      required: true,
    },
  },
  emits: ["update:formData", "fill"],
  setup(props, { emit }) {
    const showJsonModal = ref(false);
    const showPromptModal = ref(false);

    const handleParsedJson = (parsed: Record<string, any>) => {
      let filledCount = 0;
      const updated = { ...props.formData };
      Object.keys(parsed).forEach((key) => {
        if (parsed[key] !== undefined && parsed[key] !== null) {
          updated[key] = parsed[key];
          filledCount++;
        }
      });

      emit("update:formData", updated);
      emit("fill", updated);
      showSuccessAlert(
        `تم تعبئة النموذج بنجاح! تم تحديث (${filledCount}) حقل.`,
      );
    };

    return {
      showJsonModal,
      showPromptModal,
      handleParsedJson,
    };
  },
});
</script>
