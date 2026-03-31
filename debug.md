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
  3. Tìm vị trí các đáp án A/B/C/D qua Regex linh hoạt `/(?:^|\s)([A-H])[\.\)]/gi`. Nhận diện kể cả inline hay đầu dòng, chữ hoa hay chữ thường. Hệ thống mở rộng hỗ trợ lên tới 8 đáp án (từ A đến H).
  4. Hỗ trợ bắt marker đáp án đúng đa dạng: `(đúng)`, `(x)`, `[x]`, hay đánh dấu *\**. Nếu không có marker đúng do copy paste vỡ, thuật toán mặc định lấy A là đáp án đúng thay vì ném lỗi `throw new Error` khiến dữ liệu rụng.
  5. Đã nâng cấp (hot-fix) Regex loại bỏ ràng buộc phải có CÁCH khoảng trắng `(?:\s+|$)` ngay sau chữ `A. ` (hoặc `B)`). Giờ đây nó có thể bắt gọn cả các trường hợp dính liền như `A.2%` hay `B.Benzocaine`.
  5. Cập nhật helper description trong file `ImportScreen.tsx` để user hiểu về rule mới.

## Date: 2026-03-31 (Lần 2)
- **Issue**:
  1. Khi parse text, các chữ chứa kí tự `v`, `x` đứng độc lập (như "vài", "xem") bị cắt mất chữ thành "ài", "em".
  2. Khi bật tính năng xáo trộn (shuffle) đáp án, các câu hỏi chứa đáp án liên kết hoặc chốt vị trí (như "A và C đúng", "Tất cả đều đúng") bị rối loạn làm sai logic nguyên gốc.
- **Nguyên nhân**:
  1. Trong `src/utils/parser.ts`, Regex match marker đáp án đúng có sử dụng `?` cho kí tự ngoặc: `/\(?(correct|đáp án|đúng|v|x|_)\)?/gi`. Do dấu ngoặc không bắt buộc, Regex âm thầm `replace` tất cả các chữ `v` và `x` trên toàn bộ văn bản của lựa chọn thành rỗng.
  2. Hàm trộn đáp án ở `src/store/sessionStore.ts` chạy càn quét tất cả mảng `options` khi `config.shuffleOptions` được bật, bỏ qua ngữ nghĩa của từng option.
- **Phương án Fix (Đã xác minh)**:
  1. Loại bỏ các dấu `?` trong Regex của hàm `parseTextToDeck`: `/\((correct|đáp án|đúng|v|x|_)\)/gi` và `\[(correct|đáp án|đúng|v|x|_)\]/gi`. Yêu cầu bắt khớp chính xác cả cụm bao gồm dấu ngoặc để tránh false match trên văn bản bình thường.
  2. Bổ sung Regex logic trong `useSessionStore` chặn xáo trộn tuỳ chọn (bypass `shuffleOptions`) ở các câu hỏi cụ thể nếu mảng options chứa:
     - Các quy chiếu cụ thể: `\b([a-d])\s*(và|hoặc|hay|,)\s*([a-d])\b/i` (VD: a và c, A hoặc B)
     - Cụm từ meta: `/(tất cả|cả (hai|ba|2|...|a|b...)|đáp án|phương án|câu (trên|dưới|khác|a|b...))/i` (VD: tất cả đều đúng, đáp án trên).
