import { supabase } from "@/lib/supabaseClient";

/**
 * Normalize filenames to avoid Supabase edge-case errors.
 * Removes spaces, uppercases, strange chars, etc.
 */
function cleanFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.\-_]/g, "")
    .trim();
}

/**
 * Generate a Supabase Storage public URL.
 */
export async function getPublicUrl(path: string): Promise<string | null> {
  if (!path) return null;

  const cleaned = cleanFilename(path);
  const { data } = supabase.storage.from("news-thumbnails").getPublicUrl(cleaned);

  return data?.publicUrl ?? null;
}

/**
 * Upload a news image into Supabase Storage.
 *
 * @param file      The file blob itself
 * @param filename  Desired filename (auto-cleaned)
 * @returns         Public URL OR null on failure
 */
export async function uploadNewsImage(
  file: File,
  filename: string,
  opts?: { overwrite?: boolean }
): Promise<string | null> {
  if (!file) {
    console.warn("⚠️ uploadNewsImage: Missing file");
    return null;
  }

  const overwrite = opts?.overwrite ?? false;
  const cleaned = cleanFilename(filename);

  // 🚀 Upload image
  const { data, error } = await supabase.storage
    .from("news-thumbnails")
    .upload(cleaned, file, { upsert: overwrite });

  if (error) {
    console.warn("⚠️ uploadNewsImage upload error:", error.message);
    return null;
  }

  // 🔗 Return public URL
  const { data: urlData } = supabase.storage
    .from("news-thumbnails")
    .getPublicUrl(cleaned);

  return urlData?.publicUrl ?? null;
}
