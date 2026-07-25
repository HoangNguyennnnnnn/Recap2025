# Giấc Mơ Của Chúng Ta — 26.07.2026

Point-and-click narrative puzzle game. 8 chương + màn kết (thư + video + quà).

## Chạy

```
cd client && npm run dev      # → http://localhost:5173
```

Mở `http://localhost:5173` → màn đăng nhập → nhập **26072026** → vào game.

Backend **không bắt buộc**: nếu server tắt, `AuthGate` tự xác thực offline bằng
`VITE_AUTH_PASSCODE` trong `client/.env`. Muốn đổi mật khẩu thì sửa cả hai chỗ:
`client/.env` (`VITE_AUTH_PASSCODE`) và `server/.env` (`AUTH_PASSCODE`).

## 2 việc phải điền trước khi gửi cho Hna

1. **Tài khoản Netflix** → `data/gift.ts`, sửa `NETFLIX_GIFT.fields`
   (hiện đang là placeholder `dien-email-vao-day@gmail.com`).
2. **Video recap dọc 9:16** → đặt file vào `client/public/videos/recap2026.mp4`.
   Chưa có file thì màn kết vẫn chạy, hiện khung chờ + nút chọn video từ máy để xem thử.

Sửa thư: `data/story.ts` → `LETTER`.

## Các chương & lời giải

| # | Chương | Cơ chế | Đáp án |
|---|--------|--------|--------|
| 0 | Căn phòng không có gì | Nhớ khúc nhạc (Simon-says có nhạc, 4 vòng 3→6 nốt) | gõ lại đúng chuỗi |
| I | Người chỉ đường · Bách Khoa | Tìm 3 manh mối, 1 cái soi ngược trong vũng nước | ổ khoá `30082023` |
| II | Buổi hẹn đầu · Bảo tàng | Ghép 5 tranh (đổi chỗ 4 mảnh) → xếp theo số sao | thứ tự đọc thành `HANOI` |
| III | Hai chiếc ghế · Beta | Xoay 2 tấm kính cho bóng thành tim → xếp 6 khung phim theo giờ trong ngày | cả 2 núm về vị trí 0 |
| IV | Sáu giờ · Yêu xa | Xoay vòng 24h tìm khoảng lệch cho nhiều giờ chung nhất | lệch **6** → 5 giờ chung (duy nhất) |
| V | Ngày em về | Hub 5 nơi: tìm 6 tim · thần số học · xếp màu trời · lật cặp poster | ổ khoá `26072025` |
| VI | Bí mật của em · Lá số | Suy luận 4 sao vào 4 cung từ 4 manh mối | Mệnh=Thái Dương, Tài=Tử Vi, Phúc=Hồng Loan, Di=Thái Âm → "Xa mấy cũng về" |
| VII | Anh sẽ theo em | Dẫn tia sáng qua các tấm kính | xoay 4 kính: (2,3) (5,5) (8,1) (8,4) |

Thần số học màn V: `30/08/2023 → 3+0+0+8+2+0+2+3 = 18 → 1+8 = 9`.

## Cấu trúc

```
audio/soundEngine.ts   nhạc + tiếng động sinh runtime bằng Web Audio (không có file mp3 nào)
data/story.ts          lời dẫn từng chương, gợi ý, mảnh kỉ niệm, lá thư
data/gift.ts           quà Netflix + đường dẫn video
components/            SceneShell, Narration, HUD, CodeLock, Journal, ChapterMenu, ClueModal…
levels/L0…L7, Epilogue
hooks/useGameState.ts  lưu tiến trình vào localStorage (`dreamgame_save_v2`)
```

Tất cả hình ảnh là SVG vẽ trong code — không phụ thuộc file ảnh ngoài, không cần mạng.

Xoá tiến trình để test lại từ đầu: menu ☰ → "Chơi lại từ đầu", hoặc xoá key
`dreamgame_save_v2` trong localStorage.

## Ghi chú thiết kế

- Mỗi chương có 3 gợi ý mở dần (nút 💡 trên HUD). Sau 75 giây đứng một chỗ, nút gợi ý tự nháy.
- Sai không bị phạt: rung nhẹ rồi cho làm lại.
- Menu ☰ cho nhảy chương đã qua → không ai bị kẹt, luôn tới được lá thư.
- Nhạc tự tắt/bật bằng nút 🔊; trạng thái lưu ở localStorage. Câu đố màn 0
  vẫn chơi được khi tắt tiếng vì món đồ cũng sáng lên theo nốt.
