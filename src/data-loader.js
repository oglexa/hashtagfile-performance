// src/data-loader.js

const files = [
{ name: 'test_1MB.pdf', data: open('../data/test_1MB.pdf', 'b') },
{ name: 'test_1MB_v2.pdf', data: open('../data/test_1MB.pdf', 'b') },
{ name: 'test_5MB.pdf', data: open('../data/test_5MB.pdf', 'b') },
{ name: 'test_25MB.pdf', data: open('../data/test_25MB.pdf', 'b') },
{ name: 'test_50MB.pdf', data: open('../data/test_50MB.pdf', 'b') },
];

export function getRandomFile() {
    // Возвращаем случайный файл из массива
    return files[Math.floor(Math.random() * files.length)];
}