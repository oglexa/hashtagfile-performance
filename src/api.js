// src/api.js
import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_PARAMS, getTimestamp } from './config.js';

export function getUniqueFileBuffer(originalData) {
    // 1. Генерируем "мусорную" добавку (Timestamp + случайное число)
    const salt = `-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    
    // 2. Преобразуем строку в массив байт
    const saltBuffer = new Uint8Array(salt.length);
    for (let i = 0; i < salt.length; i++) {
        saltBuffer[i] = salt.charCodeAt(i);
    }

    // 3. Создаем новый буфер: Оригинал + Соль
    const newBuffer = new Uint8Array(originalData.byteLength + saltBuffer.byteLength);
    newBuffer.set(new Uint8Array(originalData), 0);
    newBuffer.set(saltBuffer, originalData.byteLength);

    // 4. Возвращаем как ArrayBuffer
    return newBuffer.buffer;
}

export function uploadFile(fileName, dataBuffer) {
    const payload = {
        file: http.file(dataBuffer, fileName, 'application/pdf'),
        
        // Поля из вашего cURL
        emails: '', 
        website: '',
        page_load_timestamp: getTimestamp(), 
        include_file: 'false', // В cURL стоит false
    };

    const res = http.post(`${BASE_URL}/api/upload`, payload, DEFAULT_PARAMS);

    if (res.status !== 200) {
        console.error(`❌ Upload Failed! Status: ${res.status} | Body: ${res.body}`);
    }

    check(res, {
        'Upload status is 200': (r) => r.status === 200,
    });
    
    return res;
}

export function verifyFile(fileName, dataBuffer) {
    const payload = {
        file: http.file(dataBuffer, fileName, 'application/pdf'),
        page_load_timestamp: getTimestamp(),
    };

    const res = http.post(`${BASE_URL}/api/verify`, payload, DEFAULT_PARAMS);

    check(res, {
        'Verify status is 200': (r) => r.status === 200,
    });

    return res;
}