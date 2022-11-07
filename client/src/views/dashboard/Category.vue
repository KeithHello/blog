<template>
    <div>
        <n-button @click="showAddModal = true">添加分类</n-button>
        <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>编号</th>
                    <th>名称</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(category, index) in categoryList">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>
                        <n-space>
                            <n-button @click="toUpdate(category)">修改</n-button>
                            <n-button @click="confirmDel(category)" type="error">删除</n-button>
                        </n-space>
                    </td>
                </tr>
            </tbody>
        </n-table>

        <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
            <template #header>
                <div>添加分类</div>
            </template>
            <div>
                <n-input v-model:value="addCategory.name" type="text" placeholder="请输入分类名称" />
            </div>
            <template #action>
                <div>
                    <n-button type="primary" @click="add">确定</n-button>
                </div>
            </template>
        </n-modal>

        <n-modal v-model:show="showUpdateModal" preset="dialog" title="Dialog">
            <template #header>
                <div>修改分类</div>
            </template>
            <div>
                <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入分类名称" />
            </div>
            <template #action>
                <div>
                    <n-button type="primary" @click="update">确定</n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { AdminStore } from "../../stores/AdminStore";
import { useRouter, useRoute } from "vue-router";

const axios = inject("axios");
const message = inject("message");
const dialog = inject("dialog");

const router = useRouter();
const route = useRoute();

const adminStore = AdminStore();

const showAddModal = ref(false);
const showUpdateModal = ref(false);
const categoryList = ref([]);
const addCategory = reactive({
    name: ""
});
const updateCategory = reactive({
    id: 0,
    name: ""
});

onMounted(() => {
    loadData();
});

const loadData = async () => {
    let result = await axios.get("/category/list");
    categoryList.value = result.data.data;
};

const add = async () => {
    let result = await axios.post("/category/_token/add", {
        name: addCategory.name
    });
    if (result.data.code === 200) {
        message.success("添加成功");
        loadData();
    } else {
        message.error(result.data.msg);
    }
    showAddModal.value = false;

};

const confirmDel = async (category) => {
    dialog.warning({
        title: '警告',
        content: '是否要删除',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            del(category);
        },
        onNegativeClick: () => {
        }
    })
};

const del = async (category) => {
    let result = await axios.delete(`/category/_token/delete?id=${category.id}`);
    if (result.data.code === 200) {
        message.success("删除成功");
        loadData();
    } else {
        message.error(result.data.msg);
    }
};

const toUpdate = async (category) => {
    showUpdateModal.value = true;

    updateCategory.id = category.id;
    updateCategory.name = category.name;
};

const update = async () => {
    let result = await axios.put("/category/_token/update", {
        id: updateCategory.id,
        name: updateCategory.name
    });
    if (result.data.code === 200) {
        message.success("修改成功");
        loadData();
    } else {
        message.error(result.data.msg);
    }
    showUpdateModal.value = false;
};


</script>

<style lang="scss" scoped>

</style>