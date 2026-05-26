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
    { title: 'Tử Tức', score: 69, summary: 'KHÁ TỐT (69/100) — Lộc Tồn, Phượng Các, Thiên Mã, Thiên Hình, Giải Thần, Thiên Hư, Bác Sĩ, Tuế Phá.' },
    { title: 'Tật Ách', score: 50, summary: 'BÌNH HÒA (50/100) — Thiên Cơ, Long Trì, Địa Giải, Tam Thai, Quan Phù, Phục Binh.' },
    { title: 'Điền Trạch', score: 49, summary: 'HƠI XẤU (49/100) — Thiên Đồng, Thiên Lương, Văn Xương, Thai Phụ, Linh Tinh, Tuyệt.' },
    { title: 'Nô Bộc', score: 46, summary: 'HƠI XẤU (46/100) — Thái Dương Hãm, Quốc Ấn, Ân Quang, Tang Môn, Bệnh Phù, Địa Võng, Hóa Kỵ.' },
    { title: 'Phúc Đức', score: 85, summary: 'RẤT TỐT (85/100) — Thiên Tướng, Đường Phù, Tấu Thư, Hồng Loan, Thiên Việt, Thiên Quan.' },
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
    { name: 'Mệnh', location: 'Dần', stars: ['Liêm Trinh (H)', 'Tham Lang (H)', 'Phúc Đức', 'Thiên Đức', 'LN Văn Tinh', 'Hữu Bật', 'Thiên Trù', 'Thiên Thọ', 'Hóa Lộc (Đ)', 'Tiểu Hao', 'Đẩu Quân', 'Kiếp Sát', 'Lộc Tồn (L)'], interpretation: 'Cung Mệnh TỐT (73/100). Liêm Trinh Hóa Lộc: hào sảng, phóng khoáng, giỏi kiếm tiền. Phúc Đức + Thiên Đức: nhân hậu, thích làm việc thiện. Hữu Bật: nhanh nhẹn, tài trí, được quý nhân giúp đỡ. Hóa Lộc: duyên dáng, khéo léo, sành ăn uống. LN Văn Tinh: năng khiếu văn chương, âm nhạc. Tham Lang Hãm: thích một mình, nhiều dục vọng, cẩn trọng ghen tuông.' },
    { name: 'Phụ Mẫu', location: 'Mão', stars: ['Cự Môn (V)', 'Thiên Y', 'Điếu Khách', 'Văn Khúc (H)', 'Tướng Quân', 'Thiên Diêu (H)'], interpretation: 'Cung Phụ Mẫu BÌNH HÒA (52/100). Cự Môn: ám tinh, cha mẹ ốm đau bệnh tật, quan điểm khác nhau, khoảng cách thế hệ lớn. Văn Khúc: cha mẹ khéo léo, tài năng, học vấn cao. Tướng Quân: cha mẹ có danh tiếng. Điếu Khách: bố mẹ phóng khoáng, thích du lịch. Thiên Y: cha mẹ dễ đau ốm, phải dùng thuốc nhiều.' },
    { name: 'Phúc Đức', location: 'Thìn', stars: ['Thiên Tướng (Đ)', 'Tấu Thư', 'Trực Phù', 'Đường Phù', 'Quả Tú', 'Hồng Loan', 'Thiên Việt', 'Thiên Quan'], interpretation: 'Cung Phúc Đức RẤT TỐT (85/100). Thiên Tướng: phúc thọ vẹn toàn, họ hàng giàu sang. Đường Phù: hưởng phúc tổ tiên, mồ mả khang trang. Tấu Thư: dòng họ nhiều người học thức cao, truyền thống khoa bảng. Hồng Loan: họ hàng sống tình cảm, có quý nhân khác giới giúp đỡ. Thiên Việt: nhiều quý nhân phù hộ, tổ tiên có người xuất chúng.' },
    { name: 'Điền Trạch', location: 'Tỵ', stars: ['Thiên Đồng (M)', 'Thiên Lương (V)', 'Văn Xương (Đ)', 'Thái Tuế', 'Thai Phụ', 'Phi Liêm', 'Linh Tinh (H)', 'Tuyệt'], interpretation: 'Cung Điền Trạch HƠI XẤU (49/100). Thiên Đồng + Thiên Lương: không được hưởng nhà đất từ đời trước, phải tự thân kiếm tiền mua nhà. Văn Xương: nhà cửa đẹp, gần trường học. Thai Phụ: có điền sản, có thể được thừa hưởng của cải. Linh Tinh: tai họa về nhà cửa, đất tổ tiên không giữ được lâu.' },
    { name: 'Quan Lộc', location: 'Ngọ', stars: ['Vũ Khúc (Đ)', 'Thất Sát (H)', 'Thiếu Dương', 'Hỷ Thần', 'Đào Hoa', 'Tả Phù', 'Hóa Khoa', 'Thiên Phúc', 'Thiên Không', 'Địa Không (H)', 'Phá Toái', 'Lưu Hà'], interpretation: 'Cung Quan Lộc KHÁ TỐT (67/100). Vũ Khúc + Thất Sát: ngành tài chính, ngân hàng, kinh doanh hoặc võ nghiệp. Thiếu Dương: tài đức vẹn toàn, tiếng tăm lẫy lừng. Hóa Khoa: thi cử đỗ đạt, nhiều bằng cấp, dễ thành chuyên gia. Đào Hoa + Tả Phù: môi trường làm việc nhiều người khác giới. Thiên Không + Địa Không: công danh có thể dang dở, dễ bị biến cố.' },
    { name: 'Nô Bộc', location: 'Mùi', stars: ['Thái Dương (H)', 'Quốc Ấn', 'Tang Môn (H)', 'Ân Quang', 'Bệnh Phù', 'Thiên Khốc', 'Địa Võng', 'Thiên Thương', 'Hóa Kỵ (Đ)'], interpretation: 'Cung Nô Bộc HƠI XẤU (46/100). Thái Dương Hãm + Hóa Kỵ: dễ bị bạn bè oán trách, thị phi. Quốc Ấn: bạn bè thông minh, giỏi giang. Ân Quang: có bạn phụ tá trung hậu, đáng tin cậy. Tang Môn: cả đời lo lắng cho bạn bè. Bệnh Phù: ít bạn bè, ít giao lưu. Địa Võng: bạn bè tốt bụng nhưng hay gây phiền toái.' },
    { name: 'Thiên Di', location: 'Thân', stars: ['Thiếu Âm', 'Đại Hao', 'Cô Thần'], interpretation: 'Cung Thiên Di KHÁ TỐT (60/100). Thiếu Âm: đi xa được nhiều người yêu quý, giúp đỡ. Vô chính diệu: khó giàu có lớn, dễ bị chi phối bởi môi trường xung quanh. Cô Thần: thích đi một mình, ít giao du, khó hòa nhập đám đông. Đại Hao: cẩn trọng hao tài khi đi xa, du lịch hoặc công tác.' },
    { name: 'Tật Ách', location: 'Dậu', stars: ['Thiên Cơ (Đ)', 'Long Trì', 'Địa Giải', 'Tam Thai', 'Quan Phù', 'Phục Binh', 'Thiên Sứ'], interpretation: 'Cung Tật Ách BÌNH HÒA (50/100). Thiên Cơ Đắc: hay lo nghĩ nhiều, căng thẳng thần kinh, dễ mất ngủ. Long Trì: sức khỏe sinh lý tốt nhưng cẩn trọng tai nạn dưới nước. Địa Giải: giải trừ bệnh tật. Tam Thai: ít đau ốm nặng. Quan Phù: nguy cơ thị phi, kiện cáo. Phục Binh: họa mất cắp, cướp giật.' },
    { name: 'Tài Bạch', location: 'Tuất', stars: ['Tử Vi (Đ)', 'Phá Quân (V)', 'Nguyệt Đức', 'Tử Phù', 'Thiên Hỷ', 'Đà La (Đ)', 'Thiên Giải', 'Quan Phủ', 'Thiên Khôi', 'Địa Kiếp (H)', 'Thiên Tài', 'Hóa Quyền (Đ)'], interpretation: 'Cung Tài Bạch KHÁ TỐT (69/100). Tử Vi: nguồn tiền tài sung túc, chủ về chức tước bổng lộc. Phá Quân + Hóa Quyền: có thể có tiền bất ngờ, năng lực vận dụng tiền tốt. Đà La: kiếm tiền nhanh, không ngại dùng mưu mẹo. Nguyệt Đức + Thiên Khôi: kiếm tiền chân chính, biết dùng tiền giúp người. Địa Kiếp Hãm: cẩn trọng phá tán, hao tài lớn khi gặp hạn.' },
    { name: 'Phu Thê', location: 'Tý', stars: ['Thiên Phủ (B)', 'Long Đức', 'Kình Dương (H)', 'Lực Sĩ'], interpretation: 'Cung Phu Thê KHÁ TỐT (65/100). Thiên Phủ: vợ giỏi giang, nhanh nhẹn, gia đình vợ có điều kiện. Long Đức: vợ hiền hậu, đức độ, sống tình nghĩa, ít mâu thuẫn. Lực Sĩ: hôn phối to lớn, vạm vỡ, sức khỏe tốt. Kình Dương Hãm: nên kết hôn muộn, chú ý bạo lực gia đình.' },
    { name: 'Huynh Đệ', location: 'Sửu', stars: ['Thái Âm (H)', 'Thanh Long', 'Bạch Hổ', 'Hoa Cái', 'Hỏa Tinh (Đ)', 'Phong Cáo', 'Thiên La', 'Thiên Quý'], interpretation: 'Cung Huynh Đệ KHÁ TỐT (64/100). Thanh Long: anh chị em hòa thuận, nhân hậu, có học thức. Hoa Cái: chăm chỉ, quý mến nhau. Phong Cáo: anh chị em tri thức, học vấn cao. Thiên Quý: anh em tình cảm tốt đẹp. Thái Âm Hãm: may lắm mới 3 người, có người mang cố tật. Hỏa Tinh: anh em xa cách.' },
    { name: 'Tử Tức', location: 'Hợi', stars: ['Lộc Tồn', 'Tuế Phá', 'Bác Sĩ', 'Thiên Hư (H)', 'Thiên Mã (Đ)', 'Thiên Hình (Đ)', 'Phượng Các', 'Giải Thần', 'Bát Tọa', 'Quan Đới', 'Tuần', 'Triệt'], interpretation: 'Cung Tử Tức KHÁ TỐT (69/100). Lộc Tồn: con muộn, ít con nhưng ngoan ngoãn hiếu thảo. Phượng Các + Giải Thần: dễ sinh quý tử, con thông minh tuấn kiệt. Thiên Mã: con giỏi giang, đa tài, có tính độc lập cao. Thiên Hình: con giỏi giang thành đạt, có duyên với quân đội. Thiên Hư: con nhỏ hay bệnh, cẩn trọng nuôi dạy.' },
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

