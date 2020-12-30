<template>
  <div id="wangeditor">
    <div ref="editorElem"></div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  name: "Editor",
  data() {
    return {
      editor: null,
      editorContent: ''
    };
  },
  // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
  props: ['catchData'], // 接收父组件的方法
  mounted() {
    this.editor = new E(this.$refs.editorElem);
    //开启debug模式
    this.editor.customConfig.debug = true;
    this.editor.customConfig.uploadImgShowBase64 = false // base 64 存储图片，如果这个参数设置为true的话，就不用配置服务器端上传地址
    this.editor.customConfig.showLinkImg = false  //   禁止上传网络图片
    this.editor.customConfig.uploadImgServer = process.env.VUE_APP_FILE_UPLOAD + "/file/upload"// 这是服务器端上传图片的接口路径
    this.editor.customConfig.uploadFileName = 'file' // 后端接受上传文件的参数名
    this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
    this.editor.customConfig.uploadImgMaxLength = 6 // 限制一次最多上传 6张图片
    this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
    // 编辑器的事件，每次改变会获取其html内容
    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
      this.$emit("update:content", html);
    //   this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
    };
    this.editor.customConfig.menus = [
      // 菜单配置
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ];
    this.editor.customConfig.uploadImgHooks = {
      fail: (xhr, editor, result) => {
        // 插入图片失败回调
        console.log(xhr, editor,result)
      },
      success: (xhr, editor, result) => {
        // 图片上传成功回调
        console.log(xhr, editor)
      },
      timeout: (xhr, editor) => {
        // 网络超时的回调
        console.log(xhr, editor)
      },
      error: (xhr, editor) => {
        console.log(xhr, editor)
        // 图片上传错误的回调
      },
      customInsert: function (insertImg, result, editor) {
        var url = result.data.url;
        insertImg(url);
      }
    }





    this.editor.create(); // 创建富文本实例
  },
  methods: {
    clear(){
      this.editor.txt.html("")
    }
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  watch: {
    value: {
      handler(newValue){
        if(newValue) { this.editor.txt.html(newValue) }
      }
    }
  }
}
</script>