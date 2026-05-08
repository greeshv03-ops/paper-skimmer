import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

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

    const truncatedText = textContent.slice(0, 500000);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            summary: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "Exactly 3 bullet points summarizing the core findings of the paper.",
            },
            methods: {
              type: SchemaType.STRING,
              description: "A concise paragraph explaining the key methodology, setup, and datasets used.",
            },
            equations: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "A list of the key equations, mathematical models, or primary metrics evaluated.",
            },
          },
          required: ["summary", "methods", "equations"],
        },
      },
    });

    const prompt = `You are an expert academic research assistant. Read the provided research paper text and extract the required information.\n\nPaper Text:\n${truncatedText}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    const parsedData = JSON.parse(responseText);

    return NextResponse.json({ data: parsedData });
  } catch (error: any) {
    console.error("Error analyzing PDF with Gemini:", error);
    return NextResponse.json({ error: error.message || "Failed to process PDF" }, { status: 500 });
  }
}
