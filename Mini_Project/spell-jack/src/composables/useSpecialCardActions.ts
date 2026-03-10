import { ref } from 'vue';
import type { Ref } from 'vue';
import { useGameStore } from '../stores/game';
import { useTelegram } from './useTelegram';
import { useCardScoring } from './useCardScoring';
import { useDeckBuilder } from './useDeckBuilder';
import type { Card, DestinyPreview } from '../types';

export function useSpecialCardActions(
  playerHand: Ref<Card[]>,
  playerScore: Ref<number>,
  currentGamePlayerDeck: Ref<Card[]>,
  dealerScore: Ref<number>,
  isGameActive: Ref<boolean>,
  isPlayerTurn: Ref<boolean>,
  showTemporaryMessage: (msg: string, duration?: number) => void,
  checkWinner: (ps: number, ds: number) => void,
) {
  const store = useGameStore();
  const { haptic } = useTelegram();
  const { calculateScore, getCardBaseValue } = useCardScoring();
  const { shuffleDeck } = useDeckBuilder();

  const isCardSelectionMode = ref(false);
  const isCriticalChoiceMode = ref(false);
  const criticalChoiceCards = ref<Card[]>([]);
  const nextCardSuit = ref<string | null>(null);
  const foresightCards = ref<Card[]>([]);
  const showSuitChoice = ref(false);
  const destinyPreview = ref<DestinyPreview | null>(null);
  const showDestinyPreview = ref(false);

  function applyGoldenTouchIfActive(card: Card): number {
    if (!store.activeEffects.goldenTouch || card.special) return 0;
    const baseValue = getCardBaseValue(card);
    const sm = card.suitMultiplierSnapshot ?? store.getSuitMultiplier(card.suit);
    const finalValue = Math.floor(baseValue * sm);
    store.addCoins(finalValue);
    store.activeEffects.goldenTouch = false;
    return finalValue;
  }

  function applyLuckySevenIfActive(card: Card): boolean {
    if (store.activeEffects.luckySeven && card.value === '7' && !card.special) {
      store.addCoins(7);
      return true;
    }
    return false;
  }

  function handleCardSwapActivate() {
    isCardSelectionMode.value = true;
  }

  function handleCardSwap(cardIndex: number) {
    if (
      !isCardSelectionMode.value ||
      !isGameActive.value ||
      currentGamePlayerDeck.value.length === 0
    )
      return;

    const newPlayerHand = [...playerHand.value];
    const newPlayerDeck = [...currentGamePlayerDeck.value];
    const cardToSwap = newPlayerHand[cardIndex];
    if (!cardToSwap) return;
    const newCard = newPlayerDeck.pop();

    if (!newCard) {
      showTemporaryMessage('Колода пуста! Обмен невозможен.', 2000);
      isCardSelectionMode.value = false;
      return;
    }

    newPlayerHand[cardIndex] = newCard;
    if (!newCard.special) newCard.suitMultiplierSnapshot = store.getSuitMultiplier(newCard.suit);
    newPlayerDeck.unshift(cardToSwap);

    playerHand.value = newPlayerHand;
    currentGamePlayerDeck.value = shuffleDeck(newPlayerDeck);
    playerScore.value = calculateScore(newPlayerHand, true);

    const goldenCoins = applyGoldenTouchIfActive(newCard);
    const gotSeven = applyLuckySevenIfActive(newCard);

    let message = `🔄 Обмен удачи! ${cardToSwap.value}${cardToSwap.suit} → ${newCard.value}${newCard.suit}`;
    if (gotSeven) message += ' (+7 монет за семёрку!)';
    if (goldenCoins > 0) message += ` (✨ +${goldenCoins} монет!)`;

    showTemporaryMessage(message, 2500);
    haptic('success');
    isCardSelectionMode.value = false;
    store.disableSwapCard();
  }

  function handleResetHand() {
    if (currentGamePlayerDeck.value.length < 2) {
      showTemporaryMessage('❌ Недостаточно карт в колоде для сброса!', 2000);
      return;
    }
    const newPlayerDeck = [...currentGamePlayerDeck.value];
    const firstCard = newPlayerDeck.pop()!;
    const secondCard = newPlayerDeck.pop()!;

    if (!firstCard.special)
      firstCard.suitMultiplierSnapshot = store.getSuitMultiplier(firstCard.suit);
    if (!secondCard.special)
      secondCard.suitMultiplierSnapshot = store.getSuitMultiplier(secondCard.suit);

    const newHand = [firstCard, secondCard];
    playerHand.value = newHand;
    currentGamePlayerDeck.value = newPlayerDeck;
    playerScore.value = calculateScore(newHand, true);

    let message = '💥 Сброс напряжения! Новая рука получена!';
    if (store.activeEffects.luckySeven) {
      const sevens = newHand.filter(c => c.value === '7' && !c.special);
      if (sevens.length > 0) {
        const coins = sevens.length * 7;
        store.addCoins(coins);
        message += ` (+${coins} монет за семёрки!)`;
      }
    }
    showTemporaryMessage(message, 2500);
    haptic('success');
  }

  function handleCriticalChoiceActivate() {
    if (currentGamePlayerDeck.value.length < 3) {
      showTemporaryMessage('❌ Недостаточно карт для критического выбора!', 2000);
      return;
    }
    criticalChoiceCards.value = currentGamePlayerDeck.value.slice(-3);
    isCriticalChoiceMode.value = true;
    showTemporaryMessage('🔍 Критический выбор: выберите одну из трех карт!');
  }

  function handleCriticalCardChoice(chosenCardIndex: number) {
    const chosenCard = criticalChoiceCards.value[chosenCardIndex];
    if (!chosenCard) return;
    const newPlayerDeck = [...currentGamePlayerDeck.value];
    newPlayerDeck.splice(-3, 3);

    if (!chosenCard.special)
      chosenCard.suitMultiplierSnapshot = store.getSuitMultiplier(chosenCard.suit);

    const newPlayerHand = [...playerHand.value, chosenCard];
    const newPlayerScore = calculateScore(newPlayerHand, true);

    playerHand.value = newPlayerHand;
    currentGamePlayerDeck.value = newPlayerDeck;
    playerScore.value = newPlayerScore;

    applyGoldenTouchIfActive(chosenCard);
    const gotSeven = applyLuckySevenIfActive(chosenCard);

    isCriticalChoiceMode.value = false;
    criticalChoiceCards.value = [];

    setTimeout(() => {
      if (newPlayerScore > store.currentTarget) {
        if (store.activeEffects.shield) {
          store.disableShield();
          showTemporaryMessage(
            `🛡️ Щит перегруза сработал! Перебор предотвращён (${newPlayerScore})`,
            2500,
          );
          haptic('success');
        } else {
          isGameActive.value = false;
          isPlayerTurn.value = false;
          checkWinner(newPlayerScore, dealerScore.value);
        }
      } else {
        let message = `🔍 Критический выбор! Получена: ${chosenCard.value}${chosenCard.suit}`;
        if (gotSeven) message += ' (+7 монет за семёрку!)';
        showTemporaryMessage(message);
        haptic('success');
      }
    }, 100);
  }

  function handleCartographerActivate() {
    if (currentGamePlayerDeck.value.length === 0) {
      showTemporaryMessage('❌ В колоде нет карт!', 2000);
      return;
    }
    const nextCard = currentGamePlayerDeck.value[currentGamePlayerDeck.value.length - 1]!;
    nextCardSuit.value = nextCard.suit;
    showTemporaryMessage(`🗺️ Картограф: следующая карта масти ${nextCard.suit}`, 5000);
    haptic('success');
    setTimeout(() => {
      nextCardSuit.value = null;
    }, 5000);
  }

  function handleLeafFallActivate() {
    if (playerHand.value.length === 0) {
      showTemporaryMessage('❌ Нет карт в руке для сброса!', 2000);
      return;
    }
    const randomIndex = Math.floor(Math.random() * playerHand.value.length);
    const droppedCard = playerHand.value[randomIndex]!;
    const newHand = playerHand.value.filter((_, i) => i !== randomIndex);

    playerHand.value = newHand;
    playerScore.value = calculateScore(newHand, true);
    store.addCoins(3);

    showTemporaryMessage(`🍃 Листопад: сброшена ${droppedCard.value}${droppedCard.suit}, +3 💰`);
    haptic('success');
  }

  function handleForesightActivate() {
    if (currentGamePlayerDeck.value.length < 2) {
      showTemporaryMessage('🔮 В колоде мало карт для предвидения!', 2000);
      return;
    }
    const deckLength = currentGamePlayerDeck.value.length;
    foresightCards.value = [
      currentGamePlayerDeck.value[deckLength - 1]!,
      currentGamePlayerDeck.value[deckLength - 2]!,
    ];
    showTemporaryMessage('🔮 Предвидение: показаны следующие 2 карты в колоде!', 2000);
    haptic('light');
    setTimeout(() => {
      foresightCards.value = [];
    }, 5000);
  }

  function handleSuitMagnetActivate() {
    showSuitChoice.value = true;
  }

  function handleSuitChoice(suitSymbol: string) {
    const result = store.applySuitMagnet(suitSymbol);
    showTemporaryMessage(result.message, result.success ? 3000 : 2000);
    showSuitChoice.value = false;
  }

  function handleDestinyActivate() {
    const nextCard = currentGamePlayerDeck.value[currentGamePlayerDeck.value.length - 1];
    if (nextCard) {
      destinyPreview.value = store.previewNextCardOutcome(
        playerHand.value,
        playerScore.value,
        nextCard,
      );
      showDestinyPreview.value = true;
    } else {
      showTemporaryMessage('🎯 В колоде нет карт для предсказания!', 2000);
    }
  }

  function handleDestinyPreviewClose() {
    showDestinyPreview.value = false;
    destinyPreview.value = null;
  }

  function resetSpecialCardState() {
    isCardSelectionMode.value = false;
    isCriticalChoiceMode.value = false;
    criticalChoiceCards.value = [];
    nextCardSuit.value = null;
    foresightCards.value = [];
    showSuitChoice.value = false;
    showDestinyPreview.value = false;
    destinyPreview.value = null;
  }

  return {
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
  };
}
