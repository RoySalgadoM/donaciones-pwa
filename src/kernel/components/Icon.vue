<template>
  <component
    :style="styleIcon"
    :class="iconClass"
    :is="isLocalIcon ? iconDonations : 'span'"
  >
    {{ isLocalIcon ? "" : name }}
  </component>
</template>

<script>
import { shallowRef } from "vue";
export default {
  name: "EIcon",
  props: {
    name: {
      type: String,
      default: null,
      description: "Nombre del ícono que renderizará el componente.",
    },
    textColor: {
      type: String,
      default: null,
      description: "Color que tendrá el ícono en modo light.",
    },
    darkTextColor: {
      type: String,
      default: null,
      description: "Color que tendrá el ícono en modo dark.",
    },
    size: {
      type: String,
      default: "md",
      description: "Tamaño del ícono. Por defecto tamaño 'md'",
    },
  },
  data() {
    return {
      sizes: {
        xs: 18,
        sm: 24,
        md: 32,
        lg: 38,
        xl: 46,
        xxl: 54,
      },
    };
  },
  setup() {
    let iconDonations = shallowRef(null);
    return { iconDonations };
  },
  computed: {
    isLocalIcon() {
      return this.name.includes("donations");
    },
    isPreSize() {
      return !!this.sizes[this.size];
    },
    iconClass() {
      return this.isLocalIcon
        ? [
            this.textColor ? this.textColor : "fill-white",
            this.darkTextColor ? this.darkTextColor : "dark:fill-white",
          ]
        : [
            "material-icons cursor-pointer",
            this.textColor ? this.textColor : "text-white",
            this.darkTextColor ? this.darkTextColor : "dark:text-white",
          ];
    },
    styleIcon() {
      return this.isLocalIcon
        ? {
            width: this.isPreSize ? this.sizes[this.size] + "px" : this.size,
            height: this.isPreSize ? this.sizes[this.size] + "px" : this.size,
          }
        : {
            fontSize: this.isPreSize ? this.sizes[this.size] + "px" : this.size,
          };
    },
  },
  created() {
    if (this.isLocalIcon) this.loadIcon();
  },
  methods: {
    async loadIcon() {
      let iconName = this.name.split(":")[1];
      try {
        const icon = await import(`@/components/icons/${iconName}.vue`);
        this.iconDonations = icon.default;
      } catch (error) {
        console.log(
          `Error al obtener el ícono ${iconName}.vue en el componente EIcon ::`,
          error
        );
      }
    },
  },
};
</script>
