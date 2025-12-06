import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// 1. Инициализация файлов (Загружаем в память один раз)
// Мы используем SharedArray, чтобы не дублировать данные файлов для каждого VU (экономим RAM)
const files = new SharedArray('Test Files', function () {
  return [
    { name: 'test_1MB.pdf', data: open('./test_1MB.pdf', 'b') },
    { name: 'test_5MB.pdf', data: open('./test_5MB.pdf', 'b') },
    { name: 'test_25MB.pdf', data: open('./test_25MB.pdf', 'b') },
    { name: 'test_50MB.pdf', data: open('./test_50MB.pdf', 'b') },
  ];
});

// 2. Конфигурация нагрузки
export const options = {
  scenarios: {
    upload_verify_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 }, // Разгон до 20 VU
        { duration: '1m', target: 50 },  // Плавный рост до 50 VU
        { duration: '2m', target: 50 },  // Удержание нагрузки
        { duration: '30s', target: 0 },  // Завершение
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% запросов должны быть быстрее 5 сек (можно увеличить для больших файлов)
    http_req_failed: ['rate<0.01'],    // Ошибок менее 1%
  },
};

const BASE_URL = 'https://test.hashtagfile.com'; [cite_start]// [cite: 3]

export default function () {
  // Выбираем случайный файл из подготовленных
  const randomFile = files[Math.floor(Math.random() * files.length)];
  
  [cite_start]// Генерируем timestamp (Unix timestamp) [cite: 17, 30]
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Общие параметры для запросов (увеличиваем таймаут для больших файлов)
  const params = {
    timeout: '120s', 
  };

  // --- SCENARIO 1: UPLOAD FILE ---
  [cite_start]// Endpoint: POST /api/upload [cite: 10]
  
  const uploadData = {
    file: http.file(randomFile.data, randomFile.name, 'application/pdf'), 
    page_load_timestamp: timestamp,
    include_file: 'true', // Из Postman коллекции
  };

  const uploadRes = http.post(`${BASE_URL}/api/upload`, uploadData, params);

  check(uploadRes, {
    'Upload status is 200': (r) => r.status === 200,
    'Upload response has body': (r) => r.body.length > 0,
  });

  // Небольшая пауза между загрузкой и проверкой (имитация поведения пользователя)
  sleep(1);

  // --- SCENARIO 2: VERIFY FILE ---
  [cite_start]// Endpoint: POST /api/verify [cite: 25]
  [cite_start]// Отправляем тот же файл для верификации [cite: 26]
  
  const verifyData = {
    file: http.file(randomFile.data, randomFile.name, 'application/pdf'),
    page_load_timestamp: timestamp,
  };

  const verifyRes = http.post(`${BASE_URL}/api/verify`, verifyData, params);

  check(verifyRes, {
    'Verify status is 200': (r) => r.status === 200,
  });

  sleep(1);
}