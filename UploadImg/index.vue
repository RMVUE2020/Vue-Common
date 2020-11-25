<template>
    <el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      :on-remove="handleRemove">
      <img v-if="imgUrl" :src="imgUrl" alt="" width="100%" height="100%">
      <i class="el-icon-plus"></i>
    </el-upload>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    listType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
        dialogImageUrl: '',
    };
  },
  watch: {},
  computed: {},
  methods: {
      handleRemove(){

      }
  },
  created() {},
  mounted() {},
  props: {
    imgUrl: {
      type: String,
      default: ""
    }
  }
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