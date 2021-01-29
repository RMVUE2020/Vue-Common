<template>
  <div class="header-wrap">
    <header class="header">
      <div class="container clearfix">
        <h1 class="logo"><router-link to="/"><img :src="logo_img" /></router-link></h1>
        <nav class="nav-link">
          <ul>
            <li v-for="item in nav_menu" :value="item.value" :class="{active: item.link == current_menu}">
              <a v-if="item.tag == 'a'" :key="item.value" :href="item.link" target="_blank" class="pop-hover">
                {{ item.label }}
                <template v-if="item.value == 'app'"><PopContact dir="top" /></template>
              </a>
              <router-link v-else :to="item.link">{{ item.label }}</router-link>
            </li>
          </ul>
        </nav>
        <!-- 不存在 token -->
        <div class="user-info-wrap">
          <div class="account" v-if="!token">
            <a @click="toLogin('loginPtcn')" href="javascript: void(0);" class="button-ui button-ui-default button-ui-mini is-plain">
              <span>{{ $t('common.login') }}</span>
            </a>
            
            <span class="line"></span>
            <a @click="toLogin('registerPtcn')" href="javascript: void(0);" class="button-ui button-ui-primary button-ui-mini">
              <span>{{ $t('common.reg') }}</span>
            </a>
          </div>
          <!-- 存在 token -->
          <div v-else>
            <router-link to="/minerIndex" class="button-ui button-ui-default button-ui-mini button-ui-round is-plain">
              <span>{{ $t('common.machine') }}</span>
            </router-link>
            <div class="dis-ib user-menu">
              <div class="name">
                <i class="icon icon-username icon-size-16"></i>
                <span>{{ username | f_userName }}</span>
              </div>
              <ul>
                <router-link to="/incomeIndex" class="link">{{ $t('common.income') }}</router-link>
                <router-link to="/orderIndex" class="link">{{ $t('common.order') }}</router-link>
                <router-link to="/assetsIndex" class="link">{{ $t('common.assets') }}</router-link>
                <router-link to="/safeIndex" class="link">{{ $t('common.security') }}</router-link>
                <div class="link" @click="logout">{{ $t('common.logout') }}</div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { formatUserName } from "@/utils/common";
import PopContact from "@/components/Pop/popContact";
export default {
  name: 'Header',
  components: { PopContact },
  props: {},
  filters: {
    f_userName(val){
      return formatUserName(val);
    }
  },
  data() {
    return {
      username: this.$store.state.app.username,
      nav_menu: this.$store.state.app.nav_menu,
      logo_img: require("@/assets/logo.png")
    };
  },
  watch: {},
  computed: {
    token(){
      return this.$store.state.app.token;
    },
    current_menu(){
      const { path } = this.$route;
      return path;
    }
  },
  methods: {
    logo(type){
      if(!this.token) {
        this.toLogin(type);
      }else{
        const routerName = this.$route.name;
        // 处于首页阻止
        if(routerName === "Index") { return false; }
        // 转入首页
        this.$router.push({
          name: "Index"
        })
      }
    },
    handlerNav(data){
      this.current_menu = data.value;
      const tag = data.tag;
      const current_path = this.$route.path;
      console.log(data)
      if(tag === "a") {
        window.open(data.link)
      }else{
        if(current_path == data.router) { return false; }
        this.$router.push({
          path: data.router
        })
      }
    },
    toLogin(type){
      this.$store.dispatch("app/toLogin", type);
    },
    logout(){
      let routerName = this.$route.name;
      this.$store.dispatch("app/logoutAction", routerName).then(response => {
        if(response === false) {
          this.$router.replace({
            name: "Index"
          });
        }
      })
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "./header.scss";
</style>