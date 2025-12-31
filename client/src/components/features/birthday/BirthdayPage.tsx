import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TypewriterWord = ({ word, delay }: { word: string; delay: number }) => {
    const characters = Array.from(word);
    
    return (
        <span className="inline-block whitespace-nowrap">
            {characters.map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.1,
                        delay: delay + (i * 0.05)
                    }}
                >
                    {char}
                </motion.span>
            ))}
            {/* Add space after the word */}
            <span className="inline-block">&nbsp;</span>
        </span>
    );
};

const TypewriterLine = ({ text, startDelay = 0 }: { text: string; startDelay?: number }) => {
    const words = useMemo(() => text.split(' '), [text]);
    
    // Calculate cumulative delay for each word based on number of characters in previous words
    let cumulativeDelay = startDelay;
    
    return (
        <p className="flex flex-wrap justify-start text-left">
            {words.map((word, i) => {
                const currentWordDelay = cumulativeDelay;
                // Update cumulative delay: characters in word + 1 for space, approx 0.05s per char
                cumulativeDelay += (word.length + 1) * 0.05;
                
                return <TypewriterWord key={i} word={word} delay={currentWordDelay} />;
            })}
        </p>
    );
};

const BirthdayPage = () => {
    const navigate = useNavigate();
    
    // Auto-replay typewriter on mount
    const [key, setKey] = useState(0);

    const handleReplay = () => {
        setKey(prev => prev + 1);
    }

    return (
        <div className="min-h-screen bg-[#fff5f7] flex items-center justify-center p-4 pt-20 md:p-8 md:pt-24 font-inter">
            {/* Main Card Container */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white w-full max-w-6xl rounded-[30px] md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row min-h-[90vh] md:h-[85vh] border border-white/50"
            >
                
                {/* LEFT COLUMN: Text Content */}
                <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between relative bg-white">
                    
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-1">
                             <span className="text-2xl">💌</span>
                             <h2 className="text-3xl md:text-4xl font-bold text-[#ff4d94]">Gửi em...</h2>
                        </div>
                        <p className="text-gray-400 text-sm ml-10">Đọc nha mình</p>
                    </div>

                    {/* Letter Content Box */}
                    <div 
                        key={key}
                        className="flex-grow bg-[#fafafa]/50 rounded-3xl p-6 md:p-8 border border-gray-50 flex flex-col gap-4 font-mono font-light text-gray-700 text-sm md:text-base leading-relaxed overflow-y-auto scrollbar-hide"
                        style={{
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                        }}
                    >
                        <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
                        <TypewriterLine text="Mình à," startDelay={0.5} />
                        
                        <TypewriterLine 
                            text="Chúc mừng sinh nhật thật vui, thật bình an và tràn đầy những điều đẹp nhất." 
                            startDelay={1.2} 
                        />
                        
                        <TypewriterLine 
                            text="Dù xa nhau, mình vẫn luôn ở đây — nghĩ về mình, nhớ mình mỗi ngày." 
                            startDelay={5} 
                        />
                        
                        <TypewriterLine 
                            text="Mong chuyến đi của mình thật an toàn, thuận lợi và đầy kỷ niệm đẹp." 
                            startDelay={9} 
                        />
                        
                        <TypewriterLine 
                            text="Hẹn ngày chúng ta gặp lại, để cùng nhau mừng sinh nhật trọn vẹn hơn nữa." 
                            startDelay={12.5} 
                        />
                        
                        <div className="mt-2 text-rose-500 font-bold">
                             <TypewriterLine text="Yêu mình nhiều lắm 💕" startDelay={16.5} />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="mt-8 flex gap-4">
                        <button 
                            onClick={handleReplay}
                            className="bg-[#ff4d94] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-[#ff3385] transition-all flex items-center gap-2"
                        >
                            <span>🎁</span> Lời chúc
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-white text-[#ff4d94] border-2 border-[#ff4d94]/20 px-6 py-3 rounded-2xl font-bold hover:bg-pink-50 transition-all flex items-center gap-2"
                        >
                            <span className="text-pink-400">🎀</span> Tiếp tục
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Video Container */}
                <div className="w-full md:w-1/2 p-4 md:p-8 bg-[#fff5f7]">
                    <div className="w-full h-full rounded-[30px] overflow-hidden shadow-2xl relative bg-black aspect-[9/16] md:aspect-auto">
                        <video 
                            className="w-full h-full object-cover"
                            src="https://res.cloudinary.com/dn7xu3u3m/video/upload/v1767203767/hpbd_gvpbww.mp4"
                            autoPlay
                            muted={false}
                            controls
                            loop
                            playsInline
                        />
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default BirthdayPage;
