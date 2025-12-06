import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const API_KEY = '------------------------------'; // Замените на ключ от fusionbrain.ai
const SECRET_KEY = '------------------------------'; // Замените на секретный ключ
const BASE_URL = 'https://api-key.fusionbrain.ai/';

// Научная классификация животных с русскими названиями
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
  "Ferruginous Hawk": { class: "Aves", name_ru: "Королевский канюк" },
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

  // Земноводные — Amphibia
  "Poison Dart Frog": { class: "Amphibia", name_ru: "Ядовитая стрелковая лягушка" },
  "Tree Frog": { class: "Amphibia", name_ru: "Древесная лягушка" },
  "Salamander": { class: "Amphibia", name_ru: "Саламандра" },
  "Axolotl": { class: "Amphibia", name_ru: "Аксолотль" },
  "Common Toad": { class: "Amphibia", name_ru: "Обыкновенная жаба" },

  // Лучепёрые рыбы — Actinopterygii
  "Clownfish": { class: "Actinopterygii", name_ru: "Клоун-фиш" },
  "Tang": { class: "Actinopterygii", name_ru: "Хирург" },
  "Piranha": { class: "Actinopterygii", name_ru: "Пиранья" },
  "Electric Eel": { class: "Actinopterygii", name_ru: "Электрический угорь" },

  // Хрящевые рыбы — Chondrichthyes
  "Stingray": { class: "Chondrichthyes", name_ru: "Скат" },
  "Manta Ray": { class: "Chondrichthyes", name_ru: "Манта" },
  "Great White Shark": { class: "Chondrichthyes", name_ru: "Большая белая акула" },
  "Hammerhead Shark": { class: "Chondrichthyes", name_ru: "Акула-молот" },
  "Tiger Shark": { class: "Chondrichthyes", name_ru: "Тигровая акула" },

  // Головоногие моллюски — Cephalopoda
  "Octopus": { class: "Cephalopoda", name_ru: "Осьминог" },
  "Squid": { class: "Cephalopoda", name_ru: "Кальмар" },

  // Сцифоидные медузы — Scyphozoa
  "Jellyfish": { class: "Scyphozoa", name_ru: "Сцифоидная медуза" },

  // Морские звезды — Asteroidea
  "Starfish": { class: "Asteroidea", name_ru: "Морская звезда" }
};

// Класс для работы с Fusion Brain API
class FusionBrainAPI {
  constructor() {
    this.URL = BASE_URL;
    this.AUTH_HEADERS = {
      'X-Key': `Key ${API_KEY}`,
      'X-Secret': `Secret ${SECRET_KEY}`,
    };
  }

  async getPipeline() {
    try {
      const response = await fetch(`${this.URL}key/api/v1/pipelines`, {
        headers: this.AUTH_HEADERS
      });
      const data = await response.json();
      return data[0]?.id || '';
    } catch (error) {
      console.error('Ошибка получения pipeline:', error);
      throw error;
    }
  }

  async generate(prompt, pipelineId, images = 1, width = 1024, height = 1024) {
    const params = {
      type: "GENERATE",
      numImages: images,
      width,
      height,
      style: "DEFAULT",
      generateParams: {
        query: prompt
      }
    };

    const formData = new FormData();
    formData.append('pipeline_id', pipelineId);

    // Создаем Blob с явным указанием типа application/json
    const paramsBlob = new Blob([JSON.stringify(params)], { type: 'application/json' });
    formData.append('params', paramsBlob, 'blob'); 

    try {
      const response = await fetch(`${this.URL}key/api/v1/pipeline/run`, {
        method: 'POST',
        headers: this.AUTH_HEADERS,
        body: formData
      });

      const data = await response.json();
      
      // Добавим проверку, чтобы не ловить undefined
      if (!data.uuid) {
          console.error('Ответ сервера при генерации:', data);
          throw new Error(`Ошибка запуска генерации: ${JSON.stringify(data)}`);
      }

      return data.uuid;
    } catch (error) {
      console.error('Ошибка генерации изображения:', error);
      throw error;
    }
  }

