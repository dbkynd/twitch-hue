<template>
  <main v-show="authorized">
    <div>
      {{ user }}
    </div>
    <div>
      <v-btn color="blue" @click="hueLogin">Connect Phillip Hue Account</v-btn>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import api from '@/plugins/axios'
import router from '@/router'
import store from '@/store'
import { apiUrl } from '@/plugins/config'

const authorized = ref(false)
const user = computed(() => store.state.user)
const hueConnected = ref(false)

onMounted(() => {
  api
    .get('/user')
    .then(({ data }) => {
      authorized.value = true
      store.commit('setUser', data)
      checkHue()
    })
    .catch(() => {
      router.push({ name: 'splash' })
    })
})

function checkHue() {
  api.get('')
}

function hueLogin() {
  window.location.href = `${apiUrl}/api/auth/hue`
}
</script>

<style scoped></style>
