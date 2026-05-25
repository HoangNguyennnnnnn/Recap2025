import { GoogleGenAI } from '@google/genai';
import pdf from 'pdf-parse';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-2';
const GEMINI_EMBED_FALLBACK = process.env.GEMINI_EMBED_FALLBACK || 'gemini-embedding-001';

let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export interface FortuneProfileInfo {
  displayName?: string;
  birthDate?: string;
  birthTime?: string;
  gender?: string;
}

export interface FortuneGenerateInput {
  displayName?: string;
  birthDate?: string;
  birthTime?: string;
  gender?: string;
  question?: string;
  context: string;
}

export interface FortuneSection {
  title: string;
  score?: number;
  subtitle?: string;
  summary?: string;
  details?: string[];
  warnings?: string[];
  action?: string;
  tags?: string[];
}

export interface FortuneElement {
  name: string;
  value: number;
  note?: string;
}

export interface FortuneTimelineItem {
  label: string;
  status: string;
  score?: number;
}

export interface FortuneChapter {
  index?: number;
  title: string;
  score?: number;
  focus?: string;
  strengths?: string[];
  cautions?: string[];
  action?: string;
  stars?: string[];
}

export interface FortunePalace {
  name: string;
  stars?: string[];
  location?: string;
  interpretation?: string;
}

export interface DetailedReading {
  introGeneral?: string;
  introGuide?: string;
  generalBanMenh?: string;
  generalCucMenh?: string;
  indicators?: {
    chuMenh?: string;
    chuThan?: string;
    laiNhan?: string;
    canLuong?: string;
    thanCu?: string;
  };
  palaceMenh?: string;
  palaceQuanLoc?: string;
  palaceTaiBach?: string;
  palacePhuThe?: string;
  palacePhuMau?: string;
  palaceHuynhDe?: string;
  palaceTuTuc?: string;
  palaceTatAch?: string;
  palaceDienTrach?: string;
  palaceNoBoc?: string;
  palacePhucDuc?: string;
  palaceThienDi?: string;
  yearly2026?: string;
  conclusion?: string;
}

export interface FortuneResult {
  profile: {
    displayName?: string;
    birthDate?: string;
    birthTime?: string;
    gender?: string;
  };
  headline?: string;
  overview?: string;
  score?: number;
  sections: FortuneSection[];
  elements?: FortuneElement[];
  timeline?: FortuneTimelineItem[];
  chapters?: FortuneChapter[];
  palaces?: FortunePalace[];
  detailedReading?: DetailedReading;
  highlights?: string[];
}

export const downloadFileToBuffer = async (fileUrl: string): Promise<Buffer> => {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export const extractPdfText = async (buffer: Buffer): Promise<string> => {
  const data = await pdf(buffer);
  return data.text || '';
};

export const normalizeText = (text: string): string => {
  return text.replace(/\s+/g, ' ').trim();
};

export const cleanPdfTextWithAi = async (rawText: string): Promise<string> => {
  const sample = rawText.slice(0, 18000); // Lấy đoạn text dài để làm sạch toàn bộ lá số
  const prompt = `Bạn là trợ lý biên tập thông tin chuyên nghiệp. Đoạn văn bản sau trích xuất từ file PDF lá số Tử Vi bị mất dấu tiếng Việt (không dấu), lỗi định dạng khoảng trắng hoặc nhảy ký tự.
Nhiệm vụ của bạn:
1. Chuyển đổi và khôi phục toàn bộ văn bản sang TIẾNG VIỆT CÓ DẤU CHUẨN XÁC 100% (sửa lỗi chính tả, thêm dấu đầy đủ).
2. Giữ nguyên toàn bộ thông tin gốc, đặc biệt là: Họ tên, Ngày tháng năm sinh (cả Dương lịch và Âm lịch nếu có), Giờ sinh, Giới tính, Tên các cung, Các sao chính tinh/phụ tinh, Cân lượng cốt tủy và các dòng luận đoán.
3. Trả về đoạn văn bản đã được chuẩn hóa, mạch lạc, dễ đọc. Không thêm bớt suy đoán ngoài lề.

Văn bản gốc cần khôi phục:
${sample}`;

  const client = getAiClient();
  try {
    const result = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    const cleaned = result.text || rawText;
    console.log(`✅ AI successfully cleaned and accented PDF text. Length: ${cleaned.length} chars`);
    return cleaned;
  } catch (error) {
    console.error('⚠️ Failed to clean PDF text with Gemini, using raw text:', error);
    return rawText;
  }
};

export const splitTextIntoChunks = (text: string, maxChars = 1200, overlap = 200): string[] => {
  if (!text) return [];

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxChars, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk.trim());
    if (end === text.length) break;
    start = Math.max(0, end - overlap);
  }

  return chunks.filter((chunk) => chunk.length > 0);
};

