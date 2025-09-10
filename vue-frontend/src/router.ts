import {createRouter, createWebHistory} from "vue-router";
import Register from "../src/components/Register.vue";
import Login from "../src/components/Login.vue";
import Feed from "../src/components/Feed.vue";
import CreatePost from "../src/components/CreatePost.vue";
import PostPage from "../src/components/PostPage.vue";
import {useUser} from "./composables/user-api";

const routes = [
    {path: "/", redirect: "/login"},
    {path: "/login", name: "login", component: Login},
    {path: "/register", name: "register", component: Register},
    {path: "/feed", name: "feed", component: Feed, meta: {requiresAuth: true}},
    {path: "/create-post", name: "create-post", component: CreatePost, meta: {requiresAuth: true}},
    {path: "/post/:id", name: "post-page", component: PostPage, props: true, meta: {requiresAuth: true}},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const {userIsAuthorized} = useUser();
    if (to.meta.requiresAuth && !userIsAuthorized) {
        next({name: "login"});
    } else {
        next();
    }
});

export default router;
