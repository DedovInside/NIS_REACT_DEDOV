<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useGameStore } from '../stores/game'
import { useTelegram } from '../composables/useTelegram'
import PlayerHand from './PlayerHand.vue'
import DealerHand from './DealerHand.vue'
import GameControls from './GameControls.vue'
import ActualDeckControl from './ActualDeckControl.vue'
import SpecialCardsPanel from './SpecialCardsPanel.vue'
import type { Card, DestinyPreview } from '../types'

const store = useGameStore()
const { haptic, shareScore } = useTelegram()


function shuffleDeck(deck: Card[]): Card[] {
  const d = [...deck]
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = d[i]!
    d[i] = d[j]!
    d[j] = tmp
  }
  return d
}

function createPlayerDeck(customCards: Card[] = []): Card[] {
  const newDeck: Card[] = []
  if (customCards.length > 0) {
    for (const card of customCards) {
      newDeck.push({ value: card.value, suit: card.suit, id: card.id, special: card.special, effect: card.effect })
    }
  } else {
    const suits = ['♠', '♥', '♦', '♣']
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    let idCounter = 1000
    for (const suit of suits) {
      for (const value of values) {
        newDeck.push({ id: idCounter++, value, suit, special: false })
      }
    }
  }
  return shuffleDeck(newDeck)
}

function createDealerDeck(): Card[] {
  const newDeck: Card[] = []
  const suits = ['♠', '♥', '♦', '♣']
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  let idCounter = 2000
  for (const suit of suits) {
    for (const value of values) {
      newDeck.push({ id: idCounter++, value, suit, special: false })
    }
  }
  return shuffleDeck(newDeck)
}

function calculateScore(hand: Card[], isPlayerHand = true): number {
  let score = 0
  let aces = 0

  for (const card of hand) {
    if (card.special) continue

    let cardValue = 0
    if (['J', 'Q', 'K'].includes(card.value)) {
      cardValue = 10
    } else if (card.value === 'A') {
      aces++
      cardValue = store.activeEffects.fireAce ? 12 : 11
    } else {
      cardValue = parseInt(card.value, 10)
    }

    if (isPlayerHand) {
      const suitMultiplier = card.suitMultiplierSnapshot ?? store.getSuitMultiplier(card.suit)
      cardValue = Math.floor(cardValue * suitMultiplier)

      if (card.chronometerEffect) {
        cardValue = Math.floor(cardValue / 2)
      }
    }

    score += cardValue
  }

  // Королевский указ
  if (isPlayerHand && store.activeEffects.royalDecree) {
    const nonSpecialCards = hand.filter((c) => !c.special).length
    score += nonSpecialCards * 2
  }

  // Тузы
  let acesAsEleven = aces
  while (acesAsEleven > 0 && score > store.currentTarget) {
    score -= store.activeEffects.fireAce ? 11 : 10
    acesAsEleven--
  }

  // Тузовая броня
  if (isPlayerHand && store.activeEffects.aceArmor && aces > 0 && score > store.currentTarget) {
    score -= store.activeEffects.fireAce ? 11 : 10
  }

  return score
}

function calculateCardDoubleBonus(card: Card): number {
  let baseValue: number
  if (['J', 'Q', 'K'].includes(card.value)) {
    baseValue = 10
  }
  else if (card.value === 'A') {
    baseValue = store.activeEffects.fireAce ? 12 : 11
  }
  else {
    baseValue = parseInt(card.value, 10)
  }

  const suitMultiplier = card.suitMultiplierSnapshot ?? store.getSuitMultiplier(card.suit)
  return Math.floor(baseValue * suitMultiplier)
}

const dealerDeck = ref<Card[]>([])
const currentGamePlayerDeck = ref<Card[]>([])
const playerHand = ref<Card[]>([])
const dealerHand = ref<Card[]>([])
const playerScore = ref(0)
const dealerScore = ref(0)
const isPlayerTurn = ref(true)
const winner = ref('')
const isGameActive = ref(false)
const isAnimating = ref(false)

