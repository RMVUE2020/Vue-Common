<template>
    <el-select filterable v-model="value" @change="change" :placeholder="data.placeholder">
        <el-option 
        v-for="item in options" 
        :key="item.id" 
        :value="item.id"
        :label="item.poolAccount"
        >
        </el-option>
    </el-select>
</template>

<script>
// API
import { PoolList } from "@/api/pool";
export default {
    name: "",
    data(){
        return {
            value: "",
            options: []
        }
    },
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        init: {
            type: [Number, String],
            default: ""
        }
    },
    beforeMount(){ this.getPoolList(); },
    methods: {
        getPoolList(){
            PoolList().then(response => {
                this.options = response.data.lists;
            })
        },
        change(value){
            this.$emit("update:value", value);
        },
        clear(){ this.value = ""; }
    },
    watch: {
        data: {
            handler(newValue) {
                console.log(newValue)
            },
            immediate: true
        },
        init: {
            handler(newValue) {
                this.value = newValue;
            },
            immediate: true
        }
    }
}
</script>

<style>

</style>