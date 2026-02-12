import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const API_KEY = '-----------------------------'; // Замените на ваш реальный API ключ
const BASE_URL = 'https://api.api-ninjas.com/v1/animals';

// Список животных для загрузки (ровно 100)
const animalNames = [
  // Млекопитающие (50)
  'Lion', 'Tiger', 'Cheetah', 'Leopard', 'Jaguar', 'Snow Leopard', 'Lynx', 
  'Cougar', 'Serval', 'Caracal', 'Hyena', 'African Wild Dog', 'Wolf', 
  'Red Fox', 'Arctic Fox', 'Brown Bear', 'Polar Bear', 'Panda', 'Koala', 
  'Kangaroo', 'Wallaby', 'Giraffe', 'Zebra', 'Elephant', 'Rhino', 'Hippo', 
  'Bison', 'Buffalo', 'Antelope', 'Gazelle', 'Moose', 'Reindeer', 'Camel', 
  'Llama', 'Alpaca', 'Sloth', 'Armadillo', 'Anteater', 'Meerkat', 'Lemur', 
  'Chimpanzee', 'Gorilla', 'Orang-utan', 'Baboon', 'Capybara', 'Red Panda', 
  'Otter', 'Raccoon', 'Wolverine', 'Mongoose',
  
  // Рептилии (12)
  'Komodo Dragon', 'Iguana', 'Chameleon', 'Gecko', 'Python', 'Red Tail Boa (common boa)', 
  'Anaconda', 'King Cobra', 'Crocodile', 'Alligator', 'Sea Turtle', 'Giant Tortoise',
  
  // Птицы (20)
  'Bald Eagle', 'Heron', 'Owl', 'Barn Owl', 'Snowy Owl', 'Falcon', 
  'Ferruginous Hawk', 'Vulture', 'Penguin', 'Flamingo', 'Peacock', 'Ostrich', 'Emu', 
  'Toucan', 'Parrot', 'Macaw', 'Cockatoo', 'Swan', 'Crane', 'Stork',
  
  // Земноводные (5)
  'Poison Dart Frog', 'Green Tree Frog', 'Salamander', 'Axolotl', 'Common Toad',
  
  // Лучепёрые рыбы (4)
  'Clownfish', 'Tang', 'Piranha', 'Electric Eel',
  
  // Хрящевые рыбы (5)
  'Stingray', 'Manta Ray', 'Great White Shark', 'Hammerhead Shark', 'Tiger Shark',
  
  // Головоногие моллюски (2)
  'Octopus', 'Squid',
  
  // Сцифоидные медузы (1)
  'Jellyfish',
  
  // Морские звезды (1)
  'Starfish'
];