Cung Mệnh tọa tại Dần, có **Liêm Trinh Hãm địa** và **Tham Lang Hãm địa**.

**Liêm Trinh + Hóa Lộc:** Bạn được hưởng sung sướng, tính cách hào sảng, phóng khoáng, đủ tài lộc vẹn toàn, giỏi kiếm tiền và tiêu tiền cũng nhiều.

**Phúc Đức + Thiên Đức:** Bạn có tính điềm đạm, tốt bụng, ngoại hình ưa nhìn, nhân hậu. Thích làm việc thiện, tạo phúc, giúp đỡ người khác.

**Hữu Bật:** Nhanh nhẹn, tài trí, đa năng, được quý nhân giúp đỡ, khả năng tự lập cao.

**Tham Lang Hãm:** Thích một mình, nhiều dục vọng, tham vọng, hay ghen tuông. Tuy nhiên, nếu biết kiểm soát sẽ phát huy được tài năng nghệ thuật.

**Lưu Niên Văn Tinh:** Có năng khiếu văn chương, mỹ thuật, âm nhạc, tài ăn nói, thu phục lòng người.`,
  palaceQuanLoc: `**Đánh giá: KHÁ TỐT (67/100 điểm)**

Cung Quan Lộc tọa tại Ngọ, **Thân cư Quan Lộc** — tâm huyết với nghề nghiệp.

