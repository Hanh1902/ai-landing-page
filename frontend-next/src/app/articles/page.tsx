"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getArticles } from "@/lib/api";
import AINewsFeed from "@/components/AINewsFeed";

interface Article {
  id: string;
  title: string;
  summary: string | null;
  created_at: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"articles" | "news">("articles");

  useEffect(() => {
    getArticles()
      .then((data) => {
        setArticles(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Check admin separately
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          const res = await fetch(`${url}/rest/v1/profiles?select=role&id=eq.${user.id}`, {
            headers: { apikey: key || "", Authorization: `Bearer ${key}` },
          });
          const profiles = await res.json();
          if (profiles?.[0]?.role === "admin") setAdmin(true);
        }
      } catch {}
    };
    checkAdmin();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá bài viết này?")) return;
    const { data: { session } } = await supabase.auth.getSession();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await fetch(`${url}/rest/v1/articles?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: key || "",
        Authorization: `Bearer ${session?.access_token || key}`,
      },
    });
    setArticles(articles.filter((a) => a.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <p className="text-red-400">Lỗi: {error}</p>;

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">Bài viết</h1>
        {admin && tab === "articles" && (
          <Link
            href="/admin/articles/new"
            className="btn-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo bài viết
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-900/50 rounded-xl mb-8 max-w-md">
        <button
          onClick={() => setTab("articles")}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === "articles"
              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              : "text-gray-400 hover:text-white"
          }`}
        >
          📝 Bài viết ({articles.length})
        </button>
        <button
          onClick={() => setTab("news")}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === "news"
              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🌐 Tin AI mới nhất
        </button>
      </div>

      {tab === "news" && <AINewsFeed />}

      {tab === "articles" && articles.length === 0 && (
        <div className="text-center py-16 glass-card rounded-2xl">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-400">Chưa có bài viết nào.</p>
        </div>
      )}

      {tab === "articles" && (
        <div className="grid gap-5">
          {articles.map((article, i) => (
            <div
              key={article.id}
              className="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <Link href={`/articles/${article.id}`} className="block">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition">
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="text-gray-400 mt-2 line-clamp-2">{article.summary}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(article.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 transition mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
              {admin && (
                <div className="mt-4 pt-4 border-t border-gray-800 flex gap-3">
                  <Link
                    href={`/admin/articles/edit/${article.id}`}
                    className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Xoá
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
