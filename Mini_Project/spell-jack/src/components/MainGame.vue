<script setup lang="ts">
import { watch, onUnmounted, ref } from 'vue';
import { useGameStore } from '../stores/game';
import { useTelegram } from '../composables/useTelegram';
import { useGameLoop } from '../composables/useGameLoop';
import { useSpecialCardActions } from '../composables/useSpecialCardActions';
import PlayerHand from './PlayerHand.vue';
import DealerHand from './DealerHand.vue';
import GameControls from './GameControls.vue';
import ActualDeckControl from './ActualDeckControl.vue';
import SpecialCardsPanel from './SpecialCardsPanel.vue';

const store = useGameStore();
const { shareScore } = useTelegram();

function showTemporaryMessage(msg: string, duration = 3000) {
  winner.value = msg;
  setTimeout(() => {
    if (winner.value === msg) winner.value = '';
  }, duration);
}

const {
  currentGamePlayerDeck,
  playerHand,
  dealerHand,
  playerScore,
  dealerScore,
  isPlayerTurn,
  winner,
  isGameActive,
  isAnimating,
  checkWinner,
  startNewGame: startNewGameBase,
  handleHit: handleHitBase,
  handleStand,
} = useGameLoop(showTemporaryMessage);

const {
  isCardSelectionMode,
  isCriticalChoiceMode,
  criticalChoiceCards,
  nextCardSuit,
  foresightCards,
  showSuitChoice,
  destinyPreview,
  showDestinyPreview,
  handleCardSwapActivate,
  handleCardSwap,
  handleResetHand,
  handleCriticalChoiceActivate,
  handleCriticalCardChoice,
  handleCartographerActivate,
  handleLeafFallActivate,
  handleForesightActivate,
  handleSuitMagnetActivate,
  handleSuitChoice,
  handleDestinyActivate,
  handleDestinyPreviewClose,
  resetSpecialCardState,
} = useSpecialCardActions(
  playerHand,
  playerScore,
  currentGamePlayerDeck,
  dealerScore,
  isGameActive,
  isPlayerTurn,
  showTemporaryMessage,
  checkWinner,
);

// Оборачиваем startNewGame, чтобы передать сброс UI-состояний
function startNewGame() {
  startNewGameBase(resetSpecialCardState);
}

// Оборачиваем handleHit, передавая реактивные ссылки на UI-состояния
function handleHit() {
  handleHitBase(currentGamePlayerDeck, showSuitChoice, destinyPreview, showDestinyPreview);
}

const showDeck = ref(false);

function handleEscKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && showDeck.value) showDeck.value = false;
}

watch(showDeck, val => {
  if (val) window.addEventListener('keydown', handleEscKey);
  else window.removeEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey);
});
</script>