  async checkGeneration(requestId, attempts = 30, delay = 10000) {
    for (let i = 0; i < attempts; i++) {
      try {
        const response = await fetch(`${this.URL}key/api/v1/pipeline/status/${requestId}`, {
          headers: this.AUTH_HEADERS
        });
        const data = await response.json();

        console.log(`Попытка ${i + 1}/${attempts}, статус: ${data.status}`);

        if (data.status === 'DONE') {
          return data.result?.files || [];
        }

        if (data.status === 'FAIL') {
          throw new Error(`Генерация не удалась: ${data.errorDescription || 'Неизвестная ошибка'}`);
        }

        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        console.error(`Ошибка проверки статуса (попытка ${i + 1}):`, error.message);
        if (i === attempts - 1) throw error;
      }
    }
    throw new Error('Превышено время ожидания генерации');
  }
}

// Генерируем кибер-панк промпт для животного
function generateCyberpunkPrompt(animalName, animalData) {
  const basePrompts = [
    `Cyberpunk animal ${animalName} with neon lights, mechanical augmentations, futuristic technology, glowing cyber implants`,
    `Animal ${animalName} in cyberpunk style with LED circuits, robotic parts, neon glow, dark futuristic background`,
    `Animal Cyber-enhanced ${animalName} with holographic elements, metallic skin, glowing eyes, sci-fi atmosphere, neon city background`,
    `Animal Futuristic ${animalName} with digital patterns, chrome details, electric aura, cyberpunk aesthetic, dark neon ambiance`
  ];

  const selectedPrompt = basePrompts[Math.floor(Math.random() * basePrompts.length)];
  
  // Добавляем специфические детали для разных классов
  let classSpecific = '';
  switch (animalData.class) {
    case 'Mammalia':
      classSpecific = ', synthetic fur with fiber optic strands, bio-mechanical joints';
      break;
    case 'Aves':
      classSpecific = ', metallic feathers with LED strips, cyber wings, holographic tail';
      break;
    case 'Reptilia':
      classSpecific = ', armored scales with digital displays, laser eyes, plasma breath';
      break;
    case 'Amphibia':
      classSpecific = ', translucent skin with visible circuits, bio-luminescent patterns';
      break;
    default:
      classSpecific = ', high-tech modifications, digital enhancements';
  }

  return selectedPrompt + classSpecific;
}

// Создаем безопасное имя файла
function createSafeFileName(animalName) {
  return animalName
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Удаляем специальные символы
    .replace(/\s+/g, '_') // Заменяем пробелы на подчеркивания
    .toLowerCase();
}

// Сохраняем base64 изображение в файл
function saveBase64Image(base64Data, fileName, outputDir) {
  try {
    // Убираем префикс data:image/png;base64, если он есть
    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const buffer = Buffer.from(cleanBase64, 'base64');
    const filePath = path.join(outputDir, `${fileName}.png`);
    
    fs.writeFileSync(filePath, buffer);
    console.log(`Изображение сохранено: ${fileName}.png`);
    
    return filePath;
  } catch (error) {
    console.error(`Ошибка сохранения изображения ${fileName}:`, error.message);
    return null;
  }
}

