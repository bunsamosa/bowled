import PlayerCardVue from "@/components/player-details/PlayerCard.vue";
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import PlayerCard from "../views/CardView.vue";
import SignUpCard from "../views/SignUpView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/player-card",
      name: "player-card",
      component: PlayerCard,
    },
    {
      path: "/team-signup",
      name: "team-signup",
      component: SignUpCard,
    }
  ],
});

export default router;
