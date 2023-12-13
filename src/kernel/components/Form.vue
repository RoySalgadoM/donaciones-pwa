<template>
  <form
    :ref="formID"
    class="w-full"
    @submit.prevent="handleValidation"
    @reset.prevent="handleReset"
  >
    <slot />
  </form>
</template>
  <script>
export default {
  name: "EForm",
  data() {
    return {
      registeredComp: [],
      isFormValid: true,
    };
  },
  provide() {
    const register = (element) => {
      this.registeredComp.push(element);
    };

    const unregister = (element) => {
      this.registeredComp = this.registeredComp.filter(
        (comp) => comp != element
      );
    };

    return {
      register,
      unregister,
    };
  },
  computed: {
    formID() {
      return `e-form${this.$.uid}`;
    },
  },
  methods: {
    handleValidation() {
      try {
        this.isFormValid = true;
        this.registeredComp.forEach((comp) => {
          const validationResult = comp.validate();
          if (!validationResult) {
            this.isFormValid = false;
          }
        });
        if (this.isFormValid) {
          this.$emit("formSubmit", this.isFormValid);
        }
        return this.isFormValid;
      } catch (error) {
        this.$emit("formSubmit", this.isFormValid);
        console.log(error);
      }
    },
    handleReset() {
      this.$emit("reset");
      this.registeredComp.forEach((comp) => {
        comp.reset();
      });
    },
    submit() {
      this.$refs[this.formID].requestSubmit();
    },
    reset() {
      this.$refs[this.formID].reset();
    },
  },
};
</script>
  