<template>
  <view class="content">
    <view>
      <text class="title">{{ title }}</text>
      <view @click="handleCopy">复制</view>
    </view>
  </view>
</template>

<script>
import { copyText } from '../../../../../../dist/script/mp';

export default {
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
        console.log(' --->', 'complete');
      });
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 200rpx;
  height: 200rpx;
  margin: 200rpx auto 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  color: #8f8f94;
  font-size: 34rpx;
}
</style>
