<script setup lang="ts">
import { ref } from "vue";
import { userStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { fetchData } from "@/components/common/FetchNFT";
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
    const data = await fetchData(address);
    const nft_data = data["data"]["items"];

    for (var ele of nft_data) {
        if (ele.hasOwnProperty("description")) {
            if (ele["description"] == "StumpedTeam") {
                team_created.value = true;
                user.teamName = ele["name"];
                user.manager = ele["managerName"];
                break;
            };
        }
    };
};


</script>

<template>
    <TeamRenderer v-if="team_created"></TeamRenderer>
    <TeamBuilder v-else></TeamBuilder>
</template>