**Vũ Khúc:** Chủ về ngành tài chính tiền tệ, ngân hàng, kinh doanh. Những công việc thuộc hành Kim đều hợp.

**Thất Sát + Vũ Khúc:** Có võ nghiệp hiển đạt, lập nhiều chiến công nhưng thăng giáng thất thường. Hợp ngành công nghiệp, quân đội, cảnh sát.

**Thiếu Dương:** Vừa có tài vừa có đức, công danh xán lạn, thăng tiến may mắn.

**Đào Hoa:** Đam mê làm việc cống hiến, có thiên khiếu viết vẽ, hội họa, âm nhạc.

**Tả Phù + Hóa Khoa:** Làm gì cũng may mắn, số làm lãnh đạo, giàu có. Hóa Khoa: thi cử đỗ đạt, nhiều bằng cấp cao.

**Thiên Không + Địa Không:** Công danh có thể dang dở, dễ bị biến cố. Cần kiên trì vượt qua.`,
  palaceTaiBach: `**Đánh giá: KHÁ TỐT (69/100 điểm)**

Cung Tài Bạch tọa tại Tuất, có **Tử Vi Đắc địa** và **Phá Quân Vượng địa**.

**Tử Vi:** Nguồn tiền tài sung túc, chủ về chức tước và bổng lộc.

