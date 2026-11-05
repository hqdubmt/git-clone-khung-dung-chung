Đã tạo middleware:

Gom middleware chung vào src/middlewares/index.js và kết nối trong src/app.js.
Thêm xác thực Bearer JWT HS256 tại auth.middleware.js. Cần cấu hình JWT_SECRET; gắn middleware này vào route cần bảo vệ. Route đăng ký vẫn công khai.
Thêm giới hạn API 100 request/15 phút tại apiRateLimit.middleware.js.
Validate name, email, password đăng ký tại validateRegisterUser.middleware.js.
Ghi hướng dẫn sử dụng trong README.md.
Đã kiểm tra cú pháp và chạy smoke test cho JWT, validate đăng ký, rate limit; đều đạt.