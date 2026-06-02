"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const res = await fetch(`${url}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        apikey: key || "",
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message?.includes("duplicate") ? "Email đã đăng ký!" : "Có lỗi xảy ra");
    } else {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 relative">
        {/* Decorative ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-indigo-500/10 rounded-full animate-spin-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-purple-500/5 rounded-full animate-spin-slow" style={{animationDirection: 'reverse', animationDuration: '40s'}}></div>

        <div className="relative animate-fade-in-up">
          <div className="inline-block mb-8 animate-float">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-2xl shadow-indigo-500/30 rotate-12 hover:rotate-0 transition-transform duration-500">
              🤖
            </div>
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full glass text-xs text-indigo-300 mb-6">
            ✨ Powered by AI & Modern Tech
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Khám phá</span>
            <br />
            <span className="text-white">Thế giới AI</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Nơi chia sẻ kiến thức về trí tuệ nhân tạo, công nghệ hiện đại và những xu hướng đang định hình tương lai.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/articles"
              className="btn-primary text-white px-8 py-4 rounded-xl font-medium text-lg inline-flex items-center gap-2"
            >
              Đọc bài viết
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#subscribe"
              className="px-8 py-4 rounded-xl font-medium text-lg border border-gray-700 text-gray-300 hover:border-indigo-500/50 hover:text-white transition-all"
            >
              Đăng ký nhận tin
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="animate-fade-in-up delay-200">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Tại sao chọn chúng tôi?</h2>
          <p className="text-gray-400">Nội dung chất lượng, cập nhật liên tục</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "⚡", title: "Cập nhật nhanh", desc: "Tin tức AI mới nhất, phân tích xu hướng công nghệ mỗi tuần", color: "from-yellow-500/20 to-orange-500/20" },
            { icon: "🧠", title: "Chuyên sâu", desc: "Bài viết phân tích chi tiết từ những người trong ngành", color: "from-blue-500/20 to-cyan-500/20" },
            { icon: "🚀", title: "Thực hành", desc: "Hướng dẫn hands-on, code examples và project thực tế", color: "from-green-500/20 to-emerald-500/20" },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-8 group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="animate-fade-in-up delay-300">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50+", label: "Bài viết" },
              { value: "1K+", label: "Độc giả" },
              { value: "200+", label: "Bình luận" },
              { value: "24/7", label: "Cập nhật" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</p>
                <p className="text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section id="subscribe" className="animate-fade-in-up delay-400">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-2xl"></div>

          <div className="relative">
            <div className="text-4xl mb-4">📬</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Đừng bỏ lỡ bài viết mới
            </h2>
            <p className="text-gray-400 mb-8">
              Đăng ký để nhận thông báo khi có bài viết mới. Không spam, hứa luôn.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Đăng ký thành công!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3 bg-gray-900/80 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  className="btn-primary text-white px-6 py-3 rounded-xl font-medium whitespace-nowrap"
                >
                  Đăng ký →
                </button>
              </form>
            )}
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm border-t border-gray-800/50 pt-8">
        <p>© 2026 AI Blog. Built with Next.js + Supabase + Vercel</p>
      </footer>
    </div>
  );
}
