"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    isAdmin().then((admin) => {
      setAuthorized(admin);
      setChecking(false);
      if (!admin) window.location.href = "/";
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("articles").insert({
      title,
      summary: summary || null,
      content,
      author_id: user?.id,
    });

    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      window.location.href = "/articles";
    }
    setLoading(false);
  };

  if (checking) return <p className="text-gray-400">Đang kiểm tra quyền...</p>;
  if (!authorized) return null;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-8">Tạo bài viết mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder-gray-500 text-lg"
          required
        />
        <input
          type="text"
          placeholder="Tóm tắt (tuỳ chọn)"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder-gray-500"
        />
        <textarea
          placeholder="Nội dung bài viết..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder-gray-500 min-h-[300px]"
          required
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Đăng bài"}
          </button>
          <a href="/articles" className="px-6 py-2 text-gray-400 hover:text-gray-300">
            Huỷ
          </a>
        </div>
      </form>
    </div>
  );
}
