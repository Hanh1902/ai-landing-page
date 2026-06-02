"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState({ articles: 0, comments: 0, subscribers: 0 });

  useEffect(() => {
    const init = async () => {
      const admin = await isAdmin();
      setAuthorized(admin);
      if (!admin) {
        window.location.href = "/";
        return;
      }

      const [articles, comments, subscribers] = await Promise.all([
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("comments").select("id", { count: "exact", head: true }),
        supabase.from("subscribers").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        articles: articles.count || 0,
        comments: comments.count || 0,
        subscribers: subscribers.count || 0,
      });
      setChecking(false);
    };
    init();
  }, []);

  if (checking) return <p className="text-gray-400">Đang kiểm tra quyền...</p>;
  if (!authorized) return null;

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-3xl font-bold text-indigo-400">{stats.articles}</p>
          <p className="text-gray-400">Bài viết</p>
        </div>
        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-3xl font-bold text-green-400">{stats.comments}</p>
          <p className="text-gray-400">Bình luận</p>
        </div>
        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-3xl font-bold text-purple-400">{stats.subscribers}</p>
          <p className="text-gray-400">Subscribers</p>
        </div>
      </div>

      <div className="space-y-3">
        <Link href="/admin/articles/new" className="block p-4 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-indigo-500/50 transition">
          ✍️ Tạo bài viết mới
        </Link>
        <Link href="/articles" className="block p-4 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-indigo-500/50 transition">
          📝 Quản lý bài viết
        </Link>
      </div>
    </div>
  );
}
