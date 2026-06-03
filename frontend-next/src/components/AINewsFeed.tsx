"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
}

export default function AINewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai-news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
            <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-700/30 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-700/30 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-8 glass-card rounded-2xl">
        <p className="text-gray-400">Không thể tải tin tức AI lúc này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {news.map((item, i) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block glass-card rounded-xl p-5 group hover:border-indigo-500/30 transition-all animate-fade-in-up"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white group-hover:text-indigo-300 transition line-clamp-2">
                {item.title}
              </h3>
              {item.summary && (
                <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">
                  {item.summary}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2.5">
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {item.source}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.publishedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition flex-shrink-0 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </a>
      ))}
    </div>
  );
}
