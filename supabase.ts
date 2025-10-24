import { createClient } from "@supabase/supabase-js";

// TODO: Replace with your project's credentials
const supabaseUrl = "https://lzravpkfmhohzeyrsbyh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cmF2cGtmbWhvaHpleXJzYnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzk2OTUsImV4cCI6MjA3Njg1NTY5NX0.QsQ9_ICxi7XTEU2w6pCW7aCYx2Y3oEQu0CPDmXUJgfE";

export const supabase = createClient(supabaseUrl, supabaseKey);