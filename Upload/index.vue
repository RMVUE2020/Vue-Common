<template>
    <el-upload
      class="avatar-uploader"
      list-type="picture-card"
      action="fakeaction"
      :show-file-list="fileList"
      :http-request="uploadSectionFile"
      :on-remove="handleRemove">
      <img v-if="imgUrl" :src="imgUrl" alt="" width="100%" height="100%">
      <i class="el-icon-plus"></i>
    </el-upload>
</template>

<script>
import { UploadFile } from "@/api/common";
export default {
  name: 'Upload',
  components: {},
  props: {
    fileList: {
      type: Boolean,
      default: false
    },
    initImg: {
      type: String,
      default: ""
    }
  },
  watch: {
    initImg: {
      handler(newValue){
        newValue && (this.imgUrl = newValue)
      }
    },
  },
  data() {
    return {
        dialogImageUrl: '',
        imgUrl: ""
    };
  },
  computed: {},
  methods: {
    uploadSectionFile(params) {
      const file = params.file,
        fileType = file.type,
        isImage = fileType.indexOf("image") != -1,
        isLt2M = file.size / 1024 / 1024 < 2;
      // 这里常规检验，看项目需求而定
      if (!isImage) {
        this.$message.error("只能上传图片格式png、jpg、gif!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("只能上传图片大小小于2M");
        return;
      }
      // 根据后台需求数据格式
      const form = new FormData();
      // 文件对象
      form.append("file", file);
      // 本例子主要要在请求时添加特定属性，所以要用自己方法覆盖默认的action
      form.append("clientType", 'xxx');
      // 项目封装的请求方法，下面做简单介绍
      UploadFile(form).then(response => {
         const data = response.data;
         this.imgUrl = data.url;
         this.$emit("update:value", this.imgUrl);
      })
      .catch(() => {
        // xxx
      });
    },
    handleRemove(){

    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss">
.avatar-uploader {
  
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 150px;
    max-width: 100%;
    height: 150px;
    line-height: 150px;
    font-size: 20px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>