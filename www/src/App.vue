<template>
  <v-app theme="dark">
    <v-app-bar>
      <v-avatar class="ml-2" :image="Logo"></v-avatar>
      <v-app-bar-title> Twitch Hue Connector </v-app-bar-title>
      <v-spacer />
      <v-avatar
        v-if="user"
        class="mr-2"
        :image="user.profile_image_url"
      ></v-avatar>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Logo from '@/components/icons/logo.png'
import { computed } from 'vue'
import store from '@/store'

const user = computed(() => store.state.user)
</script>

<style scoped></style>