// Научная классификация животных по классу
const animalTaxonomy = {
  // Млекопитающие — Mammalia
  "Lion": { class: "Mammalia", name_ru: "Лев" },
  "Tiger": { class: "Mammalia", name_ru: "Тигр" },
  "Cheetah": { class: "Mammalia", name_ru: "Гепард" },
  "Leopard": { class: "Mammalia", name_ru: "Леопард" },
  "Jaguar": { class: "Mammalia", name_ru: "Ягуар" },
  "Snow Leopard": { class: "Mammalia", name_ru: "Снежный барс" },
  "Lynx": { class: "Mammalia", name_ru: "Рысь" },
  "Cougar": { class: "Mammalia", name_ru: "Пума" },
  "Serval": { class: "Mammalia", name_ru: "Сервал" },
  "Caracal": { class: "Mammalia", name_ru: "Каракал" },
  "Hyena": { class: "Mammalia", name_ru: "Гиена" },
  "African Wild Dog": { class: "Mammalia", name_ru: "Африканская дикая собака" },
  "Wolf": { class: "Mammalia", name_ru: "Волк" },
  "Red Fox": { class: "Mammalia", name_ru: "Красная лисица" },
  "Arctic Fox": { class: "Mammalia", name_ru: "Песец" },
  "Brown Bear": { class: "Mammalia", name_ru: "Бурый медведь" },
  "Polar Bear": { class: "Mammalia", name_ru: "Белый медведь" },
  "Giant Panda Bear": { class: "Mammalia", name_ru: "Большая панда" },
  "Koala": { class: "Mammalia", name_ru: "Коала" },
  "Kangaroo": { class: "Mammalia", name_ru: "Кенгуру" },
  "Wallaby": { class: "Mammalia", name_ru: "Валлаби" },
  "Giraffe": { class: "Mammalia", name_ru: "Жираф" },
  "Zebra": { class: "Mammalia", name_ru: "Зебра" },
  "Elephant": { class: "Mammalia", name_ru: "Слон" },
  "Rhinoceros": { class: "Mammalia", name_ru: "Носорог" },
  "Hippopotamus": { class: "Mammalia", name_ru: "Бегемот" },
  "Bison": { class: "Mammalia", name_ru: "Бизон" },
  "Buffalo": { class: "Mammalia", name_ru: "Буффало" },
  "Antelope": { class: "Mammalia", name_ru: "Антилопа" },
  "Gazelle": { class: "Mammalia", name_ru: "Газель" },
  "Moose": { class: "Mammalia", name_ru: "Лось" },
  "Reindeer": { class: "Mammalia", name_ru: "Северный олень" },
  "Camel": { class: "Mammalia", name_ru: "Верблюд" },
  "Llama": { class: "Mammalia", name_ru: "Лама" },
  "Alpaca": { class: "Mammalia", name_ru: "Альпака" },
  "Sloth": { class: "Mammalia", name_ru: "Ленивец" },
  "Armadillo": { class: "Mammalia", name_ru: "Броненосец" },
  "Anteater": { class: "Mammalia", name_ru: "Муравьед" },
  "Meerkat": { class: "Mammalia", name_ru: "Сурикат" },
  "Lemur": { class: "Mammalia", name_ru: "Лемур" },
  "Chimpanzee": { class: "Mammalia", name_ru: "Шимпанзе" },
  "Gorilla": { class: "Mammalia", name_ru: "Горилла" },
  "Orang-utan": { class: "Mammalia", name_ru: "Орангутан" },
  "Baboon": { class: "Mammalia", name_ru: "Павиан" },
  "Capybara": { class: "Mammalia", name_ru: "Капибара" },
  "Red Panda": { class: "Mammalia", name_ru: "Красная панда" },
  "Otter": { class: "Mammalia", name_ru: "Выдра" },
  "Raccoon": { class: "Mammalia", name_ru: "Енот" },
  "Wolverine": { class: "Mammalia", name_ru: "Росомаха" },
  "Mongoose": { class: "Mammalia", name_ru: "Мангуста" },

  // Рептилии — Reptilia
  "Komodo Dragon": { class: "Reptilia", name_ru: "Комодский варан" },
  "Iguana": { class: "Reptilia", name_ru: "Игуана" },
  "Chameleon": { class: "Reptilia", name_ru: "Хамелеон" },
  "Gecko": { class: "Reptilia", name_ru: "Геккон" },
  "Ball Python": { class: "Reptilia", name_ru: "Питон" },
  "Red Tail Boa (common boa)": { class: "Reptilia", name_ru: "Краснохвостый удав" },
  "Anaconda": { class: "Reptilia", name_ru: "Анаконда" },
  "King Cobra": { class: "Reptilia", name_ru: "Королевская кобра" },
  "Crocodile": { class: "Reptilia", name_ru: "Крокодил" },
  "Alligator": { class: "Reptilia", name_ru: "Аллигатор" },
  "Sea Turtle": { class: "Reptilia", name_ru: "Морская черепаха" },
  "Aldabra Giant Tortoise": { class: "Reptilia", name_ru: "Гигантская черепаха Альдабра" },
  // Птицы — Aves
  "Bald Eagle": { class: "Aves", name_ru: "Белоголовый орлан" },
  "Heron": { class: "Aves", name_ru: "Цапля" },
  "Owl": { class: "Aves", name_ru: "Сова" },
  "Barn Owl": { class: "Aves", name_ru: "Сипуха" },
  "Snowy Owl": { class: "Aves", name_ru: "Полярная сова" },
  "Falcon": { class: "Aves", name_ru: "Сокол" },
  "Ferruginous Hawk": { class: "Aves", name_ru: "Ржавый ястреб" },
  "Vulture": { class: "Aves", name_ru: "Гриф" },
  "Penguin": { class: "Aves", name_ru: "Пингвин" },
  "Flamingo": { class: "Aves", name_ru: "Фламинго" },
  "Peacock": { class: "Aves", name_ru: "Павлин" },
  "Ostrich": { class: "Aves", name_ru: "Страус" },
  "Emu": { class: "Aves", name_ru: "Эму" },
  "Toucan": { class: "Aves", name_ru: "Тукан" },
  "Parrot": { class: "Aves", name_ru: "Попугай" },
  "Macaw": { class: "Aves", name_ru: "Ара" },
  "Cockatoo": { class: "Aves", name_ru: "Какаду" },
  "Swan": { class: "Aves", name_ru: "Лебедь" },
  "Crane": { class: "Aves", name_ru: "Журавль" },
  "Stork": { class: "Aves", name_ru: "Аист" },

  // Земноводные - Amphibia
  "Poison Dart Frog": { class: "Amphibia", name_ru: "Ядовитая стрелковая лягушка" },
  "Tree Frog": { class: "Amphibia", name_ru: "Древесная лягушка" },
  "Salamander": { class: "Amphibia", name_ru: "Саламандра" },
  "Axolotl": { class: "Amphibia", name_ru: "Аксолотль" },
  "Common Toad": { class: "Amphibia", name_ru: "Обыкновенная жаба" },

  // Лучепёрые рыбы - Actinopterygii
  "Clownfish": { class: "Actinopterygii", name_ru: "Клоун-фиш" },
  "Tang": { class: "Actinopterygii", name_ru: "Хирург" },
  "Piranha": { class: "Actinopterygii", name_ru: "Пиранья" },
  "Electric Eel": { class: "Actinopterygii", name_ru: "Электрический угорь" },

  // Хрящевые рыбы - Chondrichthyes
  "Stingray": { class: "Chondrichthyes", name_ru: "Скат" },
  "Manta Ray": { class: "Chondrichthyes", name_ru: "Манта" },
  "Shark": { class: "Chondrichthyes", name_ru: "Акула" },
  "Hammerhead Shark": { class: "Chondrichthyes", name_ru: "Акула-молот" },
  "Tiger Shark": { class: "Chondrichthyes", name_ru: "Тигровая акула" },

  // Головоногие моллюски - Cephalopoda
  "Octopus": { class: "Cephalopoda", name_ru: "Осьминог" },
  "Squid": { class: "Cephalopoda", name_ru: "Кальмар" },
  // Сцифоидные медузы - Scyphozoa
  "Jellyfish": { class: "Scyphozoa", name_ru: "Сцифоидная медуза" },

  // Морские звезды - Asteroidea
  "Starfish": { class: "Asteroidea", name_ru: "Морская звезда" }
};

