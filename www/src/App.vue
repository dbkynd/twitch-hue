<template>
  <v-app theme="dark">
    <v-app-bar>
      <v-app-bar-title>
        <v-avatar :image="Logo"></v-avatar>
        Twitch Hue Connector
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Logo from '@/components/icons/logo.png'
</script>

<style scoped>
</style>
