import { defineStore } from "pinia";
import { ref } from "vue";

export const useCustomizationStore = defineStore("customizationStore", () => {
  const isDarkMode = ref(false);

  function changeMode() {
    isDarkMode.value = !isDarkMode.value;
  }

  return { isDarkMode, changeMode };
});
