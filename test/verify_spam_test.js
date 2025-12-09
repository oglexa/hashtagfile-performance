import { check } from 'k6';
import { verifyFile, getUniqueFileBuffer } from '../src/api.js';

const smallFile = {
    name: 'test_small.pdf',
    data: open('../data/test_small.pdf', 'b'),
};

export const options = {
    scenarios: {
        aggressive_verify: {
            executor: 'constant-arrival-rate', // Держим ритм
            rate: 1000,      // 1000 запросов
            timeUnit: '1m',  // в минуту
            duration: '2m',  // тест идет 2 минуты
            preAllocatedVUs: 50, // Выделяем до 50 потоков
            maxVUs: 100,
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.01'],     // Ошибок быть не должно
        http_req_duration: ['p(95)<2000'],  // Мелкие файлы должны проверяться быстро (<2с)
    },
};

export default function () {
    const uniqueData = getUniqueFileBuffer(smallFile.data);
    verifyFile(smallFile.name, uniqueData);
}