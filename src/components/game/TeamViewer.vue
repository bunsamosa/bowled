<script setup lang="ts">
import { userStore } from "@/stores/user";
import { useRouter } from "vue-router";

// read user from store
const router = useRouter();
const user = userStore();

function loadGame() {
    router.push("/scoreboard");
};
</script>

<template>
    <h1 class="heading">View your team</h1>
    <v-btn @click="loadGame()">Play Game</v-btn>
    <div class="align-playercards">
        <div v-for="people in user.players">
            <div class="playerCard">
                <div class="titleBar">
                    <h3>{{ people.player_name }}</h3>
                    <h3>{{ people.age }}</h3>
                </div>
                <div class="skills">
                    <p>Fielding: {{ people.fielding }}</p>
                    <p>Wicket Keeping:{{ people.wicket_keeping }}</p>
                    <p>Batting seam:{{ people.batting_seam }}</p>
                    <p>Batting spin:{{ people.batting_spin }}</p>
                    <p>Bowling main: {{ people["bowling main"] }}</p>
                    <p>Bowling variation: {{ people.bowling_variation }}</p>
                </div>
                <div class="player-deets">
                    <h3>Form: {{ people.form }}</h3>
                    <h3>Fitness: {{ people.fitness }}</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.playerCard {
    background-color: rgb(107, 164, 211);
    width: 20vw !important;
    height: 58vh;
    border-radius: 30px;
    color: white;
    float: left;
    margin-right: 20px !important;
    margin-bottom: 20px !important;
}

.titleBar {
    background-color: rgb(64, 146, 213);
    border-top-left-radius: 30px 30px;
    border-top-right-radius: 30px 30px;
    height: 10vh;
    padding-top: 10px;
}

.titleBar h3 {
    margin-left: 30px;
}

.player-deets {
    margin-left: 20px;
    padding-top: 20px;
}

.skills {
    margin-left: 20px;
    margin-top: 20px;
}

.json-data {
    display: flex;
    flex-direction: row !important;
}

.align-playercards {
    margin-left: 8vw !important;
    margin: 5% 0;
}

.heading {
    text-align: center;
    margin-top: 5%;
}

.skills p {
    font-size: 17px;
    font-weight: 800;
}
</style>
