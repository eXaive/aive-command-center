import { supabase } from "@/lib/supabaseClient";

/**
 * Get a public URL from the Supabase Storage bucket.
 * @param path Relative path inside the bucket (e.g., "gold/article123.jpg")
 */
export async function getPublicUrl(path: string): Promise<string | null> {
  const { data } = supabase.storage.from("news-thumbnails").getPublicUrl(path);
  return data?.publicUrl ?? null;
}

/**
 * Upload a news image to Supabase if not already present.
 * Returns its public URL.
 */
export async function uploadNewsImage(file: File, filename: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("news-thumbnails")
    .upload(filename, file, { upsert: false });

  if (error) {
    console.warn("⚠️ uploadNewsImage error:", error.message);
    return null;
  }

  const { data: urlData } = supabase.storage.from("news-thumbnails").getPublicUrl(filename);
  return urlData?.publicUrl ?? null;
}
