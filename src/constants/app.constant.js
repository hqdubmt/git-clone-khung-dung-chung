const appConstants = {
  // Cổng mặc định dự phòng nếu file .env không khai báo
  APP_PORT: 5001,

  // Các định dạng ghi log chuẩn của thư viện Morgan
  MORGAN_FORMAT: {
    DEV: 'dev',
    COMBINED: 'combined'
  },
  
  // Danh sách mã lỗi tiêu chuẩn quốc tế (Dùng để trả về cho người dùng sau này)
  HTTP_STATUS: {
    OK: 200,                  // Thành công mượt mà
    CREATED: 201,             // Tạo mới dữ liệu (đăng ký, tạo đơn hàng) thành công
    BAD_REQUEST: 400,         // Dữ liệu người dùng gửi lên bị sai/thiếu
    UNAUTHORIZED: 401,        // Chưa đăng nhập tài khoản
    FORBIDDEN: 403,           // Đã đăng nhập nhưng không có quyền truy cập (Ví dụ khách vào trang Admin)
    NOT_FOUND: 404,           // Không tìm thấy đường dẫn hoặc dữ liệu
    INTERNAL_SERVER_ERROR: 500 // Lỗi sập nguồn từ phía code của Server
  }
};

module.exports = appConstants;
