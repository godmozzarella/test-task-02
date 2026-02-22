import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { name } = await req.json();
  console.log("POST /api/generate-description вызван с name:", name);
  const prompt = `
  Придумай короткое и длинное описание для продукта с названием "${name}".
  Верни JSON в формате: { "shortDescription": "...", "longDescription": "..." }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0].message?.content || '';

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Не удалось распарсить JSON от модели:", text);
      data = {
        shortDescription: "Описание недоступно",
        longDescription: "Длинное описание недоступно"
      };
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Ошибка генерации описаний:", error);
    const fallbackData = {
      shortDescription: "Описание недоступно",
      longDescription: "Длинное описание недоступно"
    };
    return NextResponse.json(fallbackData);
  }
}