import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/HomeView.vue";
import Team from "@/views/TeamView.vue";
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
      path: "/scoreboard",
      name: "scoreboard",
      component: PlayerScore,
    }
  ],
});

export default router;
