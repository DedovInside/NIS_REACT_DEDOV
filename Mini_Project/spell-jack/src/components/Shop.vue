<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
import CardModal from './CardModal.vue'
import type { Card, SpecialCard } from '../types'

const store = useGameStore()

const selectedCard = ref<Card | SpecialCard | null>(null)
const isModalOpen = ref(false)

function handleCardClick(card: Card | SpecialCard) {
  selectedCard.value = card
  isModalOpen.value = true
}

function handleModalClose() {
  isModalOpen.value = false
  selectedCard.value = null
}

function handleBuy(card: Card | SpecialCard) {
  store.buyCard(card as SpecialCard)
  handleModalClose()
}

function canAffordCard(card: SpecialCard): boolean {
  return store.coins >= card.cost
}
</script>

<template>
  <div class="shop-container">
    <h2>Card Shop</h2>
    <p class="coin-balance">You have: 💰 {{ store.coins }}</p>
    <div class="card-list">
      <template v-if="store.availableCards.length > 0">
        <div v-for="card in store.availableCards" :key="card.id" class="shop-item">
          <div
            v-if="card.type === 'special'"
            class="special-card-shop"
            @click="handleCardClick(card)"
          >
            <div class="card-emoji">{{ card.value }}</div>
            <div class="card-name">{{ card.name }}</div>
            <div class="activation-type">{{ card.activationType }}</div>
          </div>
          <div
            v-else
            :class="['card', { 'red-card': card.suit === '♥' || card.suit === '♦' }]"
            @click="handleCardClick(card)"
          >
            <div class="card-value">{{ card.value }}</div>
            <div class="card-suit">{{ card.suit }}</div>
          </div>

          <div class="buy-section">
            <span class="card-cost">💰 {{ card.cost }}</span>
            <button
              :disabled="!canAffordCard(card)"
              :class="{ disabled: !canAffordCard(card) }"
              @click="handleBuy(card)"
            >
              Buy
            </button>
          </div>
        </div>
      </template>
      <p v-else class="empty-message">No cards available in the shop.</p>
    </div>

    <CardModal
      :card="selectedCard"
      :is-open="isModalOpen"
      :can-afford="selectedCard ? canAffordCard(selectedCard as SpecialCard) : false"
      @close="handleModalClose"
      @buy="handleBuy"
    />
  </div>
</template>