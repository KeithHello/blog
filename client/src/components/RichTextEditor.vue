<template>
  <div>
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      style="height: 400px; overflow-y: hidden"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, ref, shallowRef, onMounted, inject } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
// 去掉不要的编辑器功能
const toolbarConfig = {
    excludeKeys : ["uploadVideo"]
};
const editorConfig = { 
    placeholder: "请输入内容..." 
};
// 上传图片的服务端地址
const serverUrl = inject("serverUrl");
editorConfig.MENU_CONF = {
  uploadImage: {
    server: serverUrl + "/upload/rich_editor_upload",
    base64LimitSize: 10 * 1024, // 10K
  },
  insertImage: {
    parseImageSrc: (src) => {
      return src.indexOf("http") > -1 ? src : serverUrl + src;
    },
  },
};
const mode = ref("default");
// 内容 HTML
const valueHtml = ref("");

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:model-value"]);

let initFinished = false;

onMounted(() => {
  setTimeout(() => {
    valueHtml.value = props.modelValue;
    initFinished = true;
  }, 10);
});

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  //   console.log("change:", editorRef.value);
  if (initFinished) {
    emit("update:model-value", valueHtml.value);
  }
};
</script>

<style lang="scss" scoped></style>
