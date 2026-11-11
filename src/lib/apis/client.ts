import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)?.trim();

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY trong file .env. Hãy khởi động lại dev server sau khi cập nhật .env.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
