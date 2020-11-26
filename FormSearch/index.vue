<template>
    <el-form inline ref="form" :model="form_data">
        <el-form-item v-for="item in formItme" :key="item.prop" :prop="item.prop" :rules="item.rules" :class="{noLabel: item.noLabel}">
            <!-- Username-->
            <el-input ref="username" v-if="item.type === 'Username'" v-model.trim="form_data[item.prop]" :placeholder="item.placeholder" :style="{width: item.width || 'auto'}"></el-input>
            <!-- Input-->
            <el-input v-if="item.type === 'Input'" v-model.trim="form_data[item.prop]" :placeholder="item.placeholder" :style="{width: item.width || 'auto'}"></el-input>
            <!-- Select-->
            <el-select v-if="item.type === 'Select'" filterable v-model="form_data[item.prop]" :placeholder="item.placeholder"  :style="{width: item.width || 'auto'}">
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :value="selectItem.value" :label="selectItem.label"></el-option>
            </el-select>
            <!-- 日期 -->
            <el-date-picker v-if="item.type === 'Date'" v-model="form_data[item.prop]" :format="item.formatType" :value-format="item.valueType || 'yyyy-MM-dd'" :type="item.dateMode" range-separator="至" :start-placeholder="item.startPlaceholder || '开始日期'" :end-placeholder="item.endPlaceholder|| '结束日期'" @change="handlerData(item)"></el-date-picker>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="primary" @click="reset" v-if="form_config.resetButton">重置</el-button>
            <template v-if="formHandler && formHandler.length > 0">
                <template v-for="item in formHandler">
                    <el-button v-if="item.element === 'button'" :disabled="item.disabled" :key="item.key" :type="item.type" @click="item.handler && item.handler()">
                        {{ item.label }}
                    </el-button>
                    <router-link :to="item.link" v-if="item.element === 'link'" :key="item.key" style="margin: 0 10px;">
                        <el-button :disabled="item.disabled"  :type="item.type" @click="item.handler && item.handler()">
                            {{ item.label }}
                        </el-button>
                    </router-link>
                    <el-button v-if="item.element === 'export'" :disabled="item.disabled" :key="item.key" :type="item.type" @click="handerlExport">
                        {{ item.label }}
                    </el-button>
                </template>
            </template>
        </el-form-item>
    </el-form>
</template>
<script>
// mixins
export default {
    name: "Form",
    components: {},
    data(){
        return {
            form_config: {
                resetButton: true
            },
            form_data: {},
            // 日期参数
            date: {}
        }
    },
    methods: {
        search(){
            // 拷贝数据
            const data = JSON.parse(JSON.stringify(this.form_data));
            // 用户ID
            if(this.$refs.username) { 
                data.user_id = this.handlerUsername();
            }
            // 搜索数据过滤
            const searchData = {
                pageSize: 10,
                page: 1
            }
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
            const data = JSON.parse(JSON.stringify(this.form_data));
            for(let key in data) {
                if(key.indexOf("time") != -1) {
                    this.form_data[key] = ""
                }
            }
            this.$emit("callbackComponent", {
                function: "search",
                data: { page: 1, pageSize: 10 }
            })
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
        /** table config */
        initConfig(){
            for(let key in this.formConfig) {
                if(Object.keys(this.form_config).includes(key)) {
                    this.form_config[key] = this.formConfig[key]
                }
            }
        },
        selectOptions(data){
            const options = data.options;
            data.options = this.$store.state.config[data.options];
        },
        /**
         * 对象数据处理
         */
        handlerUsername(){
            return this.form_data.user_id;
            /** 去除原业务需求 */
            // if(!this.form_data.username) { return ""; }
            // const data = this.tableData.filter(item => item.username == this.form_data.user_id);
            // return (data.length > 0) ? data[0].user_id : this.form_data.user_id;
        },
        handlerData(item){
            // 参数不存在时
            if(!item.prop || !item.felid_start || !item.felid_end) { return false; }
            // 获取时间
            const date = this.form_data[item.prop];
            this.form_data[item.felid_start] = date ? date[0] : "";
            this.form_data[item.felid_end] = date ? date[1] : "";
        },
        /** 导出 */
        handerlExport(){
            // 拷贝数据
            const data = JSON.parse(JSON.stringify(this.form_data));
            // 用户ID
            if(this.$refs.username) { 
                data.user_id = this.handlerUsername();
            }
            // 搜索数据过滤
            const searchData = {}
            for(let key in data) {
                if(data[key]) {
                    searchData[key] = data[key]
                }
            }
            this.$emit("callbackComponent", {
                function: "exportFile",
                data: searchData
            })
        }
    },
    
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
        // 配置
        formConfig: {
            type: Object,
            default: () => ({})
        },
        // 表格数据
        tableData: {
            type: Array,
            default: () => ([])
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

</style>