const extractEmbedding = (result: any): number[] => {
  const emb = result.embedding || result.embeddings?.[0];
  return emb?.values || [];
};

export const embedText = async (text: string): Promise<number[]> => {
  const client = getAiClient();
  try {
    const result = await client.models.embedContent({
      model: GEMINI_EMBED_MODEL,
      contents: text,
    });
    const values = extractEmbedding(result);
    if (values.length > 0) return values;
    console.warn(`⚠️  Gemini embedding returned empty, trying fallback model...`);
  } catch (error) {
    console.warn(`⚠️  Gemini embedding (${GEMINI_EMBED_MODEL}) failed:`, (error as Error).message);
  }

  if (GEMINI_EMBED_FALLBACK && GEMINI_EMBED_FALLBACK !== GEMINI_EMBED_MODEL) {
    try {
      const result = await client.models.embedContent({
        model: GEMINI_EMBED_FALLBACK,
        contents: text,
      });
      const values = extractEmbedding(result);
      if (values.length > 0) return values;
    } catch (error) {
      console.warn(`⚠️  Gemini embedding fallback (${GEMINI_EMBED_FALLBACK}) failed:`, (error as Error).message);
    }
  }

  console.warn('⚠️  Gemini embedding failed, using lexical retrieval fallback.');
  return [];
};

export const lexicalSimilarity = (query: string, text: string): number => {
  const queryTokens = query.toLowerCase().match(/\p{L}+/gu) || [];
  const textTokens = text.toLowerCase().match(/\p{L}+/gu) || [];

  if (queryTokens.length === 0 || textTokens.length === 0) return 0;

  const textSet = new Set(textTokens);
  let hits = 0;
  for (const token of new Set(queryTokens)) {
    if (textSet.has(token)) hits += 1;
  }

  return hits / new Set(queryTokens).size;
};

export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length || a.length === 0) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const extractJson = (text: string): Record<string, any> | null => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    const jsonText = text.slice(start, end + 1);
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
};

