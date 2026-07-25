import { MoodId } from '../audio/soundEngine';

export type ChapterId =
  | 'room'
  | 'vietphu'
  | 'museum'
  | 'campus'
  | 'cinema'
  | 'distance'
  | 'reunion'
  | 'airport'
  | 'cosmos'
  | 'screencall'
  | 'chase'
  | 'epilogue';

export interface Line {
  who: 'her' | 'me' | 'narrator' | 'dream';
  text: string;
}

export interface Shard {
  icon: string;
  title: string;
  date: string;
  text: string;
  /** Optional memory image URL. Only set for chapters with specific real photos! */
  image?: string;
}

export interface ChapterDef {
  id: ChapterId;
  numeral: string;
  title: string;
  place: string;
  mood: MoodId;
  accent: string;
  objective: string;
  intro: Line[];
  outro: Line[];
  hints: string[];
  shard: Shard;
}

export const SPEAKER_NAME: Record<Line['who'], string> = {
  her: 'Hna',
  me: 'nthz',
  narrator: '',
  dream: 'Giấc Mơ',
};

export const CHAPTER_ORDER: ChapterId[] = [
  'room',
  'vietphu',
  'museum',
  'campus',
  'cinema',
  'distance',
  'reunion',
  'airport',
  'cosmos',
  'screencall',
  'chase',
  'epilogue',
];

