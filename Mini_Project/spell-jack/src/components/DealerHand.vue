<script setup lang="ts">
import type { Card } from '../types';
import { useGameStore } from '../stores/game';

const store = useGameStore();

defineProps<{
  hand: Card[];
  score: number;
  showFirstCard: boolean;
}>();

function getHandContainerClass(cardCount: number): string {
  if (cardCount >= 12) return 'hand-container many-cards';
  if (cardCount >= 8) return 'hand-container medium-cards';
  return 'hand-container';
}
</script>

<template>
  <div :class="['dealer-container', { 'trap-active': store.activeEffects.dealerTrap }]">
    <h2>
      Dealer ({{ showFirstCard ? '?' : score }})
      <span v-if="store.activeEffects.dealerTrap" class="trap-indicator">🪤</span>
    </h2>
    <div :class="getHandContainerClass(hand.length)">
      <template v-for="(card, index) in hand" :key="index">
        <div v-if="showFirstCard && index === 0" class="card back-card">?</div>
        <div v-else :class="['card', { 'red-card': card.suit === '♥' || card.suit === '♦' }]">
          <div class="card-value">{{ card.value }}</div>
          <div class="card-suit">{{ card.suit }}</div>
        </div>
      </template>
    </div>
  </div>
</template>
