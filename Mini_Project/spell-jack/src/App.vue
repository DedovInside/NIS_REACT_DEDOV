<script setup lang="ts">
import { onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import { useTelegram } from './composables/useTelegram';

const { isTelegramApp, haptic } = useTelegram();

onMounted(() => {
  if (isTelegramApp.value) {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    haptic('light');
  }
});
</script>

<template>
  <div :class="['app', { 'tg-app': isTelegramApp }]">
    <AppHeader />
    <RouterView />
  </div>
</template>
