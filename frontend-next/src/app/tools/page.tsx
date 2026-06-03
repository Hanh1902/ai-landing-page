"use client";

import { useState } from "react";
import Link from "next/link";

interface AITool {
  name: string;
  description: string;
  category: string;
  url: string;
  icon: string;
  pricing: string;
}

const AI_TOOLS: AITool[] = [
  {
    name: "ChatGPT",
    description: "Chatbot AI đa năng của OpenAI, hỗ trợ viết, code, phân tích và sáng tạo nội dung.",
    category: "Chatbot",
    url: "https://chat.openai.com",
    icon: "💬",
    pricing: "Miễn phí / $20/tháng",
  },
  {
    name: "Claude",
    description: "AI assistant của Anthropic, nổi bật với khả năng phân tích văn bản dài và suy luận an toàn.",
    category: "Chatbot",
    url: "https://claude.ai",
    icon: "🧠",
    pricing: "Miễn phí / $20/tháng",
  },
  {
    name: "Midjourney",
    description: "Tạo hình ảnh nghệ thuật từ mô tả text, chất lượng cao và sáng tạo.",
    category: "Tạo ảnh",
    url: "https://midjourney.com",
    icon: "🎨",
    pricing: "$10/tháng",
  },
  {
    name: "GitHub Copilot",
    description: "AI hỗ trợ lập trình, gợi ý code realtime trong IDE, hỗ trợ hầu hết ngôn ngữ.",
    category: "Lập trình",
    url: "https://github.com/features/copilot",
    icon: "👨‍💻",
    pricing: "$10/tháng",
  },
  {
    name: "Runway",
    description: "Nền tảng AI cho video — tạo, chỉnh sửa video bằng AI với nhiều công cụ sáng tạo.",
    category: "Video",
    url: "https://runway.ml",
    icon: "🎬",
    pricing: "Miễn phí / $12/tháng",
  },
  {
    name: "Notion AI",
    description: "AI tích hợp trong Notion, giúp viết, tóm tắt, brainstorm và quản lý công việc.",
    category: "Năng suất",
    url: "https://notion.so/product/ai",
    icon: "📋",
    pricing: "$10/tháng",
  },
  {
    name: "ElevenLabs",
    description: "Chuyển text thành giọng nói tự nhiên, clone giọng nói, hỗ trợ đa ngôn ngữ.",
    category: "Âm thanh",
    url: "https://elevenlabs.io",
    icon: "🎙️",
    pricing: "Miễn phí / $5/tháng",
  },
  {
    name: "Perplexity",
    description: "Công cụ tìm kiếm AI, trả lời câu hỏi với nguồn tham khảo rõ ràng và cập nhật.",
    category: "Tìm kiếm",
    url: "https://perplexity.ai",
    icon: "🔍",
    pricing: "Miễn phí / $20/tháng",
  },
  {
    name: "Cursor",
    description: "IDE tích hợp AI, hỗ trợ viết code, debug và refactor thông minh.",
    category: "Lập trình",
    url: "https://cursor.sh",
    icon: "⚡",
    pricing: "Miễn phí / $20/tháng",
  },
  {
    name: "Suno",
    description: "Tạo nhạc bằng AI từ mô tả text, hỗ trợ nhiều thể loại và phong cách.",
    category: "Âm nhạc",
    url: "https://suno.ai",
    icon: "🎵",
    pricing: "Miễn phí / $8/tháng",
  },
  {
    name: "Gamma",
    description: "Tạo slide presentation đẹp từ prompt, tự động layout và thiết kế chuyên nghiệp.",
    category: "Năng suất",
    url: "https://gamma.app",
    icon: "📊",
    pricing: "Miễn phí / $8/tháng",
  },
  {
    name: "Leonardo AI",
    description: "Tạo ảnh AI với nhiều model và style, phù hợp cho game art và thiết kế.",
    category: "Tạo ảnh",
    url: "https://leonardo.ai",
    icon: "🖼️",
    pricing: "Miễn phí / $12/tháng",
  },
];

const CATEGORIES = ["Tất cả", ...Array.from(new Set(AI_TOOLS.map((t) => t.category)))];

export default function ToolsPage() {
  const [filter, setFilter] = useState("Tất cả");
  const [search, setSearch] = useState("");

  const filtered = AI_TOOLS.filter((tool) => {
    const matchCategory = filter === "Tất cả" || tool.category === filter;
    const matchSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Tools Directory</h1>
        <p className="text-gray-400">Tổng hợp {AI_TOOLS.length} công cụ AI phổ biến nhất hiện nay</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm công cụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder-gray-500"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === cat
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "bg-gray-900/50 text-gray-400 hover:text-white border border-transparent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tool, i) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-2xl p-6 group hover:border-indigo-500/30 transition-all animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{tool.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-indigo-300 transition">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {tool.category}
                  </span>
                  <span className="text-xs text-gray-500">{tool.pricing}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 glass-card rounded-2xl">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-400">Không tìm thấy công cụ nào.</p>
        </div>
      )}
    </div>
  );
}
