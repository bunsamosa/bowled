<script setup lang="ts">
import { ref } from "vue";
import jsonData from "../../player-data.json"

console.log(jsonData);
</script>

<template>
    <div class="playerCard">
        <div class="titleBar">
        <h3>Bob</h3>
        <h3>23 years 5 days</h3>
        </div>
        <div class="player-deets">
            <h3>Country:</h3>
            <h3>Experience: </h3>
            <h3>Form: Moderate</h3>
            <h3>Fitness: Decent</h3>
            <!-- <img src="images/batsman.png" /> -->
        </div>
        <div class="skills">Skills
        <p>fielding: 30%</p>
        <p>wicket keeping:40%</p>
        <p>batting vs seam bowlers:35%</p>
        <p>batting vs spin bowlers:35%</p>
        <p>bowling main: 45%</p>
        <p>bowling variation: 50%</p>
        </div>
    </div>

</template>

<style>
    .playerCard{
        background-color: rgb(107, 164, 211);
        width: 20vw !important;
        height: 80vh;
        border-radius: 30px;
        color:white;
    }
    .titleBar{
        background-color: rgb(64, 146, 213);
        border-top-left-radius: 30px 30px;
        border-top-right-radius: 30px 30px;
        height: 10vh;
        padding-top: 10px;
    }
    .titleBar h3{
        margin-left: 30px;
    }
    .player-deets{
        margin-left: 20px;
        padding-top: 20px;
    }
    .skills{
        margin-left: 20px;
        margin-top: 20px;
    }
</style>

