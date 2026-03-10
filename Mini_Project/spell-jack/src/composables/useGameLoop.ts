import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { useGameStore } from '../stores/game';
import { useTelegram } from './useTelegram';
import { useCardScoring } from './useCardScoring';
import { useDeckBuilder } from './useDeckBuilder';
import type { Card } from '../types';

export function useGameLoop(showTemporaryMessage: (msg: string, duration?: number) => void) {
  const store = useGameStore();
  const { haptic } = useTelegram();
  const { calculateScore, calculateCardDoubleBonus, getCardBaseValue } = useCardScoring();
  const { createPlayerDeck, createDealerDeck } = useDeckBuilder();

  const dealerDeck = ref<Card[]>([]);
  const currentGamePlayerDeck = ref<Card[]>([]);
  const playerHand = ref<Card[]>([]);
  const dealerHand = ref<Card[]>([]);
  const playerScore = ref(0);
  const dealerScore = ref(0);
  const isPlayerTurn = ref(true);
  const winner = ref('');
  const isGameActive = ref(false);
  const isAnimating = ref(false);

  function drawFromPlayerDeck(): Card | null {
    const deck = [...currentGamePlayerDeck.value];
    const card = deck.pop() ?? null;
    currentGamePlayerDeck.value = deck;
    return card;
  }

  function checkWinner(finalPlayerScore: number, finalDealerScore: number) {
    const target = store.currentTarget;
    let coinReward = 10;
    if (store.activeEffects.doubleBet) coinReward *= 2;

    if (finalPlayerScore > target) {
      winner.value = 'Dealer wins!';
      haptic('error');
    } else if (finalDealerScore > target) {
      winner.value = store.activeEffects.doubleBet
        ? `Player wins! +${coinReward} монет (x2 бонус!)`
        : 'Player wins!';
      store.addCoins(coinReward);
      haptic('success');
    } else if (finalPlayerScore === finalDealerScore) {
      winner.value = 'Push!';
      haptic('light');
    } else if (finalPlayerScore > finalDealerScore) {
      winner.value = store.activeEffects.doubleBet
        ? `Player wins! +${coinReward} монет (x2 бонус!)`
        : 'Player wins!';
      store.addCoins(coinReward);
      haptic('success');
    } else {
      winner.value = 'Dealer wins!';
      haptic('error');
    }

    isGameActive.value = false;
  }

  function handleDealerTurn() {
    const newDealerDeck = [...dealerDeck.value];
    const newDealerHand = [...dealerHand.value];
    let newDealerScore = calculateScore(newDealerHand, false);

    const target = store.currentTarget;
    const dealerThreshold = target <= 30 ? 17 : Math.floor(target * 0.85);

    while (
      newDealerScore < dealerThreshold &&
      newDealerScore < target &&
      newDealerDeck.length > 0
    ) {
      newDealerHand.push(newDealerDeck.pop()!);
      newDealerScore = calculateScore(newDealerHand, false);
    }

    if (store.activeEffects.dealerTrap && newDealerDeck.length > 0) {
      newDealerHand.push(newDealerDeck.pop()!);
      newDealerScore = calculateScore(newDealerHand, false);
      showTemporaryMessage('🪤 Карта-ловушка! Дилер вынужден взять дополнительную карту...');
      haptic('success');
      store.disableDealerTrap();

      dealerDeck.value = newDealerDeck;
      dealerHand.value = newDealerHand;
      dealerScore.value = newDealerScore;

      setTimeout(() => {
        winner.value = '';
        checkWinner(playerScore.value, newDealerScore);
      }, 3000);
      return;
    }

    dealerDeck.value = newDealerDeck;
    dealerHand.value = newDealerHand;
    dealerScore.value = newDealerScore;
    checkWinner(playerScore.value, newDealerScore);
  }

  watch(isPlayerTurn, val => {
    if (!val && isGameActive.value) handleDealerTurn();
  });

  function startNewGame(resetSpecialCardState: () => void) {
    store.resetGameEffects();

    const shuffledPlayerDeck = createPlayerDeck(store.playerDeck);
    const shuffledDealerDeck = createDealerDeck();

    store.generateNewTarget();
    store.generateSuitMultipliers();
    store.checkPassiveEffects('gameStart');

    if (shuffledPlayerDeck.length < 2 || shuffledDealerDeck.length < 2) {
      winner.value = 'Not enough cards in the deck to play! Add more cards in Deck Editor.';
      isGameActive.value = false;
      return;
    }

    const gameDeck = [...shuffledPlayerDeck];
    const firstCard = gameDeck.pop()!;
    const secondCard = gameDeck.pop()!;

    if (!firstCard.special)
      firstCard.suitMultiplierSnapshot = store.getSuitMultiplier(firstCard.suit);
    if (!secondCard.special)
      secondCard.suitMultiplierSnapshot = store.getSuitMultiplier(secondCard.suit);

    const newPlayerHand = [firstCard, secondCard];
    const newDealerHand = [shuffledDealerDeck.pop()!, shuffledDealerDeck.pop()!];

    currentGamePlayerDeck.value = gameDeck;
    dealerDeck.value = shuffledDealerDeck;
    playerHand.value = newPlayerHand;
    dealerHand.value = newDealerHand;

    const initialPlayerScore = calculateScore(newPlayerHand, true);
    const initialDealerScore = calculateScore(newDealerHand, false);

    if (initialPlayerScore >= store.currentTarget) {
      store.currentTarget = initialPlayerScore + Math.floor(Math.random() * 21) + 10;
    }
    if (initialDealerScore >= store.currentTarget) {
      store.currentTarget =
        Math.max(initialPlayerScore, initialDealerScore) + Math.floor(Math.random() * 21) + 10;
    }

    playerScore.value = initialPlayerScore;
    dealerScore.value = initialDealerScore;
    isPlayerTurn.value = true;
    winner.value = '';
    isGameActive.value = true;

    if (store.activeEffects.luckySeven) {
      const initialSevens = newPlayerHand.filter(c => c.value === '7' && !c.special);
      if (initialSevens.length > 0) {
        const coinsEarned = initialSevens.length * 7;
        store.addCoins(coinsEarned);
        showTemporaryMessage(
          `🍀 Счастливая семёрка! Начальные семёрки дали +${coinsEarned} монет!`,
        );
        haptic('success');
      }
    }

    resetSpecialCardState();
  }

  function handleHit(
    currentGameDeck: Ref<Card[]>,
    showSuitChoice: Ref<boolean>,
    destinyPreview: Ref<unknown>,
    showDestinyPreview: Ref<boolean>,
  ) {
    if (!isGameActive.value || !isPlayerTurn.value || isAnimating.value) return;

    isAnimating.value = true;
    store.applyAutoEffects();

    setTimeout(() => {
      const newCard = drawFromPlayerDeck();
      if (!newCard) {
        isAnimating.value = false;
        return;
      }

      if (newCard.special) {
        const result = store.applyCardEffect(newCard.effect!) as
          | Record<string, unknown>
          | undefined;
        if (result?.requiresSuitChoice) showSuitChoice.value = true;
        if (result?.requiresDestinyPreview) {
          const next = currentGameDeck.value[currentGameDeck.value.length - 1];
          if (next) {
            destinyPreview.value = store.previewNextCardOutcome(
              playerHand.value,
              playerScore.value,
              next,
            );
            showDestinyPreview.value = true;
          }
        }
      }

      if (!newCard.special) {
        newCard.suitMultiplierSnapshot = store.getSuitMultiplier(newCard.suit);
        if (store.activeEffects.chronometer > 0) newCard.chronometerEffect = true;
      }

      const newPlayerHand = [...playerHand.value, newCard];
      let newPlayerScore = calculateScore(newPlayerHand, true);

      if (store.activeEffects.doubleNext && !newCard.special) {
        const bonus = calculateCardDoubleBonus(newCard);
        newPlayerScore += bonus;
        showTemporaryMessage(
          `⚡ Двойной удар! ${newCard.value}${newCard.suit} дает +${bonus} бонусных очков!`,
        );
        haptic('success');
        store.activeEffects.doubleNext = false;
      }

      if (store.activeEffects.goldenTouch && !newCard.special) {
        const baseValue = getCardBaseValue(newCard);
        const sm = newCard.suitMultiplierSnapshot ?? store.getSuitMultiplier(newCard.suit);
        const finalValue = Math.floor(baseValue * sm);
        store.addCoins(finalValue);
        showTemporaryMessage(
          `✨ Золотое касание! ${newCard.value}${newCard.suit} дает +${finalValue} монет!`,
        );
        haptic('success');
        store.activeEffects.goldenTouch = false;
      }

      if (store.activeEffects.luckySeven && newCard.value === '7' && !newCard.special) {
        store.addCoins(7);
        showTemporaryMessage(
          `🍀 Счастливая семёрка! Получено +7 монет за ${newCard.value}${newCard.suit}!`,
        );
        haptic('success');
      }

      if (newPlayerScore > store.currentTarget && store.activeEffects.shield) {
        newPlayerHand.pop();
        newPlayerScore = calculateScore(newPlayerHand, true);
        store.activeEffects.shield = false;
        showTemporaryMessage('🛡️ Щит сработал! Последняя карта сброшена. Игра продолжается...');
        haptic('success');
        playerHand.value = newPlayerHand;
        playerScore.value = newPlayerScore;
        isAnimating.value = false;
        return;
      }

      if (store.activeEffects.extraCard) {
        const extraCard = drawFromPlayerDeck();
        if (extraCard) {
          if (extraCard.special) store.applyCardEffect(extraCard.effect!);
          newPlayerHand.push(extraCard);
          newPlayerScore = calculateScore(newPlayerHand, true);
        }
        store.activeEffects.extraCard = false;
      }

      if (store.activeEffects.chronometer > 0 && !newCard.special) {
        store.activeEffects.chronometer--;
        if (store.activeEffects.chronometer === 0) {
          showTemporaryMessage('⏰ Хронометр отключён! Карты снова дают полные очки.', 2000);
          haptic('light');
        }
      }

      playerHand.value = newPlayerHand;
      playerScore.value = newPlayerScore;
      isAnimating.value = false;

      if (newPlayerScore >= store.currentTarget) {
        isPlayerTurn.value = false;
        if (newPlayerScore === store.currentTarget) {
          let perfectReward = 20;
          if (store.activeEffects.doubleBet) perfectReward *= 2;
          winner.value = store.activeEffects.doubleBet
            ? `Perfect! Player wins! +${perfectReward} монет (x2 бонус!)`
            : 'Perfect! Player wins!';
          store.addCoins(perfectReward);
          isGameActive.value = false;
        }
      }
    }, 500);
  }

  function handleStand() {
    if (!isGameActive.value || !isPlayerTurn.value) return;
    isPlayerTurn.value = false;
  }

  return {
    dealerDeck,
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
    startNewGame,
    handleHit,
    handleStand,
  };
}
