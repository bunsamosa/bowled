import { defineStore } from "pinia";

export const userStore = defineStore({
  id: "user",
  state: () => ({
    address: "",
    teamName: "",
    manager: "",
    country: "",
    players: []
  })
});
