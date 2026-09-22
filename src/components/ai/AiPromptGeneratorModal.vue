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
            <KTIcon
              icon-name="magic-wand"
              icon-class="fs-2 text-primary me-2"
            />
            مولد تعليمات الذكاء الاصطناعي التفاعلي 🪄
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('update:show', false)"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row g-4 mb-4">
            <!-- Active Ingredient Name Input -->
            <div class="col-12">
              <label class="form-label fw-bold text-gray-800 fs-6">
                اسم المادة الفعالة المطلوبة (Target Active Ingredient):
              </label>
              <input
                v-model="promptIngredientName"
                type="text"
                class="form-control form-control-solid border-primary"
                placeholder="اكتب اسم المادة هنا (مثال: أسبرين / Aspirin)"
              />
            </div>

            <!-- Dynamic Medical Sources Form Repeater -->
            <div class="col-12">
              <div
                class="d-flex align-items-center justify-content-between mb-3"
              >
                <label class="form-label fw-bold text-gray-800 fs-6 mb-0">
                  المصادر الطبية المعتمدة (Approved Medical Sources):
                </label>
                <button
                  type="button"
                  class="btn btn-xs btn-light-primary py-1 px-3 fs-7 fw-bold"
                  @click="addSource"
                >
                  <KTIcon icon-name="plus" icon-class="fs-6 me-1" />
                  إضافة مصدر ➕
                </button>
              </div>

              <div class="d-flex flex-column gap-3">
                <div
                  v-for="(src, index) in customSources"
                  :key="index"
                  class="d-flex align-items-center gap-3"
                >
                  <span
                    class="badge badge-light-primary fw-bold px-3 py-2 fs-7 me-1"
                  >
                    {{ index + 1 }}
                  </span>
                  <input
                    v-model="customSources[index]"
                    type="text"
                    class="form-control form-control-solid"
                    placeholder="رابط المصدر، اسم النشرة، اسم الكتاب، أو اسم الموسوعة الطبية..."
                  />
                  <button
                    type="button"
                    class="btn btn-icon btn-light-danger btn-sm flex-shrink-0"
                    @click="removeSource(index)"
                    :disabled="customSources.length === 1 && !customSources[0]"
                  >
                    <KTIcon icon-name="trash" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="separator separator-dashed my-4"></div>

          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fw-bold text-gray-800 fs-6">
              البرومبت المخصص الجاهز للنسخ (Generated Prompt):
            </span>
            <span class="badge badge-light-primary fs-8">تحديث تلقائي</span>
          </div>
          <div
            class="bg-dark text-gray-200 p-4 rounded fs-7 font-monospace style-scroll text-start dir-ltr mb-2"
            style="max-height: 220px; overflow-y: auto; white-space: pre-wrap"
          >
            {{ generatedPromptText }}
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            @click="$emit('update:show', false)"
          >
            إغلاق
          </button>
          <button
            type="button"
            class="btn btn-primary fw-bold"
            @click="copyPromptToClipboard"
          >
            <KTIcon icon-name="copy" icon-class="fs-4 me-1" />
            نسخ البرومبت المخصص 📋
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { showSuccessAlert } from "@/core/helpers/alert-utils";

