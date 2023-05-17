import { serverURL } from '$lib/utils/bowledClient';

export const load = async ({ fetch }) => {
    const teamsURL = serverURL + '/live/teams';
    const fetchTeams = async () => {
        const response = await fetch(teamsURL);
        const teams = await response.json();
        return teams;
    };

    return {
        teams: fetchTeams()
    };
};