**Phá Quân + Hóa Quyền:** Năng lực vận dụng tiền bạc rất tốt, trải qua sóng gió mới giàu có. Có thể được tiền bất ngờ, cách kiếm tiền kì lạ.

**Đà La:** Có cơ hội kiếm tiền nhanh, có khả năng cạnh tranh. Không ngại dùng mưu mẹo.

**Nguyệt Đức + Thiên Khôi:** Kiếm tiền chân chính, không sân si. Biết dùng tiền giúp đỡ người khác.

**Địa Kiếp Hãm:** Cẩn trọng phá tán, hao tài lớn khi gặp hạn. Tiền đến bất ngờ cũng dễ đi bất ngờ.`,
  palacePhuThe: `**Đánh giá: KHÁ TỐT (65/100 điểm)**

Cung Phu Thê tọa tại Tý, có **Thiên Phủ Bình hòa**.

**Thiên Phủ:** Bạn dễ lấy vợ trẻ, giỏi giang, nhanh nhẹn, gia đình vợ có điều kiện, được vợ chăm sóc chiều chuộng.

**Long Đức:** Vợ hiền hậu, nhẹ nhàng, đức độ, sống tình nghĩa, ít mâu thuẫn.

**Đế Vượng:** Vợ chồng sống hòa thuận, giúp đỡ nhau, có nhiều may mắn, tránh được tai họa.

**Kình Dương Hãm:** Nên kết hôn muộn, nếu sớm dễ trắc trở, tan vỡ. Cần chú ý bạo lực gia đình.`,
  palacePhuMau: `**Đánh giá: BÌNH HÒA (52/100 điểm)**

Cung Phụ Mẫu tọa tại Mão.

**Cự Môn:** Sao Cự Môn ở cung Phụ Mẫu là ám tinh, gây bất lợi. Bạn có thể làm con nuôi hoặc cha mẹ ốm đau. Tình cảm với cha mẹ không tốt đẹp, ít được quan tâm.

**Văn Khúc:** Cha mẹ khéo léo, tài năng, học vấn cao, yêu nghệ thuật.

