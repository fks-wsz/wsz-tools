<template>
  <view class="content">
    <view>
      <text class="title" @click="handleClick">{{ title }}</text>
      <view @click="handleCopy">复制</view>
    </view>
    <GlobalMask ref="abcRef">
      <testPop />
      <view>666</view>
    </GlobalMask>
  </view>
</template>

<script>
import { copyText } from 'wsz-tools/script/mp';
import TestPop1 from '@/components/TestPop.vue';
import GlobalMask from '@/components/global-mask/GlobalMask.vue';
import AppendToBody from '@/components/global-mask/append-to-body.vue';
import Mask from '../../components/global-mask/index';

export default {
  components: {
    GlobalMask,
    AppendToBody,
    testPop: TestPop1,
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
      Mask.show({});
      this.$refs.abcRef.show('TestPop22');
    },
  },
};
</script>
