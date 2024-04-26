import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(request: Request) {
  const prompt = await request.text();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  };
  const model = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: process.env.NEXT_PUBLIC_LLM_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(model),
  };
  const res = await fetch(
    "https://api.openai.com/v1/chat/completions",
    options
  );
  const data = await res.json();
  return NextResponse.json({ data });
}
