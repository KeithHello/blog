<template>
    <div class="main-panel">
        <div class="menu">
            <div v-for="(menu, index) in menus" @click="toPage(menu)">
                {{ menu.name }}
            </div>
        </div>
        <div class="content">
            <router-view></router-view>
        </div>
        <div class="title">后台管理系统</div>
    </div>
</template>

<script setup>
import { reactive, inject } from "vue";
import { AdminStore } from "../../stores/AdminStore";
import { useRouter, useRoute } from "vue-router";

const axios = inject("axios");
const message = inject("message");
const adminStore = AdminStore();

const router = useRouter();
const route = useRoute();

let menus = [
    { name: "文章管理", href: "/dashboard/article" },
    { name: "分类管理", href: "/dashboard/category" },
    { name: "退出", href: "logout" },
]

const toPage = (menu) => {
    if (menu.href === "logout") {
        // adminStore.logout();
        router.push("/login");
    } else {
        router.push(menu.href);
    }
}


</script>

<style lang="scss" scoped>
.main-panel {
    display: flex;
    color: #64676a;
    max-width: 1500px;
    margin: 0 auto;
}

.menu {
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: 95vh;
    border-right: 1px solid #dadada;

    div {
        cursor: pointer;

        &:hover {
            background-color: #fd760e;
        }
    }
}

.content {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    height: 95vh;
    overflow: auto;
}

.title {
    font-size: 65px;
    font-weight: bold;
    text-align: right;
    position: fixed;
    color: rgba(0,0,0,20%);
    right: calc((100vw - 1500px) / 2);
    bottom: 20px;
}
</style>
