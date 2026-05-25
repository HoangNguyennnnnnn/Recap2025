import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { FortuneProfile, FortuneChunk } from '../models/index.js';

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || '';
const MD_PATH = path.resolve(__dirname, '../../../../lasonthz.md');

const parsedResult = {
  profile: {
    displayName: 'Nguyễn Trịnh Hoàng Nguyên',
    birthDate: '2004-08-13',
    birthTime: '03:00',
    gender: 'male',
  },
  headline: 'Tuyền Trung Thủy — Mộc Tam Cục — Mệnh Thủy sinh Cục Mộc',
  overview: 'Nguyễn Trịnh Hoàng Nguyên sinh ngày 13/8/2004 (28 Giáp Tý - 6 Tân Mùi - Giáp Thân), giờ Dần 03:00. Bản mệnh Tuyền Trung Thủy (Nước dòng suối), Mộc Tam Cục. Chủ mệnh Liêm Trinh, Chủ thân Thiên Lương. Cân lượng 3 lượng 6 chỉ — làm chơi ăn thật, có quý nhân phò trì. Thân cư Quan Lộc — tâm huyết với nghề nghiệp, mục tiêu rõ ràng từ nhỏ.',
  sections: [
    { title: 'Cung Mệnh', score: 73, summary: 'TỐT (73/100) — Liêm Trinh, Hóa Lộc, Phúc Đức, Thiên Đức, Hữu Bật, Thiên Thọ, Thiên Trù, LN Văn Tinh, Đẩu Quân.' },
    { title: 'Quan Lộc', score: 67, summary: 'KHÁ TỐT (67/100) — Vũ Khúc, Thất Sát, Thiếu Dương, Hỷ Thần, Đào Hoa, Tả Phù, Hóa Khoa, Thiên Phúc.' },
    { title: 'Tài Bạch', score: 69, summary: 'KHÁ TỐT (69/100) — Tử Vi, Phá Quân, Hóa Quyền, Nguyệt Đức, Thiên Khôi, Thiên Hỷ, Đà La, Quan Đới.' },
    { title: 'Phu Thê', score: 65, summary: 'KHÁ TỐT (65/100) — Thiên Phủ, Long Đức, Lực Sĩ, Đế Vượng, Kình Dương.' },
    { title: 'Phụ Mẫu', score: 52, summary: 'BÌNH HÒA (52/100) — Cự Môn, Văn Khúc, Tướng Quân, Thiên Diêu, Điếu Khách, Thiên Y, Tử, Tuần.' },
    { title: 'Huynh Đệ', score: 64, summary: 'KHÁ TỐT (64/100) — Thanh Long, Hoa Cái, Thiên Quý, Phong Cáo, Suy, Hỏa Tinh.' },
    { title: 'Tử Tức', score: 69, summary: 'KHÁ TỐT (69/100) — Thái Âm, Hỏa Tinh, Thiên La, Thanh Long, Hoa Cái, Phong Cáo, Thiên Quý.' },
    { title: 'Tật Ách', score: 50, summary: 'BÌNH HÒA (50/100) — Thiên Cơ, Long Trì, Địa Giải, Tam Thai.' },
    { title: 'Điền Trạch', score: 49, summary: 'HƠI XẤU (49/100) — Thái Dương, Ân Quang, Quốc Ấn, Tang Môn, Bệnh Phù, Địa Võng, Hóa Kỵ.' },
    { title: 'Nô Bộc', score: 46, summary: 'HƠI XẤU (46/100) — Tử Vi, Phá Quân, Thiên Tài, Nguyệt Đức, Thiên Hỷ, Thiên Khôi, Đà La, Địa Kiếp.' },
    { title: 'Phúc Đức', score: 85, summary: 'CỰC TỐT (85/100) — Thiên Đồng Miếu địa, Thiên Lương Vượng địa, Văn Xương, Thai Phụ, Linh Tinh.' },
    { title: 'Thiên Di', score: 60, summary: 'KHÁ TỐT (60/100) — Thiếu Âm, Cô Thần, Đại Hao.' },
  ],
  elements: [
    { name: 'Thủy', value: 35, note: 'Bản mệnh Tuyền Trung Thủy — hành chủ đạo' },
    { name: 'Mộc', value: 30, note: 'Cục Mộc Tam Cục — Mệnh Thủy sinh Cục Mộc, tương sinh tốt' },
    { name: 'Hỏa', value: 18, note: 'Liêm Trinh, Thái Dương — hỏa phụ' },
    { name: 'Kim', value: 12, note: 'Vũ Khúc, Tử Vi, Phá Quân — kim phụ' },
    { name: 'Thổ', value: 5, note: 'Thiên Phủ — thổ phụ' },
  ],
  timeline: [
    { label: 'Năm 2026', status: 'Năm Bính Ngọ — Tiểu vận tại Dần', score: 55 },
    { label: 'Tháng 2/2026', status: 'Tháng Tân Mão', score: 50 },
    { label: 'Sau trung niên', status: 'Phát đạt, làm chơi ăn thật', score: 85 },
  ],
  palaces: [
    { name: 'Tử Tức', location: 'Dần', stars: ['Thái Âm (H)', 'Hỏa Tinh (Đ)', 'Thiên La', 'Thanh Long', 'Hoa Cái', 'Phong Cáo', 'Thiên Quý', 'Lộc Tồn', 'Tuế Phá', 'Bác Sĩ', 'Thiên Hư (H)', 'Thiên Mã (Đ)', 'Thiên Hình (Đ)', 'Phượng Các', 'Giải Thần', 'Bát Tọa'], interpretation: 'Cung Tử Tức KHÁ TỐT (69/100). Thái Âm: có con gái, nuôi dạy con tốt. Hỏa Tinh: con cường tráng, năng động. Thanh Long + Phượng Các: con thông minh, học giỏi, thành đạt.' },
    { name: 'Phu Thê', location: 'Mão', stars: ['Thiên Phủ (B)', 'Kình Dương (H)', 'Long Đức', 'Lực Sĩ', 'Đế Vượng'], interpretation: 'Cung Phu Thê KHÁ TỐT (65/100). Thiên Phủ: vợ giỏi giang, nhanh nhẹn, gia đình vợ có điều kiện. Long Đức: vợ hiền hậu, đức độ, sống tình nghĩa. Kình Dương Hãm: nên kết hôn muộn, chú ý bạo lực gia đình.' },
    { name: 'Huynh Đệ', location: 'Thìn', stars: ['Cự Môn (V)', 'Thiên Y', 'Văn Khúc (H)', 'Thiên Diêu (H)', 'Điếu Khách', 'Tướng Quân'], interpretation: 'Cung Huynh Đệ KHÁ TỐT (64/100). Thanh Long: anh chị em hòa thuận, nhân hậu, có học thức. Hoa Cái: chăm chỉ, quý mến nhau. Suy + Hỏa Tinh: đông anh chị em, cuộc sống thuận lợi.' },
    { name: 'Mệnh', location: 'Tỵ', stars: ['Liêm Trinh (H)', 'Tham Lang (H)', 'Phúc Đức', 'Thiên Đức', 'LN Văn Tinh', 'Hữu Bật', 'Thiên Trù', 'Thiên Thọ', 'Hóa Lộc (Đ)', 'Tiểu Hao', 'Kiếp Sát', 'Đẩu Quân'], interpretation: 'Cung Mệnh TỐT (73/100). Liêm Trinh Hóa Lộc: hào sảng, phóng khoáng, giỏi kiếm tiền. Phúc Đức + Thiên Đức: nhân hậu, thích làm việc thiện. Hữu Bật: nhanh nhẹn, tài trí, được quý nhân giúp đỡ. Tham Lang Hãm: thích một mình, nhiều dục vọng, cẩn trọng gay ghen.' },
    { name: 'Phụ Mẫu', location: 'Ngọ', stars: ['Thiên Đồng (M)', 'Thiên Lương (V)', 'Văn Xương (Đ)', 'Thai Phụ', 'Linh Tinh (H)', 'Thái Tuế', 'Phi Liêm'], interpretation: 'Cung Phụ Mẫu BÌNH HÒA (52/100). Cự Môn: cha mẹ ốm đau bệnh tật, quan điểm khác nhau, khoảng cách thế hệ lớn. Văn Khúc: cha mẹ khéo léo, tài năng. Điếu Khách: bố mẹ phóng khoáng, thích du lịch. Tử + Tuần: cha mẹ hay mắc bệnh, sức khỏe không tốt.' },
    { name: 'Phúc Đức', location: 'Mùi', stars: ['Vũ Khúc (Đ)', 'Thất Sát (H)', 'Thiếu Dương', 'Hỷ Thần', 'Đào Hoa', 'Tả Phù', 'Thiên Phúc', 'Hóa Khoa'], interpretation: 'Cung Phúc Đức CỰC TỐT (85/100). Thiên Đồng Miếu địa + Thiên Lương Vượng địa: phúc đức tổ tiên dồi dào, hưởng phúc từ dòng họ. Văn Xương Đắc địa: dòng họ có truyền thống khoa bảng. Thai Phụ: tổ tiên ban phúc, dòng dõi quý phái.' },
    { name: 'Điền Trạch', location: 'Thân', stars: ['Thái Dương (H)', 'Ân Quang', 'Quốc Ấn', 'Tang Môn (H)', 'Bệnh Phù', 'Địa Võng', 'Thiên Thương', 'Hóa Kỵ (Đ)'], interpretation: 'Cung Điền Trạch HƠI XẤU (49/100). Thái Dương Hãm + Hóa Kỵ: nhà cửa hay trục trặc, đầu tư đất đai không thuận. Tang Môn + Bệnh Phù: nhà phong thủy không tốt, hay đau ốm khi ở trong nhà. Địa Võng: khó tạo dựng cơ đồ từ đất đai.' },
    { name: 'Quan Lộc', location: 'Dậu', stars: ['Thiên Cơ (Đ)', 'Long Trì', 'Địa Giải', 'Tam Thai', 'Thiên Không'], interpretation: 'Cung Quan Lộc KHÁ TỐT (67/100). Vũ Khúc + Thất Sát: ngành tài chính, ngân hàng, kinh doanh hoặc võ nghiệp. Thiếu Dương: tài đức vẹn toàn, tiếng tăm lẫy lừng. Hóa Khoa: thi cử đỗ đạt, nhiều bằng cấp, dễ thành chuyên gia. Đào Hoa + Tả Phù: môi trường làm việc nhiều người khác giới.' },
    { name: 'Nô Bộc', location: 'Tuất', stars: ['Thiên Cơ (Đ)', 'Long Trì', 'Địa Giải', 'Tam Thai'], interpretation: 'Cung Nô Bộc HƠI XẤU (46/100). Tử Vi + Phá Quân + Đà La + Địa Kiếp (H): bạn bè ít, dễ bị phản bội. Nguyệt Đức + Thiên Khôi: nhờ bạn bè mà có tiền tài. Thiên Hỷ: giao thiệp vui vẻ. Địa Kiếp: cẩn trọng bị lừa mất tiền vì bạn.' },
    { name: 'Thiên Di', location: 'Hợi', stars: ['Tử Vi (Đ)', 'Phá Quân (V)', 'Nguyệt Đức', 'Thiên Hỷ', 'Thiên Khôi', 'Thiên Tài', 'Đà La (Đ)', 'Địa Kiếp (H)', 'Hóa Quyền (Đ)'], interpretation: 'Cung Thiên Di KHÁ TỐT (60/100). Thiếu Âm: khi ra ngoài được nhiều người yêu quý. Cô Thần: thích đi một mình, khó hòa nhập đám đông. Đại Hao: cẩn trọng hao tài khi đi xa.' },
    { name: 'Tật Ách', location: 'Tý', stars: ['Thái Âm (H)', 'Hỏa Tinh (Đ)', 'Thiên La', 'Thanh Long', 'Hoa Cái', 'Phong Cáo', 'Thiên Quý'], interpretation: 'Cung Tật Ách BÌNH HÒA (50/100). Thiên Cơ Đắc: hay lo nghĩ nhiều, căng thẳng thần kinh. Long Trì: sức khỏe sinh lý tốt nhưng cẩn trọng tai nạn dưới nước. Địa Giải: giải trừ bệnh tật. Tam Thai: ít đau ốm nặng.' },
    { name: 'Tài Bạch', location: 'Sửu', stars: ['Tử Vi (Đ)', 'Phá Quân (V)', 'Nguyệt Đức', 'Thiên Hỷ', 'Thiên Khôi', 'Thiên Tài', 'Đà La (Đ)', 'Địa Kiếp (H)', 'Hóa Quyền (Đ)'], interpretation: 'Cung Tài Bạch KHÁ TỐT (69/100). Tử Vi: nguồn tiền tài sung túc. Phá Quân + Hóa Quyền: có thể có tiền bất ngờ, năng lực vận dụng tiền tốt. Đà La: kiếm tiền nhanh, không ngại dùng mưu mẹo. Địa Kiếp Hãm: cẩn trọng phá tán, hao tài khi gặp hạn.' },
  ],
};

