"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [result, setResult] = useState<string>("Loading...");

  useEffect(() => {
    const test = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // Test with raw fetch
        const res = await fetch(
          `${url}/rest/v1/articles?select=id,title&limit=5`,
          {
            headers: {
              apikey: key || "",
              Authorization: `Bearer ${key}`,
            },
          }
        );

        const data = await res.json();
        setResult(
          `Status: ${res.status}\nURL: ${url}\nKey: ${key?.substring(0, 20)}...\n\nResponse:\n${JSON.stringify(data, null, 2)}`
        );
      } catch (err: any) {
        setResult(`Error: ${err.message}`);
      }
    };
    test();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Supabase Raw Test</h1>
      <pre className="bg-gray-800 p-4 rounded text-sm whitespace-pre-wrap text-green-300">{result}</pre>
    </div>
  );
}
