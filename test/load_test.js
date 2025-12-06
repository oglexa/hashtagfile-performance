import { sleep } from "k6";
import { getRandomFile } from "../src/data-loader.js";
// Добавляем импорт функции уникализации
import { uploadFile, verifyFile, getUniqueFileBuffer } from "../src/api.js";

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // Плавный разгон до 20
    { duration: "1m", target: 50 },  // Рост до целевых 50
    { duration: "3m", target: 50 },  // Удержание нагрузки (Плато)
    { duration: "30s", target: 0 },  // Остывание
  ],
  thresholds: {
    http_req_duration: ["p(95)<10000"], // 95% запросов быстрее 10 сек
    http_req_failed: ["rate<0.01"],     // Ошибок меньше 1%
  },
};

export default function () {
  // 1. Берем шаблон файла
  const fileTemplate = getRandomFile();

  // 2. Генерируем уникальную копию (меняем 1 байт), чтобы хэш был новым
  // Это важно, иначе сервер скажет "файл уже загружен"
  const uniqueData = getUniqueFileBuffer(fileTemplate.data);

  // 3. Отправляем (передаем имя И уникальные данные отдельно)
  uploadFile(fileTemplate.name, uniqueData);
  
  sleep(2); // Имитация задержки пользователя
  
  // 4. Верифицируем тот же уникальный файл
  verifyFile(fileTemplate.name, uniqueData);
}