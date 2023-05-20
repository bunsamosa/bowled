// sort player data by wicket keeping skill in descending order
export const sortByWicketKeeping = (players: any) => {
    return [...players].sort(
        (a: any, b: any) => b.wicket_keeping_index - a.wicket_keeping_index
    );
};

// sort player data by batting skill in descending order
export const sortByBatting = (players: any) => {
    return [...players].sort(
        (a: any, b: any) => b.batting_rating - a.batting_rating);
};

// sort player data by bowling skill in descending order
export const sortByBowling = (players: any) => {
    return [...players].sort(
        (a: any, b: any) => b.bowling_rating - a.bowling_rating);
};
