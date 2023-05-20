import { persisted } from 'svelte-local-storage-store';

// object to store playing XI
export const LivePlayers = persisted('livePlayers', { "players": [] });
