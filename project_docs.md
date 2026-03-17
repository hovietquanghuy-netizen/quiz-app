# Quiz App - Project Documentation & Progress

## 1. Overview
Dự án được khởi tạo. 
Client-only quiz/exam application. Không server, không database. Toàn bộ data lưu ở localStorage.

## 2. Walkthrough
- [x] Thu thập blueprint từ User.
- [x] Tạo `buildplan.md` lưu trữ blueprint
- [x] Xác minh implementation plan với user trước khi coding.
- [x] Khởi tạo Vite app (React 19, TailwindCSS v4).
- [x] Cài đặt các thư viện (Tailwind, Zustand, Framer Motion, Recharts, Lucide-React).
- [x] Xây dựng kiến trúc thư mục chuẩn: `types`, `utils`, `store`, `components`, `screens`.
- [x] Cài đặt trạng thái thông minh với Zustand Auto-Persist (resumable session).
- [x] Hoàn thiện giao diện hiện đại (darkmode, motion) cho 5 Screens.
- [x] Build local thử nghiệm thành công 100% (Khung chuẩn production).

## 3. Future Plan
- User chạy lệnh test (`npm run dev`) trên localhost để trực tiếp cảm nhận độ hoàn thiện.
- Sau khi User xác nhận OK, làm thủ tục push code file sang GitHub -> Tự động đưa lên Vercel để phát hành.