const showDeck = ref(false)
const isCardSelectionMode = ref(false)
const isCriticalChoiceMode = ref(false)
const criticalChoiceCards = ref<Card[]>([])
const nextCardSuit = ref<string | null>(null)
const foresightCards = ref<Card[]>([])
const showSuitChoice = ref(false)
const destinyPreview = ref<DestinyPreview | null>(null)
const showDestinyPreview = ref(false)

function handleEscKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && showDeck.value) showDeck.value = false
}

watch(showDeck, (val) => {
  if (val) {
    window.addEventListener('keydown', handleEscKey)
  } else {
    window.removeEventListener('keydown', handleEscKey)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey)
})

function drawFromPlayerDeck(): Card | null {
  const deck = [...currentGamePlayerDeck.value]
  const card = deck.pop() ?? null
  currentGamePlayerDeck.value = deck
  return card
}

function showTemporaryMessage(msg: string, duration = 3000) {
  winner.value = msg
  setTimeout(() => {
    if (winner.value === msg) winner.value = ''
  }, duration)
}

function checkWinner(finalPlayerScore: number, finalDealerScore: number) {
  const target = store.currentTarget
  let coinReward = 10
  if (store.activeEffects.doubleBet) coinReward *= 2

  if (finalPlayerScore > target) {
    winner.value = 'Dealer wins!'
    haptic('error')
  } else if (finalDealerScore > target) {
    winner.value = store.activeEffects.doubleBet
      ? `Player wins! +${coinReward} монет (x2 бонус!)`
      : 'Player wins!'
    store.addCoins(coinReward)
    haptic('success')
  } else if (finalPlayerScore === finalDealerScore) {
    winner.value = 'Push!'
    haptic('light')
  } else if (finalPlayerScore > finalDealerScore) {
    winner.value = store.activeEffects.doubleBet
      ? `Player wins! +${coinReward} монет (x2 бонус!)`
      : 'Player wins!'
    store.addCoins(coinReward)
    haptic('success')
  } else {
    winner.value = 'Dealer wins!'
    haptic('error')
  }

  isGameActive.value = false
}

function handleDealerTurn() {
  const newDealerDeck = [...dealerDeck.value]
  let newDealerHand = [...dealerHand.value]
  let newDealerScore = calculateScore(newDealerHand, false)

  const target = store.currentTarget
  const dealerThreshold = target <= 30 ? 17 : Math.floor(target * 0.85)

  while (newDealerScore < dealerThreshold && newDealerScore < target && newDealerDeck.length > 0) {
    newDealerHand.push(newDealerDeck.pop()!)
    newDealerScore = calculateScore(newDealerHand, false)
  }

  // Карта-ловушка
  if (store.activeEffects.dealerTrap && newDealerDeck.length > 0) {
    newDealerHand.push(newDealerDeck.pop()!)
    newDealerScore = calculateScore(newDealerHand, false)

    showTemporaryMessage('🪤 Карта-ловушка! Дилер вынужден взять дополнительную карту...')
    haptic('success')
    store.disableDealerTrap()

    dealerDeck.value = newDealerDeck
    dealerHand.value = newDealerHand
    dealerScore.value = newDealerScore

    setTimeout(() => {
      winner.value = ''
      checkWinner(playerScore.value, newDealerScore)
    }, 3000)
    return
  }

  dealerDeck.value = newDealerDeck
  dealerHand.value = newDealerHand
  dealerScore.value = newDealerScore

  checkWinner(playerScore.value, newDealerScore)
}

// Наблюдатель за ходом дилера
watch(isPlayerTurn, (val) => {
  if (!val && isGameActive.value) {
    handleDealerTurn()
  }
})

