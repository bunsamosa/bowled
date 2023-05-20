import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_AUTH_URL;
const anonKey = import.meta.env.VITE_ANON_KEY;

export const authClient = createClient(url, anonKey);
