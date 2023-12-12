<template>
  <div
    v-if="showDialog"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div
      :class="[
        'relative top-10 mx-auto p-3 border shadow-lg rounded-md bg-white',
        sizeClass,
      ]"
    >
      <div class="text-lg font-bold">
        <slot name="title"></slot>
      </div>

      <div class="flex justify-center">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "lg",
    },
  },
  data() {
    return {
      showDialog: false,
    };
  },
  computed: {
    sizeClass() {
      switch (this.size) {
        case 'lg':
          return 'w-5/6 sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-2/5';
        case 'md':
          return 'w-5/6 sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-2/5';
        case 'sm':
          return 'w-4/6 sm:w-2/5 md:w-1/3 lg:w-1/5 xl:w-1/5';
        default:
          return 'w-5/6 sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-2/5'; // Tamaño por defecto
      }
    },
  },
  watch: {
    show(newValue) {
      newValue ? this.open() : this.close();
    },
  },
  created() {
    if (this.show) {
      this.open();
    }
  },
  methods: {
    open() {
      this.showDialog = true;
    },
    close() {
      this.showDialog = false;
    },
    handleClose() {
      this.showDialog = false;
      this.$emit("update:show", false);
    },
  },
};
</script>