**Tướng Quân:** Cha mẹ có danh tiếng, được nhiều người biết đến.

**Điếu Khách:** Bố mẹ phóng khoáng, hay đi du lịch, thiếu gắn kết.

**Tử + Tuần:** Cha mẹ hay mắc bệnh tật, sức khỏe không tốt. Mối nhân duyên với cha mẹ không sâu sắc.`,
  palaceHuynhDe: `**Đánh giá: KHÁ TỐT (64/100 điểm)**

Cung Huynh Đệ tọa tại Sửu.

**Thanh Long:** Anh chị em hòa thuận, yêu thương nhau, đều ngoan ngoãn, nhân hậu, giàu tình nghĩa, có học thức.

**Hoa Cái:** Chăm chỉ, chịu khó, anh em quý mến nhau.

**Thiên Quý + Phong Cáo:** Anh em tình cảm tốt đẹp, biết giúp đỡ nhau. Bạn chịu nhiều ảnh hưởng tốt từ anh chị em.

**Suy + Hỏa Tinh:** Đông anh chị em, cuộc sống thuận lợi, sự nghiệp thành đạt.`,
  palaceTuTuc: `**Đánh giá: KHÁ TỐT (69/100 điểm)**

Cung Tử Tức tọa tại Hợi, Vô chính diệu.

**Lộc Tồn:** Bạn có con muộn, con cái phải ở xa cha mẹ. Tuy ít con nhưng con cái đều ngoan ngoãn, hiếu thảo và giỏi giang.

**Phượng Các + Giải Thần:** Bạn được hưởng phúc về mặt con cái. Dễ sinh quý tử, con cái sinh ra dễ nuôi, thông minh, tuấn kiệt, sau này thành danh.

**Thiên Mã:** Con cái giỏi giang, đa tài, có khả năng tự gây dựng sự nghiệp và có tính độc lập cao. Con hay phải đi xa từ sớm.

**Thiên Hình:** Con cái giỏi giang, thành đạt, có công danh sự nghiệp vinh hiển, có duyên với quân đội, binh quyền.

**Thiên Hư:** Con cái khi nhỏ thường mắc nhiều bệnh tật, nghịch ngợm, khó dạy bảo. Nếu biết cách dạy dỗ, làm bạn với con thì tương lai chúng sẽ hiếu thuận.

**Bác Sĩ:** Dễ ít con, muộn con, chậm đường con cái. Có thể cần can thiệp y học.

**Tuế Phá:** Con thường ngỗ nghịch, khó dạy, phá của, hay cãi. Không được như mong đợi.

**Bát Tọa:** Con cái có điều kiện, được hưởng phúc.`,
  palaceTatAch: `**Đánh giá: BÌNH HÒA (50/100 điểm)**

Cung Tật Ách tọa tại Dậu.

**Thiên Cơ Đắc:** Hay lo nghĩ, căng thẳng thần kinh, dễ mất ngủ vì suy nghĩ nhiều.

**Long Trì:** Sức khỏe sinh lý tốt, nhưng cẩn trọng tai nạn dưới nước.

**Địa Giải:** Có khả năng tự giải trừ bệnh tật, ít bệnh nặng.

**Tam Thai:** Ít đau ốm, sức đề kháng tốt.

**Đại Vận đến hạn:** Cần chú ý sức khỏe tâm thần, tránh căng thẳng kéo dài. Tập thể dục thường xuyên, thiền định tốt cho tinh thần.`,
  palaceDienTrach: `**Đánh giá: HƠI XẤU (49/100 điểm)**

Cung Điền Trạch tọa tại Tỵ, có **Thiên Đồng Miếu địa** và **Thiên Lương Vượng địa**.

**Thiên Đồng + Thiên Lương:** Bạn không được hưởng nhà cửa từ người đời trước mà phải tự thân kiếm tiền mua nhà mua đất. Có nhà cũng khó giữ được lâu bền.

