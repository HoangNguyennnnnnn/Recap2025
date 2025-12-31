import dotenv from 'dotenv';
import { Memory, Letter, VoiceNote, Comment, Reaction, HnaGallery, SecretMedia } from '../models/index.js';
import { connectDatabase } from '../config/database.js';

dotenv.config();

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2000&auto=format&fit=crop', // Sparklers/Celebration
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await connectDatabase();

    // 1. Cleanup
    console.log('🧹 Cleaning up old data...');
    await Promise.all([
      Memory.deleteMany({}),
      Letter.deleteMany({}),
      VoiceNote.deleteMany({}),
      // Optional: keep metadata/comments/reactions or clear them too
      Comment.deleteMany({}),
      Reaction.deleteMany({}),
      HnaGallery.deleteMany({}),
      SecretMedia.deleteMany({})
    ]);

    // 2. Seed Memories
    console.log('📸 Seeding Memories...');
    const memories = [
      {
        title: "Lần đầu gặp mặt",
        description: "Nơi mọi thứ bắt đầu ✨",
        date: new Date('2024-06-26'),
        tags: ["Lần đầu", "Gặp mặt"],
        location: "Quán cà phê quen thuộc",
        story: "Tớ vẫn nhớ khoảnh khắc bước vào quán và thấy cậu ngồi đó. Thế giới như dừng lại một nhịp. Chúng mình đã nói chuyện hàng giờ về đủ mọi thứ trên đời. Tớ biết ngay lúc đó, đây là khởi đầu của một điều gì đó thật tuyệt vời.",
        photos: [UNSPLASH_IMAGES[1]]
      },
      {
        title: "Hoàng hôn trên biển",
        description: "Sóng, cát và tay tớ trong tay cậu.",
        date: new Date('2024-08-15'),
        tags: ["Du lịch", "Mùa hè"],
        location: "Bãi biển vắng",
        story: "Bầu trời lúc đó như một bức tranh màu hồng kẹo bông. Chúng mình đi dạo dọc bờ biển, để lại những dấu chân mà sau đó sóng sẽ xóa nhòa, nhưng kỷ niệm về sự bình yên ấy sẽ còn mãi trong lòng tớ.",
        photos: [UNSPLASH_IMAGES[2]]
      },
      {
        title: "Chuyến xe đêm",
        description: "Ánh đèn thành phố và những bài hát yêu thích.",
        date: new Date('2024-09-20'),
        tags: ["Phiêu lưu", "Đêm muộn"],
        location: "Đường cao tốc",
        story: "Mở cửa sổ xe, tiếng nhạc vang lên. Chúng mình vừa hát sai nhạc vừa cười đến đau cả bụng. Chỉ có tớ và cậu, đối diện với cả thế giới ngoài kia.",
        photos: []
      },
      {
        title: "Sinh nhật bất ngờ",
        description: "Tớ thực sự không ngờ tới luôn đó!",
        date: new Date('2024-11-10'),
        tags: ["Kỷ niệm", "Bất ngờ"],
        location: "Quán rooftop",
        story: "Cậu đã chuẩn bị mọi thứ thật hoàn hảo. Tất cả bạn bè đều có mặt, nhưng tớ chỉ có thể nhìn thấy cậu, rạng rỡ với nụ cười 'Tớ làm được rồi nè'.",
        photos: [UNSPLASH_IMAGES[3], UNSPLASH_IMAGES[0]]
      },
      {
        title: "Chủ nhật bình yên",
        description: "Xem phim, cuộn mình trong chăn và không chút lo âu.",
        date: new Date('2024-12-01'),
        tags: ["Bình yên", "Nhà"],
        location: "Góc nhỏ của chúng mình",
        story: "Ngoài trời mưa tầm tã, nhưng bên trong thì thật ấm áp. Chúng mình gọi pizza, xem ba bộ phim liền, và chỉ đơn giản là tận hưởng cảm giác được ở bên nhau.",
        photos: [UNSPLASH_IMAGES[4]]
      }
    ];

    await Memory.insertMany(memories);

    // 3. Seed Letters
    console.log('💌 Seeding Letters...');
    const letters = [
      {
        content: "Cậu à, cảm ơn cậu đã luôn là ánh sáng trong cuộc đời tớ. Mỗi ngày được ở bên cậu là một món quà mà tớ không bao giờ muốn đánh mất. Tớ yêu cậu nhiều hơn những gì lời nói có thể diễn tả.",
        unlockDate: new Date('2025-01-01'), // Past date (Unlocked)
        isOpened: true,
        sender: 'nthz'
      },
      {
        content: "Chúc mừng kỷ niệm của chúng mình nè! Vậy là chúng mình đã cùng nhau đi qua thêm một năm nữa, bền chặt và hạnh phúc hơn. Tớ có một điều bất ngờ dành cho cậu nè...",
        unlockDate: new Date('2026-07-26'), // Future Anniversary (Locked)
        isOpened: false,
        sender: 'nthz'
      },
      {
        content: "Chỉ là một lời nhắc nhở rằng cậu rất tuyệt vời và có thể làm được mọi thứ. Đừng bao giờ từ bỏ ước mơ của mình nhé. Tớ luôn tin tưởng và ở phía sau ủng hộ cậu.",
        unlockDate: new Date('2026-02-14'), // Future Valentine's Day (Locked)
        isOpened: false,
        sender: 'nthz'
      }
    ];

    await Letter.insertMany(letters);

    // 4. Seed Voice Notes
    console.log('🎤 Seeding Voice Notes...');
    const voiceNotes = [
      {
        location: "Đà Lạt, Việt Nam",
        coordinates: { lat: 11.9404, lng: 108.4373 },
        audioUrl: "https://example.com/audio1.mp3", // Placeholder
        transcript: "Tớ đang nhớ cậu giữa không khí se lạnh của Đà Lạt nè.",
        date: new Date('2024-05-20')
      },
      {
        location: "Hà Nội, Việt Nam",
        coordinates: { lat: 21.0285, lng: 105.8542 },
        audioUrl: "https://example.com/audio2.mp3", // Placeholder
        transcript: "Hà Nội hôm nay đẹp lắm, nhưng nếu có cậu ở đây thì sẽ đẹp hơn nhiều.",
        date: new Date('2024-04-10')
      }
    ];

    await VoiceNote.insertMany(voiceNotes);

    // 5. Seed Hna Gallery Sets
    console.log('🌸 Seeding Hna Gallery Sets...');
    const gallerySets = [
      {
        title: "Dạo chơi phố phường",
        description: "Một ngày nắng đẹp xách máy lên và đi 📸",
        date: new Date('2024-10-05'),
        photos: [
          { url: UNSPLASH_IMAGES[0], publicId: 'seed/photo1', caption: 'Khởi đầu rực rỡ', order: 0 },
          { url: UNSPLASH_IMAGES[1], publicId: 'seed/photo2', caption: 'Nắm tay nhau đi khắp thế gian', order: 1 }
        ],
        tags: ["Dạo phố", "Nắng"]
      },
      {
        title: "Bữa tối lãng mạn",
        description: "Kỷ niệm bên ánh nến 🍷",
        date: new Date('2024-12-24'),
        photos: [
          { url: UNSPLASH_IMAGES[3], publicId: 'seed/photo3', caption: 'Cheers!', order: 0 },
          { url: UNSPLASH_IMAGES[4], publicId: 'seed/photo4', caption: 'Ấm áp quá đi', order: 1 },
          { url: UNSPLASH_IMAGES[2], publicId: 'seed/photo5', caption: 'Góc chụp yêu thích', order: 2 }
        ],
        tags: ["Christmas", "Dinner"]
      }
    ];

    await HnaGallery.insertMany(gallerySets);

    // 6. Seed Secret Room Media (A Secret in Time)
    console.log('🤫 Seeding Secret Room Media...');
    const secretMedia = [
      {
        type: 'note',
        title: 'Lời chúc đầu tiên cho cậu',
        content: 'Chào mừng cậu đến với phòng bí mật của chúng mình. Đây là nơi tớ sẽ để lại những điều nhỏ bé nhưng đầy tình yêu mà tớ không muốn ai khác thấy. Tớ yêu cậu! 💕',
        date: new Date('2025-01-01'),
      },
      {
        type: 'note',
        title: 'Một lời hứa nhỏ',
        content: 'Tớ hứa sẽ luôn ở bên cậu, dù cả thế giới có quay lưng lại. Tớ sẽ là bến đỗ bình yên nhất của cậu. ⚓💖',
        date: new Date('2024-12-31'),
      },
      {
        type: 'note',
        title: 'Bình yên bên cậu',
        content: 'Tớ chỉ muốn nói là cảm ơn cậu vì đã luôn kiên nhẫn và bao dung với tớ. Có cậu ở bên, tớ thấy thế giới này dịu dàng hơn biết bao nhiêu. 🥰',
        date: new Date('2025-01-01'),
      }
    ];

    await SecretMedia.insertMany(secretMedia);

    console.log('✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
