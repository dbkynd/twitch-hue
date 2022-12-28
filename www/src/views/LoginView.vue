<template>
  <main>
    <div>
      <button @click="twitch">
        Login to Twitch
      </button>
      <button @click="hue">
        Login to Hue
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
// import { apiUrl } from '@/config'
const apiUrl = 'http://localhost:3000'

function twitch() {
  window.location.href = `${apiUrl}/auth/twitch`
}

function hue() {
  window.location.href = `${apiUrl}/auth/hue`
}
</script>