**Văn Xương Đắc:** Nhà cửa đẹp, ở gần tiệm sách, văn phòng phẩm hoặc trường học.

**Thai Phụ:** Có điền sản, có thể được tặng hoặc thừa hưởng của cải từ người đời trước. Trong nhà treo nhiều giấy khen, giải thưởng.

**Phi Liêm:** Trong nhà thường nhiều côn trùng, cần lau dọn khử khuẩn thường xuyên.

**Linh Tinh:** Tai họa về nhà cửa, nếu có đất tổ tiên để lại cũng không giữ được lâu bền. Hay gặp ốm đau, căng thẳng đầu óc.

**Tuyệt:** Gây trở ngại cho việc tạo dựng của cải, nhà cửa lâu dài. Nhà ở thường trong ngõ hẻm, tối tăm, vắng vẻ.

**Thái Tuế:** Dễ có biến động về nhà cửa, thay đổi chỗ ở.`,
  palaceNoBoc: `**Đánh giá: HƠI XẤU (46/100 điểm)**

Cung Nô Bộc tọa tại Mùi, có **Thái Dương Hãm địa** và **Hóa Kỵ Đắc địa**.

**Thái Dương Hãm:** Chủ về dễ bị bạn bè hoặc người dưới quyền oán trách. Bạn hiếu khách, bạn bè nhiều nhưng tri kỷ ít.

**Hóa Kỵ:** Bạn bè bằng mặt không bằng lòng, hay bị nói xấu, oán hại. Dễ mắc thị phi, kiện tụng với bạn bè.

**Quốc Ấn:** Bạn bè đa số là người thông minh, giỏi giang, có khí chất. Bạn có thể làm lãnh đạo, nắm chức vị chủ chốt.

**Ân Quang:** Có những người phụ tá trung hậu, đắc lực và đáng tin cậy. Bạn được hưởng phúc báo từ sự nhân nghĩa.

**Tang Môn:** Cả đời phải lo lắng cho bạn bè, bị bạn bè gây nhiều phiền toái.

**Bệnh Phù:** Có ít bạn bè, ít giao lưu. Lười ra ngoài kết bạn, có thể bị cô lập.

**Thiên Khốc:** Có ít bạn bè, hay phải buồn vì bạn bè, đồng nghiệp.

**Địa Võng:** Nhờ bạn bè tốt bụng giúp đỡ, kẻ xấu khó lòng hãm hại được bạn.`,
  palacePhucDuc: `**Đánh giá: RẤT TỐT (85/100 điểm)**

Cung Phúc Đức tọa tại Thìn, có **Thiên Tướng Đắc địa**.

**Thiên Tướng Đắc địa:** Phúc thọ vẹn toàn, họ hàng có thể giàu sang. Bạn được hưởng phúc đức tổ tiên dồi dào.

**Đường Phù:** Được hưởng phúc tổ tiên để lại nên gặp nhiều may mắn. Dòng họ có nhà thờ lớn, bề thế, uy nghi. Mồ mả tổ tiên được trông nom cẩn thận, khang trang.

**Tấu Thư:** Dòng họ thường có nhiều người học thức cao, xuất phát từ dòng dõi nhà nho, có truyền thống học hành giỏi giang, đỗ đạt.

**Hồng Loan:** Trong dòng họ đàn bà thọ hơn đàn ông, họ hàng có nhiều người thành danh, sống tình cảm. Bạn có thể gặp quý nhân là người khác giới giúp đỡ.

**Thiên Việt:** Thường được nhiều quý nhân phù hộ, giúp đỡ. Gia tộc, dòng họ có nhiều người xuất chúng, đỗ đạt cao.

**Thiên Quan:** Ông bà tổ tiên thường làm việc thiện, đem lại nhiều phúc đức may mắn cho bạn.

**Trực Phù:** Tổ tiên để lại nhiều phước đức cho con cháu. Dòng họ nhiều người hiền lành, chất phác.

