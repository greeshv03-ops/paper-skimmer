import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MAX_FILE_SIZE_MB = 20;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const parser = new PDFParse({ data });
    let textContent: string;
    try {
      const textResult = await parser.getText();
      textContent = textResult.text;
    } finally {
      await parser.destroy();
    }

    // Llama 3.3 70B has a 128k token context window (~500k chars is safe)
    const truncatedText = textContent.slice(0, 400000);

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert academic research assistant. Analyze the research paper and respond with a JSON object only, with exactly this structure:
{
  "summary": ["bullet point 1", "bullet point 2", "bullet point 3"],
  "methods": "one paragraph describing the methodology, experimental setup, and datasets used",
  "equations": ["equation or metric 1", "equation or metric 2"]
}

Rules:
- summary: exactly 3 concise bullet points on the core findings
- methods: one paragraph, factual and specific
- equations: key equations, mathematical models, or primary evaluation metrics (empty array [] if none)`,
        },
        {
          role: "user",
          content: `Research paper text:\n\n${truncatedText}`,
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from Groq");
    }

    const parsedData = JSON.parse(responseText);

    return NextResponse.json({ data: parsedData });
  } catch (error: any) {
    console.error("Error analyzing PDF with Groq:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process PDF" },
      { status: 500 }
    );
  }
}
