import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UniverseBackground from '../../universe/UniverseBackground';

const FiftyReasons = () => {
  const navigate = useNavigate();

  // 50 Romantic Reasons using tớ-cậu style
  const reasons = [
    'Cảm ơn cậu đã luôn chờ đợi tớ, dù khoảng cách có xa đến đâu. 🌍',
    'Cảm ơn những cuộc gọi thâu đêm suốt sáng, chỉ để nghe thấy tiếng của nhau. 📞',
    'Cảm ơn cậu đã luôn tin tưởng vào tương lai của đôi mình. ✨',
    'Cảm ơn những lần cậu giấu nỗi buồn vào trong để tớ yên tâm làm việc. ❤️',
    'Cảm ơn cậu vì đã luôn là động lực để tớ cố gắng mỗi ngày. 💪',
    'Cảm ơn những tin nhắn "Chào buổi sáng" và "Ngủ ngon" chưa một ngày thiếu vắng. ☀️',
    'Cảm ơn cậu đã luôn bao dung cho những lúc tớ vô tâm hay bận rộn. 🙏',
    'Cảm ơn nụ cười của cậu qua màn hình đã làm tan biến mọi mệt mỏi trong tớ. 😊',
    'Cảm ơn cậu đã giữ trọn lời hứa của chúng mình năm ấy. 🤙',
    'Cảm ơn cậu vì đã yêu tớ bằng cả trái tim chân thành nhất. 💖',
    'Tớ thích cách cậu cười mỗi khi tớ kể những câu chuyện nhạt nhẽo. 😂',
    'Cảm ơn cậu đã luôn ủng hộ mọi quyết định đôi khi hơi điên rồ của tớ. 🚀',
    'Cậu là người duy nhất khiến tớ cảm thấy mình thực sự đặc biệt. 🌟',
    'Tớ yêu mùi hương của cậu, nó làm tớ thấy bình yên đến lạ. 🌸',
    'Cảm ơn cậu đã lắng nghe tớ lảm nhảm về mọi thứ trên đời này. 🗣️',
    'Tớ thích cái cách cậu lo lắng cho tớ mỗi khi tớ ốm. 🤒',
    'Cảm ơn cậu đã cùng tớ tạo nên những kỷ niệm không thể nào quên. 🎞️',
    'Thế giới của tớ trở nên rực rỡ hơn kể từ khi có cậu bước vào. 🌈',
    'Tớ yêu cách cậu nhìn tớ, ánh mắt đó luôn làm tớ tan chảy. 😍',
    'Cảm ơn cậu đã kiên nhẫn với những tính cách trẻ con của tớ. 🧸',
    'Tớ thích được cùng cậu đi dạo dưới những cơn mưa bóng mây. 🌦️',
    'Cảm ơn cậu đã luôn là bến đỗ an yên nhất của tớ. ⚓',
    'Tớ yêu mọi khuyết điểm của cậu, vì chúng tạo nên một cậu duy nhất. 💎',
    'Cảm ơn cậu đã dạy tớ cách yêu và được yêu chân thành. 📖',
    'Tớ thích cách chúng mình cùng nhau im lặng mà vẫn thấy thoải mái. 🤫',
    'Cảm ơn cậu đã xuất hiện đúng lúc tớ cần một điểm tựa nhất. 🫂',
    'Cậu là món quà tuyệt vời nhất mà cuộc đời đã dành tặng cho tớ. 🎁',
    'Tớ yêu cách cậu chăm sóc tớ từ những điều nhỏ nhặt nhất. 🍵',
    'Cảm ơn cậu đã tin vào tớ ngay cả khi tớ không tin vào chính mình. 🎯',
    'Tớ thích cách cậu gọi tên tớ, nghe sao mà ngọt ngào thế. 🎶',
    'Cảm ơn cậu đã cùng tớ vượt qua những ngày giông bão nhất. ⛈️',
    'Tớ yêu nụ hôn của cậu, nó mang theo cả bầu trời thương nhớ. 💋',
    'Cảm ơn cậu luôn là người đầu tiên chúc mừng tớ mỗi khi có niềm vui. 🎉',
    'Tớ thích cách cậu nắm tay tớ, thật chặt và ấm áp. 🤝',
    'Cảm ơn cậu đã cho tớ biết thế nào là định mệnh của đời mình. 🎡',
    'Tớ yêu cách cậu nấu ăn cho tớ, dù đôi khi nó hơi mặn một tí. 🍳',
    'Cảm ơn cậu đã chia sẻ với tớ những bí mật thầm kín nhất. 🔑',
    'Tớ thích cách chúng mình cùng nhau mơ về ngôi nhà và những đứa trẻ. 🏠',
    'Cảm ơn cậu đã luôn là ánh sáng dẫn lối cho tớ lúc lạc phương hướng. 🕯️',
    'Tớ yêu cái cách cậu ghen tuông một cách cực kỳ đáng yêu. 🐱',
    'Cảm ơn cậu đã chấp nhận và yêu thương con người thật của tớ. 🎭',
    'Tớ thích cách chúng mình cùng nhau xem những bộ phim sến súa. 🎬',
    'Cảm ơn cậu vì những bất ngờ nho nhỏ cậu dành cho tớ mỗi ngày. 🍬',
    'Tớ yêu cách cậu an ủi tớ mỗi khi tớ gặp thất bại hay buồn bã. 🩹',
    'Cảm ơn cậu đã luôn ở bên cạnh tớ, bất kể chuyện gì xảy ra. ♾️',
    'Tớ thích cách chúng mình hứa sẽ cùng nhau già đi. 👴👵',
    'Cảm ơn cậu đã là mảnh ghép hoàn hảo còn thiếu của đời tớ. 🧩',
    'Tớ yêu cậu vì tất cả những gì cậu đang có và sẽ có. 🌹',
    'Cảm ơn cậu đã chọn tớ giữa hàng tỷ người ngoài kia. 🌌',
    'Cuối cùng, cảm ơn cậu vì đã cho tớ cơ hội được yêu cậu. ',
  ];

  return (
    <div className="min-h-screen bg-deep-blue text-soft-pink font-inter relative overflow-x-hidden">
      <UniverseBackground />

      {/* Navigation */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-deep-blue/80 backdrop-blur-md border-b border-white/5">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group hover:gap-3 transition-all"
        >
          <span className="text-xl">←</span>
          <span className="font-dancing text-lg text-white">Quay lại Vũ Trụ</span>
        </button>
        <div className="font-dancing text-xl text-stardust-gold">50 Điều Tớ Yêu Ở Cậu</div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 pt-24 pb-20 px-4 md:px-0 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-dancing text-stardust-gold mb-4 drop-shadow-md">
            Gửi Tới Hna
          </h1>
          <p className="text-white/60 text-sm uppercase tracking-widest">
            50 điều tớ muốn nói với cậu
          </p>
        </div>

        <div className="space-y-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: (index % 5) * 0.1 }}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl md:rounded-full flex items-center gap-6 hover:bg-white/10 hover:border-stardust-gold/30 transition-all"
            >
              {/* Number Badge */}
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-stardust-gold to-orange-400 flex items-center justify-center font-bold text-deep-blue shadow-lg group-hover:scale-110 transition-transform">
                {index + 1}
              </div>

              {/* Text */}
              <p className="flex-grow text-lg md:text-xl font-dancing text-white/90 group-hover:text-stardust-gold transition-colors">
                {reason}
              </p>

              {/* Decorative Heart */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-pink-400">
                ❤
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Heart */}
        <div className="mt-20 text-center opacity-50">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-4xl text-soft-pink inline-block"
          >
            ❤
          </motion.div>
          <p className="mt-4 text-xs uppercase tracking-widest">Yêu Cậu rất nhiều ❤️💕</p>
        </div>
      </div>
    </div>
  );
};

export default FiftyReasons;
