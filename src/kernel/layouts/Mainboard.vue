<template>
  <div class="flex flex-col h-screen">
    <Navbar />
    <div class="flex flex-grow">
      <Sidebar :isExpanded="isExpanded" @toggle="isExpanded = !isExpanded" />
      <main :class="isExpanded ? 'ml-30' : 'ml-2'" class="flex-grow transition-margin duration-300 ease-in-out overflow-auto">
        <RouterView />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from "@/kernel/layouts/navigation/Navbar.vue";
import Sidebar from "@/kernel/layouts/navigation/Sidebar.vue";
import Footer from "@/kernel/layouts/navigation/Footer.vue";

const isExpanded = ref(true);
</script>

