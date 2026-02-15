
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://grtnofqyehjjhddabdzr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydG5vZnF5ZWhqamhkZGFiZHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjg3MTIsImV4cCI6MjA4NjY0NDcxMn0._q6qmYDAhLJHA_Dw4zyb3gWUtlwBlfIPlyaZfFS01o4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
