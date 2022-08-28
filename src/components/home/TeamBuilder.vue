<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "@/stores/user";
import { renderTeamData } from "@/components/common/FetchNFT";

let teamName = ref("");
let manager = ref("");
let country = ref("India");
const user = userStore();
const router = useRouter();
const address = user.address;


// create team
async function createTeam() {
    // const teamData = {
    //     name: teamName.value,
    //     description: "StumpedTeam",
    //     image: import.meta.env.VITE_TEAM_IMG,
    //     tokenType: "stumped_team",
    //     managerName: manager.value,
    //     country: country.value
    // };

    // // store nft metadata
    // console.log(teamData);
    // let metaUrl = await storeNFTAsset(teamData);
    // console.log(metaUrl);

    // fetch player NFT data using collection filters
    const teamData = {
        "userID": address,
        "description": "StupendTeam",
        "image": import.meta.env.VITE_TEAM_IMG,
        "collection": "stupend_team",
        "teamName": teamName.value,
        "manager": manager.value,
        "country": country.value,
        "address": address
    };
    let filteredData = await renderTeamData(teamData);
    console.log(filteredData);
    router.push("/players");
};
</script>

<template>
    <v-container class="signup-page">
        <v-container>
            <p>Team Name</p>
            <input class="signup-input" placeholder="Team Name" v-model="teamName" />
        </v-container>
        <v-container>
            <p>Manager Name</p>
            <input class="signup-input" placeholder="Manager Name" v-model="manager" />
        </v-container>
        <v-container>
            <p>Country</p>
            <select class="signup-input" v-model="country">
                <option value="India">India</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Australia">Australia</option>
                <option value="New Zealand">New Zealand</option>
                <option value="England">England</option>
                <option value="South Africa">South Africa</option>
                <option value="West Indies">West Indies</option>
            </select>
        </v-container>
        <v-container>
            <v-btn class="mx-auto" @click="createTeam()">Create Team</v-btn>
        </v-container>

    </v-container>
</template>

<style>
.signup-input {
    border: 2px solid rgb(0, 0, 0) !important;
    width: 45vw;
    border-radius: 10px;
    padding: 10px 0;
    color: white;
}

.signup-page {
    display: flex;
    flex-direction: column;
    background-color: rgb(183, 183, 183);
    margin: auto;
    width: 50%;
    padding: 50px 20px;
    border-radius: 15px;
    box-shadow: 5px 10px #888888;
}

.signup-page p {
    margin-top: 4%;
    margin-bottom: 1%;
    font-size: 20px;
    font-weight: 500;
}

.signup-page button {
    background-color: rgb(249, 221, 61);
    padding: 10px;
    width: 30vw;
    border-radius: 15px;
    color: rgb(32, 32, 32);
    font-weight: bolder;
    cursor: pointer;
}

/* .btn {
    margin-top: 30px;
} */

.signup-input op .signup-page button:hover {
    background-color: rgb(255, 204, 0);
}
</style>
