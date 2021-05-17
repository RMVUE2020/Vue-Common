<template>
    <el-select filterable v-model="value" @change="change" :placeholder="data.placeholder">
        <el-option 
        v-for="item in options" 
        :key="item.id" 
        :value="item.id"
        :label="item.name"
        >
        </el-option>
    </el-select>
</template>

<script>
// API
import { TeamList } from "@/api/common";
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
        }
    },
    beforeMount(){ this.getTeamList(); },
    methods: {
        getTeamList(){
            TeamList().then(response => {
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
        }
    }
}
</script>

<style>

</style>