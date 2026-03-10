<script setup lang="ts">
import { useGameStore } from '../stores/game';

const store = useGameStore();

defineProps<{
  isGameActive: boolean;
}>();

const emit = defineEmits<{
  hit: [];
  stand: [];
  newGame: [];
}>();
</script>

<template>
  <div class="controls-container">
    <template v-if="isGameActive">
      <div class="control-button-wrapper">
        <button
          :class="['control-button', { 'double-next-ready': store.activeEffects.doubleNext }]"
          @click="emit('hit')"
        >
          Get Card
          <span v-if="store.activeEffects.doubleNext" class="double-next-badge">⚡ x2!</span>
        </button>
      </div>
      <button class="control-button" @click="emit('stand')">Enough</button>
    </template>
    <button v-else class="new-game-button" @click="emit('newGame')">New Game</button>
  </div>
</template>
