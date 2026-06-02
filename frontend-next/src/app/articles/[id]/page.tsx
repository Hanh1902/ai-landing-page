"use client";

import { useEffect, useState } from "react";
import { getArticle, getComments } from "@/lib/api";
import { useParams } from "next/navigation";

interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const data = await getComments(id);
      setComments(data || []);
    } catch {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleData = await getArticle(id);
        if (articleData) setArticle(articleData);
        await fetchComments();
      } catch {}
      setLoading(false);
    };
    fetchData();

    // Check admin separately, don't block render
    const checkAdmin = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
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
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentContent.trim()) return;
    setSubmitting(true);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await fetch(`${url}/rest/v1/comments`, {
      method: "POST",
      headers: {
        apikey: key || "",
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        article_id: id,
        author_name: authorName.trim(),
        content: commentContent.trim(),
      }),
    });

    setCommentContent("");
    await fetchComments();
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Xoá bình luận này?")) return;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { supabase } = await import("@/lib/supabase");
    const { data: { session } } = await supabase.auth.getSession();

    await fetch(`${url}/rest/v1/comments?id=eq.${commentId}`, {
      method: "DELETE",
      headers: {
        apikey: key || "",
        Authorization: `Bearer ${session?.access_token || key}`,
      },
    });
    setComments(comments.filter((c) => c.id !== commentId));
  };

  if (loading) return <p className="text-gray-400">Đang tải...</p>;
  if (!article) return <p className="text-gray-400">Không tìm thấy bài viết.</p>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <a href="/articles" className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 inline-block">← Quay lại</a>
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {new Date(article.created_at).toLocaleDateString("vi-VN")}
      </p>
      <div className="prose prose-invert max-w-none mb-12 whitespace-pre-wrap text-gray-300 leading-relaxed">
        {article.content}
      </div>

      <section className="border-t border-gray-800 pt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Bình luận ({comments.length})
        </h2>

        <form onSubmit={handleSubmitComment} className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Tên của bạn"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder-gray-500"
            required
          />
          <textarea
            placeholder="Viết bình luận..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder-gray-500 min-h-[80px]"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {submitting ? "Đang gửi..." : "Gửi bình luận"}
          </button>
        </form>

        {comments.length === 0 && (
          <p className="text-gray-500">Chưa có bình luận nào.</p>
        )}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex justify-between items-start">
                <p className="font-medium text-indigo-300">{comment.author_name}</p>
                {admin && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Xoá
                  </button>
                )}
              </div>
              <p className="text-gray-300 mt-1">{comment.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(comment.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
