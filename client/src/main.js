import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import naive from "naive-ui";
import { createDiscreteApi } from "naive-ui";
import { router } from "./common/router.js";
import { createPinia } from "pinia";
import axios from "axios";
import { AdminStore } from "./stores/AdminStore";
import RichTextEditor from "./components/RichTextEditor.vue";

/**
 * 依赖
 * axios
 * pinia
 * sass
 * vue-router@4
 * naive-ui( + vfonts)
 * @wangeditor/editor-for-vue@next
 */

// 全局地址
axios.defaults.baseURL = "http://localhost:8080";
// 全局请求头
axios.interceptors.request.use((config) => {
  config.headers.token = adminStore.token;
  return config;
});

const { message, notification, dialog } = createDiscreteApi([
  "message",
  "notification",
  "dialog",
]);

const app = createApp(App);

// 注入
app.provide("axios", axios);
app.provide("message", message);
app.provide("notification", notification);
app.provide("dialog", dialog);
app.provide("serverUrl", axios.defaults.baseURL)

app.component("RichTextEditor", RichTextEditor);

app.use(naive);
app.use(createPinia());
app.use(router);

const adminStore = AdminStore();

app.mount("#app");