const detailedReading = {
  introGeneral: 'Tử Vi Đẩu Số là bộ môn huyền học dựa trên vị trí các sao trong vũ trụ và ảnh hưởng của chúng đến thời điểm sinh ra của một người. Tracuutuvi.com gửi đến bạn bản luận giải chi tiết về tổng quan cuộc đời, giúp bạn hiểu bản thân có gì, cần gì và nên làm gì trong từng giai đoạn.',
  introGuide: 'Lá số được luận giải theo từng cung tương ứng với từng vấn đề: Mệnh (tổng quan), Quan Lộc (sự nghiệp), Tài Bạch (tiền tài), Phu Thê (tình duyên), Phụ Mẫu (cha mẹ), Huynh Đệ (anh chị em), Tử Tức (con cái), Tật Ách (sức khỏe), Điền Trạch (nhà cửa), Nô Bộc (bạn bè), Phúc Đức (dòng họ), Thiên Di (di chuyển).',
  generalBanMenh: `Bản mệnh Tuyền Trung Thủy (Nước dòng suối) — một trong 6 nạp âm của hành Thủy.

**Tuyền Trung Thủy** là dòng nước trong xanh, mát lành chảy siết từ thượng nguồn núi rừng. Người mang mệnh này tuy bề ngoài lặng lẽ, không thích tranh với đời nhưng nội tâm luôn không ngừng biến động.

Bạn là người **trí tuệ, học rộng, hiểu nhiều** nhưng cũng chính vì có nhiều kiến thức mà hay suy nghĩ, đắn đo, do dự trước khi đưa ra quyết định.

Màu hợp: trắng, xám (Kim), xanh dương, đen (Thủy). Mệnh tương hợp: các mệnh Kim và Thủy. Mệnh tương khắc: các mệnh Hỏa và Thổ.`,
  generalCucMenh: `Mộc Tam Cục — **Mệnh Thủy sinh Cục Mộc**.

Người mệnh sinh cục thường là người đáng tin cậy, thực tế, năng động và giỏi xoay sở trước khó khăn. Bạn rất giỏi trong việc kiểm soát cảm xúc cá nhân, tuy nhiên trong mắt người khác bạn có thể trở nên khó gần, thậm chí có phần lạnh lùng và hà khắc.

Trong tình cảm, bạn khá có duyên, ôn hòa, phong thái hấp dẫn, cư xử lịch thiệp. Trong công việc, bạn có nhiều yếu tố để trở thành thủ lĩnh, ít bị ảnh hưởng bởi cảm tính.`,
  indicators: {
    chuMenh: 'Liêm Trinh — sao thứ năm chòm Bắc Đẩu, âm hỏa, chủ cả họa và phúc, bán cát hung, vừa là đào hoa tinh vừa là tù tinh.',
    chuThan: 'Thiên Lương — chòm Nam Đẩu, Phúc Tinh và Thọ Tinh, chủ về che trở ban phước, rất yếu dễ bị ảnh hưởng bởi sao khác.',
    laiNhan: 'Cung Nô Bộc — bạn bè là điều kiện ảnh hưởng đến vận mệnh cuộc đời, sẽ quyết định thành bại.',
    canLuong: '3 lượng 6 chỉ — làm chơi ăn thật, số có quý nhân phò trì, dù gặp rắc rối sau cũng thành công. Bản mệnh trường thọ, gia đình giàu có phát đạt.',
    thanCu: 'Thân cư Quan Lộc — tâm huyết và năng khiếu trong nghề nghiệp, mục tiêu rõ ràng từ nhỏ, cẩn trọng khi chọn nghề, một khi đã chọn là theo đuổi đến cùng.',
  },
  palaceMenh: `**Đánh giá: TỐT (73/100 điểm)**

Cung Mệnh tọa tại Tỵ, có **Liêm Trinh Hãm địa** và **Tham Lang Hãm địa**.

**Liêm Trinh + Hóa Lộc:** Bạn được hưởng sung sướng, tính cách hào sảng, phóng khoáng, đủ tài lộc vẹn toàn, giỏi kiếm tiền và tiêu tiền cũng nhiều.

**Phúc Đức + Thiên Đức:** Bạn có tính điềm đạm, tốt bụng, ngoại hình ưa nhìn, nhân hậu. Thích làm việc thiện, tạo phúc, giúp đỡ người khác.

**Hữu Bật:** Nhanh nhẹn, tài trí, đa năng, được quý nhân giúp đỡ, khả năng tự lập cao.

**Tham Lang Hãm:** Thích một mình, nhiều dục vọng, tham vọng, hay ghen tuông. Tuy nhiên, nếu biết kiểm soát sẽ phát huy được tài năng nghệ thuật.

**Lưu Niên Văn Tinh:** Có năng khiếu văn chương, mỹ thuật, âm nhạc, tài ăn nói, thu phục lòng người.`,
  palaceQuanLoc: `**Đánh giá: KHÁ TỐT (67/100 điểm)**

Cung Quan Lộc tọa tại Dậu, **Thân cư Quan Lộc** — tâm huyết với nghề nghiệp.

**Vũ Khúc:** Chủ về ngành tài chính tiền tệ, ngân hàng, kinh doanh. Những công việc thuộc hành Kim đều hợp.

**Thất Sát + Vũ Khúc:** Có võ nghiệp hiển đạt, lập nhiều chiến công nhưng thăng giáng thất thường. Hợp ngành công nghiệp, quân đội, cảnh sát.

**Thiếu Dương:** Vừa có tài vừa có đức, công danh xán lạn, thăng tiến may mắn.

**Đào Hoa:** Đam mê làm việc cống hiến, có thiên khiếu viết vẽ, hội họa, âm nhạc.

**Tả Phù + Hóa Khoa:** Làm gì cũng may mắn, số làm lãnh đạo, giàu có. Hóa Khoa: thi cử đỗ đạt, nhiều bằng cấp cao.

**Thiên Không + Địa Không:** Công danh có thể dang dở, dễ bị biến cố. Cần kiên trì vượt qua.`,
  palaceTaiBach: `**Đánh giá: KHÁ TỐT (69/100 điểm)**

Cung Tài Bạch tọa tại Sửu, có **Tử Vi Đắc địa** và **Phá Quân Vượng địa**.

**Tử Vi:** Nguồn tiền tài sung túc, chủ về chức tước và bổng lộc.

**Phá Quân + Hóa Quyền:** Năng lực vận dụng tiền bạc rất tốt, trải qua sóng gió mới giàu có. Có thể được tiền bất ngờ, cách kiếm tiền kì lạ.

**Đà La:** Có cơ hội kiếm tiền nhanh, có khả năng cạnh tranh. Không ngại dùng mưu mẹo.

**Nguyệt Đức + Thiên Khôi:** Kiếm tiền chân chính, không sân si. Biết dùng tiền giúp đỡ người khác.

**Địa Kiếp Hãm:** Cẩn trọng phá tán, hao tài lớn khi gặp hạn. Tiền đến bất ngờ cũng dễ đi bất ngờ.`,
  palacePhuThe: `**Đánh giá: KHÁ TỐT (65/100 điểm)**

Cung Phu Thê tọa tại Mão, có **Thiên Phủ Bình hòa**.

**Thiên Phủ:** Bạn dễ lấy vợ trẻ, giỏi giang, nhanh nhẹn, gia đình vợ có điều kiện, được vợ chăm sóc chiều chuộng.

**Long Đức:** Vợ hiền hậu, nhẹ nhàng, đức độ, sống tình nghĩa, ít mâu thuẫn.

**Đế Vượng:** Vợ chồng sống hòa thuận, giúp đỡ nhau, có nhiều may mắn, tránh được tai họa.

**Kình Dương Hãm:** Nên kết hôn muộn, nếu sớm dễ trắc trở, tan vỡ. Cần chú ý bạo lực gia đình.`,
  palacePhuMau: `**Đánh giá: BÌNH HÒA (52/100 điểm)**

Cung Phụ Mẫu tọa tại Ngọ.

**Cự Môn:** Sao Cự Môn ở cung Phụ Mẫu là ám tinh, gây bất lợi. Bạn có thể làm con nuôi hoặc cha mẹ ốm đau. Tình cảm với cha mẹ không tốt đẹp, ít được quan tâm.

**Văn Khúc:** Cha mẹ khéo léo, tài năng, học vấn cao, yêu nghệ thuật.

**Tướng Quân:** Cha mẹ có danh tiếng, được nhiều người biết đến.

**Điếu Khách:** Bố mẹ phóng khoáng, hay đi du lịch, thiếu gắn kết.

**Tử + Tuần:** Cha mẹ hay mắc bệnh tật, sức khỏe không tốt. Mối nhân duyên với cha mẹ không sâu sắc.`,
  palaceHuynhDe: `**Đánh giá: KHÁ TỐT (64/100 điểm)**

Cung Huynh Đệ tọa tại Thìn.

**Thanh Long:** Anh chị em hòa thuận, yêu thương nhau, đều ngoan ngoãn, nhân hậu, giàu tình nghĩa, có học thức.

**Hoa Cái:** Chăm chỉ, chịu khó, anh em quý mến nhau.

**Thiên Quý + Phong Cáo:** Anh em tình cảm tốt đẹp, biết giúp đỡ nhau. Bạn chịu nhiều ảnh hưởng tốt từ anh chị em.

**Suy + Hỏa Tinh:** Đông anh chị em, cuộc sống thuận lợi, sự nghiệp thành đạt.`,
  palaceTuTuc: `**Đánh giá: KHÁ TỐT (69/100 điểm)**

Cung Tử Tức tọa tại Dần, có **Thái Âm Hãm địa**.

**Thái Âm + Hỏa Tinh:** Có con gái, con cường tráng, năng động. Cách nuôi dạy con tốt.

**Thanh Long + Phượng Các:** Con thông minh, giỏi giang, thành đạt, hiếu thảo.

**Thiên Quý:** Con có tình cảm tốt với cha mẹ, hiếu thuận.

**Lộc Tồn + Bát Tọa:** Con ít, nhưng mỗi đứa đều có điều kiện, được hưởng phúc.

**Thiên Hư:** Cẩn trọng việc nuôi dạy, tránh chiều chuộng quá mức.`,
  palaceTatAch: `**Đánh giá: BÌNH HÒA (50/100 điểm)**

Cung Tật Ách tọa tại Tý.

**Thiên Cơ Đắc:** Hay lo nghĩ, căng thẳng thần kinh, dễ mất ngủ vì suy nghĩ nhiều.

**Long Trì:** Sức khỏe sinh lý tốt, nhưng cẩn trọng tai nạn dưới nước.

**Địa Giải:** Có khả năng tự giải trừ bệnh tật, ít bệnh nặng.

**Tam Thai:** Ít đau ốm, sức đề kháng tốt.

**Đại Vận đến hạn:** Cần chú ý sức khỏe tâm thần, tránh căng thẳng kéo dài. Tập thể dục thường xuyên, thiền định tốt cho tinh thần.`,
  palaceDienTrach: `**Đánh giá: HƠI XẤU (49/100 điểm)**

Cung Điền Trạch tọa tại Thân, có **Thái Dương Hãm địa** và **Hóa Kỵ Đắc địa**.

**Thái Dương Hãm + Hóa Kỵ:** Nhà cửa hay trục trặc, đầu tư đất đai không thuận lợi. Khó tích lũy được bất động sản.

**Tang Môn + Bệnh Phù:** Nhà phong thủy không tốt, người ở hay đau ốm, mệt mỏi.

**Địa Võng:** Khó tạo dựng cơ đồ từ nhà đất. Cần cẩn trọng khi mua bán sang nhượng.

**Ân Quang:** Dù khó khăn nhưng về già vẫn có nơi ở ổn định, được con cái hỗ trợ.`,
  palaceNoBoc: `**Đánh giá: HƠI XẤU (46/100 điểm)**

Cung Nô Bộc tọa tại Tuất, có **Tử Vi Đắc địa** và **Phá Quân Vượng địa**.

**Tử Vi + Phá Quân + Đà La + Địa Kiếp:** Bè bạn ít, dễ bị phản bội, cẩn trọng mất tiền vì bạn bè. Bạn bè đến rồi đi, khó có tri kỷ lâu dài.

**Nguyệt Đức + Thiên Khôi:** Dù vậy vẫn có vài người bạn trung thành giúp đỡ về tài chính.

**Thiên Hỷ:** Giao thiệp vui vẻ, hài hước, được bạn bè quý mến.

**Địa Kiếp Hãm:** Cảnh giác với bạn bè lừa gạt tiền bạc.`,
  palacePhucDuc: `**Đánh giá: CỰC TỐT (85/100 điểm)**

Cung Phúc Đức tọa tại Mùi, có **Thiên Đồng Miếu địa** và **Thiên Lương Vượng địa**.

**Thiên Đồng Miếu địa + Thiên Lương Vượng địa:** Phúc đức tổ tiên dồi dào. Bạn hưởng phúc từ dòng họ lớn mạnh, gia đình có nhiều người thành đạt.

**Văn Xương Đắc địa:** Dòng họ có truyền thống khoa bảng, văn chương.

**Thai Phụ:** Tổ tiên ban phúc lành, có thể sinh ra trong gia đình quý phái.

**Linh Tinh:** Có thể có một số biến cố trong dòng họ, nhưng không ảnh hưởng lớn nhờ phúc đức dày.`,
  palaceThienDi: `**Đánh giá: KHÁ TỐT (60/100 điểm)**

Cung Thiên Di tọa tại Hợi.

**Thiếu Âm:** Đi xa gặp nhiều người yêu quý, giúp đỡ. Có duyên với phương xa.

**Cô Thần:** Thích đi một mình, khó hòa nhập đám đông, nhưng khi đã quen thì rất thoải mái.

**Đại Hao:** Cẩn trọng hao tài khi đi xa, du lịch hoặc công tác. Quản lý chi tiêu cẩn thận.

**Không có chính tinh tại Thiên Di:** Dễ bị chi phối bởi môi trường ngoại cảnh, cần giữ vững lập trường khi xa nhà.`,
  yearly2026: `**Năm 2026 (Bính Ngọ) — 22 tuổi. Tiểu vận tại cung Dần.**

**Năm Bính Ngọ:** Lưu Thái Tuế nhập mệnh, có nhiều biến động trong cuộc sống. Tuổi trẻ có nhiều cơ hội học tập và phát triển.

**Các sao lưu đáng chú ý:**
- Lưu Kình Dương: cẩn trọng tai nạn, tranh cãi.
- Lưu Đà La: cẩn trọng bệnh tật kéo dài.
- Lưu Hóa Khoa: có cơ hội học tập, thi cử tốt.
- Lưu Thiên Mã: có sự thay đổi chỗ ở, di chuyển nhiều.

**Tháng 2/2026 (Tân Mão):** Cần chú ý sức khỏe, tránh tranh cãi không cần thiết.`,
  conclusion: `Tracuutuvi.com đã gửi đến bạn bản lá số chi tiết cùng những luận giải về các sao và ý nghĩa của chúng trong từng cung của **Nguyễn Trịnh Hoàng Nguyên**.

**Tổng kết điểm mạnh:**
- Cung Phúc Đức CỰC TỐT (85/100) — phúc đức tổ tiên dồi dào
- Cung Mệnh TỐT (73/100) — Liêm Trinh Hóa Lộc, phóng khoáng tài lộc
- Cung Tài Bạch KHÁ TỐT (69/100) — Tử Vi tọa thủ, tiền tài sung túc

**Cần lưu ý:**
- Cung Nô Bộc Hơi xấu (46/100) — cẩn trọng bạn bè, dễ bị phản bội
- Cung Điền Trạch Hơi xấu (49/100) — nhà cửa trục trặc, đầu tư đất đai khó khăn

**Lời khuyên:** Lá số tử vi không ấn định cuộc đời bạn. Bạn hoàn toàn có thể dùng sự cố gắng, nỗ lực và tu tập để thay đổi cuộc đời, tích phúc cải mệnh. Chúc Hoàng Nguyên luôn mạnh khỏe, hạnh phúc và thành công!`,
};

const fullText = fs.existsSync(MD_PATH) ? fs.readFileSync(MD_PATH, 'utf-8') : '';

async function seed() {
  if (!MONGO_URI) {
    console.error('❌ MONGODB_URI not set in .env');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected');

  const slug = 'nthz';
  const finalResult = { ...parsedResult, detailedReading };

  const profile = await FortuneProfile.findOneAndUpdate(
    { slug },
    {
      $set: {
        slug,
        displayName: 'Nguyễn Trịnh Hoàng Nguyên',
        birthDate: '2004-08-13',
        birthTime: '03:00',
        gender: 'male',
        parsedResult: finalResult,
        fullText: fullText || JSON.stringify(finalResult),
        lastIngestAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );

  console.log(`✅ Profile "${slug}" upserted: ${profile._id}`);
  console.log(`   sections count = ${(profile.parsedResult as any)?.sections?.length}`);
  console.log(`   fullText length = ${profile.fullText?.length || 0} chars`);

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
  console.log('🎉 Seed complete! Profile nthz is ready.');
}

seed().catch(e => { console.error(e); process.exit(1); });
