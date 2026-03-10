import { useGameStore } from '../stores/game';
import type { Card } from '../types';

export function useCardScoring() {
  const store = useGameStore();

  function calculateScore(hand: Card[], isPlayerHand = true): number {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
      if (card.special) continue;

      let cardValue: number;
      if (['J', 'Q', 'K'].includes(card.value)) {
        cardValue = 10;
      } else if (card.value === 'A') {
        aces++;
        cardValue = store.activeEffects.fireAce ? 12 : 11;
      } else {
        cardValue = parseInt(card.value, 10);
      }

      if (isPlayerHand) {
        const suitMultiplier = card.suitMultiplierSnapshot ?? store.getSuitMultiplier(card.suit);
        cardValue = Math.floor(cardValue * suitMultiplier);

        if (card.chronometerEffect) {
          cardValue = Math.floor(cardValue / 2);
        }
      }

      score += cardValue;
    }

    if (isPlayerHand && store.activeEffects.royalDecree) {
      const nonSpecialCards = hand.filter(c => !c.special).length;
      score += nonSpecialCards * 2;
    }

    let acesAsEleven = aces;
    while (acesAsEleven > 0 && score > store.currentTarget) {
      score -= store.activeEffects.fireAce ? 11 : 10;
      acesAsEleven--;
    }

    if (isPlayerHand && store.activeEffects.aceArmor && aces > 0 && score > store.currentTarget) {
      score -= store.activeEffects.fireAce ? 11 : 10;
    }

    return score;
  }

  function calculateCardDoubleBonus(card: Card): number {
    let baseValue: number;
    if (['J', 'Q', 'K'].includes(card.value)) {
      baseValue = 10;
    } else if (card.value === 'A') {
      baseValue = store.activeEffects.fireAce ? 12 : 11;
    } else {
      baseValue = parseInt(card.value, 10);
    }
    const suitMultiplier = card.suitMultiplierSnapshot ?? store.getSuitMultiplier(card.suit);
    return Math.floor(baseValue * suitMultiplier);
  }

  function getCardBaseValue(card: Card): number {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return store.activeEffects.fireAce ? 12 : 11;
    return parseInt(card.value, 10);
  }

  return { calculateScore, calculateCardDoubleBonus, getCardBaseValue };
}
