const dialog = {
    data(){
        return {
            dialogVisible: false
        }
    },
    methods: {
        closed(){
            this.dialogVisible = false;
            this.$emit("update:showFlag", false);
        }
    },
    props: {
        showFlag: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        showFlag: {
            handler(newValue){
                this.dialogVisible = newValue
            }
        }
    }
}
export default dialog;