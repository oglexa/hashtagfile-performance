// src/config.js

export const BASE_URL = 'https://test.hashtagfile.com';

export const DEFAULT_PARAMS = {
    // Таймаут 3 минуты для больших файлов
    //timeout: '180s', 
    headers: {
        // --- ЗАГОЛОВКИ ИЗ ВАШЕГО НОВОГО CURL ---
        'Accept': '*/*',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Origin': 'https://test.hashtagfile.com',
        'Pragma': 'no-cache',
        'Referer': 'https://test.hashtagfile.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        
        // Эмуляция Nexus 5 / Android (важно для сервера)
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
    },
};

export function getTimestamp() {
    return Math.floor(Date.now() / 1000).toString();
}