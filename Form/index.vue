<template>
    <el-form ref="form" :model="formData" :label-width="labelWidth" :label-position="labelPosition">
        
        <template v-for="item in formItme" >
            <template v-if="!formItemHide[item.prop]">
                <el-form-item v-if="!item.inlineFormItem" :key="item.prop" :label="item.label" :prop="item.prop" :rules="item.rules" :class="{noLabel: item.noLabel}">
                    <!-- Input-->
                    <template v-if="item.type === 'Input' && !formItemHide[item.prop]" >
                        <div v-if="formMode === 'views'">{{ formData[item.prop] }}</div>
                        <el-input v-else v-model.trim="formData[item.prop]" :maxlength="item.max" :minlength="item.min" :placeholder="item.placeholder" :style="{width: item.width || inputWidth}" :disabled="item.disabled" v-on:input="item.handler && (item.handlerEevnt ? item.handlerEevnt(formData[item.prop], item) : inputEnter(item))"></el-input>
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
                        <slot v-if="item.slot" name="InputNumber" />
                    </template>
                    <!-- Site 场地 -->
                    <template v-if="item.type === 'Site'">
                        <Site :init="formData[item.prop]" :value.sync="formData[item.prop]" :data="item"/>
                    </template>
                    <!-- 矿池帐号 -->
                    <template v-if="item.type === 'Pool'">
                        <Pool :init="formData[item.prop]" :value.sync="formData[item.prop]" :data="item"/>
                    </template>
                    <!-- Select-->
                    <template v-if="item.type === 'Select'">
                        <div v-if="formMode === 'views'">{{ formData[item.prop] }}</div>
                        <template v-else>
                            <el-select v-if="item.options" filterable v-model="formData[item.prop]" :placeholder="item.placeholder" :style="{width: item.width}" :disabled="item.disabled" @change="item.handler && item.handler(formData[item.prop])">
                                <el-option v-for="selectItem in selectOptions(item)" :key="selectItem.value || selectItem[item.select_vlaue]" :value="selectItem.value || selectItem[item.select_vlaue]" :label="selectItem.label || selectItem[item.select_label]"></el-option>
                            </el-select>
                            <template v-else>{{ item.handlerApi && item.handlerApi(item) }}</template>
                            <slot v-if="item.slotName" :name="item.slotName" />
                        </template>
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
                            <template v-if="item.options">
                                <el-radio v-for="radio in item.options" :label="radio.value || radio[item.props.value]" :key="radio.value || radio[item.props.value]">{{ radio.label || radio[item.props.label] }}</el-radio>
                            </template>
                            <template v-else>
                                {{ item.handlerApi && item.handlerApi(item) }}
                            </template>
                        </el-radio-group>
                    </template>
                    <!-- 多选 -->
                    <template v-if="item.type === 'Checkbox'">
                        <div v-if="formMode === 'views'">{{ formData[item.prop] }}</div>
                        <el-checkbox-group v-else v-model="formData[item.prop]">
                            <template v-if="item.options">
                                <el-checkbox v-for="checkbox in item.options" :key="checkbox.id" :label="item.props ? checkbox[item.props.value] : checkbox.value" >{{ item.props ? checkbox[item.props.label] : checkbox.label }}</el-checkbox>
                            </template>
                            <template v-else>
                                {{ item.handlerApi && item.handlerApi(item) }}
                            </template>
                        </el-checkbox-group>
                    </template>
                    <!-- 日期 -->
                    <template v-if="item.type === 'Date'">
                        <div v-if="formMode === 'views'">{{ formData[item.prop + '_start'] | fotmatDate(item.viewsValue) }} - {{ formData[item.prop + '_end'] | fotmatDate(item.viewsValue) }}</div>
                        <el-date-picker v-else v-model="formData[item.prop]" :picker-options="item.pickerOptions || false" :disabled="item.disabled" :format="item.formatType" :value-format="item.valueType || 'yyyy-MM-dd'" :type="item.dateMode" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" @change="handlerData($event, item)" :style="{width: item.width}" ></el-date-picker>
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
                </el-form-item>
                <template v-else>
                    <InlineFormItem :data="item" :formMode="formMode" :labelWidth="labelWidth" :formData="formData" :key="item.prop" />
                </template>
            </template>
        </template>
        <!-- 按钮 -->
        <el-form-item v-if="formMode !== 'views'">
            <template v-for="item in formHandler">
                <el-button v-if="item.element === 'button'" :key="item.key" :type="item.type" @click="item.handler && item.handler()">
                    {{ item.label || "确定" }}
                </el-button>
                <el-button v-if="item.element === 'link'" :key="item.key" :type="item.type">
                    <router-link :to="item.link">{{ item.label || "返回" }}</router-link>
                </el-button>
            </template>
        </el-form-item>
    </el-form>
