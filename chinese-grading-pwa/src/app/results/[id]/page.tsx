import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft, Share, RefreshCcw, Check, X, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";


export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  
  const resolvedParams = await params;
  const submissionId = resolvedParams.id;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: submission } = await supabase
    .from("submissions")
    .select("*, lessons(title)")
    .eq("id", submissionId)
    .single();

  const { data: results } = await supabase
    .from("character_results")
    .select("*")
    .eq("submission_id", submissionId);

  if (!submission || !results) {
    return (
      <div className="min-h-screen flex flex-col gap-3 items-center justify-center bg-[#FAF9F6] text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#1C4A3A]" />
        <p className="font-medium">Fetching test results...</p>
      </div>
    );
  }

  const percentage = Math.round((submission.total_score / submission.max_score) * 100);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-sm pb-24 relative">
        
        
        <header className="p-5 flex items-center gap-4 bg-[#FAF9F6] border-b border-gray-100">
          <Link href="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Test Results</h1>
            <p className="text-xs text-gray-500">{submission.lessons?.title || "Syllabus Test"}</p>
          </div>
        </header>

        <div className="p-5">
          <div className="bg-[#1C4A3A] rounded-3xl p-6 text-white flex justify-between items-center shadow-md">
            <div>
              <p className="text-[#A2C7B8] text-sm font-medium mb-1">Score: {submission.total_score}/{submission.max_score}</p>
              <h2 className="text-4xl font-bold">{percentage}%</h2>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm">
              <span className="text-sm font-medium">{percentage >= 80 ? "Excellent!" : "Keep Trying!"}</span>
            </div>
          </div>
        </div>

        <div className="px-5 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">Graded Worksheet</h3>
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
            <img 
              src={submission.image_url} 
              alt="Worksheet" 
              className="w-full h-auto max-h-[400px] object-cover opacity-60"
            />
            
            <div className="absolute inset-0 p-4 flex flex-wrap gap-4 content-start overflow-y-auto">
              {results.map((item: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center bg-white/80 p-2 rounded-lg shadow-sm border border-gray-100">
                  {item.is_correct ? (
                    <>
                      <Check className="w-5 h-5 text-green-500 mb-1" strokeWidth={3} />
                      <span className="text-gray-800 font-bold">{item.character}</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-500 mb-1" strokeWidth={3} />
                      <div className="relative">
                        <span className="text-gray-400 line-through text-sm absolute -top-4 left-0">{item.character}</span>
                        <span className="text-red-600 font-bold text-xl drop-shadow-sm font-serif">{item.correct_character || item.character}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 flex gap-4">
          <button className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
            <Share className="w-5 h-5" /> Share Report
          </button>
          <button className="flex-1 bg-[#1C4A3A] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
            <RefreshCcw className="w-5 h-5" /> Retest Missed
          </button>
        </div>

      </div>
    </div>
  );
}