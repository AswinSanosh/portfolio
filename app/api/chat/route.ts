import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/data/chat-prompt";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API Key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://aswinsanosh.dev", // Optional, for OpenRouter rankings
        "X-Title": "Aswin Sanosh Portfolio", // Optional
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("OpenRouter Error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Failed to fetch from OpenRouter" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
