<template>
  <d2-container class="page">
    <d2-page-cover
      title="改变世界的机器"
      sub-title="感知时空，对话万物的易通物联网解决方案">
      <template slot="footer">
        <img src="image/smart-iron.jpg" style="height:240px;"/>
        <div class="page__btn-group">
          <span @click="$open('https://github.com/d2-projects')">项目组</span> |
          <span @click="$open('http://d2admin.fairyever.com/zh/')">使用文档</span> |
          <span @click="$open('https://github.com/d2-projects/d2-admin-start-kit')">简化版脚手架</span> |
          <span @click="$open('https://juejin.im/user/57a48b632e958a006691b946/posts')">掘金专栏</span> |
          <el-popover
            :width="172"
            trigger="hover">
            <p class="d2-mt-0 d2-mb-10">D2Projects</p>
            <img src="./image/qr@2x.png" style="width: 172px;">
            <span slot="reference">微信公众号</span>
            <p
              style="
                font-size: 12px;
                margin-top: 0px;
                margin-bottom: 0px;
              ">
              官方公众号，主要推送前端技术类文章、框架资源、学习教程，以及 D2 系列项目更新信息
            </p>
          </el-popover>
        </div>
        <d2-help-btn class="d2-mt"/>
      </template>
    </d2-page-cover>
  </d2-container>
</template>

<script>
import D2HelpBtn from './components/d2-help-btn'
export default {
  components: {
    D2HelpBtn
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/style/public.scss';
.page {
  .page__btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    span {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
    }
  }
}
</style>