// Кибер-префиксы и суффиксы
const cyberPrefixes = [
  "Cyber", "Holo", "Neon", "Quantum", "Nano", "Proto", "Omega", "Hyper", 
  "Digital", "Plasma", "Neural", "Binary", "Matrix", "Synth", "Chrome", "Volt"
];

const cyberSuffixes = [
  "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Theta", "Omega",
  "ZX", "MK-II", "X1", "2077", "Prime", "Neo", "Core", "Max"
];

// Функция для точного поиска животного в результатах API
function findExactAnimal(animals, searchName) {
  // Пробуем найти точное соответствие по имени
  let exactMatch = animals.find(animal => 
    animal.name.toLowerCase().trim() === searchName.toLowerCase().trim()
  );
  
  if (exactMatch) return exactMatch;
  
  // Если точного не найдено, ищем наиболее подходящий
  // Убираем распространённые префиксы из поискового запроса для сравнения
  const cleanSearchName = searchName
    .replace(/\b(Golden|Bald|Red|Arctic|Brown|Polar|Snow|African|Wild|Poison|Dart|Blue|Electric|Manta|Hammerhead|Tiger|King|Giant|Tree|Barn|Snowy)\s+/gi, '')
    .toLowerCase().trim();
  
  return animals.find(animal => {
    const cleanAnimalName = animal.name
      .replace(/\b(Golden|Bald|Red|Arctic|Brown|Polar|Snow|African|Wild|Poison|Dart|Blue|Electric|Manta|Hammerhead|Tiger|King|Giant|Tree|Barn|Snowy)\s+/gi, '')
      .toLowerCase().trim();
    
    return cleanAnimalName === cleanSearchName ||
           animal.name.toLowerCase().includes(cleanSearchName) ||
           cleanSearchName.includes(cleanAnimalName);
  });
}

