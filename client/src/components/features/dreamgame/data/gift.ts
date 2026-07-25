// ═══════════════════════════════════════════════════════════════
// The gift — revealed in the epilogue after the final chapter.
//
// ►► ĐIỀN THÔNG TIN THẬT VÀO ĐÂY TRƯỚC KHI GỬI CHO HNA ◄◄
// Chỉ cần sửa các dòng trong NETFLIX_GIFT bên dưới.
// ═══════════════════════════════════════════════════════════════

export interface GiftField {
  label: string;
  value: string;
  /** Show a copy button + monospace styling. */
  copyable?: boolean;
  /** Render as ●●●● until she taps to reveal. */
  secret?: boolean;
}

// Credentials are read from env so no real email/password sits in the repo.
// Create client/.env with:
//   VITE_GIFT_EMAIL=...
//   VITE_GIFT_PASSWORD=...
// Until both are set, the gift card shows a "chưa nạp" state instead of a
// technical placeholder — Hna never sees dummy text.
const GIFT_EMAIL = import.meta.env.VITE_GIFT_EMAIL || '';
const GIFT_PASSWORD = import.meta.env.VITE_GIFT_PASSWORD || '';

export const GIFT_READY = Boolean(GIFT_EMAIL && GIFT_PASSWORD);

export const NETFLIX_GIFT = {
  brand: 'NETFLIX',
  title: 'Một năm phim, tớ lo',
  subtitle: 'Cậu thích review phim mà chẳng có chỗ nào tử tế để xem',

  fields: [
    { label: 'Email', value: GIFT_EMAIL, copyable: true },
    { label: 'Mật khẩu', value: GIFT_PASSWORD, copyable: true, secret: true },
    { label: 'Profile của cậu', value: 'Hna 🌸' },
    { label: 'Gói', value: 'Premium · 4 màn hình · xem được ở Ba Lan' },
  ] as GiftField[],

  note:
    'Cậu cứ xem thoải mái, hết hạn tớ gia hạn tiếp. Điều kiện duy nhất: phim nào ' +
    'hay thì kể lại cho tớ, spoil cũng được. Phim nào dở thì càng phải kể — tớ ' +
    'thích nghe cậu chê phim.',

  /** Optional: a redeem/gift-card link. Leave empty to hide the button. */
  link: '',
  linkLabel: 'Mở Netflix',
};

// ═══════════════════════════════════════════════════════════════
// Video recap — VERTICAL (9:16)
//
// Đặt file video vào: client/public/videos/recap2026.mp4
// (tạo thư mục videos nếu chưa có). Nếu chưa có file, màn cuối sẽ
// hiện khung chờ và cho phép chọn video từ máy để xem thử.
// ═══════════════════════════════════════════════════════════════

export const VIDEO_SRC = '/videos/recap2026.mp4';
export const VIDEO_POSTER = ''; // optional: '/videos/recap2026-poster.jpg'
