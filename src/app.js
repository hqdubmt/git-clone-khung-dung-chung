const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandlerUtils = require('./utils/errorHandler.utils');
const { NotFoundError } = require('./cors/reasonPhrases.cors');

// Nạp cấu hình môi trường đã xử lý xong xuôi từ thư mục configs
const finalConfig = require('./configs/app.config');

const app = express();

// Lưu cấu hình vào bộ nhớ của app để file server.js có thể lấy ra sử dụng
app.set('config', finalConfig);

// CÀI ĐẶT CÁC MIDDLEWARES (Phần mềm trung gian tối ưu hệ thống)
app.use(cors()); // Cho phép ứng dụng/trình duyệt bên ngoài truy cập vào API của bạn
app.use(express.json()); // Cho phép Server đọc dữ liệu định dạng JSON do khách hàng gửi lên
app.use(compression()); // Tự động nén dữ liệu trả về giúp tăng tốc độ tải trang
app.use(helmet()); // Tự động thiết lập các lớp bảo mật để bảo vệ server khỏi hacker
app.use(cookieParser()); // Hỗ trợ đọc và xử lý cookie bảo mật (dùng cho đăng nhập)

// Tự động nhận diện kiểu ghi log lịch sử truy cập theo môi trường (dev hoặc combined)
app.use(morgan(finalConfig.LOG_FORMAT));

// PHÂN CHIA PHIÊN BẢN API (Group Versioning)
const apiRouter = express.Router();
const v1Routes = require('./app/v1/routers/index');

// Gộp các đường dẫn v1 vào API chính
apiRouter.use('/v1', v1Routes); // Tạo ra đường dẫn dạng: /api/v1
app.use('/api', apiRouter);     // Tạo ra đường dẫn gốc: /api

app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});
app.use(errorHandlerUtils); // Bắt lỗi và trả về thông tin lỗi cho khách hàng

module.exports = app;
