<template>
  <div class="relative">
    <div class="flex flex-grow w-full relative">
      <div
        class="e-calendar-icon left-3"
        :class="disabled ? 'cursor-no-drop' : 'cursor-pointer'"
        @click="disabled ? null : (showDatePicker = true)"
      >
        <slot v-if="$slots.iconCalendar" name="iconCalendar" />
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 text-primary dark:text-white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
      </div>
      <div
        v-if="!!modelValue && !disabled"
        @click.prevent="ClearDate(), (isInValid = false)"
        class="e-calendar-icon right-3 animate-slide-down"
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
      <input
        maxlength="10"
        :class="mainClass"
        :disabled="disabled"
        :value="formatDateIn"
        :placeholder="required ? label + '*' : label"
        @input="
          (val) => {
            handleDateInput(val);
            handleDateChange(val);
          }
        "
      />
      <div v-if="!!modelValue" :class="labelClass">
        {{ required ? label + "*" : label }}
      </div>
    </div>
    <div v-if="isInValid" class="e-calendar--error-message">
      {{ messageRule }}
    </div>
    <div
      v-if="showDatePicker"
      @click="showDatePicker = false"
      class="fixed inset-0 z-10"
    />
    <div v-if="showDatePicker" class="absolute z-20 -mt-40 animate-slide-up">
      <div class="bg-white rounded-lg shadow-md" style="max-width: 310px">
        <div class="calendar bg-input dark:text-white">
          <div
            class="header bg-primary dark:bg-secondary text-white h-18 flex flex-col p-4"
          >
            <div class="text-sm font-extralight">
              {{ dateTodayOnFormatTitleYear }}
            </div>
            <div class="text-md">
              {{ dateTodayOnFormatTitle }}
            </div>
          </div>
          <div class="h-20 text-center flex justify-center items-center">
            <button
              class="mx-2 hover:bg-gray-100 dark:hover:bg-primary rounded-2xl hover:cursor-pointer h-7 w-7"
              @click.prevent="changeMonth(-1)"
            >
              &#60;
            </button>
            <div
              class="w-20 hover:bg-gray-100 dark:hover:bg-primary text-sm rounded-2xl hover:cursor-pointer h-7 flex flex-col justify-center items-center transition duration-200 ease-out md:ease-in transform hover:scale-105"
              @click.prevent="toggleMonthSelector"
            >
              {{ capitalizeFirstLetter(currentMonth) }}
            </div>
            <button
              class="mx-2 hover:bg-gray-100 dark:hover:bg-primary rounded-2xl hover:cursor-pointer h-7 w-7 text-sm"
              @click.prevent="changeMonth(1)"
            >
              &#62;
            </button>
            <button
              class="mx-2 hover:bg-gray-100 dark:hover:bg-primary rounded-2xl hover:cursor-pointer h-7 w-7 text-sm"
              @click.prevent="changeYear(-1)"
            >
              &#60;
            </button>
            <div
              class="hover:bg-gray-100 dark:hover:bg-primary rounded-2xl text-sm hover:cursor-pointer px-4 h-7 flex flex-col justify-center items-center transition duration-200 ease-out md:ease-in transform hover:scale-105"
              @click.prevent="toggleYearSelector"
            >
              {{ currentYear }}
            </div>
            <button
              class="mx-2 hover:bg-gray-100 dark:hover:bg-primary rounded-2xl hover:cursor-pointer h-7 w-7"
              @click.prevent="changeYear(1)"
            >
              &#62;
            </button>
          </div>
          <div class="flex px-4">
            <div v-if="showMonthSelector" class="grid grid-cols-3 gap-2">
              <div
                v-for="(month, index) in months"
                :key="index"
                @click.prevent="selectMonth(month)"
                class="cursor-pointer hover:bg-primary p-1 text-sm rounded-lg hover:text-white text-center transition duration-100 ease-out md:ease-in transform hover:scale-105"
              >
                {{ month }}
              </div>
            </div>

            <div v-if="yearSelector" class="grid grid-cols-5 gap-2">
              <div
                v-for="(year, index) in years"
                :key="index"
                @click.prevent="selectYear(year)"
                class="cursor-pointer hover:bg-primary p-1 text-sm rounded-lg hover:text-white text-cente transition duration-100 ease-out md:ease-in transform hover:scale-105"
              >
                {{ year }}
              </div>
            </div>
          </div>
          <div
            class="flex px-6"
            v-if="showMonthSelector == false && yearSelector == false"
          >
            <div
              class="mx-2 cursor-pointer text-xs"
              v-for="(titleDay, i) in weekdays"
              :key="i"
            >
              {{ titleDay }}
            </div>
          </div>

          <div
            v-if="showMonthSelector == false && yearSelector == false"
            class="grid grid-cols-7 gap-1 px-6 transition duration-200 ease-out md:ease-in text-sm"
          >
            <div
              v-for="(day, index) in filteredDaysWithOffset"
              :key="index"
              class="rounded-2xl"
              :class="dayClasses(day)"
              @click="
                isDayBlocked(day) ||
                isDayBlockedTomorrow(day) ||
                isDaysLater(day) ||
                isDaysRange(day)
                  ? null
                  : setDay(day)
              "
            >
              {{ day !== null ? day : "" }}
            </div>
          </div>
          <div class="h-20 flex flex-col justify-center items-center">
            <div
              class="mb-2 hover:bg-gray-100 dark:hover:bg-primary rounded-2xl hover:cursor-pointer hover:px-2 h-7 flex flex-col justify-center items-center"
              @click.prevent="onTodaySelection(dateToday)"
            >
              {{ "Hoy" }}
            </div>
            <div
              class="hover:bg-gray-100 dark:hover:bg-primary rounded-2xl hover:cursor-pointer hover:px-2 h-7 flex flex-col justify-center items-center"
              @click.prevent="ClearDate(), (showDatePicker = false)"
            >
              {{ "Limpiar" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.e-calendar-base {
  @apply flex flex-grow rounded-xl pl-10 py-1.5 shadow-md w-full h-fit text-sm border-2 border-gray-800 border-opacity-20 disabled:cursor-not-allowed disabled:opacity-60;
}

.e-calendar-icon {
  @apply flex items-center justify-center cursor-pointer absolute top-0 h-full;
}

.e-calendar--error-message {
  @apply flex items-center justify-start w-full text-danger text-xs mt-1 animate-slide-down;
}
</style>

<script>
import { mapState } from "pinia";
import { DateTime } from "luxon";
import { calculateTextColor } from "@/utils/utils";
import { useCustomizationStore } from "@/config/stores/customization.ts";

export default {
  name: "Calendar",
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
      selectedDate: "",
      showDatePicker: false,
      showMonthSelector: false,
      yearSelector: false,
      isInValid: false,
      messageRule: "Error, no es una fecha valida",
      currentDate: DateTime.local().setLocale("es"),
    };
  },
  beforeUnmount() {
    if (this.unregister) {
      this.unregister(this);
    }
  },
  created() {
    if (this.register) {
      this.register(this);
    }
  },
  props: {
    label: {
      type: String,
      default: "Fecha inicio",
    },
    modelValue: {
      default: null,
    },
    labelColor: {
      type: String,
      default: "text-primary",
    },
    labelDarkColor: {
      type: String,
      default: null,
    },
    /* weekdays: {
      type: Array,
      default: () => ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    }, */
    formatDate: {
      type: String,
      default: "dd-MM-yyyy",
      description: "Formato a establecer en las fechas",
    },
    formatDateInput: {
      type: String,
      default: "dd-MM-yyyy",
      description: "Formato a establecer en las fechas",
    },
    formatDateStart: {
      type: String,
      default: "dd-MM-yyyy",
      description:
        "Formato a establecer en las fechas de la fecha inicial proporcionada",
    },
    /* messageRule: {
      type: String,
      default: "Error, no es una fecha valida",
    }, */
    beforeTomorrow: {
      type: Boolean,
      default: false,
      description: "Oculta los días posteriores al día actual",
    },
    range: {
      type: Number,
      default: null,
      description: "Rango máximo de días a partir de la primer fecha",
    },
    rules: {
      type: Array,
      default: () => {
        return [];
      },
      description:
        "Prop para recibir las reglas definidas para validar el correcto llenado de una fecha",
    },
    required: {
      type: Boolean,
      default: false,
      description: "Define si el componente es requerido.",
    },
    disabled: {
      type: Boolean,
      default: false,
      description: "Si el calendario es deshabilitado",
    },
    daysLater: {
      type: Number,
      default: null,
      description:
        "Rango de días después de la fecha seleccionada y antes de la fecha actual",
    },
    dateToStart: {
      type: String,
      default: null,
      description: "Fecha en la cual empiezan las fechas seleccionables.",
    },
    color: {
      type: String,
      default: "bg-input",
      description: "Color bg del componente en modo light.",
    },
    darkColor: {
      type: String,
      default: null,
      description: "Color bg del componente en modo dark.",
    },
    textColor: {
      type: String,
      default: null,
      description:
        "Color del texto que ingresa el usuario al componente en modo light.",
    },
    darkTextColor: {
      type: String,
      default: null,
      description:
        "Color del texto que ingresa el usuario al componente en modo dark.",
    },
    bgHeaderColorDark: {
      type: String,
      default: "dark:bg-gray-400",
      description: "Color de la sección header del componente en modo dark.",
    },
    bgHeaderColor: {
      type: String,
      default: "bg-primary",
      description: "Color de la sección header del componente en modo dark.",
    },
    textColorError: {
      type: String,
      default: "text-danger",
    },
    outline: {
      type: Boolean,
      default: true,
    },
    outlineColor: {
      type: String,
      default: "outline-primary",
    },
    outlineDarkColor: {
      type: String,
      default: "dark:outline-secondary",
    },
    outlineError: {
      type: Boolean,
      default: true,
    },
    outlineErrorColor: {
      type: String,
      default: "outline-danger",
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
    placeholderErrorColor: {
      type: String,
      default: "placeholder:text-danger",
      description:
        "Color del texto placeholder del componente cuando existe un error.",
    },
  },
  computed: {
    ...mapState(useCustomizationStore, ["isDarkMode"]),
    mainClass() {
      return [
        "e-calendar-base",
        this.isDarkMode,
        this.color,
        this.isInValid
          ? [
              this.outlineError
                ? [
                    "outline outline-2",
                    this.outlineErrorColor,
                    this.textColorError,
                  ]
                : "outline-none",
              this.placeholderErrorColor,
            ]
          : [
              this.textColor ? this.textColor : calculateTextColor(this.color),
              this.darkTextColor
                ? this.darkTextColor
                : calculateTextColor(this.color),
              this.placeholderColor
                ? this.placeholderColor
                : calculateTextColor(this.color, "placeholder"),
              this.darkPlaceholderColor
                ? this.darkPlaceholderColor
                : this.darkColor
                ? calculateTextColor(this.darkColor, "placeholder")
                : calculateTextColor(this.color, "placeholder"),
              [
                this.outline
                  ? [
                      "focus:outline outline-2",
                      this.outlineColor
                        ? this.outlineColor
                        : calculateTextColor(this.color, "outline"),
                      this.outlineDarkColor
                        ? this.outlineDarkColor
                        : this.darkColor
                        ? calculateTextColor(this.darkColor, "outline")
                        : calculateTextColor(this.color, "outline"),
                    ]
                  : "outline-none",
              ],
            ],
      ];
    },
    labelClass() {
      return [
        "absolute text-xs left-4 top-0.5 animate-slide-down line-clamp-1 tracking-wider",
        this.isInValid
          ? this.textColorError
          : [
              this.labelColor
                ? this.labelColor
                : calculateTextColor(this.color),
              this.labelDarkColor
                ? this.labelDarkColor
                : this.darkColor
                ? calculateTextColor(this.darkColor)
                : calculateTextColor(this.color),
            ],
      ];
    },
    formatDateIn() {
      if (!this.modelValue) {
        return ""; // Manejo de caso de valor nulo
      }
      try {
        let dateeee = DateTime.fromFormat(this.modelValue, this.formatDate);
        let dateeeformateee = dateeee.toFormat(this.formatDateInput);
        if (dateeee.isValid) {
          return dateeeformateee;
        } else {
          dateeee = DateTime.fromFormat(this.modelValue, this.formatDateInput);
          dateeeformateee = dateeee.toFormat(this.formatDateInput);
          if (dateeee.isValid) {
            return dateeeformateee;
          } else {
            return this.modelValue;
          }
        }
      } catch (error) {
        console.error("Error parsing or formatting date:", error);
        return this.modelValue; // Manejo de errores
      }
    },
    currentMonth() {
      return this.currentDate.toLocaleString({
        month: "long",
      });
    },
    weekdays() {
      let days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      return days;
    },
    currentYear() {
      // Muestra el año actual en selector de años del calendario
      return this.currentDate.year;
    },
    daysInMonth() {
      return this.currentDate.daysInMonth;
    },
    firstDayOfWeek() {
      return this.currentDate.startOf("month").weekday;
    },
    daysWithOffset() {
      let paddedDays = new Array(this.firstDayOfWeek).fill(null);
      for (let day = 1; day <= this.daysInMonth; day++) {
        paddedDays.push(day);
      }
      return paddedDays;
    },
    filteredDaysWithOffset() {
      //Removemos el primer elemento de las fechas ya que este desfaza el calendario
      return this.daysWithOffset.slice(1);
    },
    dateToday() {
      // Esta se utilizara para ponerlo como fecha cuando precionen el boton "Hoy"
      return DateTime.local().toFormat(this.formatDate);
    },
    dateTodayOnFormatTitle() {
      // Muestra la fecha actual que se mostrará en el título del calendario
      let currentDate = DateTime.local().setLocale("es");
      let dayOfWeek = this.capitalizeFirstLetter(currentDate.toFormat("ccc"));
      let month = this.capitalizeFirstLetter(currentDate.toFormat("LLL"));
      let day = currentDate.toFormat("dd");

      return `${dayOfWeek}, ${month}, ${day}`;
    },
    dateTodayOnFormatTitleYear() {
      // Muestra el año actual
      let currentDate = DateTime.local().setLocale("es");
      let year = currentDate.toFormat("yyyy");
      return `${year}`;
    },
    // Trae las opciones de meses que se veran en el calendario
    months() {
      let monthsArray = [];
      for (let i = 1; i <= 12; i++) {
        // TODO: Ajustar idioma
        let monthName = DateTime.local().setLocale("es");
        monthName = DateTime.fromObject({ month: i }).toLocaleString({
          month: "long",
        });
        let capitalizedMonthName = this.capitalizeFirstLetter(monthName);

        monthsArray.push(capitalizedMonthName);
      }
      return monthsArray;
    },
    // Trae las opciones de años que se veran en el calendario
    years() {
      let currentYear = DateTime.local().year;
      let yearsBack = 25;
      let yearsForward = 0;
      let yearArray = [];

      for (
        let i = currentYear - yearsBack;
        i <= currentYear + yearsForward;
        i++
      ) {
        yearArray.push(i);
      }

      return yearArray;
    },
    finalRules() {
      let rules = [...this.rules];
      if (this.required) {
        rules.unshift((val) => !!val || `El campo ${this.label} es requerido`);
      }
      return rules;
    },
    dateTomorrow() {
      let today = DateTime.local();
      let tomorrow = today.plus({ days: 1 });
      return tomorrow.toFormat(this.formatDate);
    },
    dateDaysLater() {
      let today = DateTime.local();
      let daysLater = today.plus({ days: this.daysLater + 1 });
      return daysLater.toFormat(this.formatDate);
    },
    dateDaysRange() {
      if (this.dateToStart && this.formatDateStart && this.range) {
        const startDate = DateTime.fromFormat(
          this.dateToStart,
          this.formatDateStart
        );
        const daysLater = startDate.plus({ days: this.range });
        return daysLater.toFormat(this.formatDate);
      }
      return null;
    },
    isRequiredInvalid() {
      return (
        this.required && (this.selectedDate == "" || this.selectedDate == null)
      );
    },
  },
  methods: {
    async handleDateChange(val) {
      await this.$emit("update:modelValue", val.target.value);
      if (this.modelValue && this.modelValue.length === 10) {
        let selectedDate = DateTime.fromFormat(
          this.modelValue,
          this.formatDateInput
        );
        if (selectedDate.isValid) {
          this.selectedDate = selectedDate.toFormat(this.formatDate);
          await this.$emit("update:modelValue", this.selectedDate);
        } else {
          this.selectedDate = "";
        }
      }

      this.validate();
      this.showDatePicker = false;
    },
    toggleDatePicker() {
      this.showDatePicker = !this.showDatePicker;
      this.showMonthSelector = false;
      this.yearSelector = false;
    },
    dayClasses(day) {
      // Clases dia que no se pinta
      if (day === null) {
        return ["day", "px-2", "py-1", "text-center"];
      }
      let date = this.currentDate.set({ day });
      let classes = ["day", "px-2", "py-1", "text-center"];
      // Clases para cuando no se selecciona
      if (this.selectedDate === date.toFormat(this.formatDate)) {
        classes.push(
          "selected-day",
          "bg-primary",
          "text-white",
          "rounded-2xl",
          "cursor-pointer",
          "transition",
          "duration-300",
          "ease-out",
          "md:ease-in",
          "transform",
          "hover:scale-105"
        );
      }
      // Clases para cuando no se pueda seleccionar
      if (this.isDayBlocked(day)) {
        classes.push(
          "text-gray-200",
          "cursor-not-allowed",
          "dark:text-gray-800"
        );
      }
      if (this.isDayBlockedTomorrow(day)) {
        classes.push(
          "text-gray-200",
          "cursor-not-allowed",
          "dark:text-gray-800"
        );
      }
      if (this.isDaysLater(day)) {
        classes.push(
          "text-gray-200",
          "cursor-not-allowed",
          "dark:text-gray-800"
        );
      }
      if (this.isDaysRange(day)) {
        classes.push(
          "text-gray-200",
          "cursor-not-allowed",
          "dark:text-gray-800"
        );
      }
      // Clases para cuando se pueda seleccionar
      if (
        !this.isDayBlockedTomorrow(day) &&
        !this.isDayBlocked(day) &&
        !this.isDaysLater(day) &&
        !this.isDaysRange(day) &&
        this.selectedDate !== date.toFormat(this.formatDate)
      ) {
        classes.push(
          "cursor-pointer",
          "hover:bg-gray-100 dark:hover:bg-primary"
        );
      }
      return classes.join(" ");
    },
    isDayBlocked(day) {
      let fechaActual = this.currentDate.set({ day }).startOf("day");

      if (this.dateToStart) {
        let fechaInicio = DateTime.fromFormat(
          this.dateToStart,
          this.formatDateStart
        ).startOf("day");
        return fechaActual < fechaInicio;
      }

      return false;
    },
    isDayBlockedTomorrow(day) {
      // Cuando el prop beforeTomorrow existe entonces bloquea la posibilidad de elegir cualquier diaa a partir de hoy
      let fechaActual = this.currentDate.set({ day }).startOf("day");

      if (this.beforeTomorrow) {
        let tomorrow = this.dateTomorrow;

        let fechaInicio = DateTime.fromFormat(
          tomorrow,
          this.formatDate
        ).startOf("day");
        if (fechaActual >= fechaInicio) {
          return true;
        }
      }

      return false;
    },
    isDaysLater(day) {
      // Bloquea a partir del numero de dias hacia adelante de hoy los dias que se pondan en el prop daysLater
      let fechaActual = this.currentDate.set({ day }).startOf("day");
      if (this.daysLater) {
        let tomorrow = this.dateDaysLater;

        let fechaInicio = DateTime.fromFormat(
          tomorrow,
          this.formatDate
        ).startOf("day");
        if (fechaActual >= fechaInicio) {
          return true;
        }
      }

      return false;
    },
    isDaysRange(day) {
      // Bloquea a partir del numero de dias hacia adelante de hoy los dias que se pondan en el prop range
      let fechaActual = this.currentDate.set({ day }).startOf("day");
      if (this.range) {
        let tomorrow = this.dateDaysRange;

        let fechaInicio = DateTime.fromFormat(
          tomorrow,
          this.formatDate
        ).startOf("day");
        if (fechaActual >= fechaInicio) {
          return true;
        }
      }

      return false;
    },
    // Setear la fecha actual en el calendario
    onTodaySelection(date) {
      let selectedDate = DateTime.fromFormat(date, this.formatDate);
      this.selectedDate = selectedDate.toFormat(this.formatDate);
      this.currentDate = selectedDate;
      this.isValidDate(this.selectedDate);
      this.$emit("update:modelValue", this.selectedDate);
      this.toggleDatePicker();
    },
    // Setear la fecha actual como null
    async ClearDate() {
      this.selectedDate = null;
      this.$emit("input");
      await this.$emit("update:modelValue", this.selectedDate);
      this.validate();
    },
    // Setear el dia seleccionado y emitirlo
    async setDay(day) {
      if (day !== null) {
        let selectedDate = this.currentDate.set({ day });
        this.selectedDate = selectedDate.toFormat(this.formatDate);
        this.isValidDate(this.selectedDate);
        await this.$emit("update:modelValue", this.selectedDate);
        this.showDatePicker = false;
      }
    },
    // Método para incrmentar o disminuir el mes
    changeMonth(offset) {
      this.currentDate = this.currentDate.plus({ months: offset });
    },
    // Método para incrmentar o disminuir el año
    changeYear(offset) {
      this.currentDate = this.currentDate.plus({ years: offset });
    },
    toggleMonthSelector() {
      this.showMonthSelector = !this.showMonthSelector;
      this.yearSelector = false;
    },
    selectMonth(month) {
      this.currentDate = this.currentDate.set({
        month: this.months.indexOf(month) + 1,
      });
      this.showMonthSelector = false;
    },
    toggleYearSelector() {
      this.yearSelector = !this.yearSelector;
      this.showMonthSelector = false;
    },
    selectYear(year) {
      this.currentDate = this.currentDate.set({ year });
      this.yearSelector = false;
    },
    /*  handleDateInput(event) {
      let inputValue = event.target.value;
      inputValue = inputValue.replace(/\D/g, "");

      if (inputValue.length > 8) {
        inputValue = inputValue.slice(0, 8);
      }

      if (inputValue.length >= 4 && inputValue.length < 7) {
        inputValue = inputValue.replace(/(\d{4})(\d{0,2})/, "$1/$2");
      } else if (inputValue.length >= 7) {
        inputValue = inputValue.replace(/(\d{4})(\d{2})(\d{0,2})/, "$1/$2/$3");
      }
      if (inputValue === "" || inputValue === "/" || inputValue === "//") {
        inputValue = "";
      }
      event.target.value = inputValue;
      this.selectedDate = inputValue;
    }, */
    handleDateInput(event) {
      let inputValue = event.target.value;
      let validChart = this.formatDateInput.replace(/[A-z]/g, "");
      validChart = "\\" + validChart[0];

      inputValue = inputValue.replace(
        new RegExp(`[^\\d${validChart}]`, "g"),
        ""
      );
      if (inputValue.length > 10) {
        inputValue = inputValue.slice(0, 10);
      }
      event.target.value = inputValue;
      this.selectedDate = inputValue;
    },
    /* handleDateInput(event) {
      let inputValue = event.target.value;
      let numericValue = inputValue.replace(/\D/g, "");

      let formattedValue = "";
      let numericIndex = 0;

      for (let i = 0; i < this.formatDate.length; i++) {
        let currentChar = this.formatDate[i];

        if (/\W/.test(currentChar)) {
          formattedValue += currentChar;
        } else {
          if (numericIndex < numericValue.length) {
            formattedValue += numericValue[numericIndex];
            numericIndex++;
          }
        }
      }

      event.target.value = formattedValue;
      this.selectedDate = formattedValue;
    }, */
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Validar usando luxon si es una fecha valida
    // Tambien valida si se cumplen las condiciones de los dias desponibles a tra vez de los props que se seleccionan
    isValidDate(val, currentFormat = this.formatDate) {
      if (!val) {
        this.isInValid = false;
        return;
      }

      let formattedDate = DateTime.fromFormat(val, currentFormat, {
        zone: "local",
      });

      this.isInValid = !formattedDate.isValid;
      this.isInValid
        ? (this.messageRule = "Error, no es una fecha valida")
        : (this.messageRule = "");

      if (formattedDate.isValid) {
        let fechaActual = formattedDate.startOf("day");

        if (this.dateToStart) {
          let fechaInicio = DateTime.fromFormat(
            this.dateToStart,
            this.formatDateStart
          ).startOf("day");
          this.isInValid = fechaActual < fechaInicio;
          this.isInValid
            ? (this.messageRule = "Error, no entra en el rango de fechas")
            : (this.messageRule = "");
        }

        if (this.beforeTomorrow) {
          let tomorrow = this.dateTomorrow;
          let fechaInicio = DateTime.fromFormat(
            tomorrow,
            this.formatDate
          ).startOf("day");
          this.isInValid = this.isInValid || fechaActual >= fechaInicio;
          this.isInValid
            ? (this.messageRule = "Error, no entra en el rango de fechas")
            : (this.messageRule = "");
        }

        if (this.daysLater) {
          let tomorrow = this.dateDaysLater;
          let fechaInicio = DateTime.fromFormat(
            tomorrow,
            this.formatDate
          ).startOf("day");
          this.isInValid = this.isInValid || fechaActual >= fechaInicio;
          this.isInValid
            ? (this.messageRule = "Error, no entra en el rango de fechas")
            : (this.messageRule = "");
        }

        if (this.range) {
          let tomorrow = this.dateDaysRange;
          let fechaInicio = DateTime.fromFormat(
            tomorrow,
            this.formatDate
          ).startOf("day");
          this.isInValid = this.isInValid || fechaActual >= fechaInicio;
          this.isInValid
            ? (this.messageRule = "Error, no entra en el rango de fechas")
            : (this.messageRule = "");
        }
      }
    },
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
        this.isInValid = true;
        return false;
      } else {
        this.reset();

        // Agregar las validaciones de fecha aquí
        this.isValidDate(this.modelValue);

        // Resto del código sin cambios

        return true;
      }
    },
    reset() {
      this.messageRule = false;
      this.isInValid = false;
    },
  },
  watch: {},
};
</script>
<style scoped>
/* @import url("output.css"); */
</style>
