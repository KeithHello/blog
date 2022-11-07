<template>
  <div class="login-panel">
    <n-card title="账号登录">
      <n-form :model="admin" :rules="rules">
        <n-form-item path="account" label="账号">
          <n-input v-model:value="admin.account" placeholder="请输入账号" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="admin.password"
            type="password"
            placeholder="请输入密码"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-checkbox v-model:checked="admin.remember">记住我</n-checkbox>
        <n-button type="primary" @click="login">登录</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import { reactive, inject } from "vue";
import { AdminStore } from "../stores/AdminStore";
import { useRouter, useRoute } from "vue-router";

const axios = inject("axios");
const message = inject("message");
const adminStore = AdminStore();

const router = useRouter()
const route = useRoute()

let rules = {
  account: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 4, max: 16, message: "长度在 4 到 16 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" },
  ],
};

const admin = reactive({
  account: localStorage.getItem("account") || "",
  password: localStorage.getItem("password") || "",
  remember: localStorage.getItem("remember") === "true"
});

console.log(localStorage.getItem("remember"));

const login = async () => {
  let result = await axios.post("/admin/login", {
    account: admin.account,
    password: admin.password,
  });

  console.log(result);
  

  if (result.data.code === 200) {
    adminStore.id = result.data.data.id;
    adminStore.account = result.data.data.account;
    adminStore.token = result.data.data.token;

    // 记住我，保存到本地
    if (admin.remember) {
      localStorage.setItem("id", result.data.data.id);
      localStorage.setItem("account", admin.account);
      localStorage.setItem("password", admin.password);
      localStorage.setItem("remember", admin.remember);
    }

    router.push("/dashboard");
    message.info("登录成功");
  } else {
    message.error(result.data.msg);
  }
};
</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>
