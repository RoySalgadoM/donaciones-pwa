<template>
  <div class="flex items-center justify-between w-full">
    <nav class="flex items-center justify-between pt-4 h-14">
      <ul class="inline-flex -space-x-px text-sm h-12">
        <li>
          <div
            class="flex items-center justify-center h-8 ml-2 leading-tight"
            :class="textColorComputed"
          >
            {{
              `${finalModelValue} / ${
                numPagesTotal != null ? numPagesTotal : 1
              }`
            }}
          </div>
        </li>
        <li>
          <button
            small
            class="flex items-center justify-center px-1 sm:px-2 h-8 ml-2 mx-2 cursor-pointer"
            :class="textColorComputed"
            @click="handleFirstPage"
          >
            &lt;&lt;
            <!-- <EIcon name="chevron_left" class="text-primary" /> -->
          </button>
        </li>
        <li>
          <button
            small
            class="flex items-center justify-center px-1 sm:px-2 h-8"
            :class="[
              textColorComputed,
              finalModelValue <= 1 ? 'cursor-not-allowed' : 'cursor-pointer',
            ]"
            @click="finalModelValue > 1 ? handlePrev() : false"
          >
            &lt;
            <!-- <EIcon name="keyboard_double_arrow_left" class="text-primary" /> -->
          </button>
        </li>
        <li
          class="flex items-center justify-center px-1 sm:px-2 h-8 ml-2 leading-tight"
          :class="textColorComputed"
        >
          {{ modelValue }}
        </li>
        <li>
          <button
            small
            class="flex items-center justify-center px-1 sm:px-2 h-8 ml-1"
            :class="[
              textColorComputed,
              finalModelValue >= numPagesTotal
                ? 'cursor-not-allowed'
                : 'cursor-pointer',
            ]"
            @click="finalModelValue < numPagesTotal ? handleNext() : false"
          >
            >
            <!-- <EIcon name="keyboard_double_arrow_right" class="text-primary" /> -->
          </button>
        </li>
        <li>
          <button
            small
            class="flex items-center justify-center px-1 sm:px-2 h-8 ml-2 mx-4 cursor-pointer"
            :class="textColorComputed"
            @click="handleLast"
          >
            >>
            <!-- <EIcon name="chevron_right" class="text-primary" /> -->
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
import * as R from "ramda";
import { calculateTextColor } from "@/utils/utils";
//import EIcon from "./EIcon.vue";
export default {
  name: "EPaginationTable",
  data() {
    return { svgIcon: null };
  },
  components: {
    //EIcon,
  },
  props: {
    startInZero: {
      type: Boolean,
      default: false,
      description:
        "Bandera para saber si las paginas inician 0 o en 1 para la invocacion de consultas",
      required: false,
    },
    modelValue: {
      type: [String, Number],
      default: (prop) => {
        return prop.startInZero ? 0 : 1;
      },
      description: "Valor de la página actual",
      required: false,
    },
    numPagesByPage: {
      type: Number,
      default: 5,
      description: "Cuantos números de paginas por página se verán",
      required: false,
    },
    numPagesTotal: {
      type: Number,
      default: null,
      description: "Número total de paginas a mostrar",
      required: false,
    },
    color: {
      type: String,
      default: "bg-white",
    },
    colorDark: {
      type: String,
      default: "dark:bg-black",
    },
    textColor: {
      type: String,
      default: null,
    },
    textColorDark: {
      type: String,
      default: null,
    },
  },
  created() {
    //this.svgIcon = require("../components/icons/Icon-FlechaDerecha-MenuModulos.vue");
  },
  computed: {
    textColorComputed() {
      return [
        this.textColor ? this.textColor : calculateTextColor(this.color),
        this.textColorDark
          ? this.textColorDark
          : this.colorDark
          ? calculateTextColor(this.colorDark)
          : calculateTextColor(this.color),
      ];
    },
    finalModelValue() {
      return this.startInZero ? this.modelValue + 1 : this.modelValue;
    },
    finalPages() {
      if (this.numPagesTotal === null) {
        return [];
      }
      let half = parseInt(this.numPagesByPage / 2);
      let minium =
        this.numPagesTotal < this.numPagesByPage
          ? this.numPagesTotal
          : this.numPagesByPage;
      let initialRange =
        this.finalModelValue - half > 0 ? this.finalModelValue - half : 1;
      let finalRange =
        this.finalModelValue + half < this.numPagesTotal
          ? initialRange + minium
          : this.numPagesTotal + 1;
      if (!(this.finalModelValue + half < this.numPagesTotal)) {
        initialRange =
          this.numPagesTotal - minium > 0 ? this.numPagesTotal - minium + 1 : 1;
      }
      return R.range(initialRange, finalRange);
    },
  },
  methods: {
    handleEmitPage(aux) {
      this.$emit("update:modelValue", aux);
      this.$nextTick(() => {
        let indexAux = this.finalPages.indexOf(aux);
        let refPage = this.$refs["page" + indexAux];
        if (refPage) {
          refPage.focus({ preventScroll: true });
        }
      });
    },
    handleFirstPage() {
      this.handleEmitPage(1);
    },
    handleLast() {
      this.handleEmitPage(this.numPagesTotal);
    },
    handlePrev() {
      this.handleEmitPage(this.finalModelValue - 1);
    },
    handleNext() {
      this.handleEmitPage(this.finalModelValue + 1);
    },
    setPage(page) {
      if (page >= 1 && page <= this.numPagesTotal) {
        this.handleEmitPage(page);
      } else {
        console.log("error page");
      }
    },
  },
  expose: ["setPage", "handleFirstPage"],
};
</script>
