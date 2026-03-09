<script setup lang="ts">
import type { Card } from '../types'
import { useGameStore } from '../stores/game'

const store = useGameStore()

defineProps<{
  hand: Card[]
  score: number
  isCardSelectionMode: boolean
}>()

const emit = defineEmits<{
  cardSwap: [index: number]
}>()

function getHandContainerClass(cardCount: number): string {
  if (cardCount >= 12) return 'hand-container many-cards'
  if (cardCount >= 8) return 'hand-container medium-cards'
  return 'hand-container'
}

function getCardBonusInfo(card: Card) {
  if (card.special) return { suitMultiplier: 1.0, bonusPoints: 0 }

  const suitMultiplier = card.suitMultiplierSnapshot ?? store.getSuitMultiplier(card.suit)

  let baseValue: number
  if (['J', 'Q', 'K'].includes(card.value)) {
    baseValue = 10
  } else if (card.value === 'A') {
    baseValue = store.activeEffects.fireAce ? 12 : 11
  } else {
    baseValue = parseInt(card.value)
  }

  const bonusPoints = Math.floor(baseValue * suitMultiplier) - baseValue
  return { suitMultiplier, bonusPoints }
}
</script>

<template>
  <div class="player-container">
    <h2>
      Player ({{ score }})
      <span v-if="store.activeEffects.aceArmor" class="ace-armor-indicator"> 🛡️ Туз-броня</span>
      <span v-if="store.activeEffects.fireAce" class="fire-ace-indicator"> 🔥 Огненный туз</span>
      <span v-if="store.activeEffects.luckySeven" class="lucky-seven-indicator"> 🍀 Счастливая семёрка</span>
      <span v-if="store.activeEffects.chronometer > 0" class="chronometer-indicator"> ⏰ Хронометр ({{ store.activeEffects.chronometer }})</span>
      <span v-if="store.activeEffects.royalDecree" class="royal-decree-indicator"> 👑 Королевский указ (+2 к каждой карте)</span>
      <span v-if="isCardSelectionMode" class="selection-hint"> - Выберите карту для обмена</span>
    </h2>
    <div :class="getHandContainerClass(hand.length)">
      <div
        v-for="(card, index) in hand"
        :key="index"
        :class="[
          'card',
          { 'red-card': card.suit === '♥' || card.suit === '♦' },
          { 'bonus-card': getCardBonusInfo(card).suitMultiplier > 1.0 },
          { 'selectable-card': isCardSelectionMode },
          { 'ace-armor-card': card.value === 'A' && store.activeEffects.aceArmor },
          { 'fire-ace-card': card.value === 'A' && store.activeEffects.fireAce },
          { 'lucky-seven-card': card.value === '7' && store.activeEffects.luckySeven },
          { 'chronometer-card': card.chronometerEffect },
        ]"
        :style="{ cursor: isCardSelectionMode ? 'pointer' : 'default' }"
        @click="isCardSelectionMode ? emit('cardSwap', index) : undefined"
      >
        <div class="card-value">{{ card.value }}</div>
        <div class="card-suit">{{ card.suit }}</div>

        <div v-if="getCardBonusInfo(card).suitMultiplier > 1.0" class="bonus-indicator">
          x{{ getCardBonusInfo(card).suitMultiplier }} (+{{ getCardBonusInfo(card).bonusPoints }})
        </div>
        <div v-if="card.value === 'A' && store.activeEffects.aceArmor" class="ace-armor-badge">🛡️</div>
        <div v-if="card.value === 'A' && store.activeEffects.fireAce" class="fire-ace-badge">🔥</div>
        <div v-if="card.value === '7' && store.activeEffects.luckySeven" class="lucky-seven-badge">🍀</div>
        <div v-if="card.chronometerEffect" class="chronometer-badge">⏰ ½</div>
        <div v-if="isCardSelectionMode" class="swap-indicator">🔄</div>
      </div>
    </div>
  </div>
</template>