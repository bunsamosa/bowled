import { writable } from 'svelte/store'
import type { Session } from '@supabase/supabase-js';

export const appSession = writable<Session | null>(null);
