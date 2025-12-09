import { check } from 'k6';
import { uploadFile, getUniqueFileBuffer } from '../src/api.js';

// Загружаем маленький файл напрямую
const smallFile = {
    name: 'test_small.pdf',
    data: open('../data/test_small.pdf', 'b'),
};

export const options = {
    stages: [
        { duration: '10s', target: 10 },  // Разминка
        { duration: '10s', target: 200 }, // 🚀 УДАР: Резкий рост до 200 пользователей
        { duration: '40s', target: 200 }, // Удержание пика
        { duration: '10s', target: 0 },   // Спад
    ],
    thresholds: {
        // При спайке допускаем чуть больше ошибок (до 5%), сервер может "чихать"
        http_req_failed: ['rate<0.05'], 
    },
};

export default function () {
    const uniqueData = getUniqueFileBuffer(smallFile.data);
    uploadFile(smallFile.name, uniqueData);
}