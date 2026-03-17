# Error Log & Debugging (Global)

Tiến trình lưu trữ các issue phát sinh trong quá trình xây dựng Quiz App. Mọi bug, root cause và verified solution sẽ được lưu ở đây.

## 1. Vite Build - Lỗi Recharts "react-is" không tồn tại
- **Issue**: Khi chạy lệnh `npm run build`, Rollup của Vite báo lỗi thiếu thư viện nội bộ `"react-is"` xuất phát từ components trong gói `recharts`.
- **Root Cause**: Vite v6 và Recharts trên môi trường npm 10 xử lý tree-shaking và caching package đôi lúc thắt chặt. Nó không tự resolve được file của React-is.
- **Verified Solution**: Chạy cấp tốc lệnh bổ sung bù thư viện: `npm install react-is --legacy-peer-deps`, thao tác này giúp fix build thành công tuyệt đối.

## 2. Lỗi Build TypeScript Strict: `verbatimModuleSyntax`
- **Issue**: Báo lỗi `TS1484` vì cách import các Types/Interfaces (ví dụ: Session, Question. Deck) ở các file stores/utils.
- **Root Cause**: Cấu hình `tsconfig.app.json` của template Vite React 19 v8 mới đã bật cứng flag `"verbatimModuleSyntax": true`. Nó bắt buộc mọi element thuần Type phải dùng keywork `type`.
- **Verified Solution**: Sửa lại toàn bộ các cụm import liên quan, đổi `import { X, Y }` thành chuẩn cẩn mật `import type { X, Y }`. Lỗi được dập tắt.
