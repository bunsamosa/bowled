<script setup lang="ts">
import { ref } from "vue";
import { userStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { fetchTeamData } from "@/components/common/FetchNFT";
import TeamBuilder from "@/components/home/TeamBuilder.vue";


// read user from store
const router = useRouter();
const user = userStore();
const address = user.address;
const team_created = ref(false);

console.log("team page");
console.log(address);

// not logged in
if (address == "") {
    router.push("/");
}
else {
    // check if the player has a team
    const nft_data = await fetchTeamData(address);

    // nft validation - contract, and metadata ID
    if (nft_data.hasOwnProperty("contract")) {
        if (nft_data["address"] != import.meta.env.VITE_CONTRACT_ADDRESS) {
            // invalid NFT, redirect to sign up
            team_created.value = false;
        }
    }
    else if (nft_data.hasOwnProperty("manager")) {
        team_created.value = true;
        user.manager = nft_data["manager"];
        user.teamName = nft_data["team_name"];
        user.country = nft_data["country"];
        user.players = nft_data["players"];
    };
};


</script>

<template>
    <!-- <p v-if="team_created"></p>
    <TeamBuilder v-else></TeamBuilder> -->
    <TeamBuilder></TeamBuilder>
</template>
