<template>
  <view @click="handleClick">1111</view>
</template>

<script>
import TestPop from './TestPop.vue';

export default {
  name: 'TestPop',
  data: () => ({}),
  methods: {
    handleClick() {
      this.$MASK.show(TestPop, {
        canCloseBySelfClick: false,
      });
    },
  },
};
</script>
