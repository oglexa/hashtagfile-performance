import { sleep } from "k6";
// Импортируем функцию уникализации
import { uploadFile, verifyFile, getUniqueFileBuffer } from "../src/api.js";

// Для стресс-теста (100 VUs) берем маленький файл.
// Иначе мы упремся в сеть (100 Мбит), а не в производительность сервера.
const smallFile = {
    name: 'test_small.pdf',
    data: open('../data/test_small.pdf', 'b'),
};

export const options = {
  stages: [
    { duration: "1m", target: 50 },  // Быстрый выход на норму
    { duration: "2m", target: 100 }, // Перегрузка (x2 от нормы)
    { duration: "1m", target: 100 }, // Стресс-тест на пике
    { duration: "1m", target: 0 },   // Спуск
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"], // Допускаем до 5% ошибок при стрессе
    // Можно добавить порог времени, но для стресса это не критично
    // http_req_duration: ["p(95)<5000"], 
  },
};

export default function () {
  // 1. Генерируем уникальный буфер (чтобы обойти хэш-проверку)
  const uniqueData = getUniqueFileBuffer(smallFile.data);

  // 2. Загружаем (передаем имя и данные отдельно)
  uploadFile(smallFile.name, uniqueData);
  
  sleep(1);
  
  // 3. Верифицируем
  verifyFile(smallFile.name, uniqueData);
}