function startNewGame() {
  store.resetGameEffects()

  const shuffledPlayerDeck = createPlayerDeck(store.playerDeck)
  const shuffledDealerDeck = createDealerDeck()

  store.generateNewTarget()
  store.generateSuitMultipliers()
  store.checkPassiveEffects('gameStart')

  if (shuffledPlayerDeck.length < 2 || shuffledDealerDeck.length < 2) {
    winner.value = 'Not enough cards in the deck to play! Add more cards in Deck Editor.'
    isGameActive.value = false
    return
  }

  const gameDeck = [...shuffledPlayerDeck]
  const firstCard = gameDeck.pop()!
  const secondCard = gameDeck.pop()!

  if (!firstCard.special) firstCard.suitMultiplierSnapshot = store.getSuitMultiplier(firstCard.suit)
  if (!secondCard.special) secondCard.suitMultiplierSnapshot = store.getSuitMultiplier(secondCard.suit)

  const newPlayerHand = [firstCard, secondCard]
  const newDealerHand = [shuffledDealerDeck.pop()!, shuffledDealerDeck.pop()!]

  currentGamePlayerDeck.value = gameDeck
  dealerDeck.value = shuffledDealerDeck
  playerHand.value = newPlayerHand
  dealerHand.value = newDealerHand

  const initialPlayerScore = calculateScore(newPlayerHand, true)
  const initialDealerScore = calculateScore(newDealerHand, false)

  if (initialPlayerScore >= store.currentTarget) {
    store.currentTarget = initialPlayerScore + Math.floor(Math.random() * 21) + 10
  }
  if (initialDealerScore >= store.currentTarget) {
    store.currentTarget = Math.max(initialPlayerScore, initialDealerScore) + Math.floor(Math.random() * 21) + 10
  }

  playerScore.value = initialPlayerScore
  dealerScore.value = initialDealerScore
  isPlayerTurn.value = true
  winner.value = ''
  isGameActive.value = true

  // Счастливая семёрка для стартовых карт
  if (store.activeEffects.luckySeven) {
    const initialSevens = newPlayerHand.filter((c) => c.value === '7' && !c.special)
    if (initialSevens.length > 0) {
      const coinsEarned = initialSevens.length * 7
      store.addCoins(coinsEarned)
      showTemporaryMessage(`🍀 Счастливая семёрка! Начальные семёрки дали +${coinsEarned} монет!`)
      haptic('success')
    }
  }

  isCardSelectionMode.value = false
  isCriticalChoiceMode.value = false
  criticalChoiceCards.value = []
  nextCardSuit.value = null
  foresightCards.value = []
  showSuitChoice.value = false
  showDestinyPreview.value = false
  destinyPreview.value = null
}