export default defineComponent({
  name: "AiPromptGeneratorModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    defaultIngredientName: {
      type: String,
      default: "",
    },
  },
  emits: ["update:show"],
  setup(props) {
    const promptIngredientName = ref(props.defaultIngredientName);
    const customSources = ref<string[]>([""]);

    const addSource = () => {
      customSources.value.push("");
    };

    const removeSource = (index: number) => {
      if (customSources.value.length > 1) {
        customSources.value.splice(index, 1);
      } else {
        customSources.value[0] = "";
      }
    };

    const generatedPromptText = computed(() => {
      const ingredient =
        promptIngredientName.value.trim() ||
        props.defaultIngredientName ||
        "[اكتب اسم المادة الفعالة هنا]";

      const validSources = customSources.value
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const sourcesList =
        validSources.length > 0
          ? validSources.map((s, idx) => `${idx + 1}. ${s}`).join("\n")
          : "المصادر الطبية الرسمية المعتمدة العالمية";

      return `أنت مساعد طبي رقمي متخصص لإدخال بيانات المواد الفعالة في نظام صيدلي (Bling Pharmacy System).

■ قواعد واشتراطات المصادر الطبية المعتمدة:
يُسمح لك فقط باستخراج والاعتماد على المعلومات من المصادر التالية:
${sourcesList}

■ شروط وضوابط إخراج البيانات (حاسمة جداً):
1. يُحظر تماماً إرجاع قيمة null في الحقول الأساسية (onsetOfAction, durationOfAction, chemicalClass, prescriptionType, dangerLevel). قم دائماً باستنباط وكتابة القيم الدقيقة من النشرة والمراجع الطبية!
2. يُحظر إرجاع مصفوفات فارغة [] لحقول (emergencyProcedures, icd10Codes) ويجب استخراج وتعبئة القيم المناسبة للمادة الفعالة.
3. حقول الخصوبة (fertility) والحمل (pregnancy) والرضاعة (lactation) يجب أن تكون كائنات مكتملة دائماً { "status": 1|2|3, "notes": "..." } ولا تحتمل null.

■ المطلوب منك:
استخرج بيانات المادة الفعالة التالية: (${ingredient}) من المصادر المعتمدة أعلاه، وقم بتلخيص البيانات وإرجاع كائن JSON خام فقط (Raw JSON) دون أي مقدمات أو شرح، متبعاً الشريحة التالية بدقة وتضمين كافة الحقول المتوفرة (مثال للباراسيتامول):

{
  "nameAr": "باراسيتامول", // اسم المادة الفعالة باللغة العربية
  "nameEn": "Paracetamol", // اسم المادة الفعالة باللغة الإنجليزية
  "atcCode": "N02BE01", // رمز الـ ATC الطبي العالمي للمادة
  "therapeuticClass": "مسكنات ومفضات الحرارة غير الأفيونية", // الفئة العلاجية (Therapeutic Class)
  "chemicalClass": "مشتقات الأنيلايد (Para-aminophenol derivatives)", // الفئة الكيميائية (Chemical Class)
  "prescriptionType": 1, // نوع الوصفة: 1 = OTC (بدون وصفة)، 2 = Prescription (بوصفة طبية)، 3 = Under Supervision (تحت إشراف)
  "dangerLevel": 1, // مستوى الخطورة: 1 = عادي/منخفض، 2 = متوسط، 3 = عالي الخطورة
  "onsetOfAction": "خلال 30-60 دقيقة من التناول عبر الفم", // بدء التأثير وامتصاص المادة
  "durationOfAction": "من 4 إلى 6 ساعات", // مدة استمرار التأثير
  "indications": [ // دواعي الاستعمال الطبية المعتمدة
    "تخفيف الآلام الخفيفة إلى المتوسطة مثل صداع الرأس وآلام الأسنان وآلام العضلات",
    "خفض درجة الحرارة المرتفعة وحالات الحمى"
  ],
  "isSafeForChildren": true, // هل المادة آمنة للأطفال؟ (true/false)
  "isSafeForAdults": true, // هل المادة آمنة للبالغين؟ (true/false)
  "isSafeForElderly": true, // هل المادة آمنة لكبار السن؟ (true/false)
  "freeTextDosage": "للبالغين: 500-1000 ملغ كل 4-6 ساعات (الحد الأقصى 4000 ملغ يومياً). للأطفال: 10-15 ملغ/كغم كل 4-6 ساعات", // الجرعة المقترحة المعتادة بالكامل
  "dosageAlert": "تنبيه هام: يحظر تجاوز الجرعة اليومية القصوى (4 غرام للبالغين) لتجنب التسمم الكبدي الحاد", // تنبيه حول الجرعة
  "dosageAlertSeverity": 3, // درجة خطورة تنبيه الجرعة: 1 = منخفض، 2 = متوسط، 3 = عالي
  "usageInstructions": [ // تعليمات وإرشادات الاستخدام الموصى بها
    "يمكن تناوله مع الطعام أو بدونه مع شرب كوب ماء كامل",
    "يجب ترك فاصل زمني 4 ساعات على الأقل بين الجرعات المتتالية"
  ],
  "usageMethods": [ // طرق وطبيعة الاستخدام
    "عن طريق الفم (أقراص / شراب / كبسولات)"
  ],
  "warnings": [ // التحذيرات والاحتياطات الهامة
    "يحذر من تناوله بالتزامن مع مستحضرات أخرى تحتوي على الباراسيتامول لتجنب مباغتة الجرعة القصوى",
    "يستخدم بحذر شديد وتحت إشراف طبي لمرضى الفشل الكبدي أو القصور الكبدي المزمن"
  ],
  "warningNote": "تحذير: التناول الزائد عن الجرعة الموصى بها يسبب تلفاً كبدياً جسيماً", // ملاحظة تنبيهية بارزة
  "isWarningNoteActive": true, // تفعيل عرض ملاحظة التنبيه (true/false)
  "contraindications": [ // موانع الاستعمال العامة
    { "title": "الحساسية المفرطة", "description": "يمنع استخدامه لدى المرضى الذين يعانون من حساسية مفرطة للباراسيتامول" },
    { "title": "قصور الكبد الحاد", "description": "يمنع استخدامه لدى مرضى الفشل الكبدي الشديد" }
  ],
  "pregnancy": { "status": 1, "notes": "آمن للاستخدام أثناء الحمل بأقل جرعة وأقصر مدة ممكنة" }, // تقييم الأمان للحوامل: 1 = آمن، 2 = حذر، 3 = ممنوع
  "lactation": { "status": 1, "notes": "آمن للمرضعات حيث يفرز بكميات ضئيلة جداً في الحليب" }, // تقييم الأمان للمرضعات: 1 = آمن، 2 = حذر، 3 = ممنوع
  "fertility": { "status": 1, "notes": "لا توجد أدلة على أي تأثير سلبي على الخصوبة" }, // تقييم الأمان للخصوبة: 1 = آمن، 2 = حذر، 3 = ممنوع
  "sideEffectsDescription": "يعتبر الباراسيتامول آمن جداً عند التزامه بالجرعات المحددة والآثار الجانبية نادرة للغاية", // وصف عام للآثار الجانبية
  "veryCommonSideEffects": [], // الآثار الجانبية الشائعة جداً
  "commonSideEffects": ["غثيان طفيف نادراً"], // الآثار الجانبية الشائعة
  "uncommonSideEffects": ["طفح جلدي وحكة", "احمرار الجلد"], // الآثار الجانبية غير الشائعة
  "toxicitySymptoms": ["الغثيان والقيء وفقدان الشهية خلال أول 24 ساعة", "آلام في الربع العلوي الأيمن من البطن واصفرار العينين بعد 24-48 ساعة"], // أعراض التسمم أو الجرعة الزائدة
  "emergencyProcedures": ["التوجه الفوري للطوارئ وإعطاء الترياق النوعي (N-acetylcysteine) خلال أول 8 ساعات من البلع الزائد"], // الإجراءات الطبية الطارئة عند التسمم
  "emergencyBanner": "في حالة الاشتباه بابتلاع جرعة تزيد عن 4000 ملغ دفعة واحدة اتصل بمركز السموم فوراً", // شريط الطوارئ
  "isEmergencyBannerActive": true, // تفعيل شريط الطوارئ (true/false)
  "storageConditions": ["يحفظ في درجة حرارة أقل من 30 مئوية بعيداً عن الحرارة والرطوبة ومتناول الأطفال"], // ظروف وشروط التخزين
  "icd10Codes": [ // الترميز الطبي الدولي ICD-10
    { "code": "R50.9", "description": "Fever, unspecified" },
    { "code": "R51.9", "description": "Headache, unspecified" }
  ],
  "additionalInfo": "لا يمتلك الباراسيتامول تأثيراً مضاداً للالتهابات في الأنسجة المحيطية على عكس المضادات غير الستيرويدية (NSAIDs)" // أي معلومات طبية إضافية هامة
}`;
    });

    const copyPromptToClipboard = () => {
      navigator.clipboard.writeText(generatedPromptText.value);
      showSuccessAlert("تم نسخ البرومبت بنجاح!");
    };

    return {
      promptIngredientName,
      customSources,
      addSource,
      removeSource,
      generatedPromptText,
      copyPromptToClipboard,
    };
  },
});
</script>
