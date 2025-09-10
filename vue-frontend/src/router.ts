import {createRouter, createWebHistory} from 'vue-router'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import Feed from './components/Feed.vue'
import CreatePost from './components/CreatePost.vue'
import PostPage from './components/PostPage.vue'

const routes = [
    {path: '/register', component: Register},
    {path: '/login', component: Login},
    {path: '/', component: Feed},
    {path: '/create', component: CreatePost},
    {path: '/post/:id', component: PostPage, props: true},
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
