import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://lirqqjcpasiatqcxsetb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcnFxamNwYXNpYXRxY3hzZXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzU1NTUsImV4cCI6MjA4NTc1MTU1NX0.oudc32BsJH1uXFlUe0kz2g-PD-TYGFOnLr30NB_vec4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