export const CHAPTERS: Record<ChapterId, ChapterDef> = {
  room: {
    id: 'room',
    numeral: 'Chương 0',
    title: 'Căn phòng không có gì',
    place: 'Trong giấc mơ của nthz',
    mood: 'awakening',
    accent: '#8fa3c8',
    objective: 'Căn phòng tối và bốn bức tường trơn. Tìm đồng hồ để bắt đầu.',
    intro: [
      { who: 'narrator', text: 'Đây là căn phòng trước khi tớ gặp cậu.' },
      { who: 'narrator', text: 'Nó không buồn. Nó chỉ trống.' },
      { who: 'me', text: 'Tớ sống ở đây lâu đến mức tưởng ai cũng sống như thế.' },
    ],
    outro: [
      { who: 'narrator', text: 'Tiếng tích tắc vang lên trong bóng tối.' },
      { who: 'her', text: 'Cậu đứng đó làm gì? Ra đây tớ chỉ cái này.' },
    ],
    hints: [
      'Bấm vào chiếc đồng hồ treo tường để kim bắt đầu quay.',
      'Khi đồng hồ chạy, cánh cửa mở ra.',
    ],
    shard: {
      icon: '🕰️',
      title: 'Căn phòng trống',
      date: 'Trước tháng Tám năm 2023',
      text: 'Trước khi gặp cậu, tớ không biết một ngày bình thường có thể có nhiều màu đến thế.',
    },
  },

  // ─────────────────────────────────────────────────────────────
  vietphu: {
    id: 'vietphu',
    numeral: 'Chương I',
    title: 'Nắng & Cổng Đá',
    place: 'Việt Phủ Thành Chương · 27-28/08/2023',
    mood: 'awakening',
    accent: '#f4b8c7',
    objective: 'Xoay 3 vòng sáng ống kính để hé mở khung hình kỷ niệm.',
    intro: [
      { who: 'me', text: 'Lần đầu đi dã ngoại cùng cả nhóm...' },
      { who: 'her', text: 'Cậu cứ đi thụt lùi chụp ảnh cho mọi người thế.' },
      { who: 'me', text: 'Tớ chụp cảnh thôi. Nhưng ống kính cứ tự xoay về phía cậu.' },
    ],
    outro: [
      { who: 'narrator', text: 'Những rung động dịu dàng đầu tiên đã nảy mầm từ chuyến đi ấy.' },
      { who: 'me', text: 'Cậu bắt đầu chỉ tớ cách chú ý đến những điều nhỏ nhất xung quanh.' },
    ],
    hints: [
      'Xoay 3 vòng sáng ống kính cho đến khi bông hoa ở giữa nở bừng.',
      'Khung ảnh Polaroid kỷ niệm Việt Phủ sẽ hiện ra.',
    ],
    shard: {
      icon: '🏰',
      title: 'Việt Phủ · 27-28/08/2023',
      date: '27-28/08/2023',
      text: 'Chuyến dã ngoại Việt Phủ Thành Chương cùng nhóm bạn. Ánh mắt trao nhau và những rung động ngọt ngào đầu tiên.',
      image: '/images/memories/vietphu.jpg',
    },
  },

  // ─────────────────────────────────────────────────────────────
  museum: {
    id: 'museum',
    numeral: 'Chương II',
    title: 'Buổi hẹn & Tỏ tình',
    place: 'Bảo tàng Phụ Nữ · 30/08/2023',
    mood: 'museum',
    accent: '#d8b06a',
    objective: 'Năm bức tranh. Ban ngày thì chẳng thấy gì lạ.',
    intro: [
      { who: 'me', text: 'Tớ còn tưởng bảo tàng thì buồn.' },
      { who: 'her', text: 'Không buồn. Chỉ là phải nhìn khác đi một chút.' },
    ],
    outro: [
      { who: 'narrator', text: 'Tối hôm đó 30/08/2023, đứng trước cổng nhà cậu...' },
      { who: 'me', text: 'Tớ thích cậu. Làm người yêu tớ nhé.' },
    ],
    hints: [
      'Có cái công tắc đèn ở góc phòng. Thử tắt đèn thường, bật đèn kia xem.',
      'Trong tối, mỗi bức hiện một vệt sáng ở mép. Cả năm bức nối lại thành một đường.',
    ],
    shard: {
      icon: '🌹',
      title: 'Tỏ tình · 30/08/2023',
      date: '30/08/2023 · Trước nhà Hna',
      text: 'Buổi hẹn bảo tàng đầu tiên và lời tỏ tình đầy ngập ngừng trước cổng nhà cậu. Ngày 30/8 chính thức bắt đầu hành trình của hai đứa.',
    },
  },

  // ─────────────────────────────────────────────────────────────
  campus: {
    id: 'campus',
    numeral: 'Chương III',
    title: 'Người chỉ đường',
    place: 'Bách Khoa',
    mood: 'campus',
    accent: '#e0a85a',
    objective: 'Cổng khoá. Tám chữ số của ngày hẹn định mệnh.',
    intro: [
      { who: 'her', text: 'Tớ học ở đây. Một năm thôi.' },
      { who: 'narrator', text: 'Cậu chỉ tớ cách gọi tên mọi thứ. Trước cậu, tớ đi qua chỗ này cả trăm lần mà chưa từng nhìn thấy.' },
    ],
    outro: [
      { who: 'narrator', text: 'Khoá mở.' },
      { who: 'me', text: 'Hôm đó tớ không biết mình đang bắt đầu cái gì. Chỉ biết là không muốn về.' },
    ],
    hints: [
      'Nhập mã số ngày chính thức yêu nhau.',
    ],
    shard: {
      icon: '🎓',
      title: 'Sân trường Bách Khoa',
      date: 'Năm nhất của Hna',
      text: 'Sân Bách Khoa, nắng cuối tháng Tám. Một người bắt đầu dạy tớ cách nhìn.',
    },
  },

  // ─────────────────────────────────────────────────────────────
  cinema: {
    id: 'cinema',
    numeral: 'Chương IV',
    title: 'Hai chiếc ghế',
    place: 'Beta Giải Phóng',
    mood: 'cinema',
    accent: '#a98cd8',
    objective: 'Ba cuộn máy chiếu và hai chiếc ghế đôi.',
    intro: [
      { who: 'me', text: 'Tớ không nhớ tên bộ phim.' },
      { who: 'her', text: 'Biết mà. Cậu có xem đâu.' },
    ],
    outro: [
      { who: 'her', text: 'Phim này tớ cho tám phẩy.' },
      { who: 'me', text: 'Tớ cho mười. Nhưng tớ chấm cái khác.' },
    ],
    hints: [
      'Xoay 3 cuộn phim cho đến khi phông nét.',
      'Bấm chiếc gương bên hông để đọc thông điệp ẩn.',
      'Chọn 2 ghế đôi ở dãy cuối trong cùng bên phải.',
    ],
    shard: {
      icon: '🎬',
      title: 'Hàng ghế gần cuối',
      date: 'Beta Giải Phóng',
      text: 'Tớ chưa bao giờ nhớ tên bộ phim nào mình xem cùng nhau. Tớ nhớ hết mọi thứ khác.',
    },
  },

  // ─────────────────────────────────────────────────────────────
  distance: {
    id: 'distance',
    numeral: 'Chương V',
    title: 'Khoảng lệch',
    place: 'Hà Nội ↔ Ba Lan',
    mood: 'distance',
    accent: '#5ba8c4',
    objective: 'Hai cửa sổ, hai múi giờ. Nhưng chỉ có một bầu trời.',
    intro: [
      { who: 'her', text: 'Mình vẫn nói chuyện mỗi ngày mà. Xa mấy đâu.' },
      { who: 'narrator', text: 'Xa thật. Không phải vì số cây số.' },
    ],
    outro: [
      { who: 'narrator', text: 'Những lo âu về khoảng cách và tương lai bắt đầu đè nặng.' },
      { who: 'me', text: 'Tớ xin lỗi... Tớ lo sợ tương lai mờ mịt và không muốn cậu phải chờ tớ quá lâu.' },
      { who: 'her', text: 'Sao cậu lại tự quyết định buông tay một mình như thế...' },
    ],
    hints: [
      'Xoay giờ sao cho hai múi giờ lệch nhau đúng 6 tiếng.',
    ],
    shard: {
      icon: '🕰️',
      title: 'Yêu xa lần 1',
      date: 'Những ngày dừng lại',
      text: 'Hồi đó tớ hèn lắm. Tớ sợ cậu phải chờ đợi mòn mỏi nên đã tự quyết định buông tay đẩy cậu ra xa. Tớ nợ cậu một lời xin lỗi chân thành nhất.',
      image: '/images/memories/distance1.jpg',
    },
  },

  // ─────────────────────────────────────────────────────────────
  reunion: {
    id: 'reunion',
    numeral: 'Chương VI',
    title: 'Ngày cậu về',
    place: 'Hà Nội · 26/07/2025',
    mood: 'reunion',
    accent: '#f2a8bd',
    objective: '5 địa điểm kỷ niệm trên bản đồ Hà Nội.',
    intro: [
      { who: 'me', text: 'Tớ nhớ cậu. Nhớ đến mức đi tìm.' },
      { who: 'her', text: 'Tớ về rồi. Đi đâu bây giờ?' },
      { who: 'me', text: 'Đi hết.' },
    ],
    outro: [
      { who: 'me', text: 'Lần này mình cẩn thận hơn nhé.' },
      { who: 'me', text: 'Lần này tớ biết phải giữ cái gì rồi.' },
    ],
    hints: [
      'Bấm chọn 5 địa điểm theo đúng thứ tự hành trình ngày gặp lại.',
    ],
    shard: {
      icon: '🌸',
      title: '26 · 07 · 2025',
      date: '26/07/2025',
      text: 'Sân bay, Kebin CF, Quán CK, Rạp phim, Hồ Tây. Một ngày, năm nơi, và tất cả thương nhớ đong đầy.',
    },
  },

  // ─────────────────────────────────────────────────────────────
  airport: {
    id: 'airport',
    numeral: 'Chương VII',
    title: 'Gate 04',
    place: 'Nội Bài · 04/09/2025',
    mood: 'airport',
    accent: '#d7a38f',
    objective: 'Chuyến bay cất cánh từ Cổng Gate 04.',
    intro: [
      { who: 'narrator', text: 'Sảnh chờ gần như trống. Ngoài cửa kính, chuyến bay đã ở đó.' },
      { who: 'narrator', text: '04 tháng 09. Lần này cậu đi.' },
    ],
    outro: [
      { who: 'me', text: 'Tớ không giữ cậu lại.' },
      { who: 'me', text: 'Tớ giữ chỗ để cậu quay về.' },
    ],
    hints: [
      'Chỉnh Gate 04, Tháng 09 và Năm 2025 trên bảng điều khiển.',
    ],
    shard: {
      icon: '✈️',
      title: 'Gate 04',
      date: '04/09/2025',
      text: 'Một chỗ trống không phải để mất nhau. Nó là đường để quay về.',
    },
  },

  // ─────────────────────────────────────────────────────────────
  cosmos: {
    id: 'cosmos',
    numeral: 'Chương VIII',
    title: 'Bí mật của cậu',
    place: 'Lá số · bốn cung',
    mood: 'cosmos',
    accent: '#9d8ce8',
    objective: 'Bốn cung lá số chiếu sáng.',
    intro: [
      { who: 'her', text: 'Tớ xem lá số của tớ rồi. Cả của cậu nữa.' },
      { who: 'me', text: 'Rồi nó nói gì?' },
      { who: 'her', text: 'Nói nhiều. Nhưng tớ thích nhất chỗ nó không nói.' },
    ],
    outro: [
      { who: 'narrator', text: 'Lá số sáng lên và tự đọc thành một câu.' },
      { who: 'her', text: 'Đấy là điều tớ muốn nói nhất, mà nói thẳng thì ngại.' },
    ],
    hints: [
      'Xếp 4 lá số theo đúng vị trí.',
    ],
    shard: {
      icon: '🔮',
      title: 'Bốn cung, bốn sao',
      date: 'Đêm tâm sự',
      text: 'Cậu tin vào sao. Tớ tin vào cậu. Hoá ra hai cái đó không khác nhau lắm.',
    },
  },

  // ─────────────────────────────────────────────────────────────
  screencall: {
    id: 'screencall',
    numeral: 'Chương IX',
    title: 'Hai màn hình nhìn nhau',
    place: 'Yêu xa hiện tại · 2026',
    mood: 'distance',
    accent: '#8fc4e8',
    objective: 'Xoay hai ống kính để hai khung hình trùng khít.',
    intro: [
      { who: 'her', text: 'Cậu đang làm gì đó?' },
      { who: 'me', text: 'Tớ đang vẽ lại mấy cái ngày mình đi cùng nhau.' },
      { who: 'her', text: 'Vẽ đúng không đấy?' },
      { who: 'me', text: 'Sai chỗ nào cậu chỉ, như mọi lần.' },
    ],
    outro: [
      { who: 'narrator', text: 'Ánh sáng từ hai màn hình nối thành một vệt sáng.' },
      { who: 'me', text: 'Tớ biết yêu xa mệt. Nhưng lần này tớ không buông đâu.' },
    ],
    hints: [
      'Bấm vào chiếc máy ảnh góc dưới để đổi góc nhìn.',
      'Kéo thanh trượt để chỉnh nét cả hai bên.',
    ],
    shard: {
      icon: '📱',
      title: 'Hai màn hình',
      date: 'Yêu xa 10,000 km',
      text: '10,000 km xa xôi nhưng luôn chung một nhịp đập.',
      image: '/images/memories/distance2.jpg',
    },
  },

  // ─────────────────────────────────────────────────────────────
  chase: {
    id: 'chase',
    numeral: 'Chương X',
    title: 'Đuổi theo vệt sáng',
    place: 'Hành trình cuối',
    mood: 'awakening',
    accent: '#ffd27a',
    objective: 'Đi qua ba ngôi sao dẫn đường để đến được căn phòng cuối.',
    intro: [
      { who: 'narrator', text: 'Vệt sáng đi qua cả mười chương, giờ dừng lại ở cánh cửa cuối.' },
      { who: 'me', text: 'Lần này tớ không đứng chờ nữa. Tớ đi.' },
    ],
    outro: [
      { who: 'narrator', text: 'Cánh cửa mở ra. Bên trong là tất cả những gì hai người đã đi qua.' },
    ],
    hints: [
      'Bấm vào các chòm sao sáng để dẫn đường.',
    ],
    shard: {
      icon: '⭐',
      title: 'Vệt sáng dẫn đường',
      date: '26/07/2026',
      text: 'Không phải để hết yêu xa. Mà để khoảng cách này có ngày ngắn lại.',
    },
  },

  // ─────────────────────────────────────────────────────────────
  epilogue: {
    id: 'epilogue',
    numeral: 'Kết thúc',
    title: 'Bức thư & Món quà',
    place: 'Nơi tớ chờ cậu',
    mood: 'awakening',
    accent: '#ffd27a',
    objective: '',
    intro: [],
    outro: [],
    hints: [],
    shard: {
      icon: '💌',
      title: 'Bức thư gửi Hna',
      date: '26/07/2026',
      text: 'Tất cả những gì tớ muốn nói, nằm ở đây.',
    },
  },
};

