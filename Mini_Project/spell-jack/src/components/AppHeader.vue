<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useGameStore } from '../stores/game';
import { useTelegram } from '../composables/useTelegram';

const store = useGameStore();
const { user, isTelegramApp } = useTelegram();
</script>

<template>
  <nav class="header-nav">
    <div class="coin-display">💰 {{ store.coins }}</div>

    <div v-if="isTelegramApp && user" class="user-info">
      <img
        v-if="user.photo_url"
        :src="user.photo_url"
        :alt="`${user.first_name} ${user.last_name ?? ''}`"
        class="user-avatar"
      />
      <span class="user-name">{{ user.first_name }}</span>
    </div>

    <div class="nav-links">
      <RouterLink to="/" class="nav-link">Play</RouterLink>
      <RouterLink to="/shop" class="nav-link">Shop</RouterLink>
      <RouterLink to="/deck-editor" class="nav-link">Deck</RouterLink>
    </div>
  </nav>
</template>
