<template>
  <div class="relative">
    <button
      ref="closeSelect"
      :class="mainClass"
      :disabled="disabled"
      @click.prevent="toggleDropdown"
    >
      <div class="flex items-center justify-center">
        <div
          v-if="$slots.icon"
          class="e-select-icon"
          :class="[
            iconRight ? [labelSelected ? 'right-16' : 'right-10'] : 'left-2',
          ]"
        >
          <slot name="icon" />
        </div>
        <div
          class="flex flex-col"
          :class="[$slots.icon ? [iconRight ? '' : 'pl-5'] : '']"
        >
          <div
            :class="[
              'line-clamp-1 break-all text-left pr-10',
              labelSelected ? labelClass : textSizeClass,
            ]"
          >
            {{ label }}<span v-if="required" class="text-primary">*</span>
          </div>
          <div
            :class="[
              'line-clamp-1 break-all text-left',
              iconRight ? 'pr-14' : 'pr-8',
              textSizeClass,
            ]"
          >
            {{ labelSelected }}
          </div>
        </div>
      </div>
      <div
        v-if="labelSelected && !disabled && showClean"
        @click.stop.prevent="clean"
        class="e-select-icon animate-slide-down right-11"
      >
        <slot v-if="$slots.iconClose" name="iconClose" />
        <svg
          v-else
          class="w-4 h-4 text-primary opacity-60 hover:opacity-100 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 15 15"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </div>
      <div>
        <svg
          v-if="loading"
          aria-hidden="true"
          class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <slot v-else-if="$slots.arrow" name="arrow" />
        <div v-else>
          <svg
            class="w-4 h-4"
            :class="errorRules ? 'text-danger' : 'text-primary dark:text-white'"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 8"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.9"
              d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
            />
          </svg>
        </div>
      </div>
    </button>
    <div v-if="isDropdownOpen" :class="containerOptionsClass">
      <a
        @click="selectOption(option)"
        v-for="option in options"
        :key="option.value"
        :class="[
          optionsClass,
          labelSelected == option.label ? selectedLabelColor : '',
        ]"
      >
        {{ option.label }}
      </a>
    </div>
    <div
      v-if="!!messageRule"
      :class="'e-select--error-message animate-slide-down'"
    >
      {{ messageRule }}
    </div>
  </div>
</template>

<style>
.e-select-base {
  @apply flex py-1.5 w-full h-fit px-4 items-center justify-between shadow-md tracking-wide text-base placeholder:text-black dark:placeholder:text-white disabled:cursor-not-allowed disabled:opacity-60 border-2 border-gray-800 border-opacity-20;
}

.e-select-selected {
  @apply overflow-y-auto max-h-[40vh] w-full absolute z-10 pt-4 pb-2 rounded-md hover:cursor-pointer shadow-md border-2 border-primary dark:border-secondary divide-y divide-inputHover dark:divide-gray-900;
}

.e-select-options {
  @apply block py-2 text-sm leading-5 text-left px-5;
}

.e-select-icon {
  @apply flex items-center justify-center cursor-pointer absolute top-0 h-full;
}

.e-select--error {
  @apply e-select-base outline outline-2 outline-danger text-danger placeholder:text-danger dark:placeholder:text-danger;
}

.e-select--error-message {
  @apply flex items-center justify-start w-full text-left text-xs mt-1 text-danger;
}
</style>

<script>
import { ref } from "vue";
import { mapState } from "pinia";
import { onClickOutside } from "@vueuse/core";
import { calculateTextColor } from "@/utils/utils";
import { useCustomizationStore } from "@/config/stores/customization.ts";

