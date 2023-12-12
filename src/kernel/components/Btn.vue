<template>
    <button :type="type" :disabled="disabled" :class="mainClass" @click="click">
      <slot v-if="$slots.icon" name="icon"></slot>
      {{ text }}
    </button>
  </template>
  
  <style>
  .e-btn-base {
    @apply flex items-center font-bold justify-center enabled:cursor-pointer e-btn--disabled;
  }
  
  .e-btn--disabled {
    @apply disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-gray-600 dark:disabled:border-2 dark:disabled:border-white;
  }
  </style>
  
  <script>
  import { mapState } from "pinia";
  import { calculateTextColor } from "@/utils/utils";
  import { useCustomizationStore } from "@/config/stores/customization.ts";
  
  export default {
    name: "Btn",
    computed: {
      ...mapState(useCustomizationStore, ["isDarkMode"]),
      mainClass() {
        return [
          "e-btn-base",
          this.isDarkMode,
          this.hoverColor,
          this.roundedClass,
          this.textSizeClass,
          this.darkHoverColor,
          this.fill ? this.color : "",
          this.fill ? this.darkColor : "",
          this.uppercase ? "uppercase" : "",
          this.capitalize ? "capitalize" : "",
          this.bold ? "font-bold" : "font-semibold",
          this.text ? "w-full h-fit px-10 py-1.5" : "w-11 h-11",
          [
            this.fill
              ? [calculateTextColor(this.color)]
              : [
                  this.textColor
                    ? this.textColor
                    : calculateTextColor(this.color),
                ],
          ],
          [
            this.darkTextColor
              ? this.darkTextColor
              : this.darkColor
              ? calculateTextColor(this.darkColor)
              : calculateTextColor(this.color),
          ],
          [
            this.hoverTextColor
              ? this.hoverTextColor
              : calculateTextColor(this.hoverColor, "hover"),
          ],
          [
            this.darkHoverTextColor
              ? this.darkHoverTextColor
              : this.darkHoverColor
              ? calculateTextColor(this.darkHoverColor, "hover")
              : calculateTextColor(this.hoverColor, "hover"),
          ],
          [
            this.border
              ? [
                  "border-2",
                  this.borderColor
                    ? this.borderColor
                    : calculateTextColor(this.color, "border"),
                  this.darkBorderColor
                    ? this.darkBorderColor
                    : this.darkColor
                    ? calculateTextColor(this.darkColor, "border")
                    : calculateTextColor(this.color, "border"),
                ]
              : "",
          ],
        ];
      },
      textSizeClass() {
        const textSizeClasses = {
          xs: "text-xs",
          sm: "text-sm",
          md: "text-base",
          lg: "text-lg",
          xl: "text-xl",
          xxl: "text-2xl",
        };
        return this.textSize ? textSizeClasses[this.textSize] : "text-base";
      },
      roundedClass() {
        const roundedClasses = {
          sm: "rounded",
          md: "rounded-md",
          lg: "rounded-lg",
          xl: "rounded-xl",
          xxl: "rounded-2xl",
        };
  
        return this.rounded
          ? "rounded-full"
          : [this.roundedSize ? roundedClasses[this.roundedSize] : "rounded-md"];
      },
    },
    methods: {
      click() {
        this.$emit("onClick");
      },
    },
    props: {
      type: {
        type: String,
        default: "",
        description: "Tipo de botón que se va a utilizar.",
      },
      fill: {
        type: Boolean,
        default: true,
        description:
          "Solo en caso de que sea true el botón estará relleno del color correspondiente",
      },
      disabled: {
        type: Boolean,
        default: false,
        description: "En caso de ser true deshabilita el botón.",
      },
      text: {
        type: String,
        default: null,
        description: "Texto que contendrá el botón.",
      },
      bold: {
        type: Boolean,
        default: false,
        description:
          "En caso de ser true el texto del botón tendrá la clase 'font-bold' de lo contrario 'font-semibold'.",
      },
      uppercase: {
        type: Boolean,
        default: false,
        description:
          "En caso de ser true el texto del botón será mostrado en letras MAYÚSCULAS.",
      },
      capitalize: {
        type: Boolean,
        default: false,
        description:
          "En caso de ser true el texto del botón será con la primera letra en mayúsculas.",
      },
      rounded: {
        type: Boolean,
        default: false,
        description:
          "En caso de ser true los bordes del botón serán completamente redondos.",
      },
      roundedSize: {
        type: String,
        default: "md",
        description:
          "Grado de redondeo de los bordes del botón. Ej. sm, md, lg...",
      },
      textSize: {
        type: String,
        default: null,
        description: "Tamaño del texto del botón. Ej. sm, md, lg...",
      },
      color: {
        type: String,
        default: "bg-primary",
        description: "Color bg del botón en modo light.",
      },
      darkColor: {
        type: String,
        default: null,
        description: "Color bg del botón en modo dark.",
      },
      textColor: {
        type: String,
        default: null,
        description: "Color del texto del botón en modo light.",
      },
      darkTextColor: {
        type: String,
        default: null,
        description: "Color del texto del botón en modo dark.",
      },
      hoverColor: {
        type: String,
        default: "hover:bg-primary",
        description:
          "Color bg del botón cuando se hace hover en el y el sistema se encuentra en modo light.",
      },
      darkHoverColor: {
        type: String,
        default: "dark:hover:bg-primary",
        description:
          "Color bg del botón cuando se hace hover en el y el sistema se encuentra en modo dark.",
      },
      hoverTextColor: {
        type: String,
        default: null,
        description:
          "Color del texto del botón cuando se hace hover en el y el sistema se encuentra en modo light.",
      },
      darkHoverTextColor: {
        type: String,
        default: null,
        description:
          "Color del texto del botón cuando se hace hover en el y el sistema se encuentra en modo dark.",
      },
      border: {
        type: Boolean,
        default: false,
        description:
          "En caso de ser true permitirá colocar las clases 'borderColor' y 'darkBorderColor' para agregar algún borde en específico al botón.",
      },
      borderColor: {
        type: String,
        default: null,
        description: "Color del borde a asignar el botón en modo light.",
      },
      darkBorderColor: {
        type: String,
        default: null,
        description: "Color del borde a asignar el botón en modo dark.",
      },
    },
  };
  </script>
  