<script setup lang="ts">
import type {Card} from '../types'

defineProps<{
  visible: boolean
  deck: Card[]
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div :class="['actual-deck-overlay', { open: visible }]" @click="emit('close')">
    <div class="actual-deck-panel" @click.stop>
      <div class="deck-header">
        <div class="deck-title-wrap">
          <h3 class="deck-title">Current deck</h3>
          <span class="deck-subtitle">{{ deck.length }} cards</span>
        </div>
        <button class="deck-close" @click="emit('close')">Close</button>
      </div>

      <div class="deck-grid">
        <div
            v-for="card in deck"
            :key="card.id"
            :class="[
            'card-tile',
            { red: card.suit === '♥' || card.suit === '♦' },
            { special: card.special },
          ]"
            :title="`${card.value}${card.suit}`"
        >
          <span class="tile-value">{{ card.value }}</span>
          <span class="tile-suit">{{ card.suit }}</span>
        </div>
        <div v-if="deck.length === 0" class="deck-empty">Колода пуста</div>
      </div>
    </div>
  </div>
</template>