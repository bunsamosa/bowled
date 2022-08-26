<script setup lang="ts">
import HomeRenderer from "@/components/home/HomeRenderer.vue"
import LoginComponent from "@/components/home/LoginComponent.vue"
</script>

<template>
  <v-parallax :scale=1 src="images/background.jpg" class="h-screen">
    <LoginComponent />
    <HomeRenderer />
  </v-parallax>
</template>

<style>
</style>
