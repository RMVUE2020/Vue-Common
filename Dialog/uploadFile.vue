<template>
  <el-dialog title="文件上传" :visible.sync="dialogVisible" @closed="closed" @open="open" width="500px" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-upload
        class="upload-demo"
        drag
        action="fakeaction"
        :disabled="disabled"
        :http-request="uploadSectionFile"
        :on-remove="handleRemove">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="loading" :class="{'show': loading}">
          <div>
            <i class="el-icon-loading"></i>
            <p style="font-size: 14px;">上传中...</p>
          </div>
        </div>
    </el-upload>
  </el-dialog>
</template>

<script>
// mixins
import DialogMixins from "./index";
// API
import { UploadFile } from "@/api/common";
export default {
    name: "",
    mixins: [DialogMixins],
    components: {},
    data() {
        return {
            disabled: false,
            loading: false
        };
    },
    props: {
      target: {
        type: String,
        default: ""
      }
    },
    computed: {},
    created() {},
    beforeMount() {},
    methods: {
      open(){},
      // 清除文件
      clearUplaodFile(){
        this.$refs.upload.clearFiles();
        this.imgUrl = "";
        this.$emit("update:value", "");
      },
      uploadSectionFile(params) {
        console.log(params.file.type)
        const file = params.file, 
              fileType = file.name, 
              isImage = fileType.indexOf("xls") != -1;
        // 这里常规检验，看项目需求而定
        if (!isImage) {
          this.$message.error("只能上传图片格式png、jpg、gif!");
          return;
        }
        // 根据后台需求数据格式
        const form = new FormData();
        // 文件对象
        form.append("file", file);
        // 特定属性，所以要用自己方法覆盖默认的action
      // form.append("clientType", 'xxx');
        this.disabled = this.loading = true;
        UploadFile({form, url: this.target}).then(response => {
          this.closed();
          this.$store.commit("global/SET_TABLE_LOAD");
          this.disabled = this.loading = false;
        })
        .catch(() => {
          this.disabled = this.loading = false;
        });
      },
      handleRemove(){

      }
    }
};
</script>
<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background-color: rgba(255, 255, 255, .8);
  &.show {
    display: flex;
  }
}
</style>