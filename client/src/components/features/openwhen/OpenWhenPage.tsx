import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UniverseBackground from '../../universe/UniverseBackground';

interface Letter {
  id: string;
  label: string;
  icon: string;
  content: string;
  color: string;
}

const LETTERS: Letter[] = [
  {
    id: 'sad',
    label: "Khi cậu buồn...",
    icon: "😢",
    content: "Tớ biết lúc này có thể cậu đang cảm thấy yếu lòng. Nếu tớ ở đó, tớ sẽ ôm cậu thật chặt và chẳng nói gì cả, chỉ để cậu dựa vào thôi. Hãy nhớ rằng nỗi buồn chỉ là một đám mây trôi qua, còn bầu trời của chúng ta vẫn luôn ở đó. Cậu mạnh mẽ lắm, nhưng hôm nay yếu đuối một chút cũng không sao đâu. Tớ thương cậu nhiều lắm.",
    color: "from-blue-400 to-indigo-600"
  },
  {
    id: 'mad',
    label: "Khi cậu giận tớ...",
    icon: "😡",
    content: "Xin lỗi cậu vì đã làm cậu buồn bực. Tớ ngốc nghếch quá phải không? Đừng giận tớ lâu nhé, vì thời gian mình giận nhau là thời gian lãng phí không được yêu thương nhau đấy. Hít thở sâu nào... Tớ biết lỗi rồi. Yêu cậu nhiều lắm (và sợ cậu giận lắm nè).",
    color: "from-red-400 to-rose-600"
  },
  {
    id: 'miss',
    label: "Khi cậu nhớ tớ...",
    icon: "🌙",
    content: "Tớ cũng đang nhớ cậu da diết đây. Khoảng cách này thật đáng ghét, nhưng nó cũng chứng minh tình yêu của chúng mình lớn đến nhường nào. Hãy nhìn lên bầu trời nhé, chúng ta đang dưới cùng một vầng trăng. Nhắm mắt lại đi, tớ đang gửi cho cậu một cái ôm xuyên không gian đấy.",
    color: "from-purple-400 to-violet-600"
  },
  {
    id: 'sleep',
    label: "Khi cậu không ngủ được...",
    icon: "🐑",
    content: "Đừng cố ép bản thân phải ngủ nếu không ngủ được. Thả lỏng vai nào, hít thở nhẹ nhàng thôi. Hãy tưởng tượng cậu đang nằm trên một đám mây mềm xốp, trôi bồng bềnh giữa dải ngân hà của chúng mình. Tớ đang ở bên cạnh, vuốt tóc cậu và hát ru cậu đây. Ngủ ngoan nhé bé yêu của tớ.",
    color: "from-teal-400 to-emerald-600"
  }
];

const OpenWhenPage = () => {
  const navigate = useNavigate();
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  return (
    <div className="min-h-screen text-white font-inter relative bg-deep-blue pb-12 overflow-hidden">
      <UniverseBackground />

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-stardust-gold transition-colors font-dancing text-lg"
        >
            ← Back to Universe
        </button>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 flex flex-col items-center">
        <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-dancing font-bold text-stardust-gold mb-12 drop-shadow-lg"
        >
            Open When...
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {LETTERS.map((letter, index) => (
                <motion.div
                    key={letter.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedLetter(letter)}
                    className="cursor-pointer relative group"
                >
                    {/* Envelope Card */}
                    <div className={`h-40 md:h-52 rounded-2xl bg-gradient-to-br ${letter.color} p-[1px] shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow`}>
                         <div className="h-full w-full bg-deep-blue/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                            {/* Decorative Envelope Flap (CSS Triangleish) */}
                            <div className="absolute top-0 left-0 w-full h-[50%] bg-white/5 skew-y-3 origin-top transform -translate-y-4" />
                            
                            <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                                {letter.icon}
                            </span>
                            <span className="font-dancing text-xl md:text-2xl text-white/90 group-hover:text-stardust-gold transition-colors">
                                {letter.label}
                            </span>
                            <div className="absolute bottom-4 text-xs uppercase tracking-widest opacity-40">
                                Tap to Open
                            </div>
                         </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>

      {/* Letter Modal */}
      <AnimatePresence>
        {selectedLetter && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedLetter(null)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                
                <motion.div
                    layoutId={selectedLetter.id}
                    initial={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="relative bg-[#fafaf5] text-gray-800 w-full max-w-lg p-8 md:p-12 rounded shadow-2xl overflow-hidden"
                    style={{
                        backgroundImage: `repeating-linear-gradient(#fafaf5 0px, #fafaf5 24px, #a8d5e5 25px)`,
                        lineHeight: '25px'
                    }}
                >
                    {/* Paper Texture/Style */}
                    <div className="absolute top-0 left-8 w-[1px] h-full bg-red-200/50" />
                    
                    <button 
                        onClick={() => setSelectedLetter(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>

                    <h3 className="font-dancing text-3xl text-gray-700 mb-6 border-b border-gray-200 pb-2">
                        {selectedLetter.label}
                    </h3>

                    <p className="font-dancing text-xl leading-[25px] whitespace-pre-wrap">
                        {selectedLetter.content}
                    </p>

                    <div className="mt-8 text-right font-dancing text-2xl text-rose-500">
                        Forever Yours, <br/>
                        nthz
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpenWhenPage;
