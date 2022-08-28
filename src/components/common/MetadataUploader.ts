import { NFTStorage } from "nft.storage"
const NFT_STORAGE_API_KEY = import.meta.env.VITE_NFT_STORAGE_API_KEY;

async function storeNFTAsset(data: any) {
    const client = new NFTStorage({ token: NFT_STORAGE_API_KEY })

    // convert json to Blob and upload to nft.storage
    var blobData = new Blob([JSON.stringify(data)], { type: "application/json" }),
        fr = new FileReader();
    let cid = await client.storeBlob(blobData);
    cid = "ipfs://" + cid;
    console.log("Metadata stored on Filecoin and IPFS with URL:", cid)
    return cid;
};


export { storeNFTAsset };
