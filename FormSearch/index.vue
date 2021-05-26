<template>
    <el-form inline ref="form" :model="form_data">
        <el-form-item v-for="item in formItme" :key="item.prop" :prop="item.prop" :rules="item.rules" :class="{noLabel: item.noLabel}">
            <template v-if="!item.lang || item.lang === lang">
                <!-- Username-->
                <el-input ref="username" v-if="item.type === 'Username'" v-model.trim="form_data[item.prop]" :placeholder="item.placeholder" :style="{width: item.width || 'auto'}"></el-input>
                <!-- Input-->
                <el-input v-if="item.type === 'Input'" v-model.trim="form_data[item.prop]" :placeholder="item.placeholder" :style="{width: item.width || 'auto'}"></el-input>
                <!-- Select-->
                <template v-if="item.type === 'Select'">
                    <el-select v-if="item.options" filterable v-model="form_data[item.prop]" :placeholder="item.placeholder" @change="handlerSelect(item.prop)">
                        <el-option v-for="selectItem in item.options" :key="selectItem[item.select_value] || selectItem.value" :value="selectItem[item.select_value] || selectItem.value" :label="selectItem[item.select_label] || selectItem.label"></el-option>
                    </el-select>
                    <template v-else>{{ item.handlerApi && item.handlerApi(item) }}</template>
                </template>
                <!-- Site 场地 -->
                <template v-if="item.type === 'Site'">
                    <Site ref="site" :initImg="form_data[item.prop]" :value.sync="form_data[item.prop]" :data="item"/>
                </template>
                <!-- 矿池帐号 -->
                <template v-if="item.type === 'Pool'">
                    <Pool ref="pool" :initImg="form_data[item.prop]" :value.sync="form_data[item.prop]" :data="item"/>
                </template>
                <!-- 机器型号 -->
                <template v-if="item.type === 'Machine'">
                    <Machine  ref="machine" :initImg="form_data[item.prop]" :value.sync="form_data[item.prop]" :data="item"/>
                </template>
                <!-- 团号 -->
                <template v-if="item.type === 'Team'">
                    <Team  ref="team" :initImg="form_data[item.prop]" :value.sync="form_data[item.prop]" :data="item"/>
                </template>
                <!-- 日期 -->
                <el-date-picker v-if="item.type === 'Date'" v-model="form_data[item.prop]" :format="item.formatType" :value-format="item.valueType || 'yyyy-MM-dd'" :type="item.dateMode" range-separator="至" :start-placeholder="item.startPlaceholder || '开始日期'" :end-placeholder="item.endPlaceholder|| '结束日期'" @change="handlerData(item)"></el-date-picker>
            </template>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
            <template v-if="formItme.length > 0">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="primary" @click="reset" v-if="form_config.resetButton">重置</el-button>
            </template>
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
                    <el-button v-if="item.element === 'import'" :disabled="item.disabled" :key="item.key" :type="item.type" @click="handerlImport(item)">
                        {{ item.label }}
                        <UploadFile :showFlag.sync="upload_file_show" :target="upload_target" />
                    </el-button>
                </template>
            </template>
        </el-form-item>
    </el-form>
</template>
<script>
// 上传
import UploadFile from "../Dialog/uploadFile";
import Site from "../select/site";
import Pool from "../select/pool";
import Machine from "../select/machine";
import Team from "../select/team";
export default {
    name: "Form",
    components: { UploadFile, Site, Pool, Machine, Team },
    data(){
        return {
            // 语言
            lang: this.$store.state.app.lang,
            form_config: {
                resetButton: true
            },
            form_data: {},
            // 日期参数
            date: {},
            upload_file_show: false,
            upload_target: ""
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
            // 场地
            if(this.$refs.site) { this.$refs.site[0].clear(); }
            if(this.$refs.machine) { this.$refs.machine[0].clear(); }
            if(this.$refs.pool) { this.$refs.pool[0].clear(); }
            if(this.$refs.team) { this.$refs.team[0].clear(); }
        },
        initFormData(){
            const propItem = {};
            this.formItme.forEach(item => {
                // 字段处理
                propItem[item.prop] = ""
                // 下拉选择
                // if(item.type === "Select") { this.selectOptions(item); }
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
            let options = this.$store.state.config[data.options];
            // 指定项的匹配
            let optionsArr = [];
            if(data.key && data.key.length > 0) {
                data.key.forEach(item => {
                    for(let key in options) {
                        if(key === item) {
                            optionsArr.push(options[key])
                        }
                    }
                })
            }else {
                optionsArr = options;
            }
            // 语言处理
            const optionsLang = [];
            for(let key in optionsArr) {
                const obj = optionsArr[key];
                if(!obj.lang || obj.lang === this.lang) {
                    optionsLang.push(optionsArr[key])
                }
            }
            // 更新数据
            return optionsLang;
            data.options = optionsLang;
        },
        /** 下拉选项 */
        handlerSelect(type){
            const value = this.form_data[type];
            const options = this.$store.state.config[type][value].hidden_col;
            this.$emit("callbackComponent", {
                function: "tableColHiddenSwitch",
                data: options
            })
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
        handlerOption(data){
            if(!data) { return []; }
            const options = [];
            for(let key in data) {
                const obj = data[key];
                if(!obj.lang || obj.lang === this.lang) {
                    options.push(data[key])
                }
            }
            return options;
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
        },
        /** 导出 */
        handerlImport(data){
            this.upload_target = data.target;
            this.upload_file_show = true;
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