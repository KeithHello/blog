<template>
  <n-tabs default-value="add" justify-content="start" type="line">
    <n-tab-pane name="oasis" tab="Oasis"> Wonderwall </n-tab-pane>
    <n-tab-pane name="add" tab="添加文章">
      <n-form>
        <n-form-item label="标题">
          <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="addArticle.categoryId"
            :options="categoryOptions"
          />
        </n-form-item>
        <n-form-item label="内容">
          <RichTextEditor v-model="addArticle.content"></RichTextEditor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="add" type="primary">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
    <n-tab-pane name="jay chou" tab="周杰伦"> 七里香 </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { reactive, ref, inject, onMounted } from "vue";
import { AdminStore } from "../../stores/AdminStore";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";

const axios = inject("axios");
const message = inject("message");
const adminStore = AdminStore();

const router = useRouter();
const route = useRoute();

const addArticle = reactive({
  title: "",
  categoryId: null,
  content: "",
});
const categoryOptions = ref([]);

onMounted(() => {
  loadData();
});

const loadData = async () => {
  let res = await axios.get("/category/list");
  categoryOptions.value = res.data.data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  console.log(categoryOptions.value);
};

const add = async () => {
  let result = await axios.post("/blog/_token/add", addArticle);
  if (result.data.code === 200) {
    message.success(result.data.msg);
    loadData();

    // 内容置空
    addArticle.title = "";
    addArticle.categoryId = null;
    addArticle.content = "";
  } else {
    message.error(result.data.msg);
  }
};
</script>

<style lang="scss" scoped></style>