function handleHit() {
  if (!isGameActive.value || !isPlayerTurn.value || isAnimating.value) return

  isAnimating.value = true
  store.applyAutoEffects()

  setTimeout(() => {
    const newCard = drawFromPlayerDeck()
    if (!newCard) {
      isAnimating.value = false
      return
    }

    if (newCard.special) {
      const result = store.applyCardEffect(newCard.effect!) as Record<string, unknown> | undefined
      if (result?.requiresSuitChoice) showSuitChoice.value = true
      if (result?.requiresDestinyPreview) {
        const nextCard = currentGamePlayerDeck.value[currentGamePlayerDeck.value.length - 1]
        if (nextCard) {
          destinyPreview.value = store.previewNextCardOutcome(playerHand.value, playerScore.value, nextCard)
          showDestinyPreview.value = true
        }
      }
    }

    if (!newCard.special) {
      newCard.suitMultiplierSnapshot = store.getSuitMultiplier(newCard.suit)
      if (store.activeEffects.chronometer > 0) newCard.chronometerEffect = true
    }

    let newPlayerHand = [...playerHand.value, newCard]
    let newPlayerScore = calculateScore(newPlayerHand, true)

    // Двойной удар
    if (store.activeEffects.doubleNext && !newCard.special) {
      const lastCardBonusScore = calculateCardDoubleBonus(newCard)
      newPlayerScore += lastCardBonusScore
      showTemporaryMessage(`⚡ Двойной удар! ${newCard.value}${newCard.suit} дает +${lastCardBonusScore} бонусных очков!`)
      haptic('success')
      store.activeEffects.doubleNext = false
    }

    // Золотое касание
    if (store.activeEffects.goldenTouch && !newCard.special) {
      let cardValue: number
      if (['J', 'Q', 'K'].includes(newCard.value)) cardValue = 10
      else if (newCard.value === 'A') cardValue = store.activeEffects.fireAce ? 12 : 11
      else cardValue = parseInt(newCard.value, 10)

      const sm = newCard.suitMultiplierSnapshot ?? store.getSuitMultiplier(newCard.suit)
      const finalCardValue = Math.floor(cardValue * sm)
      store.addCoins(finalCardValue)
      showTemporaryMessage(`✨ Золотое касание! ${newCard.value}${newCard.suit} дает +${finalCardValue} монет!`)
      haptic('success')
      store.activeEffects.goldenTouch = false
    }

    // Счастливая семёрка
    if (store.activeEffects.luckySeven && newCard.value === '7' && !newCard.special) {
      store.addCoins(7)
      showTemporaryMessage(`🍀 Счастливая семёрка! Получено +7 монет за ${newCard.value}${newCard.suit}!`)
      haptic('success')
    }

    // Щит перегруза
    if (newPlayerScore > store.currentTarget && store.activeEffects.shield) {
      newPlayerHand.pop()
      newPlayerScore = calculateScore(newPlayerHand, true)
      store.activeEffects.shield = false
      showTemporaryMessage('🛡️ Щит сработал! Последняя карта сброшена. Игра продолжается...')
      haptic('success')
      playerHand.value = newPlayerHand
      playerScore.value = newPlayerScore
      isAnimating.value = false
      return
    }

    // Extra card
    if (store.activeEffects.extraCard) {
      const extraCard = drawFromPlayerDeck()
      if (extraCard) {
        if (extraCard.special) store.applyCardEffect(extraCard.effect!)
        newPlayerHand.push(extraCard)
        newPlayerScore = calculateScore(newPlayerHand, true)
      }
      store.activeEffects.extraCard = false
    }

    // Хронометр
    if (store.activeEffects.chronometer > 0 && !newCard.special) {
      store.activeEffects.chronometer--
      if (store.activeEffects.chronometer === 0) {
        showTemporaryMessage('⏰ Хронометр отключён! Карты снова дают полные очки.', 2000)
        haptic('light')
      }
    }

    playerHand.value = newPlayerHand
    playerScore.value = newPlayerScore
    isAnimating.value = false

    if (newPlayerScore >= store.currentTarget) {
      isPlayerTurn.value = false
      if (newPlayerScore === store.currentTarget) {
        let perfectReward = 20
        if (store.activeEffects.doubleBet) perfectReward *= 2
        winner.value = store.activeEffects.doubleBet
          ? `Perfect! Player wins! +${perfectReward} монет (x2 бонус!)`
          : 'Perfect! Player wins!'
        store.addCoins(perfectReward)
        isGameActive.value = false
      }
    }
  }, 500)
}

function handleStand() {
  if (!isGameActive.value || !isPlayerTurn.value) return
  isPlayerTurn.value = false
}

// ========== Специальные карты ==========

function handleCardSwap(cardIndex: number) {
  if (!isCardSelectionMode.value || !isGameActive.value || currentGamePlayerDeck.value.length === 0) return

  const newPlayerHand = [...playerHand.value]
  const newPlayerDeck = [...currentGamePlayerDeck.value]
  const cardToSwap = newPlayerHand[cardIndex]
  if (!cardToSwap) return
  const newCard = newPlayerDeck.pop()

  if (!newCard) {
    showTemporaryMessage('Колода пуста! Обмен невозможен.', 2000)
    isCardSelectionMode.value = false
    return
  }

  newPlayerHand[cardIndex] = newCard
  if (!newCard.special) newCard.suitMultiplierSnapshot = store.getSuitMultiplier(newCard.suit)
  newPlayerDeck.unshift(cardToSwap)
  const shuffledDeck = shuffleDeck(newPlayerDeck)

  playerHand.value = newPlayerHand
  currentGamePlayerDeck.value = shuffledDeck
  playerScore.value = calculateScore(newPlayerHand, true)

  // Золотое касание при обмене
  let goldenTouchCoins = 0
  if (store.activeEffects.goldenTouch && !newCard.special) {
    let cardValue: number
    if (['J', 'Q', 'K'].includes(newCard.value)) cardValue = 10
    else if (newCard.value === 'A') cardValue = store.activeEffects.fireAce ? 12 : 11
    else cardValue = parseInt(newCard.value, 10)
    const sm = newCard.suitMultiplierSnapshot ?? store.getSuitMultiplier(newCard.suit)
    goldenTouchCoins = Math.floor(cardValue * sm)
    store.addCoins(goldenTouchCoins)
    store.activeEffects.goldenTouch = false
  }

  // Семёрка при обмене
  if (store.activeEffects.luckySeven && newCard.value === '7' && !newCard.special) {
    store.addCoins(7)
  }

  let message = `🔄 Обмен удачи! ${cardToSwap.value}${cardToSwap.suit} → ${newCard.value}${newCard.suit}`
  if (store.activeEffects.luckySeven && newCard.value === '7' && !newCard.special) message += ' (+7 монет за семёрку!)'
  if (goldenTouchCoins > 0) message += ` (✨ +${goldenTouchCoins} монет!)`

  showTemporaryMessage(message, 2500)
  haptic('success')
  isCardSelectionMode.value = false
  store.disableSwapCard()
}