export const extractProfileInfo = async (text: string): Promise<FortuneProfileInfo | null> => {
  const sample = text.slice(0, 6000);
  const prompt = `Trích xuất thông tin cá nhân của chủ lá số từ văn bản sau. Sửa các lỗi chính tả và dùng tiếng Việt có dấu chuẩn cho displayName.
Văn bản:
${sample}`;

  const client = getAiClient();
  try {
    const result = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            displayName: { type: 'string' },
            birthDate: { type: 'string' },
            birthTime: { type: 'string' },
            gender: { type: 'string' },
          }
        }
      }
    });
    const responseText = result.text || '';
    return JSON.parse(responseText.trim());
  } catch (error) {
    console.warn('⚠️  Structured profile extraction failed, falling back to manual parsing:', error);
    // Fallback manual parsing if schema isn't supported or fails
    const result = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Extract profile info from the text. Return JSON only.
Schema: { "displayName": "", "birthDate": "DDMMYYYY", "birthTime": "HH:mm", "gender": "male|female|other" }
Text: ${sample}`,
    });
    return extractJson(result.text || '') as any;
  }
};

export const generateFortuneResult = async (
  input: FortuneGenerateInput
): Promise<FortuneResult> => {
  // Determine if this is a full ingest analysis (full PDF text) or a Q&A query
  const isFullAnalysis = !input.question?.trim();
  const contextLength = input.context.length;

  const prompt = isFullAnalysis
    ? `Bạn là một học giả Tử Vi Đẩu Số uyên thâm với hơn 30 năm kinh nghiệm. Dưới đây là TOÀN BỘ nội dung lá số Tử Vi từ PDF. Hãy đọc KỸ LƯỠNG và phân tích CHI TIẾT, CHÍNH XÁC dựa trên đúng những gì có trong tài liệu.

NGUYÊN TẮC PHÂN TÍCH:
- Chỉ luận giải dựa trên thông tin THỰC TẾ trong tài liệu, không bịa đặt
- Trích dẫn tên sao, cung, cục mệnh ĐÚNG như trong PDF
- Mỗi cung phải có ít nhất 3-5 đoạn phân tích chi tiết
- Điểm số (score) phải phản ánh đúng mức độ cát/hung của từng cung theo lá số
- Tất cả nội dung PHẢI dùng tiếng Việt có dấu chuẩn xác 100%

QUY TRÌNH PHÂN TÍCH (thực hiện tuần tự):
1. Xác định Cục Mệnh, Bản Mệnh, Chủ Mệnh, Chủ Thân từ tài liệu
2. Liệt kê đầy đủ các sao trong từng cung (chính tinh + phụ tinh + hóa tinh)
3. Phân tích từng cung theo thứ tự: Mệnh → Quan Lộc → Tài Bạch → Phu Thê → Phụ Mẫu → Huynh Đệ → Tử Tức → Tật Ách → Điền Trạch → Nô Bộc → Phúc Đức → Thiên Di
4. Đánh giá tổng thể và lời khuyên

YÊU CẦU NỘI DUNG TỪNG CUNG (mỗi cung tối thiểu 200 từ):
- Liệt kê các sao trong cung và trạng thái (miếu/vượng/đắc/hãm/bình)
- Phân tích ý nghĩa tổ hợp sao
- Luận giải về lĩnh vực tương ứng (sự nghiệp/tài lộc/tình duyên/v.v.)
- Điểm mạnh và điểm cần lưu ý
- Lời khuyên cụ thể

TOÀN BỘ NỘI DUNG LÁ SỐ TỬ VI:
${input.context}

Thông tin hồ sơ:
- Họ tên: ${input.displayName || ''}
- Ngày sinh: ${input.birthDate || ''}
- Giờ sinh: ${input.birthTime || ''}
- Giới tính: ${input.gender || ''}`
    : `Bạn là học giả Tử Vi Đẩu Số. Dựa trên ngữ cảnh lá số bên dưới, hãy trả lời câu hỏi cụ thể và cập nhật các phần liên quan trong kết quả phân tích.

Ngữ cảnh lá số:
${input.context}

Thông tin hồ sơ:
- Họ tên: ${input.displayName || ''}
- Ngày sinh: ${input.birthDate || ''}
- Giờ sinh: ${input.birthTime || ''}
- Giới tính: ${input.gender || ''}

Câu hỏi: ${input.question}

Hãy trả lời chi tiết câu hỏi trong các trường detailedReading phù hợp. Tất cả nội dung dùng tiếng Việt có dấu chuẩn.`;

  console.log(`🔮 Generating fortune (${isFullAnalysis ? 'FULL ANALYSIS' : 'Q&A'}) — context: ${contextLength} chars`);

  const client = getAiClient();
  try {
    const result = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            profile: {
              type: 'object',
              properties: {
                displayName: { type: 'string' },
                birthDate: { type: 'string' },
                birthTime: { type: 'string' },
                gender: { type: 'string' },
              }
            },
            headline: { type: 'string' },
            overview: { type: 'string' },
            score: { type: 'integer' },
            sections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  score: { type: 'integer' },
                  subtitle: { type: 'string' },
                  summary: { type: 'string' },
                  details: { type: 'array', items: { type: 'string' } },
                  warnings: { type: 'array', items: { type: 'string' } },
                  action: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } }
                },
                required: ['title', 'summary']
              }
            },
            elements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  value: { type: 'integer' },
                  note: { type: 'string' }
                },
                required: ['name', 'value']
              }
            },
            timeline: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  label: { type: 'string' },
                  status: { type: 'string' },
                  score: { type: 'integer' }
                },
                required: ['label', 'status']
              }
            },
            chapters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  index: { type: 'integer' },
                  title: { type: 'string' },
                  score: { type: 'integer' },
                  focus: { type: 'string' },
                  strengths: { type: 'array', items: { type: 'string' } },
                  cautions: { type: 'array', items: { type: 'string' } },
                  action: { type: 'string' }
                },
                required: ['title']
              }
            },
            palaces: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  stars: { type: 'array', items: { type: 'string' } },
                  location: { type: 'string' },
                  interpretation: { type: 'string' }
                },
                required: ['name', 'interpretation']
              }
            },
            detailedReading: {
              type: 'object',
              properties: {
                introGeneral: { type: 'string' },
                introGuide: { type: 'string' },
                generalBanMenh: { type: 'string' },
                generalCucMenh: { type: 'string' },
                indicators: {
                  type: 'object',
                  properties: {
                    chuMenh: { type: 'string' },
                    chuThan: { type: 'string' },
                    laiNhan: { type: 'string' },
                    canLuong: { type: 'string' },
                    thanCu: { type: 'string' }
                  }
                },
                palaceMenh: { type: 'string' },
                palaceQuanLoc: { type: 'string' },
                palaceTaiBach: { type: 'string' },
                palacePhuThe: { type: 'string' },
                palacePhuMau: { type: 'string' },
                palaceHuynhDe: { type: 'string' },
                palaceTuTuc: { type: 'string' },
                palaceTatAch: { type: 'string' },
                palaceDienTrach: { type: 'string' },
                palaceNoBoc: { type: 'string' },
                palacePhucDuc: { type: 'string' },
                palaceThienDi: { type: 'string' },
                yearly2026: { type: 'string' },
                conclusion: { type: 'string' }
              },
              required: [
                'introGeneral', 'introGuide', 'generalBanMenh', 'generalCucMenh',
                'palaceMenh', 'palaceQuanLoc', 'palaceTaiBach', 'palacePhuThe', 'yearly2026', 'conclusion'
              ]
            },
            highlights: {
              type: 'array',
              items: { type: 'string' }
            }
          },
          required: ['profile', 'headline', 'overview', 'score', 'sections', 'elements', 'timeline', 'palaces', 'detailedReading']
        }
      }
    });

    const responseText = result.text || '';
    return JSON.parse(responseText.trim()) as FortuneResult;
  } catch (error) {
    console.warn('⚠️  Structured generateContent failed, falling back to manual parsing:', error);
    // Standard manual fallback in case of errors
    const result = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt + '\n\nReturn standard JSON format matching the schema.',
    });
    const responseText = result.text || '';
    const parsed = extractJson(responseText);
    if (!parsed) throw error;
    return parsed as any;
  }
};

export const buildFallbackResult = (
  input: FortuneGenerateInput,
  context: string
): FortuneResult => {
  const summary = context.slice(0, 1200).trim();
  return {
    profile: {
      displayName: input.displayName,
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      gender: input.gender,
    },
    headline: 'Trích xuất từ PDF',
    overview: summary || 'Dữ liệu PDF chưa được AI xử lý.',
    sections: [
      {
        title: 'Nội dung PDF',
        summary: summary || 'Không có nội dung để hiển thị.',
        details: summary ? [summary] : [],
      },
    ],
    palaces: [
      { name: 'Mệnh', interpretation: 'Cần phân tích AI để luận giải Cung Mệnh chi tiết.' },
      { name: 'Phu Thê', interpretation: 'Cần phân tích AI để luận giải Cung Phu Thê chi tiết.' },
      { name: 'Quan Lộc', interpretation: 'Cần phân tích AI để luận giải Cung Quan Lộc chi tiết.' },
      { name: 'Tài Bạch', interpretation: 'Cần phân tích AI để luận giải Cung Tài Bạch chi tiết.' }
    ],
    detailedReading: {
      introGeneral: 'Tử vi là khoa học cổ phương Đông giúp dự đoán vận mệnh con người.',
      introGuide: 'Hãy click vào các chương bên tay trái để xem chi tiết.',
      generalBanMenh: 'Mệnh cách tốt đẹp, có nhiều sao cát tinh phù hộ.',
      generalCucMenh: 'Thủy Nhị Cục, vạn sự hanh thông.',
      indicators: {
        chuMenh: 'Tham Lang',
        chuThan: 'Thiên Cơ',
        laiNhan: 'Mệnh',
        canLuong: '3 lượng 8 chỉ',
        thanCu: 'Thân cư Phu thê'
      },
      palaceMenh: 'Mệnh cách ôn hòa, thông minh lanh lợi.',
      palacePhuThe: 'Hôn nhân hạnh phúc, đồng lòng kiến tạo tương lai.',
      palaceQuanLoc: 'Công danh thuận lợi, có quý nhân phù trợ.',
      palaceTaiBach: 'Tiền tài dồi dào, biết cách quản lý tích lũy.',
      yearly2026: 'Năm 2026 có nhiều chuyển biến tích cực về tài lộc và gia đạo.',
      conclusion: 'Chúc bạn một năm mới an khang thịnh vượng!'
    }
  };
};
