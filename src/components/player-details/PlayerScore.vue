<script setup lang="ts">
import { ref } from "vue";
import { userStore } from "@/stores/user";
import {runGameEngine} from "@/components/common/FetchNFT";
const user = userStore();

// read the result and probabilities from game engine
const jsonData = await runGameEngine(user.address);
</script>
<template>
<h3 class="header">Scoreboard</h3>
    
    <div class="page-align">
        <div style="color: white; background-color: darkblue; padding: 25px; font-size: 25px; font-weight: 900;">
        <p> 
            Winner : {{ jsonData['winner']}}
        </p>
    </div>
        <div class="winner-title">
                <h3>1st Innings: </h3>
                <h3>{{ jsonData['innings1']['batting_team_name'] }}</h3>
                <h3>{{ jsonData['innings1']['runs'] }} - {{jsonData['innings1']['wickets']}}</h3>
            </div>
            
            <div>
                <table >
                    <tr>
                        <th>Batsman</th>
                        <th>Runs</th>
                        <th>Balls Faced</th>
                        <th>Strike Rate</th>
                    </tr>
                    <tr v-for="player in jsonData['innings1']['player_scores']">
                        
                        <td>{{ player.player_name }}</td>
                        <td>{{ player.runs }}</td>
                        <td>{{ player.balls_faced }}</td>
                        <td>{{ player.strike_rate}}</td>
                        <!-- <td>{{ player.runs * 100 / player.balls_faced}}</td> -->
                    </tr>
                </table>
            </div> 

        <hr class="hr" />

     <div class="winner-title">
                <h3>2nd Innings: </h3>
                <h3>{{ jsonData['innings2']['batting_team_name'] }}</h3>
                <h3>{{ jsonData['innings2']['runs'] }} - {{jsonData['innings2']['wickets']}}</h3>
            </div>
            
            <div>
                <table>
                    <tr>
                        <th>Batsman</th>
                        <th>Runs</th>
                        <th>Balls Faced</th>
                        <th>Strike Rate</th>
                    </tr>
                    <tr v-for="player in jsonData['innings2']['player_scores']">
                        
                        <td>{{ player.player_name }}</td>
                        <td>{{ player.runs }}</td>
                        <td>{{ player.balls_faced }}</td>
                        <td>{{ player.strike_rate}}</td>
                    </tr>
                </table>
            </div> 
    </div>
</template>

<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 40px;
}

td,
th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 12px 8px;
    font-weight: bold;
}

tr:nth-child(even) {
    background-color: #dddddd;
}

.winner-title {
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 18px 10px 18px 30px;
    color: white;
    background-color: rgba(42, 20, 166, 0.53);
}

.hr {
    margin: 50px 0;
}

.page-align {
    margin: 50px 80px !important;
    background-color: rgb(28 131 189 / 53%);
    border-radius: 15px;
}
.header{
    text-align: center;
    margin-top: 3%;
    font-size: 35px;
}
</style>

