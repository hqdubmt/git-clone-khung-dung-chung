# Express API Starter

Bộ khung API dùng Node.js và Express, có sẵn cấu hình môi trường, middleware
cơ bản, giới hạn request, health check, xử lý lỗi tập trung và test. Clone repo
này làm điểm bắt đầu, sau đó thêm route và nghiệp vụ riêng cho từng dự án.

## Bắt đầu dự án mới

Tốt nhất, đánh dấu repo này là template trong GitHub rồi chọn **Use this
template** để tạo repo dự án mới. Cách này tạo repo mới từ bộ file hiện tại,
không mang theo lịch sử commit cũ.

Sau khi tạo repo mới:

```sh
git clone <new-project-repository-url> my-api
cd my-api
npm install
cp .env.example .env
npm run dev
```

Không nên clone repo mẫu rồi chỉ đổi remote nếu muốn lịch sử dự án mới hoàn
toàn sạch: thao tác đó vẫn giữ các commit cũ. Có thể tải source hiện tại dạng
ZIP, giải nén vào repo mới rồi khởi tạo Git riêng nếu không dùng GitHub template.

Server mặc định chạy ở `http://localhost:5001`. Kiểm tra:

```sh
curl http://localhost:5001/api/v1/health
```

Để chạy không bật chế độ theo dõi file:

```sh
npm start
```

## Cấu hình môi trường

Chỉnh file `.env` tại máy hoặc cấu hình biến môi trường trên nền tảng deploy:

| Biến | Mặc định | Mô tả |
|---|---:|---|
| `APP_ENV` | `Dev` | Chọn `Dev` hoặc `Prod`; ảnh hưởng định dạng log và port mặc định |
| `APP_PORT` | `5001` (`Dev`), `8080` (`Prod`) | Port từ 1 đến 65535; ưu tiên hơn biến `PORT` do nền tảng deploy cung cấp |
| `PORT` | do nền tảng cấp | Dùng nếu không đặt `APP_PORT` |
| `CORS_ORIGINS` | rỗng | Danh sách origin trình duyệt được phép, phân cách bằng dấu phẩy; rỗng nghĩa là tắt CORS |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Khoảng thời gian giới hạn request, tính bằng mili giây |
| `RATE_LIMIT_MAX` | `100` | Số request tối đa mỗi IP trong một khoảng thời gian |

Giá trị `APP_ENV`, port hoặc rate limit không hợp lệ sẽ làm ứng dụng báo lỗi
ngay khi khởi động. `.env` bị Git bỏ qua; chỉ commit `.env.example` và không
đưa mật khẩu, token hoặc secret vào Git.

Ví dụ cho frontend chạy ở nhiều origin:

```dotenv
CORS_ORIGINS=http://localhost:3000,https://app.example.com
```

Khi deploy, đặt các biến tương ứng trong phần environment/secrets của nền tảng.
Rate limit mặc định dùng bộ nhớ của một tiến trình. Nếu chạy nhiều instance,
cấu hình shared store cho rate limiter trước khi mở rộng production.

## Tạo API route

Tạo route trong `src/app/v1/routers/`, rồi mount vào
`src/app/v1/routers/index.js`. Thay `findItem` bằng service/database của ứng
dụng:

```js
const express = require('express');
const { asyncHandler, NotFoundError } = require('express-error-kit');

const router = express.Router();

router.get('/items/:id', asyncHandler(async (req, res) => {
  const item = await findItem(req.params.id);
  if (!item) {
    throw new NotFoundError('Item not found');
  }
  res.json(item);
}));

module.exports = router;
```

Đăng ký router mới:

```js
router.use('/items', require('./items.routes'));
```

Route được mount dưới `/api/v1`. `express-error-kit` cung cấp các lỗi HTTP,
`asyncHandler` và middleware trả lỗi JSON thống nhất. Error handler đã được
đăng ký sau routes trong `src/app.js`; lỗi 5xx không lộ chi tiết nội bộ.

## Cấu trúc chính

```text
packages/express-error-kit/  Lớp lỗi và middleware xử lý lỗi dùng lại
src/app/v1/routers/         API routes theo version
src/configs/                Cấu hình môi trường và kiểm tra biến
src/middlewares/             Middleware dùng chung
src/app.js                   Ghép middleware, routes và error handlers
server.js                    Nạp .env và chạy HTTP server
packages/express-error-kit/ Lớp lỗi và middleware xử lý lỗi dùng lại
test/                        Unit và API tests
```

## Kiểm tra

```sh
npm test
```

Khi đổi cấu hình hoặc middleware, hãy bổ sung test tương ứng. Các route mẫu
hoặc nghiệp vụ của dự án cụ thể nên được viết trong các file route riêng, không
đưa vào lớp cấu hình dùng chung.