function handleCardSwapActivate() {
  isCardSelectionMode.value = true
}

function handleResetHand() {
  if (currentGamePlayerDeck.value.length < 2) {
    showTemporaryMessage('❌ Недостаточно карт в колоде для сброса!', 2000)
    return
  }

  const newPlayerDeck = [...currentGamePlayerDeck.value]
  const firstCard = newPlayerDeck.pop()!
  const secondCard = newPlayerDeck.pop()!

  if (!firstCard.special) firstCard.suitMultiplierSnapshot = store.getSuitMultiplier(firstCard.suit)
  if (!secondCard.special) secondCard.suitMultiplierSnapshot = store.getSuitMultiplier(secondCard.suit)

  const newHand = [firstCard, secondCard]
  playerHand.value = newHand
  currentGamePlayerDeck.value = newPlayerDeck
  playerScore.value = calculateScore(newHand, true)

  let message = '💥 Сброс напряжения! Новая рука получена!'
  if (store.activeEffects.luckySeven) {
    const newSevens = newHand.filter((c) => c.value === '7' && !c.special)
    if (newSevens.length > 0) {
      const coinsEarned = newSevens.length * 7
      store.addCoins(coinsEarned)
      message += ` (+${coinsEarned} монет за семёрки!)`
    }
  }
  showTemporaryMessage(message, 2500)
  haptic('success')
}

function handleCriticalChoiceActivate() {
  if (currentGamePlayerDeck.value.length < 3) {
    showTemporaryMessage('❌ Недостаточно карт для критического выбора!', 2000)
    return
  }
  criticalChoiceCards.value = currentGamePlayerDeck.value.slice(-3)
  isCriticalChoiceMode.value = true
  winner.value = '🔍 Критический выбор: выберите одну из трех карт!'
}

function handleCriticalCardChoice(chosenCardIndex: number) {
  const chosenCard = criticalChoiceCards.value[chosenCardIndex]
  if (!chosenCard) return
  const newPlayerDeck = [...currentGamePlayerDeck.value]
  newPlayerDeck.splice(-3, 3)

  if (!chosenCard.special) chosenCard.suitMultiplierSnapshot = store.getSuitMultiplier(chosenCard.suit)

  const newPlayerHand = [...playerHand.value, chosenCard]
  const newPlayerScore = calculateScore(newPlayerHand, true)

  playerHand.value = newPlayerHand
  currentGamePlayerDeck.value = newPlayerDeck
  playerScore.value = newPlayerScore

  if (store.activeEffects.goldenTouch && !chosenCard.special) {
    let cardValue: number
    if (['J', 'Q', 'K'].includes(chosenCard.value)) cardValue = 10
    else if (chosenCard.value === 'A') cardValue = store.activeEffects.fireAce ? 12 : 11
    else cardValue = parseInt(chosenCard.value, 10)
    const sm = chosenCard.suitMultiplierSnapshot ?? store.getSuitMultiplier(chosenCard.suit)
    store.addCoins(Math.floor(cardValue * sm))
    store.activeEffects.goldenTouch = false
  }

  if (store.activeEffects.luckySeven && chosenCard.value === '7' && !chosenCard.special) {
    store.addCoins(7)
  }

  isCriticalChoiceMode.value = false
  criticalChoiceCards.value = []
  winner.value = ''

  setTimeout(() => {
    if (newPlayerScore > store.currentTarget) {
      if (store.activeEffects.shield) {
        store.disableShield()
        showTemporaryMessage(`🛡️ Щит перегруза сработал! Перебор предотвращён (${newPlayerScore})`, 2500)
        haptic('success')
      } else {
        isGameActive.value = false
        isPlayerTurn.value = false
        checkWinner(newPlayerScore, dealerScore.value)
      }
    } else {
      let message = `🔍 Критический выбор! Получена: ${chosenCard.value}${chosenCard.suit}`
      if (store.activeEffects.luckySeven && chosenCard.value === '7' && !chosenCard.special) {
        message += ' (+7 монет за семёрку!)'
      }
      showTemporaryMessage(message)
      haptic('success')
    }
  }, 100)
}

