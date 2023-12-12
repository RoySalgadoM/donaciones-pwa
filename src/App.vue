<script setup>
import { RouterView } from "vue-router";
import { notify } from "../src/kernel/components/notify";
import { provide } from "vue";
provide("showMsg", notify.show);

</script>

<template>
  <RouterView />
</template>
