<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { serverURL } from '$lib/utils/bowledClient'; // Import serverURL
    import { onMount } from 'svelte';

    // TODO: How to get opponent team ID? For now, hardcode
    const OPPONENT_TEAM_ID = 'ind'; // Example

    let team1Id: string | null = null;
    let team2Id: string | null = null;
    let errorMessage: string | null = null;
    let isLoading = false;

    let errorLoading: string | null = null;
    let eventSource: EventSource | null = null; // Variable to hold the EventSource instance

    let team1SquadFromSelection: string[] | null = null; // To store squad from sessionStorage

    onMount(async () => {
        console.log('Mode selection page mounted');

        // Get Team IDs from URL
        const urlParams = new URLSearchParams(window.location.search);
        team1Id = urlParams.get('team1');
        team2Id = urlParams.get('team2');

        if (!team1Id || !team2Id) {
            errorMessage = 'Missing team IDs in URL.';
            return;
        }

        // Get selected squad for Team 1 from sessionStorage
        try {
            const storedSquad = sessionStorage.getItem('selectedTeam1Squad');
            if (storedSquad) {
                team1SquadFromSelection = JSON.parse(storedSquad);
                if (!Array.isArray(team1SquadFromSelection) || team1SquadFromSelection.length !== 11) {
                    console.error('Invalid squad data found in sessionStorage:', team1SquadFromSelection);
                    throw new Error('Invalid player selection data found.');
                }
                console.log('Retrieved selected squad from sessionStorage:', team1SquadFromSelection);
            } else {
                throw new Error('Player selection data not found.');
            }
        } catch (e) {
            console.error("Error retrieving squad from sessionStorage:", e);
            errorMessage = e instanceof Error ? e.message : "Could not load player selection.";
            team1SquadFromSelection = null; // Ensure it's null on error
        }

        // No initial fetch needed here anymore, happens on button click

    });

    // --- Helper to fetch player IDs --- Mofified to use correct API endpoint
    async function fetchPlayerIds(teamId: string): Promise<string[]> {
        if (!teamId) throw new Error("Team ID is required to fetch players.");

        const apiUrl = `${serverURL}/live/players?team=${teamId}`;
        console.log(`Fetching players for team: ${teamId} from ${apiUrl}`);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch players for team ${teamId}: ${response.status}`);
        }
        const players = await response.json();
        // Assuming the response is an array of player objects with player_id
        if (!Array.isArray(players)) {
             throw new Error(`Unexpected response format when fetching players for team ${teamId}`);
        }
        if (players.length === 0) {
            throw new Error(`No players found for team ${teamId}`);
        }
        // The start match API expects exactly 11 players per team
        if (players.length !== 11) {
            console.warn(`Team ${teamId} does not have exactly 11 players, found ${players.length}. API might reject.`);
            // Decide how to handle: error out, or try sending anyway?
            // For now, let's send what we got, backend validation will handle it.
        }
        return players.map(p => String(p.player_id)); // Ensure IDs are strings
    }

    // --- Handler for Player Mode (Turn-Based) ---
    async function startPlayerMode() {
        if (!team1Id || !team2Id) {
            errorMessage = "Missing team IDs to start match.";
            return;
        }
        isLoading = true;
        errorMessage = null;

        try {
            // Fetch player IDs for the opponent team (team 2)
            // const team1PlayerIds = await fetchPlayerIds(team1Id); // REMOVED: Use sessionStorage data
            const team2PlayerIds = await fetchPlayerIds(team2Id);

            // Basic validation (can be enhanced)
            if (!team1SquadFromSelection || !team2PlayerIds) { // Check retrieved squad
                errorMessage = 'Could not get player data for one or both teams.';
                return; // Stop if fetching failed or sessionStorage was invalid
            }

            // Ensure team1 squad has 11 players (already checked on retrieve, but double-check)
            if (team1SquadFromSelection.length !== 11) {
                errorMessage = `Selected team must have 11 players, found ${team1SquadFromSelection.length}. Go back and re-select.`;
                return;
            }

            // Prepare payload for the API call
            const payload = {
                team1_id: team1Id,
                team2_id: team2Id,
                overs: 5, // Keep 5 overs for now
                team1_squad_player_ids: team1SquadFromSelection, // Use stored squad
                team2_squad_player_ids: team2PlayerIds
            };

            console.log('Starting player mode with payload:', payload);

            // Make the API call to start the match
            const response = await fetch(`${serverURL}/matches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Attempt to parse error details from backend
                let errorDetail = `HTTP error ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetail = errorData.detail || JSON.stringify(errorData);
                } catch (jsonError) {
                    // Fallback if response is not JSON
                    errorDetail = await response.text();
                }
                throw new Error(errorDetail);
            }

            const matchData = await response.json();
            const matchId = matchData.match_id;

            if (matchId) {
                console.log(`Match started successfully with ID: ${matchId}. Navigating...`);
                // Navigate to the new turn-based match page
                await goto(`/live/${matchId}`);
            } else {
                throw new Error("Match ID not received from backend.");
            }

        } catch (error) {
            console.error("Error starting Player Mode match:", error);
            errorMessage = error instanceof Error ? error.message : `An unknown error occurred: ${error}`;
        } finally {
            isLoading = false;
        }
    }

    // --- Handler for Manager Mode (Old Simulation) ---
    async function startManagerMode() {
        if (!team1Id) {
            errorMessage = "Team ID not available for Manager Mode.";
            return;
        }
        console.log('Navigating to Manager Mode for team:', team1Id);
        errorMessage = null;
        isLoading = true;
        try {
            // Navigate to the manager mode page structure
            // Assumes the LivePlayers store was set correctly on the previous page
            await goto(`/play/manager-mode/${team1Id}`);
        } catch(e) {
             console.error("Error navigating/starting manager mode:", e);
             errorMessage = "Could not start or navigate to Manager Mode page.";
             isLoading = false;
        }
        // isLoading will be reset by navigation or stay true on error
    }

</script>

<div class="container mx-auto p-8 text-center">
    <h1 class="h1 mb-6">Select Game Mode</h1>

    {#if errorMessage}
        <div class="alert variant-filled-error mb-4">
            <p>{errorMessage}</p>
        </div>
    {/if}

    {#if team1Id && team2Id}
        <p class="mb-4">Playing as Team: {team1Id} vs {team2Id}</p>
        <div class="flex justify-center gap-4">
            <button
                type="button"
                class="btn btn-lg variant-filled-primary"
                on:click={startPlayerMode}
                disabled={isLoading}
                title="Player Mode"
            >
                {#if isLoading && !errorMessage} Starting... {:else} Player Mode (Turn-Based) {/if}
            </button>

            <button
                type="button"
                class="btn btn-lg variant-filled-secondary"
                on:click={startManagerMode}
                disabled={isLoading}
            >
                 {#if isLoading && errorMessage} Start Failed {:else if isLoading} Starting... {:else} Manager Mode {/if}
            </button>
        </div>
    {:else if !errorMessage}
        <p>Loading team information...</p>
    {/if}
</div>