// Основная функция генерации изображений
async function generateAllImages() {
  try {
    console.log('Начинаем генерацию кибер-панк изображений животных...\n');
    
    // Проверяем API ключи
    if (API_KEY === 'YOUR_API_KEY_HERE' || SECRET_KEY === 'YOUR_SECRET_KEY_HERE') {
      throw new Error('Необходимо указать API_KEY и SECRET_KEY от Fusion Brain!');
    }

    // Создаем директорию для изображений
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const imagesDir = path.resolve(__dirname, '../public/images/animals');
    
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log(`Создана папка: ${imagesDir}\n`);
    }

    // Инициализируем API
    const api = new FusionBrainAPI();
    const pipelineId = await api.getPipeline();
    console.log(`Pipeline ID получен: ${pipelineId}\n`);

    const animalNames = Object.keys(animalTaxonomy);
    const successfulImages = [];
    const failedImages = [];

    let currentIndex = 1;
    const totalAnimals = animalNames.length;

    for (const animalName of animalNames) {
      const animalData = animalTaxonomy[animalName];
      const safeFileName = createSafeFileName(animalName);
      const filePath = path.join(imagesDir, `${safeFileName}.png`);

      console.log(`[${currentIndex}/${totalAnimals}] Генерируем изображение: ${animalName} (${animalData.name_ru})`);

      // Проверяем, существует ли уже файл
      if (fs.existsSync(filePath)) {
        console.log(`Файл уже существует, пропускаем...`);
        successfulImages.push({
          name: animalName,
          fileName: `${safeFileName}.png`,
          class: animalData.class
        });
        currentIndex++;
        continue;
      }

      try {
        // Генерируем промпт
        const prompt = generateCyberpunkPrompt(animalName, animalData);
        console.log(`Промпт: ${prompt.substring(0, 100)}...`);

        // Отправляем запрос на генерацию
        const requestId = await api.generate(prompt, pipelineId);
        console.log(`Запрос отправлен, ID: ${requestId}`);
        // Ждем результат
        const files = await api.checkGeneration(requestId);

        if (files && files.length > 0) {
          // Сохраняем изображение
          const savedPath = saveBase64Image(files[0], safeFileName, imagesDir);
          
          if (savedPath) {
            successfulImages.push({
              name: animalName,
              fileName: `${safeFileName}.png`,
              class: animalData.class,
              prompt: prompt
            });
          } else {
            failedImages.push({ name: animalName, error: 'Ошибка сохранения файла' });
          }
        } else {
          throw new Error('Не удалось получить файл изображения');
        }

      } catch (error) {
        console.error(`Ошибка для ${animalName}: ${error.message}`);
        failedImages.push({ 
          name: animalName, 
          error: error.message 
        });
      }

      console.log(''); // Пустая строка для разделения

      // Пауза между запросами чтобы не перегрузить API
      if (currentIndex < totalAnimals) {
        console.log('Пауза 5 секунд перед следующим запросом...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      currentIndex++;
    }

    // Создаем отчет
    const report = {
      timestamp: new Date().toISOString(),
      total: totalAnimals,
      successful: successfulImages.length,
      failed: failedImages.length,
      successfulImages,
      failedImages
    };

    // Сохраняем отчет
    const reportPath = path.join(imagesDir, 'generation_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Выводим итоговую статистику
    console.log('Генерация завершена!\n');
    console.log('Статистика:');
    console.log(`Всего животных: ${totalAnimals}`);
    console.log(`Успешно сгенерировано: ${successfulImages.length}`);
    console.log(`Ошибок: ${failedImages.length}`);
    console.log(`Процент успеха: ${Math.round((successfulImages.length / totalAnimals) * 100)}%`);

    if (failedImages.length > 0) {
      console.log('\nНе удалось сгенерировать:');
      failedImages.forEach(item => {
        console.log(`- ${item.name}: ${item.error}`);
      });
    }

    // Статистика по классам
    const classCounts = successfulImages.reduce((acc, item) => {
      acc[item.class] = (acc[item.class] || 0) + 1;
      return acc;
    }, {});

    console.log('\nИзображения по классам:');
    Object.entries(classCounts).forEach(([className, count]) => {
      console.log(`  ${className}: ${count} изображений`);
    });

    console.log(`\nОтчет сохранен: ${reportPath}`);
    console.log(`Изображения сохранены в: ${imagesDir}`);
  } catch (error) {
    console.error('Критическая ошибка:', error.message);
    
    if (error.message.includes('API_KEY')) {
      console.error('\nИнструкция по получению ключей:');
      console.error('1. Зарегистрируйтесь на https://fusionbrain.ai/');
      console.error('2. Получите API Key и Secret Key');  
      console.error('3. Замените YOUR_API_KEY_HERE и YOUR_SECRET_KEY_HERE в скрипте');
    }
  }
}

// Запускаем генерацию
generateAllImages();
