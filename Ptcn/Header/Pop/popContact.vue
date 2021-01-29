<template>
    <div class="dialog-pop">
        <p class="arrow" :class="dir">
            <img :src="img" alt="" :width="width" />
            <span>iOS & Android</span>
        </p>
    </div>
</template>

<script>
export default {
    name: '',
    components: {},
    props: {
        width: {
            type: String,
            default: "116px"
        },
        dir: {
            type: String,
            default: "down"
        }
    },
    data() {
        return {
            img: "https://image.rockminer.com/official/wechat.png"
        };
    },
    watch: {},
    computed: {},
    methods: {},
    created() {},
    mounted() {}
};
</script>
<style lang="scss" scoped>
.pop-hover:hover {
    .dialog-pop p { 
        visibility: visible;
        opacity: 1;
    }
    .arrow.down { bottom: 8px; }
    .arrow.top { top: 8px; }
}
.dialog-pop {
    position: relative;
    p {
        position: absolute;
        left: 50%;
        z-index: 100;
        background-color: #fff;
        padding: 8px;
        margin-left: -66px;
        border-radius: 5px;
        visibility: hidden;
        opacity: 0;
        @include webkit(transition, all .3s ease 0s);
        @include webkit(filter, drop-shadow(0 0 10px rgba(0, 0, 0, .2)));
    }
    span {
        display: block;
        margin: 3px 0 0 0;
        padding: 0;
        text-align: center;
        font-size: 14px;
        line-height: 20px;
        color: #999;
        font-family: "YaHei";
    }
    .arrow {
        @include webkit(transition, all .3s ease 0s);
        &:before {
            content: "";
            position: absolute;
            left: 50%;
            width: 0;
            height: 0;
            margin-left: -6px;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
        }
        &.down { bottom: 0; }
        &.down:before {
            bottom: -6px;
            border-top: 6px solid #fff;
        }
        &.top { top: 0; }
        &.top:before {
            top: -6px;
            border-bottom: 6px solid #fff;
        }
    }
}

</style>