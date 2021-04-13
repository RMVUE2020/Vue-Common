<template>
  <div class="upload-wrap">
    <i class="clear" @click="clearUplaodFile"></i>
    <el-upload
      ref="upload"
      class="avatar-uploader"
      list-type="picture-card"
      action="fakeaction"
      :show-file-list="fileList"
      :http-request="uploadSectionFile"
      :on-remove="handleRemove">
      <img v-if="imgUrl" :src="imgUrl" alt="" width="100%" height="100%">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
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
        this.imgUrl = newValue
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
    // 清除文件
    clearUplaodFile(){
      this.$refs.upload.clearFiles();
      this.imgUrl = "";
      this.$emit("update:value", "");
    },
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
<style lang="scss" scoped>
.upload-wrap {
  display: inline-block;
  position: relative;
  max-width: 100%;
  &:hover {
    .clear { display: block; }
  }
  .clear {
    display: none;
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 10;
    width: 14px;
    height: 14px;
    border-radius: 100px;
    cursor: pointer;
    background-color: #000;
    &:before, &:after {
      display: block;
      content: "";
      position: absolute;
      left: 7px;
      top: 3px;
      height: 8px;
      border-right: 1px solid #fff;
    }
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }
}
</style>
<style lang="scss">
.avatar-uploader {
  max-width: 100%;
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