**Quả Tú:** Có ít họ hàng, người thân ly hương nhiều nơi.`,
  palaceThienDi: `**Đánh giá: KHÁ TỐT (60/100 điểm)**

Cung Thiên Di tọa tại Thân.

**Thiếu Âm:** Đi xa gặp nhiều người yêu quý, giúp đỡ. Có duyên với phương xa.

**Cô Thần:** Thích đi một mình, khó hòa nhập đám đông, nhưng khi đã quen thì rất thoải mái.

**Đại Hao:** Cẩn trọng hao tài khi đi xa, du lịch hoặc công tác. Quản lý chi tiêu cẩn thận.

**Không có chính tinh tại Thiên Di:** Dễ bị chi phối bởi môi trường ngoại cảnh, cần giữ vững lập trường khi xa nhà.`,
  yearly2026: `**Năm 2026 (Bính Ngọ) — 23 tuổi. Tiểu vận tại cung Nhâm Thân.**

**Năm 2026 là năm Hạn:** Gặp năm hạn, trong năm có những vận hạn, tai hoạ lớn nhỏ. Công việc, sự nghiệp, sức khỏe và các mối quan hệ có thể bị ảnh hưởng khá nhiều.

**Tuổi Giáp Thân với năm Bính Ngọ:** Can tuổi sinh can năm vận, tiểu vận khá xấu. Cuộc sống và công việc ban đầu gặp nhiều bất lợi nhưng sau có thể thành công.

**Mệnh Thủy với cung Nhâm Thân:** Hành cung tiểu vận sinh cho hành mệnh, tiểu vận tốt, có thể thực hiện được nhiều dự định trong công việc. Các mối quan hệ khác giới có xu hướng phát triển tốt.

**Các sao lưu đáng chú ý:**
- Lưu Thái Tuế nhập Phụ Mẫu: chú ý sức khỏe cha mẹ.
- Lưu Tang Môn nhập Điền Trạch: hao hụt nhà cửa, đất đai.
- Lưu Bạch Hổ nhập Tử Tức: lo lắng cho con cái.
- Lưu Kình Dương nhập Phụ Mẫu: cha mẹ không hòa thuận.
- Lưu Đà La nhập Huynh Đệ: anh chị em tranh cãi.
- Lưu Thiên Mã nhập Điền Trạch: thay đổi chỗ ở.
- Lưu Lộc Tồn nhập Mệnh: có cơ hội kiếm tiền lớn.

**Tháng 2/2026 (Tân Mão): Tháng xấu.** Ngày tốt: 1, 2, 7, 8, 11, 12, 17, 18, 21, 22, 27, 28. Ngày xấu: 5, 6, 9, 10, 15, 16, 19, 20, 25, 26, 29.`,
  conclusion: `Tracuutuvi.com đã gửi đến bạn bản lá số chi tiết cùng những luận giải về các sao và ý nghĩa của chúng trong từng cung của **Nguyễn Trịnh Hoàng Nguyên**.

**Tổng kết điểm mạnh:**
- Cung Phúc Đức RẤT TỐT (85/100) — Thiên Tướng tọa thủ, phúc đức tổ tiên dồi dào, dòng họ khoa bảng
- Cung Mệnh TỐT (73/100) — Liêm Trinh Hóa Lộc, phóng khoáng tài lộc, Hữu Bật hộ trì
- Cung Tài Bạch KHÁ TỐT (69/100) — Tử Vi tọa thủ, Phá Quân Hóa Quyền, tiền tài sung túc

**Cần lưu ý:**
- Cung Nô Bộc Hơi xấu (46/100) — Thái Dương Hãm + Hóa Kỵ, cẩn trọng bạn bè phản bội, thị phi
- Cung Điền Trạch Hơi xấu (49/100) — Thiên Đồng + Linh Tinh, nhà cửa trục trặc, đầu tư đất đai khó khăn
- Năm 2026 là năm Hạn — cẩn trọng sức khỏe, các mối quan hệ và tài chính

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
