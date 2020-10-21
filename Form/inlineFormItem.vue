<template>
    <div class="flex-box" :key="data.prop">
        <div class="label-col" :style="{width: labelWidth}">
            <span v-if="data.required" style="color: #F56C6C;">*</span>
            <span :style="data.styleCss">{{ data.label }}</span>
        </div>
        <div class="wrap-col">
            <el-row :gutter="15">
                <el-col :span="data.colSpan" v-for="inline_form in data.inlineFormItem" :key="inline_form.prop" >
                    <el-form-item :label="inline_form.label" :prop="inline_form.prop" :rules="inline_form.rules" :class="{noLabel: inline_form.noLabel}">
                        <!-- Input-->
                        <template v-if="inline_form.type === 'Input'">
                            <div v-if="formMode === 'views'">{{ formData[inline_form.prop] }}</div>
                            <el-input v-else v-model.trim="formData[inline_form.prop]" :maxlength="inline_form.max" :minlength="inline_form.min" :placeholder="inline_form.placeholder" :rules="inline_form.rules" :style="{width: inline_form.width}" :disabled="inline_form.disabled"></el-input>
                        </template>
                        <!-- Input-->
                        <template v-if="inline_form.type === 'Text'">
                            <div>{{ inline_form.label }}{{ formData[inline_form.prop] }}</div>
                        </template>
                        <!-- InputNumber -->
                        <template v-if="inline_form.type === 'InputNumber'">
                            <div v-if="formMode === 'views'">{{ formData[inline_form.prop] }}</div>
                            <el-input-number v-else v-model="formData[inline_form.prop]" controls-position="right" :min="inline_form.min || 0" :max="inline_form.max || 100000" :placeholder="inline_form.placeholder" :style="{width: inline_form.width}" :disabled="inline_form.disabled" @blur="inputNumberBlur(inline_form)" @change="inline_form.handler && inline_form.handler(formData[inline_form.prop])"></el-input-number>
                        </template>
                        <!-- 图片上传 -->
                        <template v-if="inline_form.type === 'Upload'">
                            <img v-if="formMode === 'views'" :src="formData[inline_form.prop]" />
                            <Upload v-else :initImg="formData[inline_form.prop]" :value.sync="formData[inline_form.prop]"/>
                        </template>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import Upload from "../Upload";
export default {
  name: '',
  components: { Upload },
  props: {
    data: {
        type: Object,
        default: () => ({})
    },
    labelWidth: {
        type: String,
        default: ""
    },
    formMode: {
        type: String,
        default: ""
    },
    formData: {
        type: Object,
        default: () => {}
    },
  },
  data() {
    return {
    };
  },
  watch: {},
  computed: {},
  methods: {
    inputNumberBlur(data){
        const toFixed = data.toFixed
        if(toFixed) {
            this.formData[data.prop] = this.formData[data.prop].toFixed(toFixed)
        }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.flex-box {
    display: flex;
    .label-col {
        padding-right: 12px;
        line-height: 40px;
    }
    .wrap-col { flex: 1; }
}
</style>