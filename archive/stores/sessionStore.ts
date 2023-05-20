import { writable } from 'svelte/store'
import type { Session } from '@supabase/supabase-js';

export const appSession = writable<Session | null>(null);

export const managerName = writable<String | null>(null);
export const teamName = writable<String | null>(null);
export const ensAddress = writable<String | null>(null);
export const userID = writable<String | null>(null);


export async function updateUserData(data: any) {
    managerName.set(data['manager_name']);
    teamName.set(data['team_name']);
    ensAddress.set(data['ens_address']);
    userID.set(data['user_id']);
};
