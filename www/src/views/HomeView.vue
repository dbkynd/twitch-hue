<template>
  <main v-show="authorized">
    <div>HOME</div>
    <div>
      {{ user }}
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/plugins/axios'
import router from '@/router'

const authorized = ref(false)
const user = ref({})

onMounted(() => {
  api
    .get('/user')
    .then(({ data }) => {
      authorized.value = true
      user.value = data
    })
    .catch(() => {
      router.push({ name: 'splash' })
    })
})
</script>

<style scoped></style>
