"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState(false);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);

        if (data.user) {
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          const res = await fetch(`${url}/rest/v1/profiles?select=role&id=eq.${data.user.id}`, {
            headers: { apikey: key || "", Authorization: `Bearer ${key}` },
          });
          const profiles = await res.json();
          if (profiles?.[0]?.role === "admin") setAdmin(true);
        }
      } catch {}
      setReady(true);
    };
    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!ready) return null;

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gradient hover:opacity-80 transition">
          AI Blog
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/articles" className="text-gray-300 hover:text-white transition text-sm font-medium">
            Articles
          </Link>
          <Link href="/tools" className="text-gray-300 hover:text-white transition text-sm font-medium">
            AI Tools
          </Link>
          {admin && (
            <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 transition text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <span className="text-sm text-gray-400 max-w-[150px] truncate">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-300 transition cursor-pointer hover:bg-red-500/10 px-2 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-white text-sm px-4 py-2 rounded-lg">
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-300 p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-3">
          <Link href="/articles" className="block text-gray-300 hover:text-white">Articles</Link>
          <Link href="/tools" className="block text-gray-300 hover:text-white">AI Tools</Link>
          {admin && <Link href="/admin" className="block text-yellow-400">Admin</Link>}
          {user ? (
            <>
              <p className="text-sm text-gray-400">{user.email}</p>
              <button onClick={handleLogout} className="text-red-400 text-sm">Logout</button>
            </>
          ) : (
            <Link href="/login" className="block text-indigo-400">Đăng nhập</Link>
          )}
        </div>
      )}
    </nav>
  );
}
