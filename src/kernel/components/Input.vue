<template>
    <div>
      <div class="flex flex-grow relative" v-if="!this.textarea">
        <input
          :type="inputType"
          :ref="'inputRef' + $.uid"
          :disabled="disabled"
          :maxlength="finalLength"
          @input="clearAndEmitValue"
          @keydown="preventSpace"
          :class="mainClass"
          :placeholder="required ? label + '*' : label"
          :value="cleaningInput ? modelValue : modelValue"
        />
        <div
          v-if="!!modelValue && !disabled"
          @click="clean"
          :class="[
            'e-input-icon animate-slide-down',
            type == 'password'
              ? $slots.icon && iconRight
                ? 'right-[40px]'
                : 'right-10'
              : [$slots.icon ? 'right-11' : 'right-3']
              ? iconRight
                ? 'right-11'
                : 'right-3'
              : 'right-3',
          ]"
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
        <div
          v-if="type == 'password'"
          @click="showPassword"
          class="e-input-icon right-3"
        >
          <slot v-if="$slots.iconPassword" name="iconClose" />
          <div v-else>
            <svg
              v-if="showPass"
              :class="[
                'w-6 h-6',
                errorRules ? 'text-danger' : 'text-primary dark:text-white',
              ]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1.933 10.909A4.357 4.357 0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 19 9c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M2 17 18 1m-5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <svg
              v-else
              :class="[
                'w-6 h-6',
                errorRules ? 'text-danger' : 'text-primary dark:text-white',
              ]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 14"
            >
              <g
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z"
                />
              </g>
            </svg>
          </div>
        </div>
  
        <div
          class="e-input-icon"
          :class="[
            type == 'password'
              ? iconRight
                ? 'right-9'
                : 'left-2'
              : iconRight
              ? 'right-3'
              : 'left-2',
          ]"
        >
          <slot v-if="$slots.icon" name="icon" />
        </div>
  
        <div v-if="!!modelValue" :class="labelClass">
          {{ label }}<span v-if="required">*</span>
        </div>
      </div>
      <div class="relative" v-else>
        <textarea
          :ref="'inputRef' + $.uid"
          :disabled="disabled"
          :maxlength="finalLength"
          @input="clearAndEmitValue"
          :class="[mainClass, roundedClass]"
          :placeholder="required ? label + '*' : label"
          :value="cleaningInput ? modelValue : modelValue"
        />
  
        <div
          v-if="!!modelValue && !disabled"
          @click="clean"
          class="e-input-icon right-3 animate-slide-down"
        >
          <slot v-if="$slots.iconClose" name="iconClose" />
          <svg
            v-else
            class="w-4 h-4 text-primary dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
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
  
        <div v-if="!!modelValue" :class="labelClass">
          {{ label }}<span v-if="required">*</span>
        </div>
      </div>
      <div v-if="!!messageRestrictions" class="e-input--error-message">
        {{ messageRestrictions }}
      </div>
      <div v-if="!!messageRule" class="e-input--error-message">
        {{ messageRule }}
      </div>
    </div>
  </template>
  
  <style>
  .e-input-base {
    @apply flex flex-grow py-1.5 w-full h-fit tracking-wide disabled:cursor-not-allowed disabled:opacity-60;
  }
  
  .e-input-icon {
    @apply flex items-center justify-center cursor-pointer absolute top-0 h-full;
  }
  
  .e-input--error {
    @apply e-input-base outline outline-2 outline-danger text-danger placeholder:text-danger dark:placeholder:text-danger;
  }
  
  .e-input--error-message {
    @apply flex items-center justify-start w-full text-danger text-xs mt-1 animate-slide-down;
  }
  </style>
  
  <script>
  import { mapState } from "pinia";
  import { calculateTextColor } from "@/utils/utils";
  import { useCustomizationStore } from "@/config/stores/customization.ts";
  
  const patterns = {
    email:
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,250}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/, // Email
    decimal: /[^0-9.]/g, // Números y punto
    integer: /[^0-9]/g, // Números enteros
    alfa: /[^a-zA-ZáÁéÉíÍóÓúÚüÜ\s]/g, // Alfabético con espacio y acentos
    alfaNum: /[^a-zA-Z0-9]/g, // Alfanumérico
    alfaNumChar: /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜ!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~ ]/g, // Alfanumérico con caracteres especiales
    nomenclaturaDoc: /[^a-zA-Z0-9_\-.,ñÑ\s]/g, // Alfanumérico para nomenclatura de documentos
    pathDocs: /[^a-zA-Z0-9/,_\-.]/g, //Ruta de archivos
    time: /[^0-9:]/g, //Horas HH:MM:SS
    timens: /[^0-9:]/g, //Horas HH:MM
    money: /[^0-9.,$]/g, // Números, punto, coma y signo de peso
  };
  
  export default {
    name: "EInput",
    props: {
      modelValue: {
        type: String,
        default: null,
        description: "Valor del componente EInput.",
      },
      modelModifiers: {
        default: null,
        description: "Modificadores modelValue.",
      },
      type: {
        type: String,
        default: "text",
        description: "Tipo del componente EInput (Ej. text, number, etc.).",
      },
      required: {
        type: Boolean,
        default: false,
        description: "El valor del componente es obligatorio.",
      },
      noWhiteSpace: {
        type: Boolean,
        default: false,
        description:
          "Si es true, no permite colocar espacios en el valor que se ingresa al componente.",
      },
      roundedSize: {
        type: String,
        default: null,
        description: "Grado del redondeo de los bordes del componente.",
      },
      shadow: {
        type: Boolean,
        default: true,
        description:
          "En caso de ser false, el componente no contará con sombras.",
      },
      shadowSize: {
        type: String,
        default: null,
        description: "Grado de la sombra del componente.",
      },
      disabled: {
        type: Boolean,
        default: false,
        description: "El componente estará deshabilitado en caso de ser true.",
      },
      length: {
        type: [String, Number],
        default: null,
        description: "Caracteres permitidos en el valor del componente.",
      },
      rules: {
        type: Array,
        default: () => [],
        description:
          "Arreglo que contendrá las reglas que el componente considerará para su valor.",
      },
      label: {
        type: String,
        default: null,
        description:
          "Descripción del valor que debe ser ingresado en el componente.",
      },
      textarea: {
        type: Boolean,
        default: false,
        description: "Saber si el componente sera textarea para comentarios.",
      },
      textSize: {
        type: String,
        default: "md",
        description: "Tamaño del texto del componente. Ej. sm, md, lg...",
      },
      iconRight: {
        type: Boolean,
        default: false,
        description:
          "En caso de ser true el ícono deberá estár del lado derecho del componente, de lo contrario del lado izquierdo.",
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
      focusBgColor: {
        type: String,
        default: null,
        description:
          "Color bg del componente en modo light cuando se hace clic en el.",
      },
      focusDarkBgColor: {
        type: String,
        default: null,
        description:
          "Color bg del componente en modo dark cuando se hace clic en el.",
      },
      color: {
        type: String,
        default: null,
        description:
          "Color del texto que ingresa el usuario al componente en modo light.",
      },
      darkColor: {
        type: String,
        default: null,
        description:
          "Color del texto que ingresa el usuario al componente en modo dark.",
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
      placeholderColor: {
        type: String,
        default: null,
        description: "Color del texto placeholder del componente en modo light.",
      },
      darkPlaceholderColor: {
        type: String,
        default: null,
        description: "Color del texto placeholder del componente en modo dark.",
      },
      border: {
        type: Boolean,
        default: true,
        description:
          "Colocar una ligero borde al componente cuando la prop sea true, de lo contrario no colocar.",
      },
      borderColor: {
        type: String,
        default: "border-gray-800",
        description:
          "Color del borde del componente en caso de que la prop 'border' sea true.",
      },
      outline: {
        type: Boolean,
        default: true,
        description:
          "Colocar una línea que rodea al componente cuando la prop sea true, de lo contrario no colocar.",
      },
      outlineColor: {
        type: String,
        default: "outline-primary",
        description:
          "Color de la línea que rodea al componente en caso de que la prop 'outline' dea true.",
      },
      darkOutlineColor: {
        type: String,
        default: "dark:outline-secondary",
        description:
          "Color del borde del componente en caso de que la prop 'outline' dea true.",
      },
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
    data() {
      return {
        inputType: null,
        showPass: false,
        error: false,
        errorRules: false,
        messageRule: false,
        errorRestriction: false,
        messageRestrictions: false,
        cleaningInput: false,
        MAX_LEN: { time: 8, timens: 5 },
      };
    },
    computed: {
      ...mapState(useCustomizationStore, ["isDarkMode"]),
      mainClass() {
        return [
          this.isDarkMode,
          this.shadowClass,
          this.borderClass,
          this.roundedClass,
          this.textSizeClass,
          this.bgColor ? this.bgColor : "",
          this.darkBgColor ? this.darkBgColor : "",
          this.focusBgColor ? this.focusBgColor : "",
          this.focusDarkBgColor ? this.focusDarkBgColor : "",
          [
            this.$slots.icon
              ? this.iconRight
                ? this.$slots.iconPassword || this.type == "password"
                  ? "pl-3 pr-24" // Sí hay ícono en el componente, está alineado a la derecha y también hay ícono de mostrar/ocultar password
                  : "pl-3 pr-[40px]" // Sí hay ícono en el componente y está alineado a la derecha
                : this.type == "password"
                ? "pl-10 pr-[40px]"
                : "px-10" // Sí hay ícono en el componente y está alineado a la izquierda
              : this.$slots.iconPassword || this.type == "password"
              ? "pl-3 pr-[40px]" // No hay ícono en el componente y es de tipo password
              : "pl-3 pr-10", // No hay ícono en el componente y no es de tipo password
          ],
          [
            this.errorRules || this.errorRestriction
              ? ["e-input--error"]
              : [
                  "e-input-base",
                  this.color ? this.color : calculateTextColor(this.bgColor),
                  this.darkColor
                    ? this.darkColor
                    : this.darkBgColor
                    ? calculateTextColor(this.darkBgColor)
                    : calculateTextColor(this.bgColor),
                  this.placeholderColor
                    ? this.placeholderColor
                    : calculateTextColor(this.bgColor, "placeholder"),
                  this.darkPlaceholderColor
                    ? this.darkPlaceholderColor
                    : this.darkBgColor
                    ? calculateTextColor(this.darkBgColor, "placeholder")
                    : calculateTextColor(this.bgColor, "placeholder"),
                  this.outline
                    ? [
                        "focus:outline outline-2",
                        this.outlineColor
                          ? this.outlineColor
                          : calculateTextColor(this.bgColor, "outline"),
                        this.darkOutlineColor
                          ? this.darkOutlineColor
                          : this.darkBgColor
                          ? calculateTextColor(this.darkBgColor, "outline")
                          : calculateTextColor(this.bgColor, "outline"),
                      ]
                    : "outline-none",
                ],
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
        return this.roundedSize ? roundedClasses[this.roundedSize] : "rounded-xl";
      },
      shadowClass() {
        const shadowClasses = {
          sm: "shadow-sm",
          md: "shadow-md",
          lg: "shadow-lg",
          xl: "shadow-xl",
          xxl: "shadow-2xl",
        };
  
        return this.shadow
          ? [this.shadowSize ? shadowClasses[this.shadowSize] : "shadow-md"]
          : "shadow-none";
      },
      borderClass() {
        return this.border
          ? ["border-2 border-opacity-20", this.borderColor]
          : "border-none";
      },
      labelClass() {
        return [
          "absolute text-xxs top-0.5 animate-slide-down line-clamp-1 tracking-wider",
          this.$slots.icon ? [this.iconRight ? "left-3" : "left-10"] : "left-3",
          this.error || this.errorRestriction
            ? "text-danger"
            : [this.labelColor, this.labelDarkColor],
        ];
      },
      finalRules() {
        let rules = [...this.rules];
        if (this.required) {
          rules.unshift((val) => !!val || `El campo ${this.label} es requerido`);
        }
        if (this.modelModifiers?.email) {
          rules.push(
            (val) =>
              patterns.email.test(val) ||
              `El campo ${this.label} debe tener formato de correo`
          );
        }
        return rules;
      },
      finalLength() {
        let auxLen = null;
        let types = Object.keys(this.MAX_LEN);
        if (this.modelModifiers && this.length == null) {
          let mod = Object.keys(this.modelModifiers).toString();
          types.map((info) => {
            if (info === mod) {
              auxLen = this.MAX_LEN[info];
            }
          });
        } else {
          auxLen = this.length;
        }
        return auxLen;
      },
    },
    created() {
      // Asigna el tipo de input al componente a según la prop type
      this.inputType = this.type;
      //Registra al componente al EForm al crearse
      if (this.register) {
        this.register(this);
      }
    },
    // Desregistra este componente en EForm antes de destruirse
    beforeUnmount() {
      if (this.unregister) {
        this.unregister(this);
      }
    },
    methods: {
      async clearAndEmitValue(event) {
        let valueInput = event.target.value;
  
        switch (true) {
          case this.modelModifiers?.integer:
            valueInput = valueInput.replace(patterns.integer, "");
            if (!patterns.integer.test(event.target.value)) {
              this.resetRestrictions();
            } else {
              this.showRestrictions(
                "El valor ingresado debe ser en formato entero"
              );
            }
            break;
          case this.modelModifiers?.decimal:
            valueInput = valueInput.replace(patterns.decimal, "");
            if (!patterns.decimal.test(event.target.value)) {
              this.resetRestrictions();
              if (event.target.value.includes(".")) {
                let aux = event.target.value.split(".");
                if (aux[1].length > 2) {
                  // Reemplazar los dígitos después del punto que están en la posición 3 en adelante
                  aux[1] = aux[1].substring(0, 2); // Solo mantén los primeros 2 dígitos después del punto
                  valueInput = aux.join("."); // Vuelve a unir los componentes en una cadena
                }
                if (aux.length > 2) {
                  this.showRestrictions(
                    "El valor ingresado debe ser en formato decimal"
                  );
                }
              } else {
                valueInput += ".00";
              }
            } else {
              this.showRestrictions(
                "El valor ingresado debe ser en formato decimal"
              );
            }
            break;
          case this.modelModifiers?.money:
            valueInput = valueInput.replace(patterns.decimal, "");
            if (!patterns.money.test(event.target.value)) {
              this.resetRestrictions();
              const parts = valueInput.toString().split(".");
              const integerPart = parts[0];
              const decimalPart = parts.length > 1 ? "." + parts[1] : "";
  
              // Agrega comas cada tres dígitos en la parte entera
              const formattedIntegerPart = integerPart.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              );
  
              valueInput = "$" + formattedIntegerPart + decimalPart;
            } else {
              this.showRestrictions(
                "El valor ingresado debe ser en formato de cantidad monetaria"
              );
            }
            break;
          case this.modelModifiers?.alfa:
            valueInput = valueInput.replace(patterns.alfa, "");
            if (!patterns.alfa.test(event.target.value)) {
              this.resetRestrictions();
            } else {
              this.showRestrictions("El valor ingresado debe ser alfabético");
            }
            break;
          case this.modelModifiers?.alfaNum:
            valueInput = valueInput.replace(patterns.alfaNum, "");
            if (!patterns.alfaNum.test(event.target.value)) {
              this.resetRestrictions();
            } else {
              this.showRestrictions("El valor ingresado debe ser alfanumérico");
            }
            break;
          case this.modelModifiers?.alfaNumChar:
            valueInput = valueInput.replace(patterns.alfaNumChar, "");
            if (!patterns.alfaNumChar.test(event.target.value)) {
              this.resetRestrictions();
            } else {
              this.showRestrictions(
                "El valor ingresado debe ser alfanumérico con caracteres"
              );
            }
            break;
          case this.modelModifiers?.nomenclaturaDoc:
            valueInput = valueInput.replace(patterns.nomenclaturaDoc, "");
            if (!patterns.nomenclaturaDoc.test(event.target.value)) {
              this.resetRestrictions();
            } else {
              this.showRestrictions(
                "La nomenclatura contiene caracteres inválidos"
              );
            }
            break;
          case this.modelModifiers?.pathDocs:
            valueInput = valueInput.replace(patterns.pathDocs, "");
            if (!patterns.pathDocs.test(event.target.value)) {
              this.resetRestrictions();
            } else {
              this.showRestrictions("La ruta contiene caracteres inválidos");
            }
            break;
          case this.modelModifiers?.time:
            valueInput = valueInput.replace(patterns.time, "");
            if (valueInput.length == 0 || valueInput.length == 1)
              valueInput += "0:00:00";
            if (
              !patterns.time.test(event.target.value) &&
              valueInput.length <= 8
            ) {
              this.resetRestrictions();
              if (valueInput.includes(":") || valueInput.length == 8) {
                let aux = valueInput.split(":");
                if (
                  !(
                    parseInt(aux[0]) >= 0 &&
                    parseInt(aux[0]) <= 23 &&
                    parseInt(aux[1]) >= 0 &&
                    parseInt(aux[1]) <= 59 &&
                    parseInt(aux[2]) >= 0 &&
                    parseInt(aux[2]) <= 59
                  )
                ) {
                  this.showRestrictions("El rango de horas es incorrecto");
                }
              }
            } else {
              this.showRestrictions("El campo debe contener el formato HH:MM:SS");
            }
            break;
          case this.modelModifiers?.timens:
            valueInput = valueInput.replace(patterns.timens, "");
            if (valueInput.length == 0 || valueInput.length == 1)
              valueInput += "0:00";
            if (
              !patterns.timens.test(event.target.value) &&
              event.target.value.length <= 5
            ) {
              this.resetRestrictions();
              if (valueInput.includes(":") || valueInput.length == 5) {
                let aux = valueInput.split(":");
                if (
                  !(
                    parseInt(aux[0]) >= 0 &&
                    parseInt(aux[0]) <= 23 &&
                    parseInt(aux[1]) >= 0 &&
                    parseInt(aux[1]) <= 59
                  )
                ) {
                  this.showRestrictions("El rango de horas es incorrecto");
                }
              }
            } else {
              this.showRestrictions("El campo debe contener el formato HH:MM");
            }
            break;
        }
        await this.$emit("update:modelValue", valueInput);
        this.cleaningInput = true;
        this.cleaningInput = false;
        this.validate();
      },
  
      // Limpiar el contenido del componente EInput, emitir evento clean y resetear variables de error de regla
      async clean() {
        this.$emit("clean");
        this.reset();
      },
  
      // Resetear mensaje de error y estilos de la regla, llamar a resetear mensaje y estilos de restricción
      reset() {
        this.messageRule = false;
        this.errorRules = false;
        this.resetRestrictions();
      },
  
      // Resetear el mensaje y estilos de restricción
      resetRestrictions() {
        this.messageRestrictions = false;
        this.errorRestriction = false;
      },
  
      // Mostrar el mensaje de restricción y habilitar estilos de error
      showRestrictions(message) {
        this.messageRestrictions = message;
        this.errorRestriction = true;
      },
  
      // Mostrar el valor del componente que ingresa el usuario cuando el tipo es "password"
      showPassword() {
        this.showPass = !this.showPass;
        this.inputType == "password"
          ? (this.inputType = "text")
          : (this.inputType = "password");
      },
  
      // Validar las reglas del componente
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
          this.messageRule = false;
          this.errorRules = false;
          return true;
        }
      },
      //Evitar espacios en blanco en la vista del login
      preventSpace(event) {
        if (this.noWhiteSpace && event.key === " ") {
          event.preventDefault();
        }
      },
    },
  };
  </script>
  