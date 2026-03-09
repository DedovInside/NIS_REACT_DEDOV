import { defineStore } from 'pinia'
import { specialCards } from '../data/specialCards'
import type { Card, SpecialCard, ActiveEffects, SuitMultipliers, DestinyPreview } from '../types'

function generateStarterDeck(): Card[] {
  const suits = ['♠', '♥', '♦', '♣']
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10']
  const deck: Card[] = []
  let idCounter = 100
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ id: idCounter++, value, suit, special: false })
    }
  }
  return deck
}

function generateStartedOwnedDeck(): Card[] {
  const suits = ['♠', '♥', '♦', '♣']
  const values = ['J', 'Q', 'K', 'A']
  const deck: Card[] = []
  let idCounter = 10000
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ id: idCounter++, value, suit, special: false })
    }
  }
  return deck
}

function createDefaultEffects(): ActiveEffects {
  return {
    revealDealerCard: false,
    shield: false,
    doubleNext: false,
    dealerTrap: false,
    swapCard: false,
    aceArmor: false,
    doubleBet: false,
    fireAce: false,
    luckySeven: false,
    luckySuitActive: null,
    stabilizer: false,
    goldenTouch: false,
    chronometer: 0,
    suitMagnetActive: null,
    royalDecree: false,
    extraCard: false,
    dealerFrozen: false,
  }
}

