<template>
    <footer>
        <div class="container">
            <div class="clearfix">
                <div class="pull-left">
                    <h1 class="logo"><img :src="logo_img" alt=""></h1>
                    <!-- <h5 class="title">ROCK MINER LIMITED (United Kingdom)</h5>
                    <address>
                        <span>Company Number: 12371118</span>
                        <span>Address: Churchill house 142-146 old street London England</span> 
                        <span>TEL: 0044+2082425577</span>
                    </address> -->
                </div>
                <div class="pull-left">
                    <div class="nav-item1">
                        <h5 class="item-column">{{ $t("footer.product") }}</h5>
                        <ul class="footer-nav">
                            <template v-for="item in nav_menu">
                                <template v-if="item.link !== '/'">
                                    <a v-if="item.tag == 'a'" :key="item.value" :href="item.link" target="_blank" class="pop-hover">
                                        <template v-if="item.value == 'app'"><PopContact /></template>
                                        <span>{{ item.label }}</span>
                                    </a>
                                    <router-link v-else :to="item.link" tag="a" class="pop-hover"><span>{{ item.label }}</span></router-link>
                                </template>
                            </template>
                        </ul>
                        
                    </div>
                </div>
                <div class="pull-right">
                    <div class="media">
                        <h5 class="item-column">联系我们</h5>
                        <ul class="media-list">
                            <li><a href="mailto:service@rockminer.com" class="icon footer-icon-email"></a></li>
                            <li><a target="_blnak" href="https://t.me/rockminerofficial" class="icon footer-icon-telegram"></a></li>
                            <li><a target="_blnak" href="https://twitter.com/RockMinerInc" class="icon footer-icon-twitter"></a></li>
                            <li><a target="_blnak" href="https://www.facebook.com/rockminerofficial/" class="icon footer-icon-facebook"></a></li>
                            <li><a target="_blnak" href="https://www.youtube.com/channel/UClCOdjS_EDGnZMZnGLtNpGQ" class="icon footer-icon-youtube"></a></li>
                            <li><a target="_blnak" href="https://medium.com/@rockminer" class="icon footer-icon-medium"></a></li>
                            <li><a target="_blnak" href="https://www.instagram.com/rockminerofficial/?utm_source=ig_profile_share&igshid=r8pb36wuo6hn" class="icon footer-icon-ins"></a></li>
                            <li class="pop-hover">
                                <template><PopContact dir="down" /></template>
                                <a href="javascript: void(0);" class="icon footer-icon-wechat"></a>
                            </li>
                        </ul>
                        <div id="copyright">
                            Copyright © 2020 Rockminer. All rights reserved. <br />
                            <a href="http://www.beian.miit.gov.cn/" target="_blank">粤ICP备18102255号</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AsiceContact />
    </footer>
</template>

<script>
import PopContact from "../Pop/popContact";
import AsiceContact from "../AsidePop";
export default {
  name: 'Footer',
  components: { PopContact, AsiceContact },
  props: {},
  data() {
    return {
      token: this.$store.state.app.token,
      username: this.$store.state.app.username,
      logo_img: require("@/assets/logo-white.png"),
      wechat: require("@/assets/images/code-wechat.png"),
      nav_menu: this.$store.state.app.nav_menu
    };
  },
  watch: {},
  computed: {},
  methods: {
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.logo {
  width: 77px;
  height: 24px;
  cursor: pointer;
  img { width: 100%; height: 100%; }
}
footer {
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #2A2924;
    font-family: "MR";
}
.title {
    margin-top: 24px;
    margin-bottom: 8px;
    font-size: 14px;
    font-family: "MSB";
    color: rgba(255, 255, 255, .8);
    line-height: 19px;
}
#copyright {
    margin-top: 43px;
    color: rgba(222, 222, 222, .6);
    font-size: 12px;
    line-height: 18px;
    a { color: rgba(222, 222, 222, .6); }
}
address {
    font-size: 14px;
    color: rgba(222, 222, 222, .6);
    line-height: 19px;
    span { display: block; }
}
.item-column {
    margin-bottom: 18px;
    font-size: 16px;
    color: rgba(255, 255, 255, .8);
    font-family: "MM";
    line-height: 19px;
}
.media-list {
    li {
        display: inline-block;
        position: relative;
        width: 20px;
        height: 20px;
        margin-right: 22px;
        &:last-child { margin-right: 0; }
        &:hover {
            .dislog-pop {
                opacity: 1;
                top: 150%;
                visibility: initial;
            }
            a { opacity: .8; }
        }
    }
    a {
        display: block;
        height: 100%;
        opacity: .6;
        @include webkit(transition, all .3s ease 0s);
    }
}
.nav-item1 { margin-left: 395px; }
.footer-nav {
    a {
        display: block;
        margin-bottom: 10px;
        font-size: 14px;
        color: #fff;
        line-height: 19px;
        &:hover {
            span { opacity: .6; }
            
        }
    }
}
</style>