function handleCartographerActivate() {
  if (currentGamePlayerDeck.value.length === 0) {
    showTemporaryMessage('❌ В колоде нет карт!', 2000)
    return
  }
  const nextCard = currentGamePlayerDeck.value[currentGamePlayerDeck.value.length - 1]!
  nextCardSuit.value = nextCard.suit
  showTemporaryMessage(`🗺️ Картограф: следующая карта масти ${nextCard.suit}`, 5000)
  haptic('success')
  setTimeout(() => { nextCardSuit.value = null }, 5000)
}

function handleLeafFallActivate() {
  if (playerHand.value.length === 0) {
    showTemporaryMessage('❌ Нет карт в руке для сброса!', 2000)
    return
  }
  const randomIndex = Math.floor(Math.random() * playerHand.value.length)
  const droppedCard = playerHand.value[randomIndex]!
  const newHand = playerHand.value.filter((_, i) => i !== randomIndex)

  playerHand.value = newHand
  playerScore.value = calculateScore(newHand, true)
  store.addCoins(3)

  showTemporaryMessage(`🍃 Листопад: сброшена ${droppedCard.value}${droppedCard.suit}, +3 💰`)
  haptic('success')
}

function handleSuitMagnetActivate() {
  showSuitChoice.value = true
}

function handleSuitChoice(suitSymbol: string) {
  const result = store.applySuitMagnet(suitSymbol)
  showTemporaryMessage(result.message, result.success ? 3000 : 2000)
  showSuitChoice.value = false
}

function handleForesightActivate() {
  if (currentGamePlayerDeck.value.length < 2) {
    showTemporaryMessage('🔮 В колоде мало карт для предвидения!', 2000)
    return
  }
  const deckLength = currentGamePlayerDeck.value.length
  foresightCards.value = [
    currentGamePlayerDeck.value[deckLength - 1]!,
    currentGamePlayerDeck.value[deckLength - 2]!,
  ]
  showTemporaryMessage('🔮 Предвидение: показаны следующие 2 карты в колоде!', 2000)
  haptic('light')
  setTimeout(() => { foresightCards.value = [] }, 5000)
}

function handleDestinyActivate() {
  const nextCard = currentGamePlayerDeck.value[currentGamePlayerDeck.value.length - 1]
  if (nextCard) {
    destinyPreview.value = store.previewNextCardOutcome(playerHand.value, playerScore.value, nextCard)
    showDestinyPreview.value = true
  } else {
    showTemporaryMessage('🎯 В колоде нет карт для предсказания!', 2000)
  }
}

function handleDestinyPreviewClose() {
  showDestinyPreview.value = false
  destinyPreview.value = null
}
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
            :class="['multiplier-item', { 'lucky-suit-boosted': store.activeEffects.luckySuitActive === suit }]"
          >
            <span :class="['suit-symbol', { 'red-suit': suit === '♥' || suit === '♦' }]">{{ suit }}</span>
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
          :class="['card', 'critical-choice-card', { 'red-card': card.suit === '♥' || card.suit === '♦' }]"
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
          <div :class="['card', { 'red-card': destinyPreview.nextCard.suit === '♥' || destinyPreview.nextCard.suit === '♦' }]">
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
            <span :class="['score-change', destinyPreview.scoreChange >= 0 ? 'positive' : 'negative']">
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







