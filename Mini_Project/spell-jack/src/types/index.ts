export interface Card {
  id: number | string
  value: string
  suit: string
  special: boolean
  effect?: string
  type?: string
  name?: string
  description?: string
  cost?: number
  activationType?: 'manual' | 'passive' | 'auto'
  suitMultiplierSnapshot?: number
  chronometerEffect?: boolean
}

export interface SpecialCard extends Card {
  type: 'special'
  name: string
  description: string
  cost: number
  activationType: 'manual' | 'passive' | 'auto'
  effect: string
}

export interface ActiveEffects {
  revealDealerCard: boolean
  shield: boolean
  doubleNext: boolean
  dealerTrap: boolean
  swapCard: boolean
  aceArmor: boolean
  doubleBet: boolean
  fireAce: boolean
  luckySeven: boolean
  luckySuitActive: string | null
  stabilizer: boolean
  goldenTouch: boolean
  chronometer: number
  suitMagnetActive: string | null
  royalDecree: boolean
  extraCard: boolean
  dealerFrozen: boolean
}

export interface SuitMultipliers {
  [suit: string]: number
}

export interface DestinyPreview {
  success: boolean
  currentScore: number
  nextCard: Card
  cardValue: number
  predictedScore: number
  scoreChange: number
  isOverTarget: boolean
  suitMultiplier: number
  message: string
}