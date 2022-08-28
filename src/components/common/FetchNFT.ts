// fetch NFT balance for the address using covalent APIs
async function fetchTeamData(address: string) {
    let fetch_url = import.meta.env.VITE_COVALENT_TEAM_NFT
    fetch_url = fetch_url.replace("__", address);
    const response = await fetch(fetch_url);
    const data = await response.json();
    return data;
};

// fetch team players data from collection query covalent
async function renderTeamData(collectionFilters: any) {
    let fetch_url = import.meta.env.VITE_COVALENT_TEAM_NFT
    fetch_url = fetch_url.replace("/__", "");
    console.log(collectionFilters);
    const response = await fetch(fetch_url, {
        method: "POST", headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, body: JSON.stringify(collectionFilters)
    });
    const data = await response.json();
    return data;
};

// Run the game engine contract from the user
async function runGameEngine(address: string) {
    let engine_url = import.meta.env.VITE_GAME_ENGINE;
    engine_url = engine_url.replace("__", address);
    const response = await fetch(engine_url);
    const data = await response.json();
    return data;
    return data;
};
export { fetchTeamData, renderTeamData, runGameEngine };
