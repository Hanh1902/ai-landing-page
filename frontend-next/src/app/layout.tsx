import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AI Landing Page",
  description: "Blog & Landing page powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen bg-[#0a0a1a] text-gray-100 overflow-x-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] animate-blob delay-200"></div>
          <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] animate-blob delay-400"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>

          {/* Floating particles */}
          <div className="particle top-[20%] left-[10%] animate-float"></div>
          <div className="particle top-[60%] left-[80%] animate-float delay-200"></div>
          <div className="particle top-[80%] left-[20%] animate-float delay-300"></div>
          <div className="particle top-[30%] left-[70%] animate-float delay-400"></div>
          <div className="particle top-[50%] left-[40%] animate-float delay-500"></div>
        </div>

        <div className="relative z-10">
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
