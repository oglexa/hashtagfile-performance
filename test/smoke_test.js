import { sleep } from "k6";
import { getRandomFile } from "../src/data-loader.js";
import { uploadFile, verifyFile, getUniqueFileBuffer } from "../src/api.js";

export const options = {
  vus: 1,           // Строго 1 пользователь
  duration: "1m",   // Увеличили до 1 минуты для сбора статистики
  thresholds: {
    http_req_failed: ["rate==0.00"], 
  },
};

export default function () {
    const fileTemplate = getRandomFile();

    // Проверки на null можно убрать для финального прогона, 
    // если вы уверены, что файлы грузятся (мы это уже проверили)
    
    // 1. Уникализируем
    const uniqueData = getUniqueFileBuffer(fileTemplate.data);

    // 2. Загружаем
    uploadFile(fileTemplate.name, uniqueData);
    
    sleep(1);
    
    // 3. Верифицируем
    verifyFile(fileTemplate.name, uniqueData);
    
    sleep(1);
}