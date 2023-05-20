// disable ssr for match page
// export const ssr = false;

import { serverURL } from '$lib/utils/bowledClient';
import { get } from 'svelte/store';
import { LivePlayers } from '$lib/stores/LiveGame';
import { sortByBatting, sortByBowling } from '$lib/utils/players';

// read player data
export const load = async ({ fetch, params }) => {
    const { players } = get(LivePlayers);
    const { teamID } = params;

    // create batting and bowling line-ups
    let battingLineup = sortByBatting(players);
    let bowlingLineup = sortByBowling(players);
    // choose only 5 bowlers
    bowlingLineup = bowlingLineup.slice(0, 5);

    // payload for creating a new match
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            team_id: teamID,
            batting_lineup: battingLineup,
            bowling_lineup: bowlingLineup
        })
    };

    // fetch match data
    let matchURL = serverURL + '/live/game';
    const fetchMatch = async () => {
        const response = await fetch(matchURL, payload);
        const match = await response.json();
        return match;
    }

    return {
        gameData: fetchMatch()
    };
};
