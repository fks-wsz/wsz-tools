<template>
  <view class="content">
    <view>
      <text class="title" @click="handleClick">{{ title }}</text>
      <view @click="handleCopy">复制</view>
    </view>
    <GlobalMask ref="abcRef" use-transition>
      <TestPop :key="'TestPop1'" />
      <view>666</view>
    </GlobalMask>
  </view>
</template>

<script>
// import { copyText } from 'wsz-tools/script/mp';
import TestPop from '@/components/TestPop.vue';
import AppendToBody from '@/components/global-mask/append-to-body.vue';

export default {
  components: {
    AppendToBody,
    TestPop,
  },
  data() {
    return {
      title: 'Hello',
    };
  },
  onLoad() {},
  methods: {
    handleCopy() {
      const text = '1111';
      copyText(text, { title: 'test title' }, () => {
        console.log(' --->', 'complet');
      });
    },
    handleClick() {
      this.$MASK.show(TestPop, {
        canCloseBySelfClick: true,
      });
      // this.$refs.abcRef.show('TestPop1');
    },
  },
};
</script>

<style scoped>
.content {
  height: 200vh;
}
</style>
