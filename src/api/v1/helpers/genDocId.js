const nanoid = require('nanoid');

const genDocId = nanoid.customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16);

module.exports = genDocId; // generating document ID when add any data to database