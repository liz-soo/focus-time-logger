// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mfwoiwcymvraffpykfww.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1md29pd2N5bXZyYWZmcHlrZnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNjcyNzMsImV4cCI6MjA2NDk0MzI3M30.F91dFfvI5EXCupI2Luit0NwBfWpKQqkX-RfV3vWGiNo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);