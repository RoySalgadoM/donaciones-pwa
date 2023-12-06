<template>
  <div class="col-span-12 md:col-span-6 xl:col-span-4 min-w-0 max-w-full">
    <div
      @click="toggleCollapse"
    >
        <slot name="content"></slot>
    </div>
    <!-- Contenedor para los botones, que actúa como collapse -->
    <div v-show="isCollapsed">
        <slot name="contentCollapse"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isMobile = ref(window.innerWidth <= 768);
const isCollapsed = ref(false);

const updateMobileState = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  window.addEventListener('resize', updateMobileState);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateMobileState);
});

const toggleCollapse = () => {
  if (isMobile.value) {
    isCollapsed.value = !isCollapsed.value;
  }
};

</script>

<style>
@media (max-width: 768px) {
  .buttons-container {
    display: none;
  }
  .rounded-collapse-bottom {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius:  0.5rem;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .rounded-collapse-top {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
}

@media (min-width: 768px) {
  .rounded-collapse-bottom, .rounded-collapse-top{
    border-radius: 0.5rem;
  }
  .hide-options {
    display: none;
  }
}

</style>