export const LETTER_TITLE = 'Hna này,';

export const LETTER: string[] = [
  'Cậu vừa đi qua một giấc mơ của tớ.',

  'Trong giấc mơ đó tớ là một người không biết gì. Tớ không nói quá đâu. Trước cậu, tớ sống kiểu đi ngang qua mọi thứ: ngang qua Hà Nội, ngang qua những ngày, ngang qua cả chính mình. Không nhìn, không hỏi, không thấy gì đáng để dừng lại.',

  'Rồi cậu đến, và cậu bắt đầu chỉ. Cách bảo tàng có thể vui. Cách chuyến đi dã ngoại ở Việt Phủ cũng là kỷ niệm êm đềm đầu tiên. Cậu chỉ cả những thứ chẳng ai dạy: thích cái gì thì cứ nói là thích, mặc đẹp là để mình vui trước đã, một ngày bình thường vẫn xứng đáng được chụp lại.',

  'Cái tớ học nhanh nhất là chuyện này: nhìn cái gì cũng tự hỏi "không biết cậu sẽ thấy gì ở đây". Từ đó thì cái gì cũng có màu.',

  'Rồi tháng 8 năm 2023, tớ tỏ tình trước nhà cậu. Hôm đó tớ run lắm, đứng ngập ngừng mãi. Cậu gật đầu, và tớ biết mình vừa tìm thấy một thứ không muốn mất.',

  'Những tháng sau đó là những ngày ấm áp nhất. Mình đi Bách Khoa, đi rạp phim Beta Giải Phóng — tớ chẳng nhớ nổi tên phim nào, chỉ nhớ cậu ngồi cạnh. Cậu dạy tớ cách chú ý đến từng chi tiết nhỏ.',

  'Rồi tớ phạm sai lầm. Khi khoảng cách và nỗi lo tương lai đè nặng, tớ đã hèn nhát tự quyết định buông tay, đẩy cậu ra xa vì sợ cậu phải chờ đợi mòn mỏi. Tớ nợ cậu một lời xin lỗi chân thành nhất.',

  'Rồi ngày 26 tháng 7 năm 2025, cậu về. Ngày hôm đó mình đi lại tất cả: Thống Nhất, Bách Khoa, rạp phim, Hồ Gươm, Hồ Tây. Và tớ hiểu ra mình không bao giờ muốn mất cậu một lần nữa.',

  'Rồi ngày 4 tháng 9 năm 2025, mình lại đứng ở sân bay. Lần này cậu đi sau khi mình đã quay lại, nên cái chỗ trống cạnh cửa kính vừa buồn vừa khác trước. Tớ không muốn giữ cậu ở lại bằng lời hứa hay làm cậu thấy có lỗi vì phải đi. Tớ chỉ muốn để lại một chỗ sáng, để lúc nhìn về cậu biết mình vẫn có đường quay lại.',

  'Và giờ mình lại yêu xa. Vẫn hai cái đồng hồ đó, vẫn cái khoảng lệch đó — nhưng không còn là hai người đã buông tay hồi trước.',

  'Nhưng tớ muốn nói với cậu điều này, và đây là lý do thật của cả giấc mơ: lần này khác rồi.',

  'Khác vì bây giờ tớ biết cái mình đang giữ là cái gì.',

  'Khác vì tớ không còn chờ đợi thụ động nữa. Tớ đang cố gắng : học, làm, tự sắp lại đời mình — không phải để hết yêu xa, mà để khoảng cách này có ngày ngắn lại. Tớ không muốn là người đứng đó thương nhớ. Tớ muốn là người tìm cậu.',

  'Khác vì tớ hiểu rồi: mình không đo tình yêu bằng cây số. Mình đo bằng số lần nhắc đến nhau khi người kia không có mặt. Bằng những tin nhắn gửi lúc bên kia đang ngủ, biết là sáng ra mới đọc, vẫn gửi. Bằng việc thấy cái gì hay là muốn kể ngay — chứ không phải kể cho hết chuyện.',

  'Tớ biết yêu xa mệt. Có ngày cậu sẽ thấy vô lý, và cậu có quyền thấy thế. Lúc nào mệt thì cứ nói với tớ, đừng gánh một mình. Cậu không cần phải luôn vui vẻ hay luôn mạnh mẽ. Chỉ cần cậu vẫn ở đây, vẫn kể cho tớ nghe — thế là đủ rồi.',

  'Còn tớ, tớ hứa mấy điều nhỏ, mà nhỏ thì tớ giữ được. Tớ sẽ không để cậu phải đoán tớ đang nghĩ gì. Tớ sẽ nhớ những chuyện nhỏ của cậu, kể cả cái cậu kể qua rồi quên. Tớ sẽ cố gắng đều, không phải cố gắng từng cơn. Cố gắng để sau này có thể gặp cậu, tớ sẽ có sẵn một chỗ mới để dẫn cậu đi — vì cậu đã dẫn tớ đi nhiều quá rồi, giờ tới lượt tớ.',

  'Cảm ơn cậu vì đã bước vào cái căn phòng không có gì đó. Cảm ơn vì đã chỉ. Cảm ơn vì đã về, ngày 26 tháng 7.',

  'Tớ vẫn đang đi theo cậu. Không sốt ruột, không bỏ dở. Cứ đi.',

  'Chúc mừng kỉ niệm của mình, Hna.',

  'Yêu cậu nhiều.',
];

export const LETTER_SIGNOFF = {
  line: 'Người vẫn hướng về phía cậu,',
  name: 'nthz',
  date: '26 · 07 · 2026',
};

/** Shown above the video. */
export const VIDEO_CAPTION = 'Hành trình của mình';
