# Quiz App - Project Documentation & Progress

## 1. Overview
Dự án được khởi tạo. 
Client-only quiz/exam application. Không server, không database. Deck và phiên thi lưu ở IndexedDB (di trú tự động từ localStorage bản cũ); lịch sử kết quả vẫn ở localStorage.

## 1b. Câu hỏi có hình minh hoạ & format JSON
Câu hỏi hỗ trợ trường `image` (tuỳ chọn) — data URI base64 hoặc URL, hiển thị giữa đề bài và các lựa chọn, bấm vào để phóng to (lightbox).

Quy trình đề xuất khi có PDF đề thi mới: nhờ Claude chuyển PDF → JSON theo format dưới đây (trích ảnh, nén ~1000px JPEG, nhúng base64, nhận đáp án đúng từ chữ đỏ), rồi import bằng tab "Tải lên JSON".

```json
{
  "name": "Tên bài thi",
  "questions": [
    {
      "text": "Nội dung câu hỏi?",
      "image": "data:image/jpeg;base64,... (tuỳ chọn)",
      "options": ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"],
      "correctIndex": 1
    }
  ]
}
```

Text importer cũng nhận diện format đề `[<A>]` `[<B>]` (quy đổi tự động về `A.` `B.`).

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
- [x] Fix lỗi text importer sai regex với chữ "v", "x".
- [x] Tối ưu hóa tính năng shuffle: tránh random câu hỏi chứa đáp án liên kết ("A và C").
- [x] Hỗ trợ câu hỏi có hình minh hoạ (`image`) + lightbox phóng to; chuyển lưu trữ deck/session sang IndexedDB để chứa được ảnh base64.

## 3. Future Plan
- User chạy lệnh test (`npm run dev`) trên localhost để trực tiếp cảm nhận độ hoàn thiện.
- Sau khi User xác nhận OK, làm thủ tục push code file sang GitHub -> Tự động đưa lên Vercel để phát hành.
