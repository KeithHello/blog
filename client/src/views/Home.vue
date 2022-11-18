<template>
  <div class="container">
    <div class="nav">
      <div @click="homepage">首页</div>
      <div>
        <n-popselect
          @update:value="searchByCategory"
          v-model:value="selectedCategory"
          :options="categoryOptions"
          trigger="click"
        >
          <div>
            分类<span>{{ categoryName }}</span>
          </div>
        </n-popselect>
      </div>
      <div @click="dashboard">后台</div>
    </div>
    <n-divider />

    <n-space class="search">
      <n-input
        class="searchBox"
        v-model:value="pageInfo.keyword"
        placeholder="请输入搜索内容"
      />
      <n-button type="primary" ghost @click="loadBlogData(0)">搜索</n-button>
    </n-space>

    <div v-for="(blog, index) in blogListInfo">
      <n-card class="article" :title="blog.title" @click="toDetail(blog)">
        <div class="font">
          <span v-html="blog.content"></span>
          <span>...</span>
        </div>

        <template #footer>
          <n-space align="center">
            <div>发布时间： {{ blog.create_time }}</div>
          </n-space>
        </template>
      </n-card>
    </div>

    <n-pagination
      @update:page="loadBlogData"
      v-model:page="pageInfo.page"
      :page-count="pageInfo.pageCount"
    />

    <n-divider />
    <div class="footer">
      <div>Power by Keith</div>
      <div>© 2022</div>
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

const selectedCategory = ref(0);
const blogListInfo = ref([]);
const categoryOptions = ref([]);

// 分页
const pageInfo = reactive({
  page: 1,
  pageSize: 10,
  pageCount: 0,
  count: 0,
  keyword: "",
  categoryId: null,
});

onMounted(() => {
  loadBlogData();
  loadCategoryData();
});

const categoryName = computed(() => {
  const category = categoryOptions.value.find(
    (option) => option.value === selectedCategory.value
  );
  return category ? category.label : "";
});

const loadBlogData = async (page = 0) => {
  if (page != 0) {
    pageInfo.page = page;
  }

  let res = await axios.get("/blog/search", {
    params: {
      page: pageInfo.page,
      pageSize: pageInfo.pageSize,
      keyword: pageInfo.keyword,
      categoryId: pageInfo.categoryId,
    },
  });

  blogListInfo.value = res.data.data.list.map((item) => {
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

const searchByCategory = async (categoryId) => {
  pageInfo.categoryId = categoryId;
  loadBlogData();
};

const toDetail = (blog) => {
  router.push({
    path: "/detail",
    query: {
      id: blog.id,
    },
  });
};

const homepage = () => {
  router.push("/");
};
const dashboard = () => {
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}

.nav {
  display: flex;
  font-size: 20px;
  color: #64676a;
  padding-top: 20px;

  div {
    cursor: pointer;
    margin-right: 15px;

    &:hover {
      color: #fd760e;
    }

    span {
      font-size: 12px;
    }
  }
}

.searchBox {
  width: 500px;
  margin-bottom: 15px;
}

.font {
  display: flex;
  align-items: center;
}

.article {
  margin-bottom: 15px;
  cursor: pointer;
}

.footer {
  text-align: center;
  line-height: 25px;
  color: #64676a;
}
</style>