// Определяем класс животного по таксономии
function getAnimalClass(animalName, apiAnimal) {
  // Сначала проверяем нашу таблицу таксономии
  if (animalTaxonomy[animalName]) {
    return animalTaxonomy[animalName].class;
  }
  
  // Если нет в таблице, пробуем извлечь из API
  const taxonomyClass = apiAnimal?.taxonomy?.class;
  if (taxonomyClass) {
    return taxonomyClass;
  }
  
  // Fallback - определяем по характеристикам
  const group = apiAnimal?.characteristics?.group?.toLowerCase() || '';
  if (group.includes('mammal')) return 'Mammalia';
  if (group.includes('reptile')) return 'Reptilia';
  if (group.includes('bird')) return 'Aves';
  if (group.includes('amphibian')) return 'Amphibia';
  if (group.includes('fish')) return 'Actinopterygii';
  
  return 'Other';
}

// Генерируем случайное кибер-имя
function generateCyberName(originalName) {
  const prefix = cyberPrefixes[Math.floor(Math.random() * cyberPrefixes.length)];
  const suffix = cyberSuffixes[Math.floor(Math.random() * cyberSuffixes.length)];
  
  // Просто добавляем кибер-префикс и суффикс к полному имени
  return `${prefix} ${originalName} ${suffix}`;
}

// Генерируем энергию и настроение на основе характеристик животного
function generateStatsFromCharacteristics(animal) {
  const characteristics = animal.characteristics || {};
  
  let baseEnergy = 60;
  
  // Образ жизни влияет на энергию
  const lifestyle = characteristics.lifestyle?.toLowerCase() || '';
  if (lifestyle.includes('diurnal')) baseEnergy += 15;
  if (lifestyle.includes('nocturnal')) baseEnergy += 10;
  if (lifestyle.includes('cathemeral')) baseEnergy += 20;
  
  // Скорость влияет на энергию
  const topSpeed = characteristics.top_speed || '';
  if (topSpeed.includes('mph')) {
    const speed = parseInt(topSpeed);
    if (speed > 50) baseEnergy += 20;
    else if (speed > 25) baseEnergy += 10;
  }
  
  // Диета влияет на энергию
  const diet = characteristics.diet?.toLowerCase() || '';
  if (diet.includes('carnivore')) baseEnergy += 15;
  if (diet.includes('herbivore')) baseEnergy += 5;
  if (diet.includes('omnivore')) baseEnergy += 10;
  
  // Ограничиваем энергию от 30 до 95
  const energy = Math.min(95, Math.max(30, baseEnergy + Math.floor(Math.random() * 20 - 10)));
  
  // Настроение зависит от энергии
  const moods = ['happy', 'excited', 'playful', 'calm', 'curious'];
  let mood = moods[Math.floor(Math.random() * moods.length)];
  
  if (energy > 80) mood = Math.random() > 0.5 ? 'excited' : 'playful';
  else if (energy > 60) mood = Math.random() > 0.5 ? 'happy' : 'curious';
  else if (energy < 50) mood = 'calm';
  
  return { energy, mood };
}

