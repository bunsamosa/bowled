let fetch_url = import.meta.env.VITE_COVALENT_URL

// fetch NFT balance for the address using covalent APIs
async function fetchData(address: string) {
    fetch_url = fetch_url.replace("__", address);
    const response = await fetch(fetch_url);
    const data = await response.json();
    return data;
};

export { fetchData };
