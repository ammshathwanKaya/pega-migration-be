import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export const uploadToSupabase = async (file: Express.Multer.File) => {
  const fileName = `${randomUUID()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .getPublicUrl(fileName);

  return {
    url: data.publicUrl,
    key: fileName,
  };
};

export const deleteFromSupabase = async (filePath: string) => {
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .remove([filePath]);

  if (error) {
    console.error("Supabase delete error:", error);
    throw new Error("Failed to delete file from storage");
  }
};