export default {
  name: "ESelect",
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: null,
      description: "Valor que se le asignará al componente.",
    },
    label: {
      type: String,
      default: "",
      description:
        "Etiqueta que indicará el valor solicitado para el componene.",
    },
    required: {
      type: Boolean,
      default: false,
      description:
        "Si es true significa que el valor del componente es requerido, de lo contrario no lo es.",
    },
    disabled: {
      type: Boolean,
      default: false,
      description:
        "Si es true significa que el componente estará deshabilitado, de lo contrario estará habilitado.",
    },
    showClean: {
      type: Boolean,
      default: true,
      description: "Ocultara el boton de borrar si es necesario.",
    },
    loading: {
      type: Boolean,
      default: false,
      description: "Si es true se deberá mostrar un ícono de carga.",
    },
    outline: {
      type: Boolean,
      default: true,
      description:
        "Bandera para mostrar o no una línea que rodee al componente.",
    },
    outlineColor: {
      type: String,
      default: "outline-primary",
      description:
        "Color de la línea que rodeará al componente en modo light en caso de que la bandera 'outline' sea true.",
    },
    darkOutlineColor: {
      type: String,
      default: "dark:outline-secondary",
      description:
        "Color de la línea que rodeará al componente en modo dark en caso de que la bandera 'outline' sea true.",
    },
    rules: {
      type: Array,
      default: () => [],
      description: "Reglas para validar el valor según la opción seleccionada.",
    },
    options: {
      type: Array,
      default: () => [],
      description: "Opciones que tendrá el componente.",
    },
    textSize: {
      type: String,
      default: "md",
      description: "Tamaño del texto del botón. Ej. sm, md, lg...",
    },
    roundedSize: {
      type: String,
      default: null,
      description: "Grado del redondeo de los bordes del componente.",
    },
    iconRight: {
      type: Boolean,
      default: false,
      description:
        "En caso de ser true el ícono deberá estár del lado derecho del componente, de lo contrario del lado izquierdo.",
    },
    color: {
      type: String,
      default: null,
      description: "Color del texto del componente en modo light.",
    },
    darkColor: {
      type: String,
      default: null,
      description: "Color del texto del componente en modo dark.",
    },
    bgColor: {
      type: String,
      default: "bg-input",
      description: "Color bg del componente en modo light.",
    },
    darkBgColor: {
      type: String,
      default: null,
      description: "Color bg del componente en modo dark.",
    },
    labelColor: {
      type: String,
      default: "text-primary",
      description: "Color del texto label del componente en modo light.",
    },
    labelDarkColor: {
      type: String,
      default: "dark:text-white",
      description: "Color del texto label del componente en modo dark.",
    },
    selectedLabelColor: {
      type: String,
      default: "bg-inputHover",
      description:
        "Color bg de la opción que coincida con el valor de la opción ya seleccionada.",
    },
    hoverColor: {
      type: String,
      default: "hover:bg-inputHover",
      description: "Color bg al hacer hover entre las opciones en modo light.",
    },
    darkHoverColor: {
      type: String,
      default: null,
      description: "Color bg al hacer hover entre las opciones en modo dark.",
    },
  },
  data() {
    return {
      errorRules: false,
      messageRule: false,
    };
  },
  computed: {
    ...mapState(useCustomizationStore, ["isDarkMode"]),
    mainClass() {
      return [
        this.isDarkMode,
        this.roundedClass,
        this.bgColor ? this.bgColor : "",
        this.darkBgColor ? this.darkBgColor : "",
        this.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        [
          this.$slots.icon
            ? [this.iconRight ? "pl-3 pr-20" : "px-10"]
            : "pl-3 pr-10",
        ],
        [
          this.errorRules
            ? ["e-select--error"]
            : [
                "e-select-base",
                this.color ? this.color : calculateTextColor(this.bgColor),
                this.darkColor
                  ? this.darkColor
                  : this.darkBgColor
                  ? calculateTextColor(this.darkBgColor)
                  : calculateTextColor(this.bgColor),
                this.outline
                  ? [
                      "focus:outline outline-2",
                      this.outlineColor,
                      this.darkOutlineColor,
                    ]
                  : "outline-none",
              ],
        ],
      ];
    },
    containerOptionsClass() {
      return [
        "e-select-selected",
        this.isDarkMode,
        this.color ? this.color : calculateTextColor(this.bgColor),
        this.darkColor
          ? this.darkColor
          : this.darkBgColor
          ? calculateTextColor(this.darkBgColor)
          : calculateTextColor(this.bgColor),
        this.bgColor,
        this.darkBgColor,
      ];
    },
    optionsClass() {
      return ["e-select-options", this.hoverColor];
    },
    roundedClass() {
      const roundedClasses = {
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        xxl: "rounded-2xl",
      };

      return this.roundedSize ? roundedClasses[this.roundedSize] : "rounded-xl";
    },
    labelClass() {
      return [
        "absolute text-xs top-0.5 line-clamp-1 tracking-wider animate-slide-down",
        this.isDarkMode,
        this.messageRule
          ? "text-danger"
          : [
              this.labelColor
                ? this.labelColor
                : calculateTextColor(this.bgColor),
              this.labelDarkColor
                ? this.labelDarkColor
                : this.darkBgColor
                ? calculateTextColor(this.darkBgColor)
                : calculateTextColor(this.bgColor),
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
    labelSelected() {
      let label = null;
      if (typeof this.modelValue === "boolean") {
        label = this.options.find(
          (val) =>
            typeof val.value === "boolean" && val.value === this.modelValue
        );
      } else {
        label = this.options.find((val) => val.value === this.modelValue);
      }

      return label ? label.label : this.modelValue;
    },
    finalRules() {
      let rules = [...this.rules];
      if (this.required && typeof this.modelValue !== "boolean") {
        rules.unshift((val) => !!val || `El campo ${this.label} es requerido`);
      }
      return rules;
    },
  },
  created() {
    //Registra al componente al EForm al crearse
    if (this.register) {
      this.register(this);
    }
  },
  beforeUnmount() {
    // Desregistra este componente en EForm antes de destruirse
    if (this.unregister) {
      this.unregister(this);
    }
  },
  methods: {
    // Limpia la opción seleccionada del componente
    async clean() {
      this.$emit("clean");
      this.reset();
    },
    // Muestra u oculta la ventana con el listado de opciones al seleccionar
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    // Emite la opción seleccionada y manda a llamar a la función de validación
    async selectOption(option) {
      this.isDropdownOpen = false;
      await this.$emit("update:modelValue", option.value);
      this.validate();
    },
    // Resetea las variables de error
    async reset() {
      this.messageRule = false;
      this.errorRules = false;
      this.isDropdownOpen = false;
    },
    //Valida la opción seleccionada
    validate() {
      let rules = this.finalRules;
      let i = 0;
      let result = true;

      while (i < rules.length && result === true) {
        result = rules[i](this.modelValue);
        i++;
      }

      if (result !== true) {
        this.messageRule = result;
        this.errorRules = true;
        return false;
      } else {
        this.reset();
        return true;
      }
    },
  },
  setup() {
    const closeSelect = ref(null);
    const isDropdownOpen = ref(false);

    // Función para cerrar el dropdown
    const closeDropdown = () => {
      isDropdownOpen.value = false;
    };

    // Configura el observador de clic fuera del elemento
    onClickOutside(closeSelect, closeDropdown);

    return {
      closeSelect,
      isDropdownOpen,
      closeDropdown,
      onClickOutside,
    };
  },
  inject: {
    register: {
      from: "register",
      default: false,
    },
    unregister: {
      from: "unregister",
      default: false,
    },
  },
};
</script>
