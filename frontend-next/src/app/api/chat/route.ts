import { NextResponse } from "next/server";

// AI knowledge base - trả lời các câu hỏi phổ biến về AI
const AI_KNOWLEDGE: Record<string, string> = {
  "chatgpt": "ChatGPT là chatbot AI của OpenAI, sử dụng mô hình GPT. Nó có thể viết văn, code, phân tích dữ liệu, và nhiều hơn nữa. Phiên bản miễn phí dùng GPT-4o mini, bản Plus ($20/tháng) dùng GPT-4o.",
  "gpt": "GPT (Generative Pre-trained Transformer) là dòng mô hình ngôn ngữ lớn của OpenAI. GPT-4 là phiên bản mạnh nhất hiện tại với khả năng suy luận và hiểu ngữ cảnh vượt trội.",
  "claude": "Claude là AI assistant của Anthropic, nổi bật với khả năng xử lý văn bản dài (lên đến 200K tokens), suy luận an toàn và trung thực. Có Claude 3.5 Sonnet, Haiku và Opus.",
  "midjourney": "Midjourney là AI tạo hình ảnh từ text prompt. Chạy qua Discord, nổi tiếng với chất lượng nghệ thuật cao. Giá từ $10/tháng.",
  "stable diffusion": "Stable Diffusion là mô hình AI tạo ảnh mã nguồn mở. Bạn có thể chạy miễn phí trên máy tính cá nhân hoặc dùng các dịch vụ online.",
  "machine learning": "Machine Learning (học máy) là nhánh của AI, cho phép máy tính học từ dữ liệu mà không cần lập trình cụ thể. Gồm 3 loại chính: supervised, unsupervised và reinforcement learning.",
  "deep learning": "Deep Learning là nhánh con của Machine Learning, sử dụng mạng neural nhiều lớp. Nó là nền tảng của hầu hết AI hiện đại: nhận dạng hình ảnh, xử lý ngôn ngữ, tạo sinh nội dung.",
  "neural network": "Mạng neural nhân tạo mô phỏng cách não bộ hoạt động, gồm các neuron kết nối với nhau. Transformer là kiến trúc neural network đằng sau GPT, BERT và hầu hết AI ngôn ngữ hiện nay.",
  "prompt": "Prompt engineering là nghệ thuật viết câu lệnh cho AI. Tips: hãy cụ thể, cho ví dụ, chia task nhỏ, và yêu cầu AI suy nghĩ từng bước (chain-of-thought).",
  "ai safety": "An toàn AI là lĩnh vực nghiên cứu cách đảm bảo AI hoạt động đúng mục đích, không gây hại. Bao gồm alignment, robustness, và interpretability.",
  "llm": "LLM (Large Language Model) là mô hình ngôn ngữ lớn được huấn luyện trên lượng text khổng lồ. Ví dụ: GPT-4, Claude, Gemini, LLaMA. Chúng hiểu và tạo văn bản giống con người.",
  "gemini": "Gemini là AI của Google DeepMind, hỗ trợ đa phương thức (text, hình ảnh, video, code). Tích hợp vào Google Search, Workspace và Android.",
  "copilot": "GitHub Copilot là AI hỗ trợ lập trình, gợi ý code realtime. Dựa trên mô hình của OpenAI, hỗ trợ hầu hết ngôn ngữ. Giá $10/tháng, miễn phí cho sinh viên.",
  "sora": "Sora là mô hình AI tạo video của OpenAI. Có thể tạo video chất lượng cao lên đến 1 phút từ mô tả text.",
  "agi": "AGI (Artificial General Intelligence) là AI có trí tuệ tổng quát như con người — có thể học và giải quyết mọi vấn đề. Chưa đạt được nhưng nhiều công ty đang hướng tới.",
  "học ai": "Để học AI, bạn nên bắt đầu với: 1) Python cơ bản, 2) Toán (đại số tuyến tính, xác suất), 3) Machine Learning cơ bản (khóa Andrew Ng trên Coursera), 4) Deep Learning, 5) Thực hành project.",
  "việc làm": "Ngành AI đang rất hot với nhiều vị trí: ML Engineer, Data Scientist, AI Researcher, Prompt Engineer, AI Product Manager. Lương khởi điểm từ $1000-3000/tháng tại VN.",
};

function findAnswer(message: string): string {
  const lower = message.toLowerCase();

  // Check exact matches first
  for (const [key, value] of Object.entries(AI_KNOWLEDGE)) {
    if (lower.includes(key)) return value;
  }

  // Greeting
  if (lower.match(/xin chào|hello|hi |hey|chào/)) {
    return "Chào bạn! 👋 Mình có thể giúp bạn tìm hiểu về AI, các công cụ AI, machine learning, hoặc bất cứ gì liên quan. Hỏi mình đi!";
  }

  // Thanks
  if (lower.match(/cảm ơn|thanks|thank/)) {
    return "Không có gì! 😊 Nếu có câu hỏi gì khác về AI, cứ hỏi mình nhé!";
  }

  // What can you do
  if (lower.match(/làm được gì|giúp gì|bạn là ai|mày là ai/)) {
    return "Mình là AI assistant của blog này! Mình có thể trả lời câu hỏi về: ChatGPT, Claude, Midjourney, Machine Learning, Deep Learning, prompt engineering, việc làm AI, và nhiều hơn nữa. Thử hỏi mình xem!";
  }

  // Fallback
  const suggestions = ["ChatGPT", "Machine Learning", "Prompt Engineering", "việc làm AI", "cách học AI"];
  const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
  return `Hmm, mình chưa có thông tin về vấn đề này. Thử hỏi mình về ${randomSuggestion} hoặc các công cụ AI phổ biến nhé! 🤔`;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "Vui lòng nhập câu hỏi." });
    }

    // Simulate slight delay for natural feel
    await new Promise((resolve) => setTimeout(resolve, 500));

    const reply = findAnswer(message);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Có lỗi xảy ra, thử lại sau nhé!" });
  }
}
