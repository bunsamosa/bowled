import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/HomeView.vue";
import Team from "@/views/TeamView.vue";
import Players from "@/views/Players.vue";
import PlayerScore from "@/views/PlayerScoreView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/team",
      name: "team",
      component: Team,
    },
    {
      path: "/players",
      name: "players",
      component: Players,
    },
    {
      path: "/scoreboard",
      name: "scoreboard",
      component: PlayerScore,
    }
  ],
});

export default router;
