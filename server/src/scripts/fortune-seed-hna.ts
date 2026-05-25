/**
 * fortune-seed-hna.ts
 * Seed script: đọc lasohna.md → parse → lưu vào MongoDB cho profile "hna"
 * Run: cd server && npx tsx src/scripts/fortune-seed-hna.ts
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { FortuneProfile, FortuneChunk, FortuneReading } from '../models/index.js';

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || '';

// ── Full text from lasohna.md ─────────────────────────────────────────────────
const MD_PATH = path.resolve(__dirname, '../../../../lasohna.md');

// ── Parsed FortuneResult from lasohna.md ─────────────────────────────────────
const parsedResult = {
  profile: {
    displayName: 'Nguyễn Hồng Anh',
    birthDate: '2004-10-06',
    birthTime: '11:15',
    gender: 'female',
  },
  headline: 'Tuyền Trung Thủy — Hỏa Lục Cục — Mệnh Thủy khắc Cục Hỏa',
  overview: 'Nguyễn Hồng Anh sinh ngày 6/10/2004 (23 Mậu Ngọ - 8 Quý Dậu - Giáp Thân), giờ Ngọ 11:15. Bản mệnh Tuyền Trung Thủy (Nước dòng suối), Hỏa Lục Cục. Chủ mệnh Liêm Trinh, Chủ thân Thiên Lương. Cân lượng 3 lượng 8 chỉ — từ năm 36 tuổi phú quý vinh hoa. Thân Mệnh đồng cung tại Mão.',
  sections: [
    { title: 'Cung Mệnh', score: 85, summary: 'RẤT TỐT (85/100) — Thiên Cơ Miếu địa, Cự Môn Miếu địa, Long Đức, Hữu Bật.' },
    { title: 'Quan Lộc', score: 63, summary: 'KHÁ TỐT (63/100) — Vô chính diệu, có Hỷ Thần, Thiên Việt, Đường Phù, Hồng Loan.' },
    { title: 'Tài Bạch', score: 90, summary: 'CỰC TỐT (90/100) — Thiên Đồng Đắc địa, Thiếu Âm, Lâm Quan, Tả Phù, Thiên Tài.' },
    { title: 'Phu Thê', score: 74, summary: 'TỐT (74/100) — Thái Dương, Thái Âm, Thiên Khôi, Ân Quang, Thiên Quý. Có Đà La, Hóa Kỵ cần lưu ý.' },
    { title: 'Phụ Mẫu', score: 55, summary: 'BÌNH HÒA (55/100) — Thiên Tướng Vượng địa, Văn Xương, Hoa Cái. Có Linh Tinh, Thiên Hình, Thiên La.' },
    { title: 'Huynh Đệ', score: 65, summary: 'KHÁ TỐT (65/100) — Tham Lang Đắc địa, Lộc Tồn, Phượng Các, Giải Thần, Bác Sĩ.' },
    { title: 'Tử Tức', score: 100, summary: 'CỰC TỐT (100/100) — Vũ Khúc, Thiên Phủ, Thanh Long, Hóa Khoa, Long Trì, Thai Phụ.' },
    { title: 'Tật Ách', score: 45, summary: 'Hơi xấu (45/100) — Phá Quân, Tang Môn, Thiên Khốc, Thiên Sứ, Địa Võng, Hóa Quyền.' },
    { title: 'Điền Trạch', score: 55, summary: 'BÌNH HÒA (55/100) — Thất Sát Miếu địa, Mộ, Điếu Khách, Bệnh Phù, Tuần.' },
    { title: 'Nô Bộc', score: 68, summary: 'KHÁ TỐT (68/100) — Liêm Trinh Vượng địa, Hóa Lộc, Thái Tuế, Hỏa Tinh, Thiên Y.' },
    { title: 'Phúc Đức', score: 73, summary: 'TỐT (73/100) — Phúc Đức, Thiên Đức, Bát Tọa, LN Văn Tinh. Có Đại Hao, Địa Kiếp, Tuyệt.' },
    { title: 'Thiên Di', score: 60, summary: 'KHÁ TỐT (60/100) — Vô chính diệu, Đào Hoa, Tam Thai, Thiên Phúc, Tấu Thư. Có Phá Toái, Lưu Hà, Triệt.' },
  ],
  elements: [
    { name: 'Thủy', value: 35, note: 'Bản mệnh Tuyền Trung Thủy — hành chủ đạo' },
    { name: 'Hỏa', value: 25, note: 'Cục Hỏa Lục Cục — bị Thủy khắc' },
    { name: 'Mộc', value: 20, note: 'Thiên Cơ, Tham Lang — hành phụ' },
    { name: 'Kim', value: 12, note: 'Vũ Khúc, Thiên Phủ — hành phụ' },
    { name: 'Thổ', value: 8, note: 'Lộc Tồn, Thiên Tướng — hành phụ' },
  ],
  timeline: [
    { label: 'Năm 2026', status: 'Năm Hạn — Tiểu vận Bính Tý', score: 45 },
    { label: 'Tháng 2/2026', status: 'Tháng xấu — Tân Mão', score: 40 },
    { label: 'Sau 36 tuổi', status: 'Phú quý vinh hoa', score: 90 },
  ],
  palaces: [
    { name: 'Huynh Đệ', location: 'Dần', stars: ['Tham Lang (Đ)', 'Lộc Tồn', 'Bác Sĩ', 'Trường Sinh', 'Phượng Các', 'Giải Thần', 'Tuế Phá', 'Thiên Mã (Đ)', 'Thiên Hư (H)'], interpretation: 'Cung Huynh Đệ KHÁ TỐT (65/100). Lộc Tồn: ít anh chị em, chênh lệch tuổi, hiền lành. Phượng Các + Giải Thần: anh chị em tài giỏi thành đạt. Thiên Mã: anh chị em sống xa nhau. Thiên Hư: hay than vãn, bất hòa.' },
    { name: 'Mệnh', location: 'Mão', stars: ['Thiên Cơ (M)', 'Cự Môn (M)', 'Long Đức', 'Hữu Bật', 'Thiên Giải', 'Kình Dương (H)', 'Quan Phủ', 'Dưỡng'], interpretation: 'Cung Mệnh RẤT TỐT (85/100). Thiên Cơ Miếu địa: thông minh, linh hoạt, lương thiện. Cự Môn Miếu địa: tài ăn nói, nhân hậu, giàu sang. Long Đức: ngoại hình dễ nhìn, tốt bụng. Hữu Bật: quý nhân giúp đỡ, tự lập cao.' },
    { name: 'Phụ Mẫu', location: 'Thìn', stars: ['Tử Vi (V)', 'Thiên Tướng (V)', 'Hoa Cái', 'Văn Xương (Đ)', 'Phục Binh', 'Thai', 'Linh Tinh (Đ)', 'Thiên Hình (H)', 'Thiên La', 'Bạch Hổ'], interpretation: 'Cung Phụ Mẫu BÌNH HÒA (55/100). Thiên Tướng Vượng địa: cha mẹ có tiền tài, sống thọ. Văn Xương: cha mẹ giỏi văn chương nghệ thuật. Linh Tinh + Thiên Hình: cha mẹ hay ốm đau, khắc khẩu. Thiên La: cha mẹ khắt khe, đặt kỳ vọng cao.' },
    { name: 'Phúc Đức', location: 'Tỵ', stars: ['Thiên Lương (H)', 'Phúc Đức', 'Thiên Đức', 'Đại Hao', 'Kiếp Sát', 'Bát Tọa', 'Địa Kiếp (Đ)', 'Thiên Trù', 'LN Văn Tinh', 'Địa Không (Đ)', 'Tuyệt'], interpretation: 'Cung Phúc Đức TỐT (73/100). Phúc Đức + Thiên Đức: dòng họ thiện lương, tổ tiên làm phúc. Bát Tọa: được hưởng phúc lộc tổ tiên. Đại Hao + Địa Kiếp + Tuyệt: mồ mả tổ tiên kém phúc khí, dễ thất lạc.' },
    { name: 'Điền Trạch', location: 'Ngọ', stars: ['Thất Sát (M)', 'Mộ', 'Điếu Khách', 'Bệnh Phù', 'Tuần'], interpretation: 'Cung Điền Trạch BÌNH HÒA (55/100). Thất Sát Miếu địa: có đất đai ông bà để lại. Mộ: được hưởng phúc tổ tiên, nhà ít thay đổi, tính keo kiệt. Điếu Khách: nhà đẹp, hay thay đổi chỗ ở. Bệnh Phù: nhà ẩm thấp, hay ốm đau.' },
    { name: 'Quan Lộc', location: 'Mùi', stars: ['Vô chính diệu', 'Hỷ Thần', 'Thiên Việt', 'Đường Phù', 'Trực Phù', 'Hồng Loan', 'Tử', 'Quả Tú', 'Đẩu Quân', 'Thiên Quan', 'Tuần'], interpretation: 'Cung Quan Lộc KHÁ TỐT (63/100). Vô chính diệu — nghề nghiệp hay thay đổi. Hỷ Thần: may mắn công danh. Thiên Việt: quý nhân trọng dụng. Đường Phù: công việc thanh cao, tri thức. Hồng Loan: ra đời sớm, liên quan nghệ thuật cảm xúc.' },
    { name: 'Nô Bộc', location: 'Thân', stars: ['Liêm Trinh (V)', 'Hóa Lộc (Đ)', 'Thái Tuế', 'Phi Liêm', 'Hỏa Tinh (H)', 'Thiên Diêu (H)', 'Phong Cáo', 'Thiên Y', 'Bệnh', 'Thiên Thương', 'Triệt'], interpretation: 'Cung Nô Bộc KHÁ TỐT (68/100). Liêm Trinh Vượng địa + Hóa Lộc: nhờ bạn bè kiếm tiền. Hỏa Tinh: bạn bè giàu có thành danh. Thiên Y: bạn bè ngành y dược. Bệnh + Hỏa Tinh: cẩn trọng bạn xấu gây tai họa.' },
    { name: 'Thiên Di', location: 'Dậu', stars: ['Phá Quân (Đ)', 'Thiếu Dương', 'Đào Hoa', 'Tam Thai', 'Thiên Không', 'Thiên Phúc', 'Tấu Thư', 'Suy', 'Phá Toái', 'Lưu Hà', 'Triệt'], interpretation: 'Cung Thiên Di KHÁ TỐT (60/100). Vô chính diệu. Đào Hoa + Tam Thai: đi xa gặp may, dễ nổi tiếng, lập nghiệp xa quê. Thiên Phúc: ra đường gặp quý nhân. Phá Toái + Lưu Hà + Triệt: cẩn trọng tai nạn, bị lừa gạt khi đi xa.' },
    { name: 'Tật Ách', location: 'Tuất', stars: ['Phá Quân (Đ)', 'Quốc Ấn', 'Tướng Quân', 'Tang Môn (H)', 'Thiên Khốc', 'Thiên Sứ', 'Địa Võng', 'Hóa Quyền (Đ)', 'Đế Vượng'], interpretation: 'Cung Tật Ách Hơi xấu (45/100). Phá Quân: lúc bé dễ bệnh máu, cơ quan sinh dục. Tang Môn: bệnh tinh thần (lo âu, u buồn), bệnh máu huyết, kinh nguyệt không đều. Thiên Khốc: đau mũi họng, da kém, thần kinh không ổn. Hóa Quyền: bệnh tật nghiêm trọng hơn.' },
    { name: 'Tài Bạch', location: 'Hợi', stars: ['Thiên Đồng (Đ)', 'Thiếu Âm', 'Lâm Quan', 'Cô Thần', 'Tả Phù', 'Thiên Tài', 'Thiên Thọ', 'Tiểu Hao'], interpretation: 'Cung Tài Bạch CỰC TỐT (90/100). Thiên Đồng Đắc địa: tay trắng làm nên, sau trung niên ổn định. Thiếu Âm: kiếm tiền chân chính, may mắn tài chính. Lâm Quan: tiền tài nhiều. Tả Phù: quý nhân giúp kiếm tiền, nhiều nguồn thu. Tiểu Hao: có tiền hay tiêu, khó tích trữ.' },
    { name: 'Tử Tức', location: 'Tý', stars: ['Vũ Khúc (V)', 'Thiên Phủ (M)', 'Thanh Long', 'Long Trì', 'Thai Phụ', 'Hóa Khoa', 'Quan Phủ', 'Quan Đới', 'Tiểu Hao'], interpretation: 'Cung Tử Tức CỰC TỐT (100/100). Vũ Khúc + Thiên Phủ: có nhiều con trai, hai con sau đều quý hiển. Thanh Long: con thông minh hiếu thảo, mẹ tròn con vuông. Hóa Khoa: con ngoan học giỏi. Thai Phụ: sinh quý tử, con có bằng cấp cao.' },
    { name: 'Phu Thê', location: 'Sửu', stars: ['Thái Dương (Đ)', 'Thái Âm (Đ)', 'Thiên Khôi', 'Ân Quang', 'Thiên Quý', 'Lực Sĩ', 'Nguyệt Đức', 'Thiên Hỷ', 'Tử Phù', 'Đà La (Đ)', 'Hóa Kỵ (Đ)', 'Mộc Dục'], interpretation: 'Cung Phu Thê TỐT (74/100). Thái Dương + Thái Âm + Thiên Khôi: vợ chồng nghĩa nặng tình sâu. Ân Quang + Thiên Quý: hôn nhân hạnh phúc viên mãn, chung thủy. Đà La + Hóa Kỵ: hay khắc khẩu, cần lưu ý bạo lực gia đình. Chồng có thể gặp nạn tai bệnh tật.' },
  ],
};

// ── detailedReading ───────────────────────────────────────────────────────────
const detailedReading = {
  introGeneral: 'Tử Vi Đẩu Số là bộ môn huyền học dựa trên vị trí các sao trong vũ trụ và ảnh hưởng của chúng đến thời điểm sinh ra của một người. Tracuutuvi.com gửi đến bạn bản luận giải chi tiết về tổng quan cuộc đời, giúp bạn hiểu bản thân có gì, cần gì và nên làm gì trong từng giai đoạn.',
  introGuide: 'Lá số được luận giải theo từng cung tương ứng với từng vấn đề: Mệnh (tổng quan), Quan Lộc (sự nghiệp), Tài Bạch (tiền tài), Phu Thê (tình duyên), Phụ Mẫu (cha mẹ), Huynh Đệ (anh chị em), Tử Tức (con cái), Tật Ách (sức khỏe), Điền Trạch (nhà cửa), Nô Bộc (bạn bè), Phúc Đức (dòng họ), Thiên Di (di chuyển).',
  generalBanMenh: `Bản mệnh Tuyền Trung Thủy (Nước dòng suối) — một trong 6 nạp âm của hành Thủy.

**Tuyền Trung Thủy** là dòng nước trong xanh, mát lành chảy siết từ thượng nguồn núi rừng. Người mang mệnh này tuy bề ngoài lặng lẽ, không thích tranh với đời nhưng nội tâm luôn không ngừng biến động.

Bạn là người **trí tuệ, học rộng, hiểu nhiều** nhưng cũng chính vì có nhiều kiến thức mà hay suy nghĩ, đắn đo, do dự trước khi đưa ra quyết định.

Màu hợp: trắng, xám (Kim), xanh dương, đen (Thủy). Mệnh tương hợp: các mệnh Kim và Thủy. Mệnh tương khắc: các mệnh Hỏa và Thổ.`,
  generalCucMenh: `Hỏa Lục Cục — **Mệnh Thủy khắc Cục Hỏa**.

Người mệnh khắc cục thường có tính cách hơi ngông ngông, ngang tàng, thường có cảm xúc và tình cảm đặc biệt, có thể gặp trường hợp bi lụy hoặc đau khổ về tình cảm.

Bạn có **sự nhận thức về cái tôi một cách mạnh mẽ**, tuy nhiên lại có sự nhìn nhận và tư duy thiếu thực tế, nên thường dễ rơi vào trạng thái không hài lòng với thực tại.

Người mệnh khắc cục lại có sự **nhân hậu, nhân ái, thích làm từ thiện**, quan tâm đến cải cách xã hội, có lối sống mẫu mực. Càng buông xả cái tôi bao nhiêu, càng có nhiều thực quyền và sức ảnh hưởng bấy nhiêu.`,
  indicators: {
    chuMenh: 'Liêm Trinh — sao thứ năm chòm Bắc Đẩu, âm hỏa, chủ cả họa và phúc, bán cát hung, vừa là đào hoa tinh vừa là tù tinh.',
    chuThan: 'Thiên Lương — chòm Nam Đẩu, Phúc Tinh và Thọ Tinh, chủ về che trở ban phước, rất yếu dễ bị ảnh hưởng bởi sao khác.',
    laiNhan: 'Cung Tật Ách — sức khỏe bản thân là điều kiện then chốt của cuộc đời, lấy sức khỏe bản thân để tạo điều kiện phát triển.',
    canLuong: '3 lượng 8 chỉ — từ bé tư chất thông minh, học hành giỏi giang, sớm được vinh danh. Sau năm 36 tuổi có thành tựu lớn, phú quý vinh hoa.',
    thanCu: 'Thân Mệnh đồng cung tại Mão — lấy bản thân làm trung tâm, thẳng thắn, tự chủ, quyết đoán, độc lập. Cần bao dung hơn trong tình cảm.',
  },
  palaceMenh: `**Đánh giá: RẤT TỐT (85/100 điểm)**

Cung Mệnh tọa tại Mão, có **Thiên Cơ Miếu địa** và **Cự Môn Miếu địa** — đây là cách cục rất đẹp.

**Thiên Cơ Miếu địa:** Bạn khéo léo, thông minh, nhanh nhạy, trí óc không ngừng hoạt động. Linh hoạt, hiếu động, không thích ngồi yên. Tính cách cởi mở, lương thiện, đáng tin cậy. Thiên Cơ là phúc tinh giúp tiêu trừ tai ương, gia tăng tuổi thọ. Tuy nhiên do linh hoạt hay thay đổi nên cuộc đời ít khi ổn định.

**Cự Môn Miếu địa:** Thông minh, nhân hậu, vui vẻ, mưu trí, khả năng phán xét chuẩn. Cuộc sống dễ được giàu sang, có uy danh. Tài ăn nói, phù hợp ngành giao tiếp, ngoại giao. Là người tài giỏi, đảm đang, có thể giúp ích cho chồng.

**Long Đức:** Ngoại hình ưa nhìn, tính tình ôn hòa, nhân hậu, đức hạnh, được nhiều người yêu mến.

**Hữu Bật:** Nhanh nhẹn, tài trí, đa năng, hiền lành, tốt bụng, dễ được quý nhân giúp đỡ, khả năng tự lập cao.

**Kình Dương (Hãm địa):** Thể lực tốt, mạnh mẽ, dũng cảm nhưng đôi lúc nóng nảy, kiêu căng. Cần chú ý tai nạn bất ngờ ảnh hưởng sức khỏe.`,
  palaceQuanLoc: `**Đánh giá: KHÁ TỐT (63/100 điểm)**

Cung Quan Lộc tọa tại Tý, **Vô chính diệu** — nghề nghiệp hay thay đổi, công danh bình thường hoặc không bền.

**Hỷ Thần:** Gặp nhiều may mắn trong công việc, đường công danh hanh thông, thi cử đỗ đạt. Hợp làm nghề giải trí và sáng tạo.

**Thiên Việt:** Con đường công danh xán lạn, được cấp trên tin tưởng trọng dụng, khi khó khăn có quý nhân giúp đỡ.

**Đường Phù:** Dễ có công danh hiển đạt, làm tại nơi công quyền hoặc nhà nước. Công việc thiên về tri thức, không thiên về chân tay. Liên quan đến lãnh đạo cấp cao hoặc nơi sang trọng thượng lưu.

**Hồng Loan:** Ra đời sớm, sớm có công ăn việc làm. Được người khác giới giúp đỡ. Công việc liên quan cảm xúc, nghệ thuật, văn thơ.

**Tuần:** Công danh không thuận lợi, phải dành nhiều tâm sức mới gây dựng được cơ đồ. Làm việc chung với bạn bè gặp nhiều vấn đề.`,
  palaceTaiBach: `**Đánh giá: CỰC TỐT (90/100 điểm)**

Cung Tài Bạch tọa tại Hợi, có **Thiên Đồng Đắc địa** — cách cục rất đẹp về tài lộc.

**Thiên Đồng Đắc địa:** Tay trắng làm nên, hoặc chỉ dùng vốn nhỏ mà phát đạt. Phần nhiều sau trung niên mới ổn định, đến vãn niên mới có tiền của tích lũy.

**Thiếu Âm:** Kiếm tiền bằng hình thức chân chính, không tranh giành đấu đá. May mắn về chuyện tiền bạc, hay đi làm từ thiện công đức.

**Lâm Quan:** Số lượng tiền tài, của cải nhiều — cách cục đẹp trong lá số.

**Tả Phù:** Gặp sự thuận lợi về mưu cầu tiền bạc, có thể làm nhiều việc cùng lúc, nhiều nguồn thu. Gặp may mắn kiếm tiền vì có quý nhân hướng dẫn.

**Tiểu Hao:** Có tiền thường phải tiêu luôn, khó mà tích trữ — cần chú ý quản lý chi tiêu.`,
  palacePhuThe: `**Đánh giá: TỐT (74/100 điểm)**

Cung Phu Thê tọa tại Sửu, có nhiều sao cát tinh nhưng cũng có sao hung cần lưu ý.

**Thái Dương + Thái Âm + Thiên Khôi:** Vợ chồng nghĩa nặng tình sâu, tình cảm bền chặt. Dễ kết hôn sớm, có thể lấy chồng hơn tuổi.

**Ân Quang + Thiên Quý:** Hôn nhân hạnh phúc viên mãn. Kết hôn vì tình yêu chân thành, chung thủy, gắn bó đến già. Vợ chồng rất đẹp đôi, sống vừa có tình vừa có nghĩa.

**Thiên Hỷ:** Hai vợ chồng vui vẻ hòa thuận, cuộc sống sung túc khá giả.

**Đà La + Hóa Kỵ (cần lưu ý):** Vợ chồng hay khắc khẩu, xung khắc, bất hòa. Chồng có thể gặp nạn tai bệnh tật. Cần chú ý vấn đề bạo lực gia đình.

**Mộc Dục:** Người hôn phối sành điệu, thích chải chuốt. Vợ chồng có thể sống thử trước khi cưới.`,
  palacePhuMau: `**Đánh giá: BÌNH HÒA (55/100 điểm)**

Cung Phụ Mẫu tọa tại Thìn, có **Tử Vi Vượng địa** và **Thiên Tướng Vượng địa**.

**Thiên Tướng Vượng địa:** Cha mẹ có tiền tài, sống thọ hưởng thụ cùng con cháu.

**Văn Xương:** Cha mẹ có thể là chuyên gia văn chương nghệ thuật. Cha mẹ và con cái hòa thuận, có cùng lý tưởng.

**Hoa Cái:** Cha mẹ giỏi giang, tháo vát, đôi khi ghê gớm và thích áp đặt con cái. Chăm chỉ, kinh tế khá giả.

**Linh Tinh + Thiên Hình (cần lưu ý):** Cha mẹ có thể có sức khỏe kém, hay mắc bệnh. Cha mẹ nóng nảy, khắt khe, có xu hướng gây áp lực lớn. Cha mẹ và con cái thường khắc khẩu.

**Thiên La:** Cha mẹ tài giỏi nhưng không phát triển lên cao. Bạn bị cha mẹ kiểm soát, không được tự do thể hiện bản thân.`,
  palaceHuynhDe: `**Đánh giá: KHÁ TỐT (65/100 điểm)**

Cung Huynh Đệ tọa tại Dần, có **Tham Lang Đắc địa**.

**Lộc Tồn:** Ít anh chị em, chênh lệch nhiều tuổi. Anh chị em hiền lành, tốt tính, có điều kiện kinh tế, thích từ thiện.

**Bác Sĩ:** Anh chị em có học, thành đạt, giỏi giang, sau này hay giúp đỡ bạn.

**Phượng Các + Giải Thần:** Nhiều anh chị em tài giỏi, thành đạt và giàu có.

**Thiên Mã:** Anh chị em thường phải sống xa nhau, mỗi người một nơi.

**Tuế Phá:** Anh chị em không hợp tính, hay bất đồng, chống đối. Gặp nhau hay tranh luận cãi nhau.

**Thiên Hư:** Anh chị em bất hòa, hay than vãn kể khổ, duyên phận bạc bẽo.`,
  palaceTuTuc: `**Đánh giá: CỰC TỐT (100/100 điểm)**

Cung Tử Tức tọa tại Tý, có **Vũ Khúc Vượng địa** và **Thiên Phủ Miếu địa** — cách cục xuất sắc nhất lá số.

**Vũ Khúc + Thiên Phủ:** Chủ về có nhiều con trai. Có hai con, sau đều quý hiển.

**Thanh Long:** Con cái thông minh, giỏi giang, thành đạt, hiếu thảo. Sinh con dễ dàng, mẹ tròn con vuông.

**Hóa Khoa:** Con cái ngoan ngoãn, nhân hậu, hiếu thảo. Con thông minh, học thức cao, đạt nhiều thành tựu. Biết cách nuôi dạy con.

**Long Trì:** Dễ sinh con, con sinh ra xinh xắn, dễ nuôi, thông minh.

**Thai Phụ:** Có thể sinh được quý tử. Con cái dễ hiển đạt, có bằng cấp, đạt chức danh xuất sắc.`,
  palaceTatAch: `**Đánh giá: Hơi xấu (45/100 điểm)**

Cung Tật Ách tọa tại Tuất, có nhiều sao hung — đây là cung yếu nhất trong lá số.

**Phá Quân Đắc địa:** Lúc bé dễ mắc bệnh về máu, hoặc vấn đề cơ quan sinh dục. Hay bị máu nóng, mụn nhọt. Lớn lên cẩn trọng tai nạn xe cộ.

**Tang Môn (Hãm địa):** Hay bị vất vả do bệnh tật. Bệnh tinh thần: căng thẳng, lo âu, u buồn. Bệnh thể chất: máu huyết, gân cốt, huyết áp cao. Đối với phụ nữ: kinh nguyệt không đều, tử cung yếu.

**Thiên Khốc:** Dễ bị bệnh đau mũi họng, da không tốt, hay hốt hoảng, thần kinh không ổn định.

**Địa Võng:** Dễ bị bắt giữ xử phạt nếu làm điều sai trái. Gặp nhiều trở ngại khốn đốn.

**Hóa Quyền:** Bệnh tật có thể trở nên nghiêm trọng hơn.

→ **Lời khuyên:** Cần rèn luyện sức khỏe thường xuyên, thăm khám định kỳ, chú ý sức khỏe tâm thần và máu huyết.`,
  palaceDienTrach: `**Đánh giá: BÌNH HÒA (55/100 điểm)**

Cung Điền Trạch tọa tại Ngọ, có **Thất Sát Miếu địa**.

**Thất Sát Miếu địa:** Có đất đai nhà cửa của ông bà cha mẹ để lại.

**Mộ:** Được hưởng phúc từ đất đai tổ tiên. Nhà cửa ít thay đổi, sửa sang. Tính toán chi li tiền của đất đai, nhờ tích góp tiết kiệm có thể kiếm được đất đai.

**Điếu Khách:** Nhà cửa đẹp, thích trang trí. Dễ thay đổi nhiều chỗ ở, thích khám phá nơi mới. Cần cẩn trọng tài chính, tránh cờ bạc đỏ đen.

**Bệnh Phù:** Ít quan tâm chăm sóc nhà cửa. Phong thủy nơi ở không tốt, hay bị ốm đau mệt mỏi. Nhà hay bẩn thỉu, ẩm thấp.`,
  palaceNoBoc: `**Đánh giá: KHÁ TỐT (68/100 điểm)**

Cung Nô Bộc tọa tại Thân, có **Liêm Trinh Vượng địa** và **Hóa Lộc Đắc địa**.

**Liêm Trinh Vượng địa + Hóa Lộc:** Có thể nhờ bạn bè trợ lực mà kiếm được tiền. Giao lưu rộng, có nhiều bạn bè hữu ích nhưng hay biến động.

**Thiên Y (Đắc địa):** Bạn bè nhiều người làm ngành y dược. Bạn bè thông minh, cẩn thận. Sau này ốm đau có người quan tâm chăm sóc.

**Phong Cáo:** Bạn bè có chức vụ cao, học thức cao, tầm ảnh hưởng trong xã hội.

**Hỏa Tinh (Hãm địa) + Bệnh:** Cẩn trọng kết giao bạn bè, dễ gặp bạn xấu gây tai họa. Bạn bè hay ốm đau.

**Thiên Diêu (Hãm địa):** Bạn bè dễ ăn chơi trác tán, cẩn trọng mối quan hệ ngoài luồng với bạn bè khác giới.`,
  palacePhucDuc: `**Đánh giá: TỐT (73/100 điểm)**

Cung Phúc Đức tọa tại Tỵ, có **Thiên Lương Hãm địa**.

**Phúc Đức + Thiên Đức:** Được hưởng lộc phúc từ dòng dõi gia tộc. Dòng họ thiện lương, nhân hậu, đoàn kết. Ông bà tổ tiên sống ngay thẳng, hay làm phúc. Họ hàng phú quý, mồ mả tổ tiên thuận vị.

**Bát Tọa:** Được hưởng phúc lộc tổ tiên. Có thể là con dòng họ lớn mạnh. Học hành thi cử thành công.

**LN Văn Tinh:** Được hưởng phúc đức, sống thọ. Sinh ra trong gia đình có tri thức, dòng họ có nhiều người bằng cấp cao.

**Đại Hao + Địa Kiếp + Tuyệt (cần lưu ý):** Mồ mả tổ tiên kém phúc khí, dễ thất lạc. Cuộc sống có thể trải qua cô đơn, tự lập, vất vả. Cẩn trọng tai nạn bất ngờ.`,
  palaceThienDi: `**Đánh giá: KHÁ TỐT (60/100 điểm)**

Cung Thiên Di tọa tại Dậu, **Vô chính diệu** — khó giàu có lớn, dễ bị chi phối bởi môi trường ngoại cảnh.

**Đào Hoa + Tam Thai:** Được nhiều người say mê mến mộ. Đi xa gặp may mắn, đi đến đâu cũng có người thương kẻ giúp. Dễ kết hôn với người ở xa, định cư xa quê, lập nghiệp xa nhà.

**Thiên Phúc:** Hay giúp đỡ người khác nên được nhiều người giúp lại. Ra đường gặp quý nhân, gặp "thiên thời địa lợi nhân hòa".

**Tấu Thư:** Khi ra ngoài hay lo toan, làm công việc liên quan văn bản giấy tờ. Có thể trở thành nhà diễn thuyết.

**Phá Toái + Lưu Hà + Triệt (cần lưu ý):** Dễ gặp rắc rối trong di chuyển. Nguy cơ bị vu oan kiện tụng. Cẩn trọng tai nạn liên quan đến nước. Dễ bị lừa gạt khi đi xa.`,
  yearly2026: `**Năm 2026 (Bính Ngọ) — 23 tuổi. Tiểu vận tại cung Bính Tý.**

**Năm Hạn:** Gặp năm hạn, có những vận hạn tai họa lớn nhỏ. Giai đoạn này chủ về sức khỏe hoặc liên quan tới học tập là phần nhiều.

**Can tuổi sinh can năm vận:** Tiểu vận khá xấu, cuộc sống và con đường học vấn ban đầu gặp nhiều bất lợi, nhưng sau cố gắng có thể thành công.

**Mệnh Thủy đồng hành với cung Bính Tý:** Tiểu vận bình thường, có thể ứng biến được với mọi hoàn cảnh. Trong học tập ít có khả năng đạt thành tựu lớn.

**Các sao lưu đáng chú ý:**
- Lưu Thái Tuế nhập Điền Trạch: dễ thay đổi chỗ ở, bố mẹ mua bán nhà cửa.
- Lưu Tang Môn nhập Nô Bộc: vì bạn bè mà bị vạ lây, thị phi, cãi vã.
- Lưu Bạch Hổ nhập Huynh Đệ: anh chị em có thể ốm đau, sức khỏe giảm sút.
- Lưu Kình Dương nhập Điền Trạch: quanh nhà hay xảy ra tranh cãi, nhà cửa phải sửa sang.
- Lưu Đà La nhập Phụ Mẫu: hay xảy ra xung đột cãi vã với cha mẹ.

**Tháng 2/2026 (Tân Mão): Tháng xấu.** Ngày tốt: 1, 2, 7, 8, 11, 12, 17, 18, 21, 22, 27, 28. Ngày xấu: 5, 6, 9, 10, 15, 16, 19, 20, 25, 26, 29.`,
  conclusion: `Tracuutuvi.com đã gửi đến bạn bản lá số chi tiết cùng những luận giải về các sao và ý nghĩa của chúng trong từng cung của **Nguyễn Hồng Anh**.

**Tổng kết điểm mạnh:**
- Cung Tử Tức CỰC TỐT (100/100) — đường con cái xuất sắc
- Cung Tài Bạch CỰC TỐT (90/100) — tài lộc dồi dào
- Cung Mệnh RẤT TỐT (85/100) — thông minh, lương thiện, được quý nhân giúp đỡ

**Cần lưu ý:**
- Cung Tật Ách Hơi xấu (45/100) — cần chú ý sức khỏe, đặc biệt máu huyết và tâm thần
- Năm 2026 là năm Hạn — cẩn trọng trong học tập và các mối quan hệ

**Lời khuyên:** Lá số tử vi không ấn định cuộc đời bạn. Bạn hoàn toàn có thể dùng sự cố gắng, nỗ lực và tu tập để thay đổi cuộc đời, tích phúc cải mệnh. Chúc Hồng Anh luôn mạnh khỏe, hạnh phúc và thành công!`,
};

// ── Full text for RAG ─────────────────────────────────────────────────────────
const fullText = fs.existsSync(MD_PATH) ? fs.readFileSync(MD_PATH, 'utf-8') : '';

// ── Main seed function ────────────────────────────────────────────────────────
async function seed() {
  if (!MONGO_URI) {
    console.error('❌ MONGODB_URI not set in .env');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected');

  const slug = 'hna';
  const finalResult = { ...parsedResult, detailedReading };

  // Upsert profile
  const profile = await FortuneProfile.findOneAndUpdate(
    { slug },
    {
      $set: {
        slug,
        displayName: 'Nguyễn Hồng Anh',
        birthDate: '2004-10-06',
        birthTime: '11:15',
        gender: 'female',
        parsedResult: finalResult,
        fullText: fullText || JSON.stringify(finalResult),
        lastIngestAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );

  console.log(`✅ Profile "${slug}" upserted: ${profile._id}`);
  console.log(`   parsedResult.score = ${(profile.parsedResult as any)?.score}`);
  console.log(`   sections count = ${(profile.parsedResult as any)?.sections?.length}`);
  console.log(`   fullText length = ${profile.fullText?.length || 0} chars`);

  // Also seed chunks from fullText for RAG Q&A
  const text = profile.fullText || '';
  if (text.length > 0) {
    await FortuneChunk.deleteMany({ profileSlug: slug });
    const chunkSize = 1500;
    const overlap = 200;
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end).trim());
      if (end === text.length) break;
      start = Math.max(0, end - overlap);
    }

    const docs = chunks.filter(Boolean).map((t, i) => ({
      profileSlug: slug,
      sourceId: new mongoose.Types.ObjectId(),
      order: i,
      text: t,
      embedding: [],
    }));

    if (docs.length > 0) {
      await FortuneChunk.insertMany(docs);
      console.log(`✅ Inserted ${docs.length} chunks for RAG`);
    }
  }

  await mongoose.disconnect();
  console.log('🎉 Seed complete! Profile hna is ready.');
}

seed().catch(e => { console.error(e); process.exit(1); });