// Получаем случайный эмодзи для класса животного
function getRandomEmoji(animalClass) {
  const emojis = animalEmojis[animalClass] || ['🤖🔮'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Основная функция загрузки данных
async function fetchAnimalsData() {
  try {
    console.log('Начинаем загрузку 100 кибер-питомцев из API Ninjas...');
    
    const allPets = [];
    const seenNames = new Set();
    let petId = 1;
    let successCount = 0;
    
    for (const animalName of animalNames) {
      console.log(`Загружаем данные для: ${animalName}... (${successCount + 1}/100)`);
      
      try {
        const response = await fetch(`${BASE_URL}?name=${encodeURIComponent(animalName)}`, {
          headers: {
            'X-Api-Key': API_KEY
          }
        });
        
        if (!response.ok) {
          console.warn(`Ошибка для ${animalName}: ${response.status}`);
          continue;
        }
        
        const animals = await response.json();
        
        if (animals && animals.length > 0) {
          const animal = findExactAnimal(animals, animalName);
          
          if (animal) {
            const animalClass = getAnimalClass(animalName, animal);
            const cyberName = generateCyberName(animal.name);
            
            if (seenNames.has(cyberName)) {
              console.warn(`Дубликат имени: ${cyberName}`);
              continue;
            }
            seenNames.add(cyberName);
            
            const { energy, mood } = generateStatsFromCharacteristics(animal);
            
            const pet = {
              id: petId.toString(),
              name: cyberName,
              species: animalClass,
              mood: mood,
              energy: energy,
              level: Math.floor(Math.random() * 5) + 1,
              originalName: animal.name,
              characteristics: animal.characteristics || {}, // Добавляем полные характеристики
              taxonomy: animal.taxonomy || {} // Добавляем таксономию для дополнительной информации
            };
            
            allPets.push(pet);
            petId++;
            successCount++;
            
            console.log(`Создан питомец: ${cyberName} (${animalClass})`);
          } else {
            console.warn(`Точное соответствие не найдено для: ${animalName}`);
          }
        } else {
          console.warn(`Данные не найдены для: ${animalName}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
      } catch (error) {
        console.error(`Ошибка при загрузке ${animalName}:`, error.message);
      }
    }
    
    console.log(`\nЗагружено ${allPets.length} уникальных кибер-питомцев из 100 запланированных!`);
    
    allPets.sort((a, b) => a.species.localeCompare(b.species));
    
    // Генерируем TypeScript файл с обновленным интерфейсом
    const fileContent = `// Автоматически сгенерированный файл кибер-питомцев
// Сгенерировано: ${new Date().toLocaleString()}
// Источник: API Ninjas Animals API
// Всего питомцев: ${allPets.length}

export interface Pet {
  id: string;
  name: string;
  species: string;
  mood: string;
  energy: number;
  level: number;
  originalName?: string;
  characteristics?: Record<string, string>;
  taxonomy?: Record<string, string>;
}

export const petsData: Pet[] = ${JSON.stringify(allPets, null, 2)};

export default petsData;
`;
    
    // Сохраняем файлы
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outputPath = path.resolve(__dirname, '../src/data/pets.ts');
    
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, fileContent);
    console.log(`TypeScript файл сохранен: ${outputPath}`);
    console.log(`Файл содержит полные данные с characteristics`);
    
    // Выводим статистику по научным классам
    const classMapping = {
      'Mammalia': 'Млекопитающие',
      'Reptilia': 'Пресмыкающиеся', 
      'Aves': 'Птицы',
      'Amphibia': 'Земноводные',
      'Actinopterygii': 'Лучепёрые рыбы',
      'Chondrichthyes': 'Хрящевые рыбы',
      'Cephalopoda': 'Головоногие моллюски',
      'Scyphozoa': 'Сцифоидные медузы',
      'Asteroidea': 'Морские звезды'
    };
    
    const classStats = allPets.reduce((acc, pet) => {
      const classRu = classMapping[pet.species] || pet.species;
      acc[classRu] = (acc[classRu] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nСтатистика по научным классам:');
    Object.entries(classStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([className, count]) => {
        console.log(`  ${className}: ${count} питомцев`);
      });
    
    console.log(`\nВсего сгенерировано: ${allPets.length} кибер-питомцев`);
    
  } catch (error) {
    console.error('Критическая ошибка:', error.message);
  }
}

// Запускаем скрипт
fetchAnimalsData();
