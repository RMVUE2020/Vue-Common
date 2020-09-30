<template>
    <div>
        <SearchForm 
            v-if="table_config.form_search"
            :tableData="table_data" 
            :formItme="table_config.form_item" 
            :formHandler="table_config.form_handler" 
            :formConfig="table_config.form_config" 
            :formItemHide="table_config.form_hide" 
            @callbackComponent="callbackComponent" 
        />
        <slot name="other"></slot>
        <el-table ref="table" v-loading="loading_table" element-loading-text="加载中" :data="table_data" border style="width: 100%">
            <el-table-column v-if="table_config.checkbox" type="selection" width="35"></el-table-column>
            <template v-for="item in this.table_config.thead">
                <!--回调-->
                <el-table-column v-if="item.type === 'function'" :key="item.prop" :prop="item.prop" :label="item.label">
                    <template slot-scope="scope">
                        <span v-html="item.callback && item.callback(scope.row, item.prop)"></span>
                    </template>
                </el-table-column>
                <!--插槽slot-->
                <el-table-column v-else-if="item.type === 'slot'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <slot :name="item.slotName" :data="scope.row"></slot>
                    </template>
                </el-table-column>
                <!--图标显示 -->
                <el-table-column v-else-if="item.type === 'image'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <img :src="scope.row.imgUrl" :width="item.imgWidth || 50" alt="" />
                    </template>
                </el-table-column>
                <!--操作 -->
                <el-table-column v-else-if="item.type === 'operation'" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width">
                    <template slot-scope="scope">
                        <slot :name="item.slotName" :data="scope.row"></slot>
                        <el-button v-if="item.deleteButton" size="small" @click="handlerDel(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
                <!--纯文本渲染-->
                <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label"></el-table-column>
            </template>
        </el-table>
        <el-row class="padding-top-30">
            <el-col :span="4"><div style="padding: 5px;"></div></el-col>
            <el-col :span="20">
                <el-pagination
                    v-if="table_config.pagination"
                    class="pull-right"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>
<script>
// 组件
import SearchForm from "../FormSearch";
import { GetTableData, Delete, Export } from "@/api/common";
export default {
    name: "TableComponent",
    components: { SearchForm },
    data(){
        return {
            // 加载标记
            request_flag: true,
            // 加载提示
            loading_table: false,
            // tableData
            table_data: [],
            table_config: {
                thead: [],
                checkbox: true,
                url: "",
                pagination: true,
                data: {},
                data_backup: {},
                // 加载完成后回调
                onload: false,
                // search_form
                form_type: "default",
                form_item: [],
                form_handler: [],
                form_config: {},
                form_hide: {},
                form_search: true
            },
            // 页码
            total: 0,
            // 当前页码
            currentPage: 1,
            // 数据ID
            rowId: "",
            //
        }
    },
    beforeMount(){},
    methods: {
        // 组件回调
        callbackComponent(params){
            this[params.function] && this[params.function](params.data);

        },
        // 搜索
        search(data){
            // 获取 table 列表请求的参数
            const requestData = JSON.parse(JSON.stringify(this.table_config.data_backup));
            delete requestData.page;
            delete requestData.pageSize;
            if(JSON.stringify(requestData) !== "{}") {
                for(let key in requestData) {
                    data[key] = requestData[key]
                }
            }
            this.requestData(data)
        },
        // 导出
        exportFile(data){
            let requestData = {
                url: this.table_config.url + 'ExportFile',
                data: Object.assign(data, this.table_config.data),
            }
            Export(requestData).then(response => {
                const file = response.data;
                file && this.gFileDown(file);
            })
        },
        /** table config */
        initConfig(){
            const config = JSON.parse(JSON.stringify(this.table_config));
            for(let key in this.config) {
                if(Object.keys(config).includes(key)) {
                    config[key] = this.config[key]
                    // 备份搜索数据
                    if(key === "data") {
                        config.data_backup = this.config[key];
                    }
                }
            }
            this.table_config = config;
            // 配置完成后开始读取接口数据
            this.loadData();
        },
        loadData(){

            // url 不存在时不请求接口
            if(!this.table_config.url) { return false; }
            let requestData = {
                url: this.table_config.url,
                data: this.table_config.data,
            }
            this.loading_table = true;
            GetTableData(requestData).then(response => {
                const data = response.data;
                // 判断数据是否存在
                if(data.lists) { this.table_data = data.lists }
                if(!data.lists) { this.table_data = [] }
                this.total = data.count;
                this.loading_table = false;
                // 加载完成后回调
                if(this.table_config.onload) { 
                    this.$emit("callbackComponent", {
                        function: "onload",
                        data 
                    })
                }
            }).catch(error => {
                this.loading_table = false;
            })
        },
        requestData(params = ""){
            if(params) {
                // 处理业务逻辑
                this.table_config.data = params;
            }
            this.loadData();
        },
        /** 页码 */
        handleSizeChange(val){
            this.table_config.data.pageSize = val;
            this.loadData();
        },
        handleCurrentChange(val){
            this.table_config.data.page = val;
            this.loadData();
        },
        /** 删除 */
        handlerDel(id){
            this.$confirm('确认删除此信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.rowId = id;
                this.delete();
            }).catch(error => {
                this.rowId = "";
            })
        },
        delete(){
            let requestData = {
                url: `${this.table_config.url}Delete`,
                method: "DELETE",
                data: { id: parseInt(this.rowId) },
            }
            Delete(requestData).then(response => {
                console.log(response)
                this.$message({
                    type: "success",
                    message: response.message
                })
                this.loadData();
            }).catch(error => {
            })
        }
    },
    props: {
        config: {
            type: Object,
            default: () => {}
        },
        searchFormConfig: {
            type: Object,
            default: () => {}
        },
    },
    watch: {
        config: {
            handler(newValue) {
                this.initConfig();
            },
            immediate: true
        },
        "$store.state.global.tableOnloadFlag": {
            handler(newValue){
                this.loadData()
            }
        }
    }
}
</script>
<style lang="scss" scoped>

</style>