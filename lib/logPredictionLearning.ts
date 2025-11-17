import { supabase } from "@/lib/supabaseClient";

export async function logPredictionLearning({
  prediction,
  cas,
  selectedAnswer,
  isCorrect,
  autoVerified,
  clarity,
  sentiment,
  focusCategory
}) {
  return await supabase.from("prediction_learning_log").insert([
    {
      prediction_id: prediction.id,
      headline: prediction.headline,
      prediction_text: prediction.prediction,
      prediction_confidence: prediction.confidence,

      cas_id: cas?.id || null,
      cas_cause: cas?.cause || null,
      cas_effect: cas?.effect || null,
      cas_confidence: cas?.confidence || null,

      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      auto_verified: autoVerified,

      sentiment: sentiment,
      clarity_level: clarity,
      awareness_state: focusCategory || prediction.category,

      country: prediction.country,
      category: prediction.category,
    },
  ]);
}
