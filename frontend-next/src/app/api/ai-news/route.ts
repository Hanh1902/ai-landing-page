import { NextResponse } from "next/server";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
}

// Dùng các RSS feed ít bị block hơn
const RSS_FEEDS = [
  {
    url: "https://hnrss.org/newest?q=AI+artificial+intelligence&count=10",
    source: "Hacker News",
  },
  {
    url: "https://www.reddit.com/r/artificial/.rss?limit=10",
    source: "Reddit r/artificial",
  },
  {
    url: "https://arxiv.org/rss/cs.AI",
    source: "ArXiv AI",
  },
];

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function extractText(xml: string, tag: string): string {
  // Handle CDATA
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return stripHtml(cdataMatch[1]);

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xml.match(regex);
  if (!match) return "";
  return stripHtml(match[1]);
}

function extractItems(xml: string): Array<{ title: string; link: string; description: string; pubDate: string }> {
  const items: Array<{ title: string; link: string; description: string; pubDate: string }> = [];

  // RSS 2.0 format
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const linkMatch = itemXml.match(/<link>([^<]+)<\/link>/);
    items.push({
      title: extractText(itemXml, "title"),
      link: linkMatch ? linkMatch[1].trim() : "",
      description: extractText(itemXml, "description"),
      pubDate: extractText(itemXml, "pubDate") || extractText(itemXml, "dc:date"),
    });
  }

  // Atom format fallback
  if (items.length === 0) {
    const entryRegex = /<entry[\s>]([\s\S]*?)<\/entry>/gi;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entryXml = match[1];
      const linkMatch = entryXml.match(/<link[^>]*href="([^"]*)"[^>]*\/?>/);
      items.push({
        title: extractText(entryXml, "title"),
        link: linkMatch ? linkMatch[1] : "",
        description: extractText(entryXml, "summary") || extractText(entryXml, "content"),
        pubDate: extractText(entryXml, "published") || extractText(entryXml, "updated"),
      });
    }
  }

  return items;
}

async function fetchFeed(feedUrl: string, source: string): Promise<NewsItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AI-Blog/1.0)",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
    });

    clearTimeout(timeout);
    if (!res.ok) return [];

    const xml = await res.text();
    const items = extractItems(xml);

    return items.slice(0, 5).map((item, i) => ({
      id: `${source.toLowerCase().replace(/\s+/g, "-")}-${i}-${Date.now()}`,
      title: item.title,
      summary: item.description.slice(0, 200) + (item.description.length > 200 ? "..." : ""),
      url: item.link,
      source,
      publishedAt: item.pubDate || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

// Fallback data khi không fetch được RSS
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "fallback-1",
    title: "OpenAI ra mắt GPT-5 với khả năng suy luận vượt trội",
    summary: "Mô hình mới cho thấy cải thiện đáng kể trong suy luận toán học, lập trình và giải quyết bài toán nhiều bước.",
    url: "https://openai.com/blog",
    source: "OpenAI",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    title: "Google DeepMind phát hành mô hình AI mã nguồn mở mới",
    summary: "Dòng mô hình open-weight mới được thiết kế cho nghiên cứu và ứng dụng thương mại.",
    url: "https://deepmind.google",
    source: "DeepMind",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "fallback-3",
    title: "Meta AI giới thiệu bước đột phá trong học đa phương thức",
    summary: "Nghiên cứu mới kết hợp thị giác, ngôn ngữ và âm thanh trong một kiến trúc thống nhất duy nhất.",
    url: "https://ai.meta.com",
    source: "Meta AI",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "fallback-4",
    title: "Anthropic công bố nghiên cứu mới về an toàn AI",
    summary: "Bài báo khám phá phương pháp Constitutional AI để đảm bảo hệ thống AI luôn hữu ích và không gây hại.",
    url: "https://anthropic.com/research",
    source: "Anthropic",
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "fallback-5",
    title: "Microsoft tích hợp AI Copilot vào toàn bộ công cụ lập trình",
    summary: "Tính năng AI mới giúp tăng năng suất lập trình viên với gợi ý code thông minh và kiểm thử tự động.",
    url: "https://devblogs.microsoft.com",
    source: "Microsoft",
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

export async function GET() {
  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map((feed) => fetchFeed(feed.url, feed.source))
    );

    const allNews: NewsItem[] = results
      .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === "fulfilled")
      .flatMap((r) => r.value)
      .filter((item) => item.title && item.url)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 15);

    // Nếu không lấy được tin nào, dùng fallback
    const finalNews = allNews.length > 0 ? allNews : FALLBACK_NEWS;

    return NextResponse.json(finalNews, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json(FALLBACK_NEWS);
  }
}