<template>
  <div class="main-game">
    <h1 class="header">SpellJack</h1>

    <ActualDeckControl
      :visible="showDeck"
      :deck="currentGamePlayerDeck"
      @close="showDeck = false"
    />

    <div class="game-info">
      <div class="game-target">
        <h3>Target Score: {{ store.currentTarget }}</h3>
        <div v-if="store.activeEffects.doubleBet" class="double-bet-indicator">
          💰 Двойная ставка активна! x2 награда за победу!
        </div>
      </div>
      <div class="suit-multipliers">
        <h4>Suit Multipliers:</h4>
        <div class="multipliers-table">
          <div
            v-for="suit in ['♠', '♥', '♦', '♣']"
            :key="suit"
            :class="[
              'multiplier-item',
              { 'lucky-suit-boosted': store.activeEffects.luckySuitActive === suit },
            ]"
          >
            <span :class="['suit-symbol', { 'red-suit': suit === '♥' || suit === '♦' }]">{{
              suit
            }}</span>
            <span class="multiplier-value">x{{ store.getSuitMultiplier(suit) }}</span>
          </div>
        </div>

        <div v-if="store.activeEffects.stabilizer" class="stabilizer-indicator">
          ⚖️ Стабилизатор активен - коэффициенты x1.0
        </div>
        <div v-if="store.activeEffects.goldenTouch" class="golden-touch-indicator">
          ✨ Золотое касание готово - следующая карта даст монеты!
        </div>
      </div>
    </div>

    <DealerHand
      :hand="dealerHand"
      :score="dealerScore"
      :show-first-card="isPlayerTurn && !store.activeEffects.revealDealerCard"
    />

    <div v-if="isCriticalChoiceMode" class="critical-choice-panel">
      <h3>🔍 Критический выбор - выберите одну карту:</h3>
      <div class="critical-choice-cards">
        <div
          v-for="(card, index) in criticalChoiceCards"
          :key="index"
          :class="[
            'card',
            'critical-choice-card',
            { 'red-card': card.suit === '♥' || card.suit === '♦' },
          ]"
          @click="handleCriticalCardChoice(index)"
        >
          <div class="card-value">{{ card.value }}</div>
          <div class="card-suit">{{ card.suit }}</div>
          <div class="choice-indicator">Выбрать</div>
        </div>
      </div>
    </div>

    <div v-if="showSuitChoice" class="suit-choice-panel">
      <h3>🧲 Магнит мастей - выберите масть для усиления:</h3>
      <div class="suit-choice-options">
        <div
          v-for="suit in ['♥', '♦', '♣', '♠']"
          :key="suit"
          :class="['suit-choice-option', suit === '♥' || suit === '♦' ? 'red-suit' : 'black-suit']"
          @click="handleSuitChoice(suit)"
        >
          <div class="suit-symbol">{{ suit }}</div>
          <div class="suit-name">
            {{ suit === '♥' ? 'Червы' : suit === '♦' ? 'Бубны' : suit === '♣' ? 'Трефы' : 'Пики' }}
          </div>
          <div class="current-multiplier">x{{ store.getSuitMultiplier(suit) }}</div>
        </div>
      </div>
    </div>

    <div v-if="showDestinyPreview && destinyPreview" class="destiny-preview-panel">
      <h3>🔮 Карта судьбы - предсказание будущего:</h3>
      <div class="destiny-preview-content">
        <div class="predicted-card">
          <div
            :class="[
              'card',
              {
                'red-card':
                  destinyPreview.nextCard.suit === '♥' || destinyPreview.nextCard.suit === '♦',
              },
            ]"
          >
            <div class="card-value">{{ destinyPreview.nextCard.value }}</div>
            <div class="card-suit">{{ destinyPreview.nextCard.suit }}</div>
          </div>
          <div class="card-info">
            <div>Следующая карта</div>
            <div class="card-name">{{ destinyPreview.nextCard.name }}</div>
          </div>
        </div>
        <div class="prediction-results">
          <div class="prediction-item">
            <span>Текущие очки:</span>
            <span class="current-score">{{ destinyPreview.currentScore }}</span>
          </div>
          <div class="prediction-item main-prediction">
            <span>Предсказанные очки:</span>
            <span class="predicted-score">{{ destinyPreview.predictedScore }}</span>
          </div>
          <div class="prediction-item">
            <span>Изменение:</span>
            <span
              :class="['score-change', destinyPreview.scoreChange >= 0 ? 'positive' : 'negative']"
            >
              {{ destinyPreview.scoreChange >= 0 ? '+' : '' }}{{ destinyPreview.scoreChange }}
            </span>
          </div>
        </div>
        <div class="destiny-actions">
          <button class="destiny-close-btn" @click="handleDestinyPreviewClose">Понятно</button>
        </div>
      </div>
    </div>

    <div class="game-area">
      <div
        :class="['deck-stack', { 'animate-deal': isAnimating }]"
        role="button"
        tabindex="0"
        aria-label="Show current deck"
        title="Показать текущую колоду"
        style="cursor: pointer"
        @click="showDeck = true"
        @keydown.enter="showDeck = true"
        @keydown.space="showDeck = true"
      >
        <div class="card back-card">?</div>
        <div v-if="nextCardSuit" class="next-card-suit-indicator">🗺️ {{ nextCardSuit }}</div>
      </div>

      <div v-if="winner" class="winner-section">
        <h2 class="winner-message">{{ winner }}</h2>
        <button
          v-if="winner.includes('Player wins!')"
          class="share-button"
          title="Поделиться результатом"
          @click="shareScore(playerScore)"
        >
          📤 Поделиться
        </button>
      </div>

      <div v-if="foresightCards.length > 0" class="foresight-section">
        <h3>🔮 Следующие карты в колоде:</h3>
        <div class="foresight-cards">
          <div
            v-for="(card, index) in foresightCards"
            :key="`foresight-${index}`"
            :class="['foresight-card', { 'red-card': card.suit === '♥' || card.suit === '♦' }]"
          >
            <div class="card-value">{{ card.value }}</div>
            <div class="card-suit">{{ card.suit }}</div>
            <div class="card-order">{{ index + 1 }}</div>
          </div>
        </div>
      </div>

      <PlayerHand
        :hand="playerHand"
        :score="playerScore"
        :is-card-selection-mode="isCardSelectionMode"
        @card-swap="handleCardSwap"
      />
    </div>

    <SpecialCardsPanel
      :is-blocked="isCriticalChoiceMode"
      @card-swap-activate="handleCardSwapActivate"
      @reset-hand="handleResetHand"
      @critical-choice-activate="handleCriticalChoiceActivate"
      @cartographer-activate="handleCartographerActivate"
      @leaf-fall-activate="handleLeafFallActivate"
      @foresight-activate="handleForesightActivate"
      @suit-magnet-activate="handleSuitMagnetActivate"
      @destiny-activate="handleDestinyActivate"
    />

    <GameControls
      :is-game-active="isGameActive && isPlayerTurn && !isCriticalChoiceMode"
      @hit="handleHit"
      @stand="handleStand"
      @new-game="startNewGame"
    />
  </div>
</template>
