<template>
  <main v-show="authorized">
    <div>
      {{ user }}
    </div>
    <div>
      Phillips Hue Account:
      <v-btn v-if="!hueConnected" color="blue" @click="hueLogin">
        Connect
      </v-btn>
      <v-btn v-else color="gray" disabled>Connected</v-btn>
    </div>
    <div>
      Hue Bridge User:
      <v-btn v-if="!hueBridgeUser" color="blue" @click="createHueBridgeUser">
        Create
      </v-btn>
      <v-btn v-else color="gray" disabled>Created</v-btn>
    </div>
    <div>
      Lights:
      <div v-for="light in lights" :key="light">
        {{ light.name }}
      </div>
    </div>
    <div>
      Redemptions:
      <div v-for="redeem in redemptions" :key="redeem.id">
        <img
          :src="
            redeem.image ? redeem.image.url_1x : redeem.default_image.url_1x
          "
          alt=""
        />
        {{ redeem.title }}
      </div>
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
const hueBridgeUser = ref(false)
const lights = ref([])
const redemptions = ref([])

const sortedRedemptions = computed(() => {
  return redemptions.value.sort((a, b) => a.cost - b.cost)
})

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

async function checkHue() {
  await api.get('/hue/connected').then(({ data }) => {
    hueConnected.value = data.connected
  })
  await api.get('/hue/bridge').then(({ data }) => {
    hueBridgeUser.value = data.connected
  })
  api.get('/hue/lights').then(({ data }) => {
    lights.value = data
  })
  api.get('/twitch/redemptions').then(({ data }) => {
    redemptions.value = data
  })
}

function hueLogin() {
  window.location.href = `${apiUrl}/api/auth/hue`
}

function createHueBridgeUser() {
  api.post('/hue/user/create').then(({ data }) => {
    hueBridgeUser.value = data.user
  })
}
</script>

<style scoped></style>
