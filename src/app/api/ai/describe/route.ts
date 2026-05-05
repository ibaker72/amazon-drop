import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { productName, category, tags, existingDescription } = await req.json();

    if (!productName) {
      return NextResponse.json({ error: "Product name required" }, { status: 400 });
    }

    const prompt = `You are writing product descriptions for an e-commerce store called "NJ Drop" that sells quality wholesale products sourced from North Jersey.

Write a compelling, SEO-friendly product description for:

Product: ${productName}
${category ? `Category: ${category}` : ""}
${tags?.length ? `Tags: ${tags.join(", ")}` : ""}
${existingDescription ? `Current description to improve: ${existingDescription}` : ""}

Requirements:
- 2-3 sentences, conversational but professional tone
- Highlight quality and value
- No fluff or filler words
- Do NOT mention "NJ Drop" in the description
- Do NOT use bullet points — write in flowing prose

Return only the description text, nothing else.`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    });

    const description =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    return NextResponse.json({ description });
  } catch (err) {
    console.error("AI describe error:", err);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
