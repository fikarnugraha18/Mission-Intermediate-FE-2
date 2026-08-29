import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-worksheet.jpg`;

    const { error: storageError } = await supabase.storage
      .from("worksheets")
      .upload(fileName, fileBuffer, { contentType: file.type });

    if (storageError) throw new Error("Failed to process image: " + storageError.message);

    const { data: { publicUrl } } = supabase.storage
      .from("worksheets")
      .getPublicUrl(fileName);

    
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const prompt = `Compare the handwriting in this Tian Zige grid against the expected spelling list ["校园", "操场", "老师", "礼堂", "同学", "教室", "图书馆", "食堂", "花园", "运动场"]. 
    Return strictly a JSON object with a "results" array. Each item must have "character" (string) and "is_correct" (boolean). Do not use markdown blocks like \`\`\`json.`;

    const imagePart = {
      inlineData: {
        data: Buffer.from(fileBuffer).toString("base64"),
        mimeType: file.type,
      },
    };

    const aiResult = await model.generateContent([prompt, imagePart]);
    const responseText = aiResult.response.text();
    
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(cleanedText);

    const { data: lesson } = await supabase.from("lessons").select("id").limit(1).single();
    const totalCorrect = parsedData.results.filter((r: any) => r.is_correct).length;
    const maxScore = parsedData.results.length || 10;

    const { data: submission, error: subError } = await supabase
      .from("submissions")
      .insert({
        lesson_id: lesson?.id,
        image_url: publicUrl,
        total_score: totalCorrect,
        max_score: maxScore,
      })
      .select()
      .single();

    if (subError) throw new Error("Failed to save submission: " + subError.message);

    const charResults = parsedData.results.map((r: any) => ({
      submission_id: submission.id,
      character: r.character,
      is_correct: r.is_correct,
      correct_character: r.is_correct ? null : r.character,
    }));

    await supabase.from("character_results").insert(charResults);

    
    return NextResponse.json({ success: true, submissionId: submission.id });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}