<template>
  <header>
    A bridge between Twitch and Hue lights, this app will let you trigger
    lighting events from things such as channel point redemptions.
  </header>
  <div>
    <v-btn color="#6441a5" @click="twitch"> Login via Twitch </v-btn>
  </div>
</template>

<script setup lang="ts">
// import { apiUrl } from '@/config'
const apiUrl = 'http://localhost:3000'

function twitch() {
  window.location.href = `${apiUrl}/api/auth/twitch`
}
</script>
