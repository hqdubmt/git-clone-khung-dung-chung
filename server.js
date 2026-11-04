require('dotenv').config();
const express = require('express');
const app = require('./src/app');

// 1. Lấy cấu hình môi trường đã được xử lý từ app.js
const config = app.get('config') || {};
const PORT = config.PORT || 5001;
const ENV = config.ENV || 'Dev';

// 2. Kích hoạt Server lắng nghe các kết nối từ Internet
const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`🌍 Môi trường hiện tại: [ ${ENV.toUpperCase()} ]`);
  console.log(`=========================================`);
});

// 3. Tấm khiên bảo vệ: Chống sập ứng dụng đột ngột khi hệ thống gặp lỗi lớn (ví dụ mất kết nối Database)
process.on('unhandledRejection', (err) => {
  console.error('❌ LỖI NGHIÊM TRỌNG HỆ THỐNG:', err.message);
  server.close(() => process.exit(1)); // Tắt server êm ái rồi mới đóng tiến trình
});
