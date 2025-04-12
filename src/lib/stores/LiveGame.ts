import { persisted } from 'svelte-local-storage-store';

// Define the expected type
interface LivePlayersStore {
    players: number[];
}

// object to store playing XI with explicit type
export const LivePlayers = persisted<LivePlayersStore>(
    'livePlayers',
    { players: [] } // Initial value
);
