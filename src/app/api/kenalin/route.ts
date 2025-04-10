import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const prompt: string = process.env.PROMPT_RESPON_PERKENALAN?.replace('{{ pesan }}', message) || "haloo";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const generationConfig = {
      temperature: 1.5,
      maxOutputTokens: 1000, // harus "maxOutputTokens" bukan "maxTokens"
      topP: 0.9,
    };

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig,
    });

    const response = result.response;

    if (!response) {
      return NextResponse.json({ error: "No response from the model" }, { status: 500 });
    }

    const text = response.text();

    return NextResponse.json({ reply: text });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message || error.toString() },
      { status: 500 }
    );
  }
}
