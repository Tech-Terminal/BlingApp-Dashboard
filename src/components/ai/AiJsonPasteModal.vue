<template>
  <div
    v-if="show"
    class="modal fade show d-block tab-modal-backdrop"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5
            class="modal-title fw-bold text-gray-900 d-flex align-items-center"
          >
            <KTIcon icon-name="document" icon-class="fs-2 text-primary me-2" />
            لصق بيانات JSON المستخرجة من الذكاء الاصطناعي 📥
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('update:show', false)"
          ></button>
        </div>
        <div class="modal-body">
          <p class="fs-7 text-gray-600 mb-4">
            قم بلصق استجابة JSON المستخرجة من الذكاء الاصطناعي هنا. سيقوم النظام
            بتعبئة جميع حقول النموذج تلقائياً.
          </p>
          <textarea
            v-model="pastedJsonText"
            class="form-control font-monospace fs-7"
            rows="12"
            placeholder='{ "nameAr": "باراسيتامول", "nameEn": "Paracetamol", "atcCode": "N02BE01", ... }'
          ></textarea>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            @click="$emit('update:show', false)"
          >
            إلغاء
          </button>
          <button
            type="button"
            class="btn btn-primary fw-bold"
            @click="applyPastedJson"
          >
            تعبئة النموذج 🚀
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AlertService from "@/core/services/AlertService";

export default defineComponent({
  name: "AiJsonPasteModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:show", "apply"],
  setup(props, { emit }) {
    const pastedJsonText = ref("");

    const applyPastedJson = () => {
      if (!pastedJsonText.value.trim()) {
        AlertService.error("يرجى لصق كائن JSON أولاً");
        return;
      }

      try {
        let textToParse = pastedJsonText.value.trim();

        // 1. Remove markdown codeblock wrapper ```json ... ```
        if (textToParse.startsWith("```")) {
          textToParse = textToParse
            .replace(/^```(json)?/, "")
            .replace(/```$/, "")
            .trim();
        }

        // 2. Strip single-line JS comments (// ...) and trailing commas
        textToParse = textToParse
          .replace(/\/\/.*/g, "")
          .replace(/,\s*([\]}])/g, "$1");

        const parsed = JSON.parse(textToParse);
        if (typeof parsed !== "object" || parsed === null) {
          throw new Error("البيانات الملصقة ليست كائن JSON صالح");
        }

        emit("apply", parsed);
        emit("update:show", false);
        pastedJsonText.value = "";
      } catch (err: any) {
        AlertService.error(
          "خطأ في قراءة JSON: " +
            (err.message || "تأكد من صحة تنسيق JSON الملصق"),
        );
      }
    };

    return {
      pastedJsonText,
      applyPastedJson,
    };
  },
});
</script>
