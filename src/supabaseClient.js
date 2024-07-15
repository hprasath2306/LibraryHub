import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uuqwqbnrcgqykhyfrivu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1cXdxYm5yY2dxeWtoeWZyaXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5NjkxNzIsImV4cCI6MjAzNjU0NTE3Mn0.FW324LHgRTQSdn53DRNwedrHaRW86hTDn8jlVPTD3Tk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
