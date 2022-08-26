<script setup lang="ts">
import { ref } from "vue";

var taglines = ref([
    "Compete with users from all around the world",
    "Buy star players from the live auction",
    "Nurture and train the next cricket superstar"
])
</script>

<template>
    <div class="centerDiv">
        <v-container :fluid=true tag="logo">
            <v-img src="images/stumped_logo_white.png" width="40vh" class="mx-auto"></v-img>
        </v-container>
        <v-container :fluid=true>
            <p class="question mx-auto">Live your Dream of owning a T20 Cricket Team!</p>
        </v-container>
        <v-container>
            <vue-writer :array=taglines class="taglines" :typeSpeed=75 :eraseSpeed=25 />
        </v-container>
    </div>
</template>

<style>
.question {
    color: #FFC700;
    font-family: Inter;
    font-size: 4vh;
    font-weight: 700;
    line-height: 4vw;
    letter-spacing: 0em;
    text-align: center;
}

.taglines {
    color: #ffffff;
    font-family: Inter;
    font-size: 3vh;
    font-weight: 500;
    line-height: 4vw;
    text-align: center;
}

.centerDiv {
    padding-top: 15vh;
}


/* Desktops */
@media screen and (min-height : 720px) and (min-width: 1280px) and (-webkit-min-device-pixel-ratio: 1) {
    .question {
        color: #FFC700;
        font-family: Inter;
        font-size: 5.5vh;
        font-weight: 700;
        line-height: 4vw;
        letter-spacing: 0em;
        text-align: center;
    }

    .taglines {
        color: #ffffff;
        font-family: Inter;
        font-size: 3.5vh;
        font-weight: 500;
        line-height: 4vw;
        text-align: center;
    }
}
</style>
