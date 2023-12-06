<template>
  <nav class="bg-secondary text-white p-4">
    <div class="container mx-auto flex items-center justify-between">
      <a class="text-xl" href="#">Donaciones</a>
      <div>
        <div class="px-3 py-2 rounded-md" @click="handleLogout"><span class="material-icons">logout</span></div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAccessAuthStore } from "@/config/stores/auth";

const router = useRouter();
const authStore = useAccessAuthStore();

let userLogged = ref(null);
userLogged = authStore.userLogged;

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push({ name: "Login"});
  } catch (error) {
    console.log("Error", error);
  }
};
</script>