export const useGameStore = defineStore('game', {
  state: () => ({
    coins: 100,
    playerDeck: generateStarterDeck() as Card[],
    playerOwnedCards: generateStartedOwnedDeck() as Card[],
    availableCards: [...specialCards] as SpecialCard[],
    currentTarget: 21,
    suitMultipliers: {} as SuitMultipliers,
    activeSpecialCards: [] as SpecialCard[],
    usedSpecialEffects: [] as string[],
    activeEffects: createDefaultEffects(),
  }),

  getters: {
    manualActivationCards(state): SpecialCard[] {
      return state.activeSpecialCards.filter(
        (card) => card.activationType === 'manual' && !state.usedSpecialEffects.includes(String(card.id))
      )
    },
  },

  actions: {
    addCoins(amount: number) {
      this.coins += amount
    },

    addCardToDeck(card: Card) {
      if (this.playerDeck.length < 52) {
        this.playerDeck.push(card)
      }
    },

    removeCardFromDeck(cardId: number | string) {
      const removed = this.playerDeck.find((c) => c.id === cardId)
      if (!removed) return
      this.playerDeck = this.playerDeck.filter((c) => c.id !== cardId)
      this.playerOwnedCards.push(removed)
    },

    buyCard(card: SpecialCard) {
      if (this.coins >= card.cost) {
        this.coins -= card.cost
        this.playerOwnedCards.push(card)
        this.availableCards = this.availableCards.filter((c) => c.id !== card.id)
      }
    },

    addSpecialCardToDeck(card: SpecialCard): boolean {
      if (this.activeSpecialCards.length >= 3) return false
      this.activeSpecialCards.push(card)
      return true
    },

    removeSpecialCardFromDeck(cardId: number | string) {
      this.activeSpecialCards = this.activeSpecialCards.filter((card) => card.id !== cardId)
    },

    activateSpecialCard(cardId: string | number): unknown {
      const card = this.activeSpecialCards.find((c) => c.id === cardId)
      if (!card || this.usedSpecialEffects.includes(String(cardId))) {
        return false
      }
      this.usedSpecialEffects.push(String(cardId))
      const result = this.applyCardEffect(card.effect)
      return result || true
    },

    applyCardEffect(effectName: string): unknown {
      switch (effectName) {
        case 'revealDealerCard':
          this.activeEffects.revealDealerCard = true
          break
        case 'shield':
          this.activeEffects.shield = true
          break
        case 'doubleNext':
          this.activeEffects.doubleNext = true
          break
        case 'dealerTrap':
          this.activeEffects.dealerTrap = true
          break
        case 'swapCard':
          this.activeEffects.swapCard = true
          break
        case 'aceArmor':
          this.activeEffects.aceArmor = true
          break
        case 'resetHand':
          console.log('Reset hand activated')
          break
        case 'criticalChoice':
          console.log('Critical choice activated')
          break
        case 'doubleBet':
          this.activeEffects.doubleBet = true
          break
        case 'showNextSuit':
          console.log('Show next suit activated')
          break
        case 'fireAce':
          this.activeEffects.fireAce = true
          break
        case 'luckySeven':
          this.activeEffects.luckySeven = true
          break
        case 'leafFall':
          console.log('Листопад активирован')
          break
        case 'luckySuit': {
          const suits = ['♠', '♥', '♦', '♣'] as const
          const randomSuit = suits[Math.floor(Math.random() * suits.length)]!
          const currentMultiplier = this.getSuitMultiplier(randomSuit)
          const newMultiplier = Math.min(currentMultiplier * 2, 4.0)
          this.suitMultipliers[randomSuit] = newMultiplier
          this.activeEffects.luckySuitActive = randomSuit
          return {
            success: true,
            message: `🌟 Масть удачи: ${randomSuit} усилена до x${newMultiplier}!`,
          }
        }
        case 'foresight':
          console.log('Foresight activated')
          break
        case 'stabilizer':
          this.activeEffects.stabilizer = true
          this.suitMultipliers = { '♠': 1.0, '♥': 1.0, '♦': 1.0, '♣': 1.0 }
          return { success: true, message: '⚖️ Стабилизатор: коэффициенты зафиксированы на 1.0!' }
        case 'goldenTouch':
          this.activeEffects.goldenTouch = true
          return { success: true, message: '✨ Золотое касание: следующая карта даст монеты равные её очкам!' }
        case 'chronometer':
          this.activeEffects.chronometer = 2
          return { success: true, message: '⏰ Хронометр: следующие 2 карты дают половину очков!' }
        case 'suitMagnet':
          return { success: true, requiresSuitChoice: true, message: '🧲 Магнит мастей: выберите масть для усиления!' }
        case 'destiny':
          return { success: true, requiresDestinyPreview: true, message: '🎯 Карта судьбы: показываю исход следующей карты!' }
        case 'royalDecree':
          this.activeEffects.royalDecree = true
          break
        case 'extraCard':
          this.activeEffects.extraCard = true
          break
        default:
          console.log(`Unknown effect: ${effectName}`)
      }
      return undefined
    },

    applySuitMagnet(chosenSuit: string): { success: boolean; message: string } {
      if (!chosenSuit || this.suitMultipliers[chosenSuit] === undefined) {
        return { success: false, message: 'Некорректная масть!' }
      }
      this.suitMultipliers[chosenSuit] += 1
      this.activeEffects.suitMagnetActive = null

      const suitNames: Record<string, string> = { '♥': 'Червы', '♦': 'Бубны', '♣': 'Трефы', '♠': 'Пики' }
      return {
        success: true,
        message: `🧲 Магнит мастей: ${suitNames[chosenSuit]} +1 (теперь x${this.suitMultipliers[chosenSuit]})!`,
      }
    },

    previewNextCardOutcome(_playerHand: Card[], currentScore: number, nextCard: Card): DestinyPreview {
      if (!nextCard || nextCard.special) {
        return {
          success: false,
          currentScore,
          nextCard,
          cardValue: 0,
          predictedScore: currentScore,
          scoreChange: 0,
          isOverTarget: false,
          suitMultiplier: 1,
          message: 'Невозможно предсказать исход специальной карты!',
        }
      }

      let cardValue = 0
      if (['J', 'Q', 'K'].includes(nextCard.value)) {
        cardValue = 10
      } else if (nextCard.value === 'A') {
        cardValue = this.activeEffects.fireAce ? 12 : 11
      } else {
        cardValue = parseInt(nextCard.value, 10)
      }

      const suitMultiplier = this.getSuitMultiplier(nextCard.suit)
      cardValue = Math.floor(cardValue * suitMultiplier)

      if (this.activeEffects.chronometer > 0) {
        cardValue = Math.floor(cardValue / 2)
      }
      if (this.activeEffects.doubleNext) {
        cardValue *= 2
      }
      if (this.activeEffects.royalDecree) {
        cardValue += 2
      }

      const predictedScore = currentScore + cardValue
      const isOverTarget = predictedScore > this.currentTarget

      return {
        success: true,
        currentScore,
        nextCard,
        cardValue,
        predictedScore,
        scoreChange: cardValue,
        isOverTarget,
        suitMultiplier,
        message: `🎯 Следующая карта: ${nextCard.value}${nextCard.suit} (${cardValue} очков) → Итого: ${predictedScore} ${isOverTarget ? '⚠️ ПЕРЕБОР!' : '✅'}`,
      }
    },

    resetGameEffects() {
      this.usedSpecialEffects = []
      this.activeEffects = createDefaultEffects()
    },

    disableDealerTrap() {
      this.activeEffects.dealerTrap = false
    },

    disableSwapCard() {
      this.activeEffects.swapCard = false
    },

    disableShield() {
      this.activeEffects.shield = false
    },

    applyAutoEffects() {
      this.activeSpecialCards
        .filter((card) => card.activationType === 'auto' && !this.usedSpecialEffects.includes(String(card.id)))
        .forEach((card) => {
          this.activateSpecialCard(card.id)
        })
    },

    checkPassiveEffects(context: string) {
      this.activeSpecialCards
        .filter((card) => card.activationType === 'passive' && !this.usedSpecialEffects.includes(String(card.id)))
        .forEach((card) => {
          this.checkPassiveCondition(card, context)
        })
    },

    checkPassiveCondition(card: SpecialCard, context: string) {
      if (context !== 'gameStart') return
      switch (card.effect) {
        case 'shield':
          this.activeEffects.shield = true
          break
        case 'aceArmor':
          this.activeEffects.aceArmor = true
          break
        case 'fireAce':
          this.activeEffects.fireAce = true
          break
        case 'doubleBet':
          this.activeEffects.doubleBet = true
          break
        case 'luckySeven':
          this.activeEffects.luckySeven = true
          break
        case 'luckySuit':
          this.applyCardEffect('luckySuit')
          break
        case 'royalDecree':
          this.activeEffects.royalDecree = true
          break
      }
    },

    generateNewTarget() {
      this.currentTarget = Math.floor(Math.random() * (100 - 21 + 1)) + 21
    },

    generateSuitMultipliers() {
      const suits = ['♠', '♥', '♦', '♣']
      const multipliers: SuitMultipliers = {}
      suits.forEach((suit) => {
        multipliers[suit] = Math.round((Math.random() * 3 + 1) * 10) / 10
      })
      this.suitMultipliers = multipliers
    },

    getSuitMultiplier(suit: string): number {
      return this.suitMultipliers[suit] || 1.0
    },
  },
})