import { sleep } from 'k6';
import { uploadFile, verifyFile, getUniqueFileBuffer } from '../src/api.js';

// Прямая загрузка большого файла, минуя общий data-loader
// Убедитесь, что файл test_50MB.pdf существует в папке data (и он < 50MB)
const hugeFile = {
    name: 'test_50MB.pdf',
    data: open('../data/test_50MB.pdf', 'b'),
};

export const options = {
    scenarios: {
        large_file_upload: {
            executor: 'constant-vus',
            vus: 2,              // Всего 2 пользователя (чтобы не убить сеть)
            duration: '3m',      // Тестируем 3 минуты
        },
    },
    thresholds: {
        // Для больших файлов время ожидания может быть долгим, ставим порог 60 сек
        http_req_duration: ['p(95)<60000'], 
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    // 1. Генерируем уникальную копию большого файла
    // ВНИМАНИЕ: Это займет ~50 МБ RAM. 
    const uniqueData = getUniqueFileBuffer(hugeFile.data);

    // 2. Загружаем
    uploadFile(hugeFile.name, uniqueData);
    
    sleep(5); // Даем "отдохнуть" каналу
    
    // 3. Верифицируем
    verifyFile(hugeFile.name, uniqueData);
    
    sleep(2);
}