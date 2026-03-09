import { ref, onMounted } from 'vue'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  language_code?: string
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  initDataUnsafe: {
    user?: TelegramUser
  }
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  openTelegramLink: (url: string) => void
  switchInlineQuery: (query: string, chatTypes?: string[]) => void
  MainButton: {
    text: string
    show: () => void
    hide: () => void
    onClick: (cb: () => void) => void
  }
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }
  colorScheme: 'light' | 'dark'
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

const user = ref<TelegramUser | null>(null)
const isTelegramApp = ref(false)

export function useTelegram() {
  const getWebApp = (): TelegramWebApp | null => {
    return window.Telegram?.WebApp ?? null
  }

  const init = () => {
    const webapp = getWebApp()
    if (webapp) {
      webapp.ready()
      webapp.expand()
      isTelegramApp.value = true

      if (webapp.initDataUnsafe?.user) {
        user.value = webapp.initDataUnsafe.user
      }
    }
  }

  onMounted(() => {
    init()
  })

  const haptic = (type: 'success' | 'error' | 'warning' | 'light' = 'light') => {
    const webapp = getWebApp()
    if (!webapp) return

    try {
      if (type === 'light') {
        webapp.HapticFeedback.impactOccurred('light')
      } else {
        webapp.HapticFeedback.notificationOccurred(type)
      }
    } catch (e) {
      console.error('Haptic feedback error:', e)
    }
  }

  const shareScore = (score: number) => {
    const webapp = getWebApp()
    if (webapp) {
      try {
        webapp.switchInlineQuery(
          `Набрал ${score} очков в SpellJack! 🃏`,
          ['users', 'groups', 'channels']
        )
      } catch {
        const botUsername = 'spelljack_bot'
        webapp.openTelegramLink(
          `https://t.me/share/url?url=https://t.me/${botUsername}&text=${encodeURIComponent(`Набрал ${score} очков в SpellJack! 🃏`)}`
        )
      }
    } else {
      alert(`🎉 Результат: ${score} очков!\n📤 Функция "Поделиться" доступна в Telegram.`)
    }
  }

  return {
    user,
    isTelegramApp,
    haptic,
    shareScore,
    getWebApp
  }
}