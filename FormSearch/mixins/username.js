const UsernameMixins = {
    data(){
        return {
         
        }
    },
    methods: {
        usernameInput(val){
            const data = this.tableData.filter(item => item.username == val);
            return (data.length > 0) ? data[0].user_id : "";
        },
        handlerData(item){
            console.log(item)
        }
    }
}
export default UsernameMixins;