<template>
    <div class="container">
        <n-button @click="back">返回</n-button>

        <!-- 标题 -->
        <n-h1>{{ blogInfo.title }}</n-h1>

        <!-- 文章内容 -->
        <div class="blog-content">
            <div v-html="blogInfo.content"></div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, inject, onMounted, computed } from "vue";
import { AdminStore } from "../stores/AdminStore";
import { useRouter, useRoute } from "vue-router";

const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog");
const adminStore = AdminStore();

const router = useRouter();
const route = useRoute();

const blogInfo = ref({});

onMounted(() => {
    loadBlog();
});

const loadBlog = async () => {
    const res = await axios.get('/blog/detail', {
        params: {
            id: route.query.id
        }
    });
    if (res.data.code === 200) {
        blogInfo.value = res.data.data;
    } else {
        message.error(res.data.msg);
    }
};

const back = () => {
    router.back();
};

</script>

<style>
.blog-content img {
    max-width: 100% !important;
}
</style>

<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
}
</style>