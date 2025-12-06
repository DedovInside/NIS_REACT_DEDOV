# Кибер-Зоопарк 2077

**ФИО:** Дедов Иван

## Описание проекта

React + TypeScript веб-приложение для управления виртуальными питомцами в стиле киберпанк. Приложение использует данные из API Ninjas Animals API и генерирует кибер-панк изображения животных через Fusion Brain AI.

## Инструкции по запуску

**Клонировать репозиторий:**

```bash
git clone `[URL репозитория]`
cd cyber-zoo-2077
```

**Установить зависимости:**

```bash
npm install
```

**Запустить приложение в режиме разработки:**

```bash
npm run dev
```

**Открыть браузер по адресу:**

[http://localhost:5173](http://localhost:5173)

### Дополнительная настройка (опционально)

Для обновления данных животных из API:

1. Получить API ключ на [API Ninjas](https://api-ninjas.com/)
2. Заменить `API_KEY` в файле `scripts/generatePets.js`
3. Запустить скрипт:

```bash
npm run generate-pets
```

Для генерации AI-изображений:

1. Получить ключи на [Fusion Brain AI](https://fusionbrain.ai/)
2. Заменить `API_KEY` и `SECRET_KEY` в `scripts/generateImages.js`
3. Запустить:

```bash
npm run generate-images
```

## Реализованный функционал (80 баллов)

### Архитектура и TypeScript (5/5)

- Полная типизация всех компонентов, хуков и утилит
- Строгая структура директорий согласно требованиям
- Type-safe интерфейсы для `Pet`, `PetAction`, `EventContext`
- Union types для режимов и состояний

### Хуки React

**useState + useEffect + useRef (5/5):**

- `useState` для управления модальными окнами, загрузкой, фильтрами
- `useEffect` для автоматического уменьшения энергии питомцев
- `useRef` для DOM-анимаций аватаров (bounce эффект)

**useReducer (10/10):**

- Полноценный reducer в `usePetLifecycle` с actions: FEED, LEVEL_UP, CHEER, RESET, DECREASE_ENERGY
- Сложная логика смены настроения в зависимости от энергии
- Immutable state updates

**Оптимизация (5/5):**

- `React.memo` для всех компонентов (PetCard, EventLog, PetDetailsModal)
- `useMemo` для фильтрации питомцев по species
- `useCallback` для всех обработчиков событий

**Кастомные хуки (10/10):**

1. `usePetLifecycle` - управление жизненным циклом питомца с таймером
2. `useEventLog` - работа с глобальным контекстом событий

### Функциональность

**Загрузка и отображение (5/5):**

- Симуляция загрузки с задержкой 2 сек
- Material UI Skeleton Loader (5 карточек)
- Grid система с адаптивными breakpoints

**Таймер энергии (5/5):**

- Автоматическое уменьшение на 5 единиц каждые 3 сек
- Смена настроения:
  - `energy > 80` --> excited/playful
  - `energy > 60` --> happy/curious
  - `energy <= 40` --> tired
  - `energy <= 20` --> sad
  - `energy = 0` --> sleeping (питомец недоступен)

**Контекст и логи (10/10):**

- `EventContext` с провайдером и хуком
- Timestamp для каждого события
- Material UI Drawer с анимацией
- Функции `addEvent` и `clearEvents`

**Действия питомца (5/5):**

- **Feed** - восстанавливает 20 энергии, улучшает настроение
- **Level Up** - повышает уровень, делает excited
- **Cheer** - улучшает настроение, +5 энергии
- **Reset** - возврат к начальному состоянию

**Фильтрация (5/5):**

- Material UI Select с `MenuItems`
- Фильтр по 9 научным классам (Mammalia, Aves, Reptilia и др.)
- Отображение количества найденных питомцев
- Мемоизация через `useMemo`

### Стилизация

**SCSS (5/5):**

- `global.scss` - базовые стили, градиентный фон, анимации, scrollbar

**module.scss (5/5):**

- `PetCard.module.scss` - изолированные стили карточек
- BEM-подобная структура классов

**Inline styles (5/5):**

- Динамический `boxShadow` в зависимости от энергии:
  - `energy > 50` --> розовое свечение
  - `energy <= 50` --> красное свечение
- Прозрачность вычисляется динамически

**styled-components (5/5):**

- `ActionButton.styled.ts` с тремя вариантами (primary, secondary, danger)
- Gradient backgrounds и hover-эффекты
- Условная стилизация через props

**Material UI (5/5):**

- AppBar с Toolbar
- Drawer для логов событий
- Skeleton для загрузки
- Select для фильтрации
- Dialog для модальных окон
- Grid для адаптивной сетки
- Icons (FoodBank, ArrowUpward, RecordVoiceOver, Refresh, Analytics, Pets)

## Доработки на 9 баллов

### 1. Кибер-панк UI/UX дизайн

**Реализовано:**

- Розовая неоновая цветовая схема (#ff00e1) вместо стандартной бирюзовой
- Custom font "SK Cuber" для футуристического вида
- Gradient backgrounds с эффектами blur
- Анимации `bounce` для excited/playful питомцев
- Анимация `glow` для карточек
- Hover-эффекты с `transform` и `box-shadow`
- Custom scrollbar с розовым градиентом

**Обоснование:** Создает уникальную атмосферу киберпанка, повышает engagement и делает приложение визуально запоминающимся.

### 2. Material UI Icons вместо эмодзи

**Реализовано:**

- Замена всех текстовых эмодзи на векторные иконки
- `PetsIcon` для заголовка
- `AnalyticsIcon` для Event Log
- `FoodBankIcon`, `ArrowUpwardIcon`, `RecordVoiceOverIcon`, `RefreshIcon` для кнопок

**Обоснование:** Профессиональный внешний вид, масштабируемость, консистентность дизайна, лучшая читаемость.

### 3. Адаптивный Grid с responsive breakpoints

**Реализовано:**

- Material UI Grid v7 с новым синтаксом `size={{ xs: 12, sm: 6, md: 4 }}`
- Адаптивные карточки на разных экранах:
  - Mobile (xs): 1 колонка
  - Tablet (sm): 2 колонки
  - Desktop (md+): 3 колонки

**Обоснование:** Обеспечивает корректную работу на всех устройствах, улучшает UX на мобильных.

### 4. Продвинутые анимации

**Реализовано:**

- Bounce-анимация аватаров через `useRef`
- Fade-in для изображений после загрузки
- Smooth transitions для всех hover-эффектов
- Gradient animation для заголовков

**Обоснование:** Повышает визуальную привлекательность и улучшает feedback пользователям.

## Доработки на 10 баллов

### 1. Модальное окно с детальной информацией

**Реализовано:**

- Компонент `PetDetailsModal` с полным профилем питомца
- Разделы:
  - **Basic Information** - имя, класс, уровень, энергия, настроение
  - **Characteristics** - полные характеристики из API (diet, habitat, lifespan и др.)
  - **Taxonomy** - научная классификация (kingdom, phylum, class, order и др.)
- Автоматическое форматирование полей: `litter_size` --> "Litter Size"
- Умное поведение: не открывается при клике на кнопки или изображение
- Закрытие по Escape, backdrop и кнопке Close
- Анимации появления/исчезновения

**Обоснование:** Значительно расширяет функциональность приложения, предоставляет образовательную ценность с реальными научными данными. Демонстрирует работу с модальными окнами на продвинутом уровне.

### 2. Интеграция с реальным API

**Реализовано:**

- **API Ninjas Animals API** - получение данных о 100 животных
- Скрипт `generatePets.js`:
  - Загрузка данных для каждого животного
  - Автоматическая фильтрация и валидация
  - Удаление дубликатов
  - Генерация кибер-имен (префикс + originalName + суффикс)
  - Сохранение полных `characteristics` и `taxonomy`
  - Обработка ошибок и rate limits (delay 150ms)
- Генерация TypeScript файла `pets.ts` с типами
- 9 научных классов: Mammalia, Aves, Reptilia, Amphibia, Actinopterygii, Chondrichthyes, Cephalopoda, Scyphozoa, Asteroidea

**Обоснование:** Использует реальные данные вместо mock, делает приложение практически применимым. Демонстрирует работу с внешними API, обработку больших объемов данных и автоматизацию.

### 3. AI-генерация изображений

**Реализовано:**

- **Fusion Brain AI API** - генерация кибер-панк изображений животных
- Скрипт `generateImages.js`:
  - Класс `FusionBrainAPI` для работы с API
  - Получение pipeline ID
  - Генерация изображений с кастомными промптами
  - Проверка статуса генерации с retry логикой
  - Сохранение base64 в PNG файлы
  - Отчет о генерации с статистикой
- Кастомные промпты для каждого класса животных:
  - Mammalia: synthetic fur, bio-mechanical joints
  - Aves: metallic feathers, cyber wings
  - Reptilia: armored scales, laser eyes
  - Amphibia: translucent skin, bio-luminescent patterns
- Безопасные имена файлов (lowercase, underscores)
- Skip уже существующих файлов

**Обоснование:** Создает уникальные визуальные элементы для приложения, демонстрирует работу с AI API, автоматизацию контент-генерации. Это продвинутая техника, выходящая за рамки стандартного React-разработчика.

### 4. Продвинутая архитектура данных

**Реализовано:**

- Утилита `imageMapper.ts`:
  - Функция `createSafeFileName` для синхронизации имен
  - `getAnimalImagePath` для маппинга Pet → изображение
  - `useAnimalImage` хук для удобной работы
- Lazy loading изображений с `loading="lazy"`
- Fallback на эмодзи при ошибке загрузки
- TypeScript интерфейсы:

  ```typescript
  interface Pet {
    characteristics?: Record<string, string>;
    taxonomy?: Record<string, string>;
  }
  ```

**Обоснование:** Профессиональная архитектура с разделением ответственности, type-safety, оптимизация производительности.

### 5. Расширенная типизация

**Реализовано:**

- Строгие union types:

  ```typescript
  type PetAction = 
    | { type: 'FEED' }
    | { type: 'LEVEL_UP' }
    | { type: 'CHEER' }
    | { type: 'RESET'; payload: Pet }
    | { type: 'DECREASE_ENERGY' };
  ```

- Record types для динамических данных
- Nullable types с optional chaining
- Discriminated unions для reducer actions

**Обоснование:** Демонстрирует глубокое понимание TypeScript, предотвращает runtime ошибки, улучшает DX.

### 6. Оптимизация производительности

**Реализовано:**

- Мемоизация компонентов через `React.memo`
- `displayName` для всех мемоизированных компонентов
- `useMemo` для фильтрации (избегает пересчетов)
- `useCallback` для стабилизации обработчиков
- Lazy loading изображений
- Debounce для энергии (не каждый рендер, а раз в 3 сек)

**Обоснование:** Критично для работы со 100 питомцами, предотвращает лишние ре-рендеры, экономит память и CPU.

## Технологии

- **React 19** - библиотека для UI
- **TypeScript** - строгая типизация
- **Vite** - быстрый dev server
- **Material UI v7** - компонентная библиотека
- **styled-components** - CSS-in-JS
- **SCSS Modules** - изолированные стили
- **API Ninjas** - источник данных о животных
- **Fusion Brain AI** - генерация изображений

## Структура проекта

```md
cyber-zoo-2077/
├── scripts/
│   ├── generatePets.js      # Скрипт загрузки данных из API
│   └── generateImages.js    # Скрипт генерации AI-изображений
├── src/
│   ├── components/
│   │   ├── PetCard/
│   │   │   ├── PetCard.tsx
│   │   │   ├── PetCard.module.scss
│   │   │   └── types.ts
│   │   ├── PetActions/
│   │   │   └── ActionButton.styled.ts
│   │   ├── PetDetailsModal/
│   │   │   └── PetDetailsModal.tsx
│   │   └── EventLog/
│   │       └── EventLog.tsx
│   ├── context/
│   │   └── EventContext.tsx
│   ├── hooks/
│   │   ├── usePetLifecycle.ts
│   │   └── useEventLog.ts
│   ├── data/
│   │   └── pets.ts
│   ├── utils/
│   │   └── imageMapper.ts
│   ├── pages/
│   │   └── Dashboard.tsx
│   ├── styles/
│   │   └── global.scss
│   └── App.tsx
└── public/
    ├── images/
    │   └── animals/         # AI-сгенерированные изображения
    └── fonts/
        └── sk-cuber-2.ttf   # Кибер-панк шрифт
```

## Итоговая оценка

**Базовый функционал (80 баллов):** Полностью реализован (80/80)

**Доработки на 9 баллов:**

- Кибер-панк UI/UX с анимациями
- Material UI Icons
- Адаптивный Grid
- Семантическая верстка

**Доработки на 10 баллов:**

- Модальные окна с детальной информацией
- Реальный API (API Ninjas)
- AI-генерация изображений (Fusion Brain)
- Продвинутые техники React и TypeScript
- Оптимизация производительности

Ожидаемая оценка: 10 баллов

## Дополнительные материалы

- [API Ninjas Documentation](https://api-ninjas.com/api/animals)
- [Fusion Brain AI](https://fusionbrain.ai/)
- [Material UI v7 Migration](https://mui.com/material-ui/migration/migration-v6/)
