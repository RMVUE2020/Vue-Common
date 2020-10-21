<template>
  <div>
    <!-- Input-->
    <template v-if="item.type === 'Input' && !formItemHide[item.prop]" >
        <div v-if="formMode === 'views'">{{ formData[item.prop] }}</div>
        <el-input v-else v-model.trim="formData[item.prop]" :maxlength="item.max" :minlength="item.min" :placeholder="item.placeholder" :style="{width: item.width || inputWidth}" :disabled="item.disabled"></el-input>
    </template>
    <!-- Textarea -->
    <template v-if="item.type === 'Textarea' && !formItemHide[item.prop]" >
        <div v-if="formMode === 'views'">{{ formData[item.prop] }}</div>
        <el-input type="textarea" :rows="item.rows || 3" v-else v-model.trim="formData[item.prop]" :maxlength="item.max" :minlength="item.min" :placeholder="item.placeholder" :style="{width: item.width}" :disabled="item.disabled"></el-input>
    </template>
    <!-- InputNumber -->
    <template v-if="item.type === 'InputNumber'">
        <div v-if="formMode === 'views'">{{ formData[item.prop] }}</div>
        <el-input-number v-else v-model="formData[item.prop]" controls-position="right" :min="item.min || 0" :max="item.max || 100000" :placeholder="item.placeholder" :style="{width: item.width}" :disabled="item.disabled" @blur="inputNumberBlur(item)" @change="item.handler && item.handler(formData[item.prop])"></el-input-number>
    </template>
    <!-- Select-->
    <template v-if="item.type === 'Select'">
        <div v-if="formMode === 'views'">{{ formData[item.prop] }}</div>
        <el-select v-else filterable v-model="formData[item.prop]" :placeholder="item.placeholder" :style="{width: item.width}" :disabled="item.disabled" @change="item.handler && item.handler(formData[item.prop])">
            <el-option v-for="selectItem in item.options" :key="selectItem.value || selectItem[item.select_vlaue]" :value="selectItem.value || selectItem[item.select_vlaue]" :label="selectItem.label || selectItem[item.select_label]"></el-option>
        </el-select>
    </template>
    <!-- 禁启用 -->
    <template v-if="item.type === 'Disabled'">
        <div v-if="formMode === 'views'">{{ formData[item.prop] }}</div>
        <el-radio-group v-else v-model="formData[item.prop]">
            <el-radio v-for="radio in radio_disabled" :label="radio.value" :key="radio.value">{{ radio.label }}</el-radio>
        </el-radio-group>
    </template>
    <!-- 单选 -->
    <template v-if="item.type === 'Radio'">
        <div v-if="formMode === 'views'">{{ formData[item.prop] }}</div>
        <el-radio-group v-else v-model="formData[item.prop]">
            <el-radio v-for="radio in item.options" :label="radio.value" :key="radio.value">{{ radio.label }}</el-radio>
        </el-radio-group>
    </template>
    <!-- 日期 -->
    <template v-if="item.type === 'Date'">
        <div v-if="formMode === 'views'">{{ formData[item.prop + '_start'] | fotmatDate(item.viewsValue) }} - {{ formData[item.prop + '_end'] | fotmatDate(item.viewsValue) }}</div>
        <el-date-picker v-else v-model="formData[item.prop]" :format="item.formatType" :value-format="item.valueType || 'yyyy-MM-dd'" :type="item.dateMode" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" @change="handlerData($event, item)"></el-date-picker>
    </template>
    <!-- 编辑器 -->
    <template v-if="item.type === 'Wangeditor'">
        <div v-if="formMode === 'views'" v-html="formData[item.prop]"></div>
        <Wangeditor ref="Wangeditor" v-else :value="formData[item.prop]" :content.sync="formData[item.prop]"/>
    </template>
    <!-- 图片上传 -->
    <template v-if="item.type === 'Upload'">
        <img :src="formData[item.prop]" v-if="formMode === 'views'" />
        <Upload v-else :initImg="formData[item.prop]" :value.sync="formData[item.prop]"/>
    </template>
    <!-- slot -->
    <slot v-if="item.type === 'Slot'" :name="item.slotName" />
    <!-- 额外的HTML -->
    <div v-else-if="item.type === 'InnerHTML'" :key="item.prop">
        <div :style="item.style">{{ item.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
</style>