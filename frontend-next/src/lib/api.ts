const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function supabaseGet(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getArticles() {
  return supabaseGet("articles?select=id,title,summary,created_at&order=created_at.desc");
}

export async function getArticle(id: string) {
  const data = await supabaseGet(`articles?select=*&id=eq.${id}`);
  return data[0] || null;
}

export async function getComments(articleId: string) {
  return supabaseGet(`comments?select=*&article_id=eq.${articleId}&order=created_at.asc`);
}
