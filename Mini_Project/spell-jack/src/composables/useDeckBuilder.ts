import type { Card } from '../types';

export function useDeckBuilder() {
  function shuffleDeck(deck: Card[]): Card[] {
    const d = [...deck];
    for (let i = d.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = d[i]!;
      d[i] = d[j]!;
      d[j] = tmp;
    }
    return d;
  }

  function createPlayerDeck(customCards: Card[] = []): Card[] {
    const newDeck: Card[] = [];
    if (customCards.length > 0) {
      for (const card of customCards) {
        newDeck.push({
          value: card.value,
          suit: card.suit,
          id: card.id,
          special: card.special,
          effect: card.effect,
        });
      }
    } else {
      const suits = ['♠', '♥', '♦', '♣'];
      const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      let idCounter = 1000;
      for (const suit of suits) {
        for (const value of values) {
          newDeck.push({ id: idCounter++, value, suit, special: false });
        }
      }
    }
    return shuffleDeck(newDeck);
  }

  function createDealerDeck(): Card[] {
    const newDeck: Card[] = [];
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let idCounter = 2000;
    for (const suit of suits) {
      for (const value of values) {
        newDeck.push({ id: idCounter++, value, suit, special: false });
      }
    }
    return shuffleDeck(newDeck);
  }

  return { shuffleDeck, createPlayerDeck, createDealerDeck };
}
