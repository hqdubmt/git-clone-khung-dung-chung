const appConstants = require('../constants/app.constant');
const appHelper = require('../helpers/app.helper');

// Kịch bản 1: Môi trường Phát triển (Dành cho bạn lập trình trên máy cá nhân)
const Dev = {
  PORT: process.env.APP_PORT || appConstants.APP_PORT,
  ENV: 'Dev',
  LOG_FORMAT: appConstants.MORGAN_FORMAT.DEV // Hiện thị log ngắn gọn, có màu xanh đỏ dễ nhìn
};

// Kịch bản 2: Môi trường Chạy thực tế (Khi bạn up lên mạng cho khách hàng dùng thật)
const Prod = {
  PORT: process.env.APP_PORT || 8080, // Thực tế thường chạy cổng mạng tiêu chuẩn
  ENV: 'Prod',
  LOG_FORMAT: appConstants.MORGAN_FORMAT.COMBINED // Ghi log cực kỳ chi tiết (IP, thiết bị) để bảo mật
};

// Gom tất cả kịch bản vào một đối tượng quản lý
const configMapping = {
  Dev,
  Prod
};

// Đọc xem file .env đang yêu cầu môi trường nào (Mặc định nếu quên điền là 'Dev')
const currentEnv = process.env.APP_ENV || 'Dev';

// Sử dụng trợ thủ helper để lọc và xuất ra đúng cấu hình được yêu cầu
module.exports = appHelper.getConfig(currentEnv, configMapping);
