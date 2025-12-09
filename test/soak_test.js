import { sleep } from "k6";
import { getRandomFile } from "../src/data-loader.js";
import { uploadFile, verifyFile, getUniqueFileBuffer } from "../src/api.js";

export const options = {
  stages: [
    { duration: "2m", target: 5 },   // Очень плавный разгон
    { duration: "56m", target: 5 },  // ДЛИТЕЛЬНАЯ работа (Soak)
    { duration: "2m", target: 0 },   // Плавное завершение
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"], // Ошибок быть не должно
    // Мы не ставим жесткий порог по времени, так как цель - увидеть график
  },
};

export default function () {
  const fileTemplate = getRandomFile();
  const uniqueData = getUniqueFileBuffer(fileTemplate.data);

  // Загрузка
  uploadFile(fileTemplate.name, uniqueData);
  
  // Важно: в Soak тестах паузы (sleep) чуть больше, 
  // чтобы имитировать реальную размеренную работу
  sleep(5); 
  
  // Проверка
  verifyFile(fileTemplate.name, uniqueData);
  
  sleep(5);
}