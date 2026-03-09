<script setup lang="ts">
import { ref, computed } from 'vue'
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

const cardsNotInDeck = computed(() =>
  store.playerOwnedCards.filter(
    (card) => !store.playerDeck.some((deckCard) => deckCard.id === card.id)
  )
)

const regularCardsNotInDeck = computed(() =>
  cardsNotInDeck.value.filter((card) => !card.type || card.type !== 'special')
)

const availableSpecialCards = computed(() =>
  store.playerOwnedCards.filter(
    (card) =>
      card.type === 'special' &&
      !store.activeSpecialCards.some((ac) => ac.id === card.id)
  )
)

const shortNames: Record<string, string> = {
  'Открытый взгляд': 'Взгляд',
  'Щит перегруза': 'Щит',
  'Двойной удар': 'x2 Удар',
  'Карта-ловушка': 'Ловушка',
  'Обмен удачи': 'Обмен',
  'Тузовая броня': 'Броня',
  'Сброс напряжения': 'Сброс',
  'Критический выбор': 'Выбор',
  'Двойная ставка': 'x2 Ставка',
  'Картограф': 'Карта',
  'Огненный туз': 'Огонь',
  'Счастливая семёрка': 'Семёрка',
  'Листопад': 'Лист',
  'Масть удачи': 'Удача',
  'Карта предвидения': 'Видение',
  'Стабилизатор': 'Стабил.',
  'Золотое касание': 'Золото',
  'Хронометр': 'Время',
  'Магнит мастей': 'Магнит',
  'Карта судьбы': 'Судьба',
  'Королевский указ': 'Указ',
}

function getShortName(name: string): string {
  return shortNames[name] || name
}

function addSpecialCard(card: Card) {
  if (store.activeSpecialCards.length >= 3) {
    alert('Максимум 3 специальные карты в колоде!')
    return
  }
  store.addSpecialCardToDeck(card as SpecialCard)
}
</script>

<template>
  <div class="deck-editor-container">
    <h2>Deck Editor</h2>
    <p>Build your deck for the game (cards: {{ store.playerDeck.length }}/52)</p>

    <div class="deck-section">
      <h3>My Deck</h3>
      <div class="deck-cards">
        <template v-if="store.playerDeck.length > 0">
          <div v-for="card in store.playerDeck" :key="card.id" class="deck-card">
            <div
              :class="['card', { 'red-card': card.suit === '♥' || card.suit === '♦' }, { 'special-card': card.special }]"
              style="cursor: pointer"
              title="Нажмите для просмотра информации"
              @click="handleCardClick(card)"
            >
              <div class="card-value">{{ card.value }}</div>
              <div class="card-suit">{{ card.suit }}</div>
            </div>
            <button class="remove-card-button" @click="store.removeCardFromDeck(card.id)">-</button>
          </div>
        </template>
        <p v-else class="empty-message">Deck is empty</p>
      </div>
    </div>

    <div class="deck-section">
      <h3>Специальные карты ({{ store.activeSpecialCards.length }}/3)</h3>
      <div class="deck-cards">
        <template v-if="store.activeSpecialCards.length > 0">
          <div v-for="card in store.activeSpecialCards" :key="card.id" class="deck-card">
            <div
              class="card special-card"
              style="cursor: pointer"
              title="Нажмите для просмотра информации"
              @click="handleCardClick(card)"
            >
              <div class="card-value">{{ card.value }}</div>
              <div class="card-suit">{{ getShortName(card.name) }}</div>
            </div>
            <button class="remove-card-button" @click="store.removeSpecialCardFromDeck(card.id)">-</button>
          </div>
        </template>
        <p v-else class="empty-message">Нет активных специальных карт</p>
      </div>
    </div>

    <div class="collection-section">
      <h3>All My Cards</h3>
      <div class="collection-cards">
        <template v-if="regularCardsNotInDeck.length > 0">
          <div v-for="card in regularCardsNotInDeck" :key="card.id" class="deck-card">
            <div
              :class="['card', { 'red-card': card.suit === '♥' || card.suit === '♦' }]"
              style="cursor: pointer"
              title="Нажмите для просмотра информации"
              @click="handleCardClick(card)"
            >
              <div class="card-value">{{ card.value }}</div>
              <div class="card-suit">{{ card.suit }}</div>
            </div>
            <button class="add-card-button" @click="store.addCardToDeck(card)">+</button>
          </div>
        </template>
        <p v-else class="empty-message">All your cards are in the deck!</p>
      </div>
    </div>

    <div class="collection-section">
      <h3>Доступные специальные карты</h3>
      <div class="collection-cards">
        <template v-if="availableSpecialCards.length > 0">
          <div v-for="card in availableSpecialCards" :key="card.id" class="deck-card">
            <div
              class="card special-card"
              style="cursor: pointer"
              title="Нажмите для просмотра информации"
              @click="handleCardClick(card)"
            >
              <div class="card-value">{{ card.value }}</div>
              <div class="card-suit">{{ getShortName((card as SpecialCard).name) }}</div>
            </div>
            <button class="add-card-button" @click="addSpecialCard(card)">+</button>
          </div>
        </template>
        <p v-else class="empty-message">Все специальные карты уже в колоде!</p>
      </div>
    </div>

    <CardModal
      :card="selectedCard"
      :is-open="isModalOpen"
      :show-buy-section="false"
      @close="handleModalClose"
    />
  </div>
</template>