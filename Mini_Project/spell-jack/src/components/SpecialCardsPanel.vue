<script setup lang="ts">
import { useGameStore } from '../stores/game';
import type { SpecialCard } from '../types';

const store = useGameStore();

defineProps<{
  isBlocked?: boolean;
}>();

const emit = defineEmits<{
  cardSwapActivate: [];
  resetHand: [];
  criticalChoiceActivate: [];
  cartographerActivate: [];
  leafFallActivate: [];
  foresightActivate: [];
  suitMagnetActivate: [];
  destinyActivate: [];
}>();

const passiveCards = () =>
  store.activeSpecialCards.filter(card => card.activationType === 'passive');

function handleCardActivation(cardId: string | number) {
  const card = store.manualActivationCards.find(c => c.id === cardId);
  if (!card) return;

  const effectHandlers: Record<string, string> = {
    swapCard: 'cardSwapActivate',
    resetHand: 'resetHand',
    criticalChoice: 'criticalChoiceActivate',
    showNextSuit: 'cartographerActivate',
    leafFall: 'leafFallActivate',
    foresight: 'foresightActivate',
    suitMagnet: 'suitMagnetActivate',
    destiny: 'destinyActivate',
  };

  const handler = effectHandlers[card.effect];
  if (handler) {
    (emit as (event: string) => void)(handler);
  }

  store.activateSpecialCard(cardId);
}

function getCardStatus(card: SpecialCard): string {
  const statusMap: Record<string, () => string> = {
    doubleNext: () =>
      store.activeEffects.doubleNext ? 'Готов к удвоению!' : 'Нажмите для активации',
    dealerTrap: () =>
      store.activeEffects.dealerTrap ? 'Ловушка установлена!' : 'Нажмите для активации',
    swapCard: () => (store.activeEffects.swapCard ? 'Выберите карту!' : 'Нажмите для активации'),
    resetHand: () => 'Сбросить всю руку!',
    criticalChoice: () => 'Выбрать из 3 карт!',
    showNextSuit: () => 'Показать масть!',
    leafFall: () => 'Сбросить карту +3💰!',
    foresight: () => 'Показать 2 карты!',
    stabilizer: () =>
      store.activeEffects.stabilizer ? 'Коэффициенты x1.0!' : 'Убрать случайность!',
    goldenTouch: () => (store.activeEffects.goldenTouch ? 'Готов к золоту!' : 'Монеты = очки!'),
    chronometer: () =>
      store.activeEffects.chronometer > 0
        ? `Осталось ${store.activeEffects.chronometer} карт!`
        : 'Замедлить время!',
    suitMagnet: () =>
      store.activeEffects.suitMagnetActive ? 'Выберите масть!' : 'Усилить масть +1!',
    destiny: () => 'Предсказать карту!',
  };
  return statusMap[card.effect]?.() ?? 'Нажмите для активации';
}

function getPassiveStatus(card: SpecialCard): string {
  const statusMap: Record<string, () => string> = {
    aceArmor: () => (store.activeEffects.aceArmor ? 'Дополнительная защита!' : 'Пассивный эффект'),
    shield: () => (store.activeEffects.shield ? 'Щит активен!' : 'Пассивный эффект'),
    fireAce: () => (store.activeEffects.fireAce ? 'Тузы = 12 очков!' : 'Пассивный эффект'),
    doubleBet: () => (store.activeEffects.doubleBet ? 'Двойная награда!' : 'Пассивный эффект'),
    luckySeven: () => (store.activeEffects.luckySeven ? 'Бонус за семёрки!' : 'Пассивный эффект'),
    luckySuit: () =>
      store.activeEffects.luckySuitActive
        ? `Усилена ${store.activeEffects.luckySuitActive}!`
        : 'Пассивный эффект',
    royalDecree: () =>
      store.activeEffects.royalDecree ? 'Все карты +2 очка!' : 'Пассивный эффект',
  };
  return statusMap[card.effect]?.() ?? 'Пассивный эффект';
}

function getCardClass(card: SpecialCard): string {
  const base = 'special-card-item';
  const classMap: Record<string, () => string> = {
    doubleNext: () => (store.activeEffects.doubleNext ? `${base} active-effect` : base),
    dealerTrap: () => (store.activeEffects.dealerTrap ? `${base} active-effect trap-effect` : base),
    swapCard: () => (store.activeEffects.swapCard ? `${base} active-effect swap-effect` : base),
    resetHand: () => `${base} reset-hand-effect`,
    criticalChoice: () => `${base} critical-choice-effect`,
    showNextSuit: () => `${base} cartographer-effect`,
    leafFall: () => `${base} leaf-fall-effect`,
    foresight: () => `${base} foresight-effect`,
    stabilizer: () =>
      store.activeEffects.stabilizer
        ? `${base} stabilizer-effect active`
        : `${base} stabilizer-effect`,
    goldenTouch: () =>
      store.activeEffects.goldenTouch
        ? `${base} golden-touch-effect active`
        : `${base} golden-touch-effect`,
    chronometer: () =>
      store.activeEffects.chronometer > 0
        ? `${base} chronometer-effect active`
        : `${base} chronometer-effect`,
    suitMagnet: () =>
      store.activeEffects.suitMagnetActive
        ? `${base} suit-magnet-effect active`
        : `${base} suit-magnet-effect`,
    destiny: () => `${base} destiny-effect`,
  };
  return classMap[card.effect]?.() ?? base;
}

function getPassiveCardClass(card: SpecialCard): string {
  const base = 'special-card-item passive-effect';
  const classMap: Record<string, () => string> = {
    aceArmor: () => (store.activeEffects.aceArmor ? `${base} ace-armor-effect` : base),
    shield: () => (store.activeEffects.shield ? `${base} shield-effect` : base),
    fireAce: () => (store.activeEffects.fireAce ? `${base} fire-effect` : base),
    doubleBet: () => (store.activeEffects.doubleBet ? `${base} gold-effect` : base),
    luckySeven: () => (store.activeEffects.luckySeven ? `${base} lucky-effect` : base),
    luckySuit: () => (store.activeEffects.luckySuitActive ? `${base} lucky-suit-effect` : base),
    royalDecree: () => (store.activeEffects.royalDecree ? `${base} royal-effect` : base),
  };
  return classMap[card.effect]?.() ?? base;
}
</script>

<template>
  <div
    v-if="store.manualActivationCards.length > 0 || passiveCards().length > 0"
    class="special-cards-panel"
  >
    <!-- Manual cards -->
    <template v-if="store.manualActivationCards.length > 0">
      <h3>Специальные карты</h3>
      <div class="special-cards-grid">
        <div
          v-for="card in store.manualActivationCards"
          :key="card.id"
          :class="getCardClass(card)"
          :style="{ opacity: isBlocked ? 0.5 : 1, cursor: isBlocked ? 'not-allowed' : 'pointer' }"
          @click="!isBlocked && handleCardActivation(card.id)"
        >
          <div class="card-emoji">{{ card.value }}</div>
          <div class="card-name">{{ card.name }}</div>
          <div class="activation-hint">{{ getCardStatus(card) }}</div>
        </div>
      </div>
    </template>

    <template v-if="passiveCards().length > 0">
      <h3>Пассивные эффекты</h3>
      <div class="special-cards-grid">
        <div v-for="card in passiveCards()" :key="card.id" :class="getPassiveCardClass(card)">
          <div class="card-emoji">{{ card.value }}</div>
          <div class="card-name">{{ card.name }}</div>
          <div class="activation-hint">{{ getPassiveStatus(card) }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
