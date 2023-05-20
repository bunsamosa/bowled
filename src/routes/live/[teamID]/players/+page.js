import { serverURL } from '$lib/utils/bowledClient';

// fetch players of the team
export const load = async ({ fetch, params }) => {
    const { teamID } = params;
    const playersURL = serverURL + '/live/players?team=' + teamID;

    const fetchPlayers = async () => {
        const response = await fetch(playersURL);
        const players = await response.json();
        return players;
    };

    return {
        players: fetchPlayers(),
        teamID: teamID
    };
};
