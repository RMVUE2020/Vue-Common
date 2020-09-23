<template>
    <div class="flex-box">
        <div class="wrap-col">
            <el-form inline ref="form" :model="form_data" class="el-form-inline-col">
            <el-row :gutter="15">
                <el-col :span="item.spanCol || form_config.spanCol" v-for="item in formItme" :key="item.prop">
                    <el-form-item :prop="item.prop" :rules="item.rules" :class="{noLabel: item.noLabel}" style="width: 100%;">
                        <!-- Input-->
                        <el-input v-if="item.type === 'Input'" v-model.trim="form_data[item.prop]" :placeholder="item.placeholder" style="width: 100%;"></el-input>
                        <!-- Select-->
                        <el-select v-if="item.type === 'Select'" filterable v-model="form_data[item.prop]" :placeholder="item.placeholder" style="width: 100%;">
                            <el-option v-for="selectItem in item.options" :key="selectItem.value" :value="selectItem.value" :label="selectItem.label"></el-option>
                        </el-select>
                        <!-- 日期 -->
                        <template v-if="item.type === 'Date'">
                            <el-date-picker v-model="form_data[item.prop]" :format="item.formatType" :value-format="item.valueType || 'yyyy-MM-dd'" :type="item.dateMode" range-separator="至" :start-placeholder="item.startPlaceholder || '开始日期'" :end-placeholder="item.endPlaceholder|| '结束日期'"></el-date-picker>
                        </template>
                    </el-form-item>
                </el-col>
            </el-row>
            </el-form>
        </div>
        <div class="button-col">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="reset" v-if="form_config.resetButton">重置</el-button>
            <template v-if="formHandler && formHandler.length > 0">
                <template v-for="item in formHandler">
                    <el-button v-if="item.element === 'button'" :key="item.key" :type="item.type" @click="item.handler && item.handler()">
                        {{ item.label }}
                    </el-button>
                    <el-button v-if="item.element === 'link'" :key="item.key" :type="item.type" @click="item.handler && item.handler()">
                        <router-link :to="item.link">{{ item.label }}</router-link>
                    </el-button>
                </template>
            </template>
        </div>
    </div>
</template>
<script>
// 省市区
export default {
    name: "Form",
    components: {},
    props: {
        formItme: {
            type: Array,
            default: () => []
        },
        // 按钮
        formHandler: {
            type: Array,
            default: () => []
        },
        // 按钮
        formConfig: {
            type: Object,
            default: () => ({})
        }
    },
    data(){
        return {
            form_config: {
                resetButton: true,
                spanCol: 6
            },
            form_data: {}
        }
    },
    methods: {
        search(){
            // 拷贝数据
            const data = JSON.parse(JSON.stringify(this.form_data));
            const searchData = {}
            for(let key in data) {
                if(data[key]) {
                    searchData[key] = data[key]
                }
            }
            this.$emit("callbackComponent", {
                function: "search",
                data: searchData
            })
        },
        reset(){
            this.$refs.form.resetFields();
            this.$emit("callbackComponent", {
                function: "search"
            })
        },
        /** table config */
        initConfig(){
            for(let key in this.formConfig) {
                if(Object.keys(this.form_config).includes(key)) {
                    this.form_config[key] = this.formConfig[key]
                }
            }
        },
        initFormData(){
            const propItem = {};
            this.formItme.forEach(item => {
                // 字段处理
                propItem[item.prop] = ""
                // 下拉选择
                if(item.type === "Select") { this.selectOptions(item); }
                // 自定义检验规则
                if(item.validator) { item.rules = item.validator; }
            })
            // 更新字段
            this.form_data = propItem;
        },
        selectOptions(data){
            const options = data.options;
            data.options = this.$store.state.config[data.options];
        }
    },
    watch: {
        formItme: {
            handler(newValue){
                this.initFormData()
            },
            immediate: true
        },
        formConfig: {
            handler(newValue) {
                if(JSON.stringify(newValue) === "{}") { return false; }
                this.initConfig();
            },
            immediate: true
        },
    }
}
</script>
<style lang="scss" scoped>
.flex-box {
    display: flex;
    .wrap-col { flex: 1; }
    .button-col {
        padding-left: 15px;
    }
}
</style>
<style lang="scss">
.el-form-inline-col.el-form--inline .el-form-item__content { width: 100%; }
</style>