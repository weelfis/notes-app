import { createRouter, createWebHistory } from "vue-router";
import NotePage from "../views/NotePage.vue";

const routes = [
  {
    path: "/note/:id",
    name: "note",
    component: NotePage,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory("/"),
  routes
});

export default router;
