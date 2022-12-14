<template>
  <n-tabs v-model:value="tabValue" justify-content="start" type="line">
    <n-tab-pane name="list" tab="文章列表">
      <div v-for="(blog, index) in blogListInfo">
        <n-card :title="blog.title" class="article">
          <div class="font">
            <span v-html="blog.content"></span>
            <span>...</span>
          </div>

          <template #footer>
            <n-space align="center">
              <div>发布时间： {{ blog.create_time }}</div>
              <n-button type="info" ghost @click="toUpdate(blog)"
                >修改</n-button
              >
              <n-button type="warning" ghost @click="confirmDel(blog)"
                >删除</n-button
              >
            </n-space>
          </template>
        </n-card>
      </div>

      <n-space>
        <div v-for="pageNum in pageInfo.pageCount" @click="toPage(pageNum)">
          <div class="item" :class="{ paging: pageNum === pageInfo.page }">
            {{ pageNum }}
          </div>
        </div>
      </n-space>
    </n-tab-pane>
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
          <n-button @click="add" type="primary" ghost>提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
    <n-tab-pane name="update" tab="修改">
      <n-form>
        <n-form-item label="标题">
          <n-input
            v-model:value="updateArticle.title"
            placeholder="请输入标题"
          />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="updateArticle.categoryId"
            :options="categoryOptions"
          />
        </n-form-item>
        <n-form-item label="内容">
          <RichTextEditor v-model="updateArticle.content"></RichTextEditor>
        </n-form-item>
        <n-form-item label="">
          <n-button @click="update" type="primary" ghost>提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { reactive, ref, inject, onMounted } from "vue";
import { AdminStore } from "../../stores/AdminStore";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";

const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog");
const adminStore = AdminStore();

const router = useRouter();
const route = useRoute();

const addArticle = reactive({
  title: "",
  categoryId: null,
  content: "",
});
const updateArticle = reactive({
  id: 0,
  title: "",
  categoryId: null,
  content: "",
});

const blogListInfo = ref([]);
const categoryOptions = ref([]);
const tabValue = ref("list");

// 分页
const pageInfo = reactive({
  page: 1,
  pageSize: 10,
  pageCount: 0,
  count: 0,
});

onMounted(() => {
  loadBlogData();
  loadCategoryData();
});

const loadBlogData = async () => {
  let res = await axios.get("/blog/search", {
    params: {
      page: pageInfo.page,
      pageSize: pageInfo.pageSize,
    },
  });
  blogListInfo.value = res.data.data.list.map((item) => {
    item.content += "...";
    item.create_time = new Date(item.create_time).toLocaleString();
    return item;
  });
  pageInfo.count = res.data.data.total;
  pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
};

const loadCategoryData = async () => {
  let res = await axios.get("/category/list");
  categoryOptions.value = res.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
};

const add = async () => {
  let result = await axios.post("/blog/_token/add", addArticle);
  if (result.data.code === 200) {
    message.success(result.data.msg);
    loadBlogData();

    // 内容置空
    addArticle.title = "";
    addArticle.categoryId = null;
    addArticle.content = "";

    tabValue.value = "list";
  } else {
    message.error(result.data.msg);
  }
};

const toPage = async (pageNum) => {
  pageInfo.page = pageNum;
  loadBlogData();
};

const toUpdate = async (blog) => {
  let res = await axios.get("/blog/detail", {
    params: {
      id: blog.id,
    },
  });
  updateArticle.id = res.data.data.id;
  updateArticle.title = res.data.data.title;
  updateArticle.categoryId = res.data.data.category_id;
  updateArticle.content = res.data.data.content;

  tabValue.value = "update";
};

const update = async () => {
  let result = await axios.put("/blog/_token/update", updateArticle);
  if (result.data.code === 200) {
    message.success(result.data.msg);

    // 内容置空
    updateArticle.id = 0;
    updateArticle.title = "";
    updateArticle.categoryId = null;
    updateArticle.content = "";

    loadBlogData();

    // 切换到列表页
    tabValue.value = "list";
  } else {
    message.error(result.data.msg);
  }
};

const confirmDel = async (blog) => {
  dialog.warning({
    title: "警告",
    content: "是否要删除",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      del(blog);
    },
    onNegativeClick: () => {},
  });
};

const del = async (blog) => {
  let result = await axios.delete("/blog/_token/delete", {
    params: {
      id: blog.id,
    },
  });
  if (result.data.code === 200) {
    message.success(result.data.msg);
    loadBlogData();
  } else {
    message.error(result.data.msg);
  }
};
</script>

<style lang="scss" scoped>
.article {
  margin-bottom: 15px;
}

.paging {
  color: aqua;
}

.item {
  cursor: pointer;
}

.font {
  display: flex;
  align-items: center;

  span {
  }
}
</style>
