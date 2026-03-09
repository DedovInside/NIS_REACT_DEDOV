<script setup lang="ts">
import type { Card, SpecialCard } from '../types'

defineProps<{
  card: Card | SpecialCard | null
  isOpen: boolean
  canAfford?: boolean
  showBuySection?: boolean
}>()

const emit = defineEmits<{
  close: []
  buy: [card: Card | SpecialCard]
}>()

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

function getCardDescription(card: Card | SpecialCard): string {
  if (card.type === 'special') {
    return (card as SpecialCard).description || `Специальная карта с эффектом: ${card.effect ?? 'unknown'}`
  }

  const valueDescriptions: Record<string, string> = {
    A: 'Туз - может стоить 1 или 11 очков',
    K: 'Король - стоит 10 очков',
    Q: 'Дама - стоит 10 очков',
    J: 'Валет - стоит 10 очков',
  }
  const desc = valueDescriptions[card.value]
  if (desc) return desc
  return `Числовая карта достоинством ${card.value} очков`
}
</script>

<template>
  <div v-if="isOpen && card" class="modal-backdrop" @click="handleBackdropClick">
    <div class="card-modal">
      <div class="modal-header">
        <h3>Информация о карте</h3>
        <button class="modal-close" @click="emit('close')">✕</button>
      </div>

      <div class="modal-content">
        <div class="card-preview">
          <!-- Специальная карта -->
          <div v-if="card.type === 'special'" class="special-card-large">
            <div class="card-emoji-large">{{ card.value }}</div>
            <div class="card-name-large">{{ (card as SpecialCard).name }}</div>
            <div class="activation-type-large">{{ (card as SpecialCard).activationType }}</div>
          </div>
          <div
            v-else
            :class="['card-large', { 'red-card': card.suit === '♥' || card.suit === '♦' }]"
          >
            <div class="card-value-large">{{ card.value }}</div>
            <div class="card-suit-large">{{ card.suit }}</div>
          </div>
        </div>

        <div class="card-info">
          <h4>{{ card.type === 'special' ? ((card as SpecialCard).name || card.id) : `${card.value}${card.suit}` }}</h4>

          <div v-if="card.type === 'special'" class="special-info">
            <div class="activation-info">
              <strong>Тип активации:</strong> {{ (card as SpecialCard).activationType }}
            </div>
            <div class="activation-description">
              <template v-if="(card as SpecialCard).activationType === 'manual'">🖱️ Активируется вручную в игре</template>
              <template v-else-if="(card as SpecialCard).activationType === 'passive'">⚡ Срабатывает автоматически при условии</template>
              <template v-else-if="(card as SpecialCard).activationType === 'auto'">🔄 Активируется сразу при взятии карты</template>
            </div>
          </div>

          <div class="card-description">
            <strong>Описание:</strong>
            <p>{{ card.description || getCardDescription(card) }}</p>
          </div>

          <div v-if="showBuySection !== false" class="cost-section">
            <div class="card-cost-large">💰 {{ card.cost }}</div>
            <button
              :class="['buy-button-large', { disabled: !canAfford }]"
              :disabled="!canAfford"
              @click="emit('buy', card)"
            >
              {{ canAfford ? 'Купить' : 'Недостаточно монет' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>