</template>
<script>
import Wangeditor from "../Wangeditor";
import Upload from "../Upload";
import InlineFormItem from "./inlineFormItem";
import Site from "../select/site";
import Pool from "../select/pool";
// utils/format
import { dateTime } from "@/utils/format";
export default {
    name: "Form",
    components: { Wangeditor, Upload, InlineFormItem, Site, Pool },
    props: {
        labelWidth: {
            type: String,
            default: "120px"
        },
        formData: {
            type: Object,
            default: () => ({})
        },
        formItme: {
            type: Array,
            default: () => ([])
        },
        formItemHide: {
            type: Object,
            default: () => ({})
        },
        // 按钮
        formHandler: {
            type: Array,
            default: () => ([])
        },
        // 模式
        formMode: {
            // views查看模式
            type: String,
            default: ""
        },
        // label 位置
        labelPosition: {
            // views查看模式
            type: String,
            default: "left"
        },
        // input width
        inputWidth: {
            type: String,
            default: "100%"
        }
    },
    filters: {
        fotmatDate(val, params){
            if(!val) { return ""; }
            if(!params) { params = {}; }
            params.value = val;
            return dateTime(params);
        }
    },
    data(){
        return {
            // 禁启用数据 
            radio_disabled: this.$store.state.config.radio_disabled,
            type_msg: {
                "Input": "请输入",
                "Textarea": "请输入",
                "Radio": "请选择",
                "Select": "请选择",
                "Date": "请选择",
                "Upload": "请上传",
                "Wangeditor": "请填写",
                "InputNumber": "请填写",
            }
        }
    },
    methods: {
        initFormData(){
            this.formItme.forEach(item => {
                // rules 规则
                this.rules(item);
                // 自定义检验规则
                if(item.validator) { item.rules = item.validator; }
            })
        },
        rules(item){
            item.inlineFormItem && item.inlineFormItem.length > 0 ? this.subItemRules(item) : this.itemRules(item);
        },
        itemRules(item){
            const requiredRules = [{ required: true, message: item.required_msg || `${this.type_msg[item.type]}${item.label}`, trigger: 'change' }];
            if(item.required) {
                if(item.rules && item.rules.length > 0) {
                    item.rules = requiredRules.concat(item.rules);
                }else{
                    item.rules = requiredRules;
                }
            }
            
        },
        subItemRules(item){
            item.inlineFormItem.forEach(elem => {
                elem.inlineFormItem && elem.inlineFormItem.length > 0 ? this.subItemRules(elem) : this.itemRules(elem);
            })
        },
        reset(){
            this.$refs.form.resetFields();
            if(this.$refs.Wangeditor && this.$refs.Wangeditor.length > 0) {
                this.$refs.Wangeditor.forEach(item => {
                    item.clear();
                })
            }
        },
        /** 日期处理 */
        handlerData(event, item){
            // 双日期范围处理
            if(!item.felid_start || !item.felid_end) { return false; }
            // 获取时间
            if(item.dateMode === "daterange") {
                let startTime = event ? event[0] : "";
                let endTime = event ? event[1] : "";
                this.formData[item.felid_start] = startTime;
                this.formData[item.felid_end] = endTime;
            }
            // 是否有回调
            if(item.callback) { item.callback(); }
        },
        inputNumberBlur(data){
            const toFixed = data.toFixed
            if(toFixed) {
                this.formData[data.prop] = this.formData[data.prop].toFixed(toFixed)
            }
        },
        /** 下拉菜单选项 */
        selectOptions(params){
            let options = params.options;
            // 指定项的匹配
            let optionsArr = [];
            if(params.key && params.key.length > 0) {
                params.key.forEach(item => {
                    for(let key in options) {
                        if(key === item) {
                            optionsArr.push(options[key])
                        }
                    }
                })
            }else {
                optionsArr = options;
            }
            return optionsArr;
        },
        // 输入框
        inputEnter(data){
            if(data.lowercase) { this.handlerLowercase(data); }
        },
        handlerLowercase(data){
            this.formData[data.prop] = this.formData[data.prop].toLowerCase();
        }
    },
    watch: {
        formItme: {
            handler(newValue){
                this.initFormData()
            },
            immediate: true
        }
    }
}
</script>
<style lang="scss" scoped>

</style>