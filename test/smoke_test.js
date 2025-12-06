import { sleep } from "k6";
import { getRandomFile } from "../src/data-loader.js";
import { uploadFile, verifyFile, getUniqueFileBuffer } from "../src/api.js";

export const options = {
  vus: 1,
  duration: "10s", // Короткий тест
  thresholds: {
    http_req_failed: ["rate==0.00"], // Ошибок быть не должно вообще
  },
};

export default function () {
    // 1. Получаем файл
    const fileTemplate = getRandomFile();

    // ПРОВЕРКА 1: Загрузился ли файл?
    if (!fileTemplate || !fileTemplate.data) {
        console.error(`🚨 ОШИБКА: Файл не загружен! Проверьте путь в data-loader.js. Имя: ${fileTemplate ? fileTemplate.name : 'Unknown'}`);
        return; // Останавливаем итерацию
    } else {
        console.log(`File found: ${fileTemplate.name}, File size: ${fileTemplate.data.byteLength}`);
    }
    
    // 2. Уникализируем
    const uniqueData = getUniqueFileBuffer(fileTemplate.data);
    
    // ПРОВЕРКА 2: Сработала ли уникализация?
    if (!uniqueData) {
        console.error('🚨 ОШИБКА: getUniqueFileBuffer вернула null/undefined! Проверьте return в src/api.js');
        return;
    }

    // 3. Загружаем
    uploadFile(fileTemplate.name, uniqueData);
    
    sleep(1);
    
    verifyFile(fileTemplate.name, uniqueData);
    
    sleep(1);
}
