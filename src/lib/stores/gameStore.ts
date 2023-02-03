import { writable } from 'svelte/store'

export const teamID = writable<String | null>(null);
export const battingLineUp = writable<String | null>(null);
export const bowlingLineUp = writable<String | null>(null);
export const gameID = writable<String | null>(null);
export const allPlayers = writable<String | null>(null);
