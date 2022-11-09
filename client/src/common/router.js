import {createRouter, createWebHashHistory} from 'vue-router'

let routes = [
    {
        path: '/test',
        component: () => import('../views/Test.vue')
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/detail',
        name: 'Detail',
        component: () => import('../views/Detail.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/Dashboard.vue'),
        children: [
            {path: "/dashboard/category", name: 'Dashboard/Category', component: () => import('../views/dashboard/Category.vue')},
            {path: "/dashboard/article", name: 'Dashboard/Article', component: () => import('../views/dashboard/Article.vue')},
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export {router, routes}