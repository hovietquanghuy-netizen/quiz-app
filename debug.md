# Debug History

## Date: 2026-03-31
- **Issue**: Người dùng copy paste text các câu hỏi từ Word thường bị lỗi không phân tích được hoặc bị bỏ qua rất nhiều nội dung.
- **Nguyên nhân**:
  1. File `src/utils/parser.ts` cũ sử dụng logic tĩnh, dò tìm chính xác chuỗi `A.` bằng `indexOf()`, không dùng Regex nên khi Word đổi format thành `A)` hay `a.` thì sẽ lỗi và throw Error chết liền 1 luồng khiến toàn bộ nội dung sau bị gián đoạn (nên bị bỏ qua rất nhiều nội dung).
  2. Thuật toán phân block cũ chỉ chia text theo `\n\n` (Enter 2 lần). Nếu không Enter 2 lần, nó xem mỗi dòng là 1 câu, dẫn đến vỡ cấu trúc và failed.
  3. Cờ đánh dấu `(Correct)` chỉ bắt chính tả `(correct)`. Trong Word nhiều khi bị mất highlight copy thì không có `(correct)`, code cũ lỗi và ném Error `throw new Error(...)` ngay lập tức bỏ qua bài test.
- **Phương án Fix (Đã xác minh)**:
  1. Nâng cấp `parseTextToDeck` ở `src/utils/parser.ts` thay vì logic đơn điệu, chuyển sang **Smart AI Regex Parsing**.
  2. Tự động tìm Block dựa vào cụm từ "Câu X:" hoặc nhận diện một dòng kết thúc đáp án (D/E).
  3. Tìm vị trí các đáp án A/B/C/D qua Regex linh hoạt `/(?:^|\s)([A-H])[\.\)](?:\s+|$)/gi`. Nhận diện kể cả inline hay đầu dòng, chữ hoa hay chữ thường. Hệ thống mở rộng hỗ trợ lên tới 8 đáp án (từ A đến H).
  4. Hỗ trợ bắt marker đáp án đúng đa dạng: `(đúng)`, `(x)`, `[x]`, hay đánh dấu *\**. Nếu không có marker đúng do copy paste vỡ, thuật toán mặc định lấy A là đáp án đúng thay vì ném lỗi `throw new Error` khiến dữ liệu rụng.
  5. Cập nhật helper description trong file `ImportScreen.tsx` để user hiểu về rule mới.
