import { sleep } from "k6";
import { getRandomFile } from "../src/data-loader.js";
import { uploadFile, verifyFile } from "../src/api.js";

export const options = {
  stages: [
    { duration: "1m", target: 50 }, // Быстрый выход на норму
    { duration: "2m", target: 100 }, // Перегрузка (x2 от нормы)
    { duration: "1m", target: 100 }, // Стресс-тест на пике
    { duration: "1m", target: 0 }, // Спуск
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"], // Допускаем до 5% ошибок при стрессе
  },
};

export default function () {
  const file = getRandomFile();

  uploadFile(file);
  sleep(1);
  verifyFile